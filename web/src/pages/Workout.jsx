import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../firebase-config";
import Header from "../partials/Header";

const Workout = () => {
  const [user, loading, error] = useAuthState(auth);

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
      
    </div>
  );
};

export default Workout;
