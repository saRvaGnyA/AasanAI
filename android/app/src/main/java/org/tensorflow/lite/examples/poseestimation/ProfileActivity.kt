package org.tensorflow.lite.examples.poseestimation

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.appcompat.app.ActionBar
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
import com.google.firebase.ktx.Firebase
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

        database=FirebaseDatabase.getInstance().getReference("workout")
        database.get().addOnCompleteListener {

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