package org.tensorflow.lite.examples.poseestimation

import android.content.ContentValues.TAG
import android.graphics.Color
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import com.androidplot.ui.DynamicTableModel
import com.androidplot.ui.TableOrder
import com.androidplot.xy.*
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import java.text.FieldPosition
import java.text.Format
import java.text.ParsePosition
import java.util.*


class AnalysisActivity : AppCompatActivity() {
    fun append(arr: Array<Int>, element: Int): Array<Int> {
        val list: MutableList<Int> = arr. toMutableList()
        list. add(element)
        return list. toTypedArray()
    }
    override  fun onCreate(savedInstanceState: Bundle?){
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_analysis)
        val userEmail = FirebaseAuth.getInstance().currentUser!!.email
        val db  = Firebase.firestore
        val dataX = db.collection("workout").document(userEmail.toString()).collection("poses")//.collection("1658005950264").document("poses")
        println("**********************************************************")
//        for(ele in dataX)
//        println(dataX.parent)
//        var domainLabels = arrayOf<Long>()//X CO-ORDINATES
//        var series1Number = arrayOf<Number>(1,4) //Y1 CO-ORDINATES
//        var series2Number = arrayOf<Number>(2,8) //Y2 CO-ORDINATES
        val list: MutableList<String> = ArrayList()
        val series1NumberList: MutableList<Long> = ArrayList()
        val series2NumberList: MutableList<Long> = ArrayList()
        val series3NumberList: MutableList<Long> = ArrayList()
        val series4NumberList: MutableList<Long> = ArrayList()
        val series5NumberList: MutableList<Long> = ArrayList()
        var cnt = 0
        dataX.get()
            .addOnSuccessListener { documents ->
                for (document in documents) {
//                        println(document)
                    val datePar = document.id.toLong()
                    val backToDate: Date = Date(datePar)
                    list.add(cnt,backToDate.toString())
                    series1NumberList.add(cnt, document.get("cobra") as Long)
                    series2NumberList.add(cnt,document.get("chair") as Long)
                    series3NumberList.add(cnt,document.get("tree") as Long)
                    series4NumberList.add(cnt,document.get("dog") as Long)
                    series5NumberList.add(cnt,document.get("warrior") as Long)
//                        println(backToDate.toString())
//                        println("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@${backToDate}@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@${document.get("cobra")}@@@@@@@@@@@@@@@@@@@@@@@${document.get("chair")}@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
//                        println("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@${list}@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@${series1NumberList}@@@@@@@@@@@@@@@@@@@@@@@${series2NumberList}@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
//                    Log.d(TAG, "${document.id} => ${document.data}")
                    cnt = cnt+1
                }
//                    println("############################${list}############################${series1NumberList}###########################${series2NumberList}############################")
                val domainLabels: Array<String> = list.toTypedArray()
                val series1Number: Array<Long> = series1NumberList.toTypedArray()
                val series2Number: Array<Long> = series2NumberList.toTypedArray()
                val series3Number: Array<Long> = series3NumberList.toTypedArray()
                val series4Number: Array<Long> = series4NumberList.toTypedArray()
                val series5Number: Array<Long> = series5NumberList.toTypedArray()

                val series1 : XYSeries = SimpleXYSeries(Arrays.asList(*series1Number),SimpleXYSeries.ArrayFormat.Y_VALS_ONLY,"Bhujangasana")
                val series2 : XYSeries = SimpleXYSeries(Arrays.asList(*series2Number),SimpleXYSeries.ArrayFormat.Y_VALS_ONLY,"Utkatasana")
                val series3 : XYSeries = SimpleXYSeries(Arrays.asList(*series3Number),SimpleXYSeries.ArrayFormat.Y_VALS_ONLY,"Svanasana")
                val series4 : XYSeries = SimpleXYSeries(Arrays.asList(*series4Number),SimpleXYSeries.ArrayFormat.Y_VALS_ONLY,"Vrikshasana")
//                    val series5 : XYSeries = SimpleXYSeries(Arrays.asList(*series5Number),SimpleXYSeries.ArrayFormat.Y_VALS_ONLY,"Warrior")
                val series1Format = LineAndPointFormatter(Color.rgb(237, 0, 0),Color.BLACK,null,null)
                val series2Format = LineAndPointFormatter(Color.rgb(0, 87, 217),Color.BLACK,null,null)
                val series3Format = LineAndPointFormatter(Color.rgb(123, 61, 132),Color.BLACK,null,null)
                val series4Format = LineAndPointFormatter(Color.rgb(118, 220, 20),Color.BLACK,null,null)
                val series5Format = LineAndPointFormatter(Color.rgb(255, 139, 40),Color.BLACK,null,null)//123 61 132
                series1Format.setInterpolationParams(CatmullRomInterpolator.Params(10,CatmullRomInterpolator.Type.Centripetal))
                series2Format.setInterpolationParams(CatmullRomInterpolator.Params(10,CatmullRomInterpolator.Type.Centripetal))
                series3Format.setInterpolationParams(CatmullRomInterpolator.Params(10,CatmullRomInterpolator.Type.Centripetal))
                series4Format.setInterpolationParams(CatmullRomInterpolator.Params(10,CatmullRomInterpolator.Type.Centripetal))
//                    series5Format.setInterpolationParams(CatmullRomInterpolator.Params(10,CatmullRomInterpolator.Type.Centripetal))
                val plot = findViewById<XYPlot>(R.id.plot)
                plot.legend.tableModel = DynamicTableModel(2, 2, TableOrder.ROW_MAJOR)
                plot.addSeries(series1,series1Format)
                plot.addSeries(series2,series2Format)
                plot.addSeries(series3,series3Format)
                plot.addSeries(series4,series4Format)
//                    plot.addSeries(series5,series5Format)

                plot.graph.getLineLabelStyle(XYGraphWidget.Edge.BOTTOM).format = object : Format(){
                    override fun format(p0: Any?, p1: StringBuffer?, p2: FieldPosition?): StringBuffer {
                        val i = Math.round((p0 as Number).toFloat())
                        return p1!!.append(i)
                    }
                    override fun parseObject(p0: String?, p1: ParsePosition?): Any? {
                        return null
                    }

                }
                PanZoom.attach(plot)

            }
            .addOnFailureListener { exception ->
                Log.w(TAG, "Error getting documents: ", exception)
            }
    }
}