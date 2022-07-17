package org.tensorflow.lite.examples.poseestimation

import android.content.ContentValues
import android.content.Intent
import android.graphics.Color
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.ActionBar
import com.androidplot.xy.*
import com.google.android.gms.tasks.Task
import com.google.android.material.bottomnavigation.BottomNavigationView
import com.google.firebase.FirebaseApp
import org.tensorflow.lite.examples.poseestimation.databinding.ActivityProfileBinding
import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.database.DataSnapshot
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.database.Query
import com.google.firebase.database.ktx.database
import com.google.firebase.firestore.ktx.firestore
import com.google.firebase.ktx.Firebase
import java.text.FieldPosition
import java.text.Format
import java.text.ParsePosition
import java.util.*

class ProfileActivity : AppCompatActivity() {
    private lateinit var binding: ActivityProfileBinding
    private lateinit var actionBar: ActionBar
    private lateinit var firebaseAuth: FirebaseAuth
    private lateinit var database: DatabaseReference

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        firebaseAuth = FirebaseAuth.getInstance()
        database = Firebase.database.reference

        val userEmail = FirebaseAuth.getInstance().currentUser!!.email
        val db  = Firebase.firestore
        val dataX = db.collection("workout").document(userEmail.toString()).collection("poses")//.collection("1658005950264").document("poses")
        println("******************************************************************************************************************************************************************************")
        var cnt = 0

        val myMap = mutableMapOf<String, Long>()
        dataX.get()
            .addOnSuccessListener { documents ->
                myMap["cobra"]=0
                myMap["chair"]=0
                myMap["dog"]=0
                myMap["tree"]=0

                for (document in documents) {
                    val datePar = document.id.toLong()
                    val backToDate: Date = Date(datePar)
                    cnt = cnt+1

                    if(document.get("cobra")!=0){
                        val temp=myMap["cobra"];
                        if (temp != null) {
                            myMap["cobra"]= temp+1
                        }
                    }
                    if(document.get("dog")!=0){
                        val temp=myMap["dog"];
                        if (temp != null) {
                            myMap["dog"]= temp+1
                        }
                    }
                    if(document.get("tree")!=0){
                        val temp=myMap["tree"];
                        if (temp != null) {
                            myMap["tree"]= temp+1
                        }
                    }
                    if(document.get("chair")!=0){
                        val temp=myMap["chair"];
                        if (temp != null) {
                            myMap["chair"]= temp+1
                        }
                    }
                }
//                println("**********************************************"+myMap["cobra"])
//                println("**********************************************"+myMap["chair"])
//                println("**********************************************"+myMap["tree"])
//                println("**********************************************"+myMap["dog"])
                binding.cobraNo.text= myMap["cobra"].toString()
                binding.chairNo.text= myMap["chair"].toString()
                binding.dogNo.text= myMap["dog"].toString()
                binding.treeNo.text= myMap["tree"].toString()

            }

        checkUser()
        binding.logoutBtn.setOnClickListener{
            firebaseAuth.signOut()
            checkUser()
        }
    }
    private val navigasjonen = BottomNavigationView.OnNavigationItemSelectedListener { item ->
        when (item.itemId) {
            R.id.profile -> {
                val intent = Intent(this@ProfileActivity, ProfileActivity::class.java)
                startActivity(intent)
                return@OnNavigationItemSelectedListener true
            }
            R.id.analytics -> {
                val intent = Intent(this@ProfileActivity, AnalysisActivity::class.java)
                startActivity(intent)
                return@OnNavigationItemSelectedListener true
            }
            R.id.practice -> {
                val intent = Intent(this@ProfileActivity, MainActivity::class.java)
                startActivity(intent)
                return@OnNavigationItemSelectedListener true
            }
        }
        false

    }
    private fun checkUser() {
        val bottomNavigation = findViewById<BottomNavigationView>(R.id.bottom_navigator)
        bottomNavigation.setOnNavigationItemSelectedListener(navigasjonen)
        val firebaseUser = firebaseAuth.currentUser
        if(firebaseUser != null){
            val email  = firebaseUser.email
            binding.emailTv.text = email

        }
        else{
            startActivity(Intent(this,LoginActivity::class.java))
            finish()
        }
    }
}