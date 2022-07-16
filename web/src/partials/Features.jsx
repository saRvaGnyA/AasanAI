import React, { useState, useRef, useEffect } from "react";

import AasanAILogo from "../images/aasanai.gif";

function Features() {
  return (
    <section className="relative">
      {/* Section background (needs .relative class on parent and next sibling elements) */}
      <div
        className="absolute inset-0 bg-gray-100 pointer-events-none mb-16"
        aria-hidden="true"
      ></div>
      <div className="absolute left-0 right-0 m-auto w-px p-px h-20 bg-gray-200 transform -translate-y-1/2"></div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20">
          {/* Section header */}
          <div className="max-w-3xl mx-auto text-center pb-12 md:pb-16">
            <h1 className="h2 mb-4">Perform Yogasanas With AI</h1>
            <p className="text-xl text-gray-600">
              AasanAI is a Deep Learning-powered Web and Mobile application to
              help you during your yoga workouts
            </p>
          </div>

          {/* Section content */}
          <div className="md:grid md:grid-cols-12 md:gap-6">
            {/* Content */}
            <div
              className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-7 lg:col-span-6 md:mt-6"
              data-aos="fade-right"
            >
              <div className="md:pr-4 lg:pr-12 xl:pr-16 mb-8">
                <h3 className="h3 mb-3">An ecosystem for Yogasanas</h3>
                <p className="text-xl text-gray-600">
                  AasanAI detects your Yogasana position and helps you perfect
                  your posture by getting visual feedback
                </p>
              </div>

              <div className="mb-8 md:mb-0">
                <a
                  className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${"bg-white shadow-md border-gray-200 hover:shadow-lg"}`}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1">
                      Timer for each Aasana
                    </div>
                    <div className="text-gray-600">
                      A timer which keeps a track of your current and best times
                      helps you gradually progress in your workout
                    </div>
                  </div>
                  <div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
                    <svg
                      className="w-3 h-3 fill-current"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M11.953 4.29a.5.5 0 00-.454-.292H6.14L6.984.62A.5.5 0 006.12.173l-6 7a.5.5 0 00.379.825h5.359l-.844 3.38a.5.5 0 00.864.445l6-7a.5.5 0 00.075-.534z" />
                    </svg>
                  </div>
                </a>
                <a
                  className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${"bg-white shadow-md border-gray-200 hover:shadow-lg"}`}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1">
                      Maintain your workout history
                    </div>
                    <div className="text-gray-600">
                      AasanAI maintains a history of your Yoga workout sessions
                      thereby allowing you to improve gradually
                    </div>
                  </div>
                  <div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
                    <svg
                      className="w-3 h-3 fill-current"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.854.146a.5.5 0 00-.525-.116l-11 4a.5.5 0 00-.015.934l4.8 1.921 1.921 4.8A.5.5 0 007.5 12h.008a.5.5 0 00.462-.329l4-11a.5.5 0 00-.116-.525z"
                        fillRule="nonzero"
                      />
                    </svg>
                  </div>
                </a>
                <a
                  className={`flex items-center text-lg p-5 rounded border transition duration-300 ease-in-out mb-3 ${"bg-white shadow-md border-gray-200 hover:shadow-lg"}`}
                >
                  <div>
                    <div className="font-bold leading-snug tracking-tight mb-1">
                      Participate in events and competitions
                    </div>
                    <div className="text-gray-600">
                      AasanAI aims to gamify this ecosystem to allow yoga events
                      and competitions to take place virtually
                    </div>
                  </div>
                  <div className="flex justify-center items-center w-8 h-8 bg-white rounded-full shadow flex-shrink-0 ml-3">
                    <svg
                      className="w-3 h-3 fill-current"
                      viewBox="0 0 12 12"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11.334 8.06a.5.5 0 00-.421-.237 6.023 6.023 0 01-5.905-6c0-.41.042-.82.125-1.221a.5.5 0 00-.614-.586 6 6 0 106.832 8.529.5.5 0 00-.017-.485z"
                        fill="#191919"
                        fillRule="nonzero"
                      />
                    </svg>
                  </div>
                </a>
              </div>
            </div>

            <div
              className="max-w-xl md:max-w-none md:w-full mx-auto md:col-span-5 lg:col-span-6 mb-8 md:mb-0 md:order-1"
              data-aos="zoom-y-out"
            >
              <div className="relative flex flex-col text-center lg:text-right">
                <div className="relative inline-flex flex-col">
                  <img
                    className="md:max-w-none mx-auto rounded mt-10"
                    src={AasanAILogo}
                    width="450"
                    height="462"
                    alt="AasanAI Logo GIF"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
