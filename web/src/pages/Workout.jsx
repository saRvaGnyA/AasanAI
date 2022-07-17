import React, { useState, useRef, useEffect } from "react";
import { setDoc, doc } from "@firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import Webcam from "react-webcam";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";

import { auth, db } from "../firebase-config";
import Header from "../partials/Header";
import Vrikshasan from "../images/vrikshasan.webp";
import Utkatasan from "../images/utkatasan.gif";
import Bhujangasan from "../images/bhujangasan.gif";
import Svanasan from "../images/svanasan.gif";

// reference keypoint mapping at https://www.tensorflow.org/lite/examples/pose_estimation/overview
const POINTS = {
  NOSE: 0,
  LEFT_EYE: 1,
  RIGHT_EYE: 2,
  LEFT_EAR: 3,
  RIGHT_EAR: 4,
  LEFT_SHOULDER: 5,
  RIGHT_SHOULDER: 6,
  LEFT_ELBOW: 7,
  RIGHT_ELBOW: 8,
  LEFT_WRIST: 9,
  RIGHT_WRIST: 10,
  LEFT_HIP: 11,
  RIGHT_HIP: 12,
  LEFT_KNEE: 13,
  RIGHT_KNEE: 14,
  LEFT_ANKLE: 15,
  RIGHT_ANKLE: 16,
};

const keypointConnections = {
  nose: ["left_ear", "right_ear"],
  left_ear: ["left_shoulder"],
  right_ear: ["right_shoulder"],
  left_shoulder: ["right_shoulder", "left_elbow", "left_hip"],
  right_shoulder: ["right_elbow", "right_hip"],
  left_elbow: ["left_wrist"],
  right_elbow: ["right_wrist"],
  left_hip: ["left_knee", "right_hip"],
  right_hip: ["right_knee"],
  left_knee: ["left_ankle"],
  right_knee: ["right_ankle"],
};

function drawSegment(ctx, [mx, my], [tx, ty], color) {
  ctx.beginPath();
  ctx.moveTo(mx, my);
  ctx.lineTo(tx, ty);
  ctx.lineWidth = 5;
  ctx.strokeStyle = color;
  ctx.stroke();
}

function drawPoint(ctx, x, y, r, color) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

let skeletonColor = "rgb(255,255,255)";
let poseList = [
  "Tree",
  "Chair",
  "Cobra",
  "Warrior",
  "Dog",
  "Shoulderstand",
  "Traingle",
];

const CLASS_NO = {
  Chair: 0,
  Cobra: 1,
  Dog: 2,
  No_Pose: 3,
  Shoulderstand: 4,
  Traingle: 5,
  Tree: 6,
  Warrior: 7,
};

let interval;
let flag = false;
const ts = Number(new Date());
let data;

