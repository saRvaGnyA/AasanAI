import React, { useState, useRef } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import Webcam from "react-webcam";

import { auth } from "../firebase-config";
import Header from "../partials/Header";
import Vrikshasan from "../images/vrikshasan.webp";
import Utkatasan from "../images/utkatasan.gif";
import Bhujangasan from "../images/bhujangasan.gif";
import Svanasan from "../images/svanasan.gif";

const Workout = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [user, loading, error] = useAuthState(auth);
  const [tab, setTab] = useState(1);

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
          Current Timer: <span className="text-red-600 font-bold">12s</span>
        </span>
      </div>
      <div className="absolute pt-6 left-1/2">
        <span className="mx-4">
          Previous Best: <span className="text-green-600 font-bold">20s</span>
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
                  setTab(1);
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
                  setTab(2);
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
                  setTab(3);
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
                  setTab(4);
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
