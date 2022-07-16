import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { auth } from "../firebase-config";
import Header from "../partials/Header";

const Workout = () => {
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
      <div className="absolute pt-6 left-1/3">
        <span className="mx-4 px-8">
          Current Timer: <span className="text-red-600 font-bold">12s</span>
        </span>
        <span className="mx-4 px-8">
          Previous Best: <span className="text-green-600 font-bold">15s</span>
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
    </div>
  );
};

export default Workout;