const Workout = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [user, loading, error] = useAuthState(auth);
  const [tab, setTab] = useState(1);
  const [isStartPose, setIsStartPose] = useState(false);

  const [startingTime, setStartingTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [poseTime, setPoseTime] = useState(0);
  const [bestPerform, setBestPerform] = useState(0);
  const [currentPose, setCurrentPose] = useState("Tree");
  const [best1, setBest1] = useState(0);
  const [best2, setBest2] = useState(0);
  const [best3, setBest3] = useState(0);
  const [best4, setBest4] = useState(0);

  useEffect(() => {
    const timeDiff = (currentTime - startingTime) / 1000;
    if (flag) {
      setPoseTime(timeDiff);
    }
    if ((currentTime - startingTime) / 1000 > bestPerform) {
      setBestPerform(timeDiff);
      if (tab === 1) {
        setBest1(timeDiff);
      }
      if (tab === 2) {
        setBest2(timeDiff);
      }
      if (tab === 3) {
        setBest3(timeDiff);
      }
      if (tab === 4) {
        setBest4(timeDiff);
      }
      data = {
        tree: String(best1),
        chair: String(best2),
        cobra: String(best3),
        dog: String(best4),
        warrior: "0",
      };
      console.log(data);
      upd();
    }
  }, [currentTime]);

  const upd = async () => {
    await setDoc(doc(db, `workout/${user.email}/poses/${ts}`), data);
  };

  useEffect(() => {
    setCurrentTime(0);
    setPoseTime(0);
    setBestPerform(0);
  }, [currentPose]);

  function get_center_point(landmarks, left_bodypart, right_bodypart) {
    let left = tf.gather(landmarks, left_bodypart, 1);
    let right = tf.gather(landmarks, right_bodypart, 1);
    const center = tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5));
    return center;
  }

  function get_pose_size(landmarks, torso_size_multiplier = 2.5) {
    let hips_center = get_center_point(
      landmarks,
      POINTS.LEFT_HIP,
      POINTS.RIGHT_HIP
    );
    let shoulders_center = get_center_point(
      landmarks,
      POINTS.LEFT_SHOULDER,
      POINTS.RIGHT_SHOULDER
    );
    let torso_size = tf.norm(tf.sub(shoulders_center, hips_center));
    let pose_center_new = get_center_point(
      landmarks,
      POINTS.LEFT_HIP,
      POINTS.RIGHT_HIP
    );
    pose_center_new = tf.expandDims(pose_center_new, 1);

    pose_center_new = tf.broadcastTo(pose_center_new, [1, 17, 2]);
    // return: shape(17,2)
    let d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0);
    let max_dist = tf.max(tf.norm(d, "euclidean", 0));

    // normalize scale
    let pose_size = tf.maximum(
      tf.mul(torso_size, torso_size_multiplier),
      max_dist
    );
    return pose_size;
  }

  function normalize_pose_landmarks(landmarks) {
    let pose_center = get_center_point(
      landmarks,
      POINTS.LEFT_HIP,
      POINTS.RIGHT_HIP
    );
    pose_center = tf.expandDims(pose_center, 1);
    pose_center = tf.broadcastTo(pose_center, [1, 17, 2]);
    landmarks = tf.sub(landmarks, pose_center);

    let pose_size = get_pose_size(landmarks);
    landmarks = tf.div(landmarks, pose_size);
    return landmarks;
  }

  function landmarks_to_embedding(landmarks) {
    // normalize landmarks 2D
    landmarks = normalize_pose_landmarks(tf.expandDims(landmarks, 0));
    let embedding = tf.reshape(landmarks, [1, 34]);
    return embedding;
  }

  const runMovenet = async () => {
    const detectorConfig = {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
    };
    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );
    const poseClassifier = await tf.loadLayersModel(
      "https://models.s3.jp-tok.cloud-object-storage.appdomain.cloud/model.json"
    );
    interval = setInterval(() => {
      detectPose(detector, poseClassifier);
    }, 100);
  };

  const detectPose = async (detector, poseClassifier) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      let notDetected = 0;
      const video = webcamRef.current.video;
      const pose = await detector.estimatePoses(video);
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      try {
        const keypoints = pose[0].keypoints;
        let input = keypoints.map((keypoint) => {
          if (keypoint.score > 0.4) {
            if (
              !(keypoint.name === "left_eye" || keypoint.name === "right_eye")
            ) {
              drawPoint(ctx, keypoint.x, keypoint.y, 8, "rgb(255,255,255)");
              let connections = keypointConnections[keypoint.name];
              try {
                connections.forEach((connection) => {
                  let conName = connection.toUpperCase();
                  drawSegment(
                    ctx,
                    [keypoint.x, keypoint.y],
                    [
                      keypoints[POINTS[conName]].x,
                      keypoints[POINTS[conName]].y,
                    ],
                    skeletonColor
                  );
                });
              } catch (err) {}
            }
          } else {
            notDetected += 1;
          }
          return [keypoint.x, keypoint.y];
        });
        if (notDetected > 4) {
          skeletonColor = "rgb(255,255,255)";
          return;
        }
        const processedInput = landmarks_to_embedding(input);
        const classification = poseClassifier.predict(processedInput);

        classification.array().then((data) => {
          const classNo = CLASS_NO[currentPose];
          console.log(data[0][classNo]);
          if (data[0][classNo] > 0.97) {
            if (!flag) {
              setStartingTime(new Date(Date()).getTime());
              flag = true;
            }
            setCurrentTime(new Date(Date()).getTime());
            skeletonColor = "rgb(0,255,0)";
          } else {
            flag = false;
            skeletonColor = "rgb(255,255,255)";
          }
        });
      } catch (err) {
        console.log(err);
      }
    }
  };

  function startYoga() {
    setIsStartPose(true);
    runMovenet();
  }

  function stopPose() {
    setIsStartPose(false);
    clearInterval(interval);
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen overflow-hidden">
        <Header></Header>
        <main className="flex-grow">
          <section className="bg-gradient-to-b from-gray-100 to-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                  <h1 className="h1">Please sign in to start your workout</h1>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header></Header>
      <div className="absolute pt-6 right-1/2">
        <span className="mx-4">
          Current Timer:{" "}
          <span className="text-red-600 font-bold">{poseTime}s</span>
        </span>
      </div>
      <div className="absolute pt-6 left-1/2">
        <span className="mx-4">
          Previous Best:{" "}
          <span className="text-green-600 font-bold">{bestPerform}s</span>
        </span>
      </div>
      <section className="relative">
        <div className="mx-auto">
          {/* Hero content */}
          <div className="pb-12 pt-20 md:pb-20">
            <div class="flex border-b border-gray-500 dark:border-gray-700 justify-center">
              <button
                className={
                  tab === 1
                    ? "h-10 px-4 py-2 -mb-px text-sm text-center text-blue-600 bg-transparent border-b-2 border-blue-500 sm:text-base dark:border-blue-400 dark:text-blue-300 whitespace-nowrap focus:outline-none"
                    : "h-10 px-4 py-2 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-transparent sm:text-base dark:text-white whitespace-nowrap cursor-base focus:outline-none hover:border-gray-400"
                }
                onClick={() => {
                  stopPose();
                  setCurrentPose("Tree");
                  setTab(1);
                  startYoga();
                }}
              >
                Vrikshasana
              </button>

              <button
                className={
                  tab === 2
                    ? "h-10 px-4 py-2 -mb-px text-sm text-center text-blue-600 bg-transparent border-b-2 border-blue-500 sm:text-base dark:border-blue-400 dark:text-blue-300 whitespace-nowrap focus:outline-none"
                    : "h-10 px-4 py-2 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-transparent sm:text-base dark:text-white whitespace-nowrap cursor-base focus:outline-none hover:border-gray-400"
                }
                onClick={() => {
                  stopPose();
                  setCurrentPose("Chair");
                  setTab(2);
                  startYoga();
                }}
              >
                Utkatasana
              </button>

              <button
                className={
                  tab === 3
                    ? "h-10 px-4 py-2 -mb-px text-sm text-center text-blue-600 bg-transparent border-b-2 border-blue-500 sm:text-base dark:border-blue-400 dark:text-blue-300 whitespace-nowrap focus:outline-none"
                    : "h-10 px-4 py-2 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-transparent sm:text-base dark:text-white whitespace-nowrap cursor-base focus:outline-none hover:border-gray-400"
                }
                onClick={() => {
                  stopPose();
                  setCurrentPose("Cobra");
                  setTab(3);
                  // startYoga();
                }}
              >
                Bhujangasana
              </button>

              <button
                className={
                  tab === 4
                    ? "h-10 px-4 py-2 -mb-px text-sm text-center text-blue-600 bg-transparent border-b-2 border-blue-500 sm:text-base dark:border-blue-400 dark:text-blue-300 whitespace-nowrap focus:outline-none"
                    : "h-10 px-4 py-2 -mb-px text-sm text-center text-gray-700 bg-transparent border-b-2 border-transparent sm:text-base dark:text-white whitespace-nowrap cursor-base focus:outline-none hover:border-gray-400"
                }
                onClick={() => {
                  stopPose();
                  setCurrentPose("Dog");
                  setTab(4);
                  // startYoga();
                }}
              >
                Adho Mukha Svanasana
              </button>
            </div>
          </div>
        </div>
      </section>

      <Webcam
        width="640px"
        height="480px"
        id="webcam"
        ref={webcamRef}
        style={{
          position: "absolute",
          left: 20,
          top: 125,
          padding: "0px",
        }}
      />
      <canvas
        ref={canvasRef}
        id="my-canvas"
        width="640px"
        height="480px"
        style={{
          position: "absolute",
          left: 20,
          top: 125,
          zIndex: 1,
        }}
      ></canvas>

      {tab === 1 && (
        <div>
          <img
            src={Vrikshasan}
            alt="Vrikshasan"
            width="480px"
            height="480px"
            style={{
              position: "absolute",
              right: 40,
              top: 125,
              padding: "0px",
            }}
          />
        </div>
      )}
      {tab === 2 && (
        <div>
          <img
            src={Utkatasan}
            alt="Utkatasan"
            width="480px"
            height="480px"
            style={{
              position: "absolute",
              right: 40,
              top: 125,
              padding: "0px",
            }}
          />
        </div>
      )}
      {tab === 3 && (
        <div>
          <img
            src={Bhujangasan}
            alt="Bhujangasan"
            width="480px"
            height="480px"
            style={{
              position: "absolute",
              right: 40,
              top: 125,
              padding: "0px",
            }}
          />
        </div>
      )}
      {tab === 4 && (
        <div>
          <img
            src={Svanasan}
            alt="Svanasan"
            width="480px"
            height="480px"
            style={{
              position: "absolute",
              right: 40,
              top: 125,
              padding: "0px",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default Workout;
