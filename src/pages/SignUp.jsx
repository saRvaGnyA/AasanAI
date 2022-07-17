import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";

import { auth } from "../firebase-config";
import Header from "../partials/Header";

function SignUp() {
  let navigate = useNavigate();

  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth);

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    createUserWithEmailAndPassword(email, pw);
    navigate("/", { replace: true });
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/*  Site header */}
      <Header />

      {/*  Page content */}
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-gray-100 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              {/* Page header */}
              <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                <h1 className="h1">
                  Welcome. Start your way to a healthy lifestyle
                </h1>
              </div>

              {/* Form */}
              <div className="max-w-sm mx-auto">
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-800 text-sm font-medium mb-1"
                        htmlFor="email"
                      >
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="form-input w-full text-gray-800"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label
                        className="block text-gray-800 text-sm font-medium mb-1"
                        htmlFor="password"
                      >
                        Password <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="password"
                        type="password"
                        className="form-input w-full text-gray-800"
                        placeholder="Enter your password"
                        value={pw}
                        onChange={(e) => {
                          setPw(e.target.value);
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mt-6">
                    <div className="w-full px-3">
                      <button className="btn text-white bg-blue-600 hover:bg-blue-700 w-full">
                        Sign up
                      </button>
                    </div>
                  </div>
                </form>

                <div className="text-gray-600 text-center mt-6">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="text-blue-600 hover:underline transition duration-150 ease-in-out"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SignUp;
