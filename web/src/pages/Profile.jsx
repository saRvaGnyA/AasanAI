import React from "react";
import Header from "../partials/Header";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase-config";

function HeroHome() {
  const [user, loading, error] = useAuthState(auth);

  return (
    <div className="relative">
      <div className="">
        <Header></Header>
      </div>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="lg:w-8/12 lg:mx-auto mb-8 pt-20">
          <section class="flex flex-wrap items-center p-4 md:py-8">
            <div class="md:w-3/12 md:ml-16">
              <img
                class="w-20 h-20 md:w-40 md:h-40 object-cover rounded-full
                     border-2 border-pink-600 p-1"
                src="https://i.pinimg.com/736x/6e/b8/d9/6eb8d959e858c648a00fc269e3bbf579.jpg"
                alt="profile"
              />
            </div>

            <div class="w-8/12 md:w-7/12 ml-4">
              <p
                className="text-2xl text-gray-600 mb-8"
                data-aos="zoom-y-out"
                data-aos-delay="150"
              >
                Email:{" "}
                <a
                  className="underline-offset-8 underline text-blue-600 text-2xl"
                  href={`mailto:${user.email}`}
                >
                  {user.email}
                </a>
              </p>

              <ul class="hidden md:flex space-x-8 mb-4">
                <li>
                  <span class="font-semibold">20 </span>
                  Days Streak
                </li>

                <li>
                  <span class="font-semibold">15 </span>
                  hours of Yoga
                </li>
              </ul>

              <div class="hidden md:block">
                <h1 class="font-semibold">Novice</h1>
                <span>5 more days until Enthusiast</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default HeroHome;
