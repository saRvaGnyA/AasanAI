/* Copyright 2021 The TensorFlow Authors. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================
*/

package org.tensorflow.lite.examples.poseestimation.ml

import android.content.Context
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.ktx.database
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import org.tensorflow.lite.Interpreter
import org.tensorflow.lite.examples.poseestimation.data.Person
import org.tensorflow.lite.support.common.FileUtil
import java.lang.ref.PhantomReference
import java.time.LocalDateTime
import java.util.*
import kotlin.reflect.typeOf

class PoseClassifier(
    private val interpreter: Interpreter,
    private val labels: List<String>
) {
    private val input = interpreter.getInputTensor(0).shape()
    private val output = interpreter.getOutputTensor(0).shape()
    val userEmail = FirebaseAuth.getInstance().currentUser!!.email
    val firebaseOutput =   mutableListOf<Pair<String, Float>>()
//    private lateinit var databaseReference : DatabaseReference
    val db = Firebase.firestore
    val dateTime: Date = Calendar.getInstance().time
    val dateTimeAsLong: Long = dateTime.time

    companion object {
        private const val MODEL_FILENAME = "classifier.tflite"
        private const val LABELS_FILENAME = "labels.txt"
        private const val CPU_NUM_THREADS = 4

        fun create(context: Context): PoseClassifier {
            val options = Interpreter.Options().apply {
                setNumThreads(CPU_NUM_THREADS)
            }
            return PoseClassifier(
                Interpreter(
                    FileUtil.loadMappedFile(
                        context, MODEL_FILENAME
                    ), options
                ),
                FileUtil.loadLabels(context, LABELS_FILENAME)
            )
        }
    }

    fun classify(person: Person?): List<Pair<String, Float>> {
        // Preprocess the pose estimation result to a flat array

        val inputVector = FloatArray(input[1])
        person?.keyPoints?.forEachIndexed { index, keyPoint ->
            inputVector[index * 3] = keyPoint.coordinate.y
            inputVector[index * 3 + 1] = keyPoint.coordinate.x
            inputVector[index * 3 + 2] = keyPoint.score
        }

        // Postprocess the model output to human readable class names
        val outputTensor = FloatArray(output[1])
        interpreter.run(arrayOf(inputVector), arrayOf(outputTensor))
        val output = mutableListOf<Pair<String, Float>>()
        outputTensor.forEachIndexed { index, score ->
            output.add(Pair(labels[index], score))
        }

        if(firebaseOutput.size==0){
            for(ele in output){
                firebaseOutput.add(ele)
            }
        }
        else{

            var cnt = 0
            for(ele in output){
                if(ele.second>=0.97){
                    firebaseOutput.set(cnt,ele)
                }
                cnt = cnt+1
            }
        }
        println("*************************${output}*****************************")
        println("@@@@@@@@@@@@@@@@@@@@@@@@@@${firebaseOutput}@@@@@@@@@@@@@@@@@@@@@@2")
        return output
    }

    fun close() {
        val finalDateTime: Date = Calendar.getInstance().time
        val finalDateTimeAsLong: Long = finalDateTime.time
        var diff = (finalDateTimeAsLong-dateTimeAsLong)/1000
        val myMap = mutableMapOf<String, Long>()
        println("%%%%%%%%%%%%%%%%%%%%%${dateTimeAsLong}%%%%%%%%%${finalDateTimeAsLong}%%%%%%%%%%%%%%5")
        for(ele in firebaseOutput){
            if(ele.second>=0.5){
                myMap[ele.first.toString()] = diff
            }
            else{
                myMap[ele.first.toString()] = 0
            }

        }
        println(myMap)
        db.collection("workout").document(userEmail.toString()).collection("poses").document(dateTimeAsLong.toString()).set(myMap)
//        db.collection("workout").document(userEmail.toString()).collection(dateTimeAsLong.toString()).document("poses").set(myMap)
//        println("cccccccccccccccccccccccccccccccccc")
//        println("${userEmail}")
        // conversion from int to date ===> val backToDate: Date = Date(dateTimeAsLong)
        interpreter.close()
    }
}
