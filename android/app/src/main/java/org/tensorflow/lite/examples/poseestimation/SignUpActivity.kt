package org.tensorflow.lite.examples.poseestimation

import android.app.ProgressDialog
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.text.TextUtils
import android.util.Patterns
import android.widget.Toast
import androidx.appcompat.app.ActionBar
import org.tensorflow.lite.examples.poseestimation.databinding.ActivitySignUpBinding
import com.google.firebase.FirebaseApp
import com.google.firebase.auth.FirebaseAuth;

class SignUpActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySignUpBinding
    private lateinit var actionBar:ActionBar
    private lateinit var progressDialog:ProgressDialog
    private lateinit var firebaseAuth:FirebaseAuth
    private var email=""
    private var password=""

    override fun onCreate(savedInstanceState: Bundle?) {

        super.onCreate(savedInstanceState)
        FirebaseApp.initializeApp(this)
        try {
            this.supportActionBar!!.hide()
        } catch (e: NullPointerException) {
        }
        binding= ActivitySignUpBinding.inflate(layoutInflater)
        setContentView(binding.root)

        actionBar=supportActionBar!!

        actionBar.title="Sign Up"
        actionBar.setDisplayHomeAsUpEnabled(true)
        actionBar.setDisplayShowHomeEnabled(true)

        progressDialog= ProgressDialog(this)
        progressDialog.setTitle("Please wait")
        progressDialog.setMessage("Creating account ...")
        progressDialog.setCanceledOnTouchOutside(false)

        firebaseAuth=FirebaseAuth.getInstance()

        binding.signUpButton.setOnClickListener{
            validateData()
        }
    }

    private fun validateData() {
        email=binding.EmailSU.text.toString().trim()
        password=binding.PasswordSU.text.toString().trim()

        if(!Patterns.EMAIL_ADDRESS.matcher(email).matches()){
            binding.EmailSUStatus.error="Invalid Email format"
        }
        else if(TextUtils.isEmpty(password)){
            binding.PasswordSUStatus.error="Please enter password"
        }
        else if(password.length<6){
            binding.PasswordSUStatus.error="Password must be at least 6 characters long"
        }
        else{
            firebaseSignUp()
        }
    }

    private fun firebaseSignUp() {
        progressDialog.show()
        firebaseAuth.createUserWithEmailAndPassword(email,password)
            .addOnSuccessListener {
                progressDialog.dismiss()
                val firebaseUser=firebaseAuth.currentUser
                val email=firebaseUser!!.email
                Toast.makeText(this,"Account Created with email ${email}",Toast.LENGTH_SHORT).show()
            }
            .addOnFailureListener{e->
                progressDialog.dismiss()
                Toast.makeText(this,"SignUp Failed due to ${e.message}",Toast.LENGTH_SHORT).show()
            }
    }

    override fun onSupportNavigateUp(): Boolean {
        onBackPressed()
        return super.onSupportNavigateUp()
    }
}