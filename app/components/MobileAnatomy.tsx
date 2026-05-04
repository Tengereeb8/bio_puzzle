"use client";
import React, { useState } from "react";

function OrganOverlay({ emoji, name }: { emoji: string; name: string }) {
  return (
    <div className="bg-white border-4 border-yellow-400 rounded-2xl shadow-2xl flex flex-col items-center justify-center w-24 h-24 scale-110 rotate-3 opacity-90">
      <span className="text-4xl">{emoji}</span>
      <span className="text-xs font-bold text-blue-600 mt-1 uppercase">
        {name}
      </span>
    </div>
  );
}

const MobileAnatomyGame = () => {
  const tests = [
    { id: 1, top: "20%", left: "30%" },
    { id: 2, top: "35%", left: "70%" },
    { id: 3, top: "50%", left: "25%" },
    { id: 4, top: "55%", left: "65%" },
    { id: 5, top: "75%", left: "50%" },
  ];

  return (
    <div className="fixed inset-0 bg-sky-100 flex flex-col items-center font-sans overflow-hidden select-none">
      <div className="w-full pt-6 pb-2 text-center bg-white/90 backdrop-blur-md shadow-sm z-30">
        <h1 className="text-xl font-black text-blue-600">БИЕИЙН БҮТЭЦ 🦴</h1>
      </div>

      <div className="relative flex-1 w-full max-w-md bg-white overflow-hidden">
        <img
          src="https://images.imagerenderer.com/images/artworkimages/mediumlarge/2/1-childs-skeleton-growth-plates-monica-schroeder.jpg"
          alt="Skeleton"
          className="absolute inset-0 w-full h-[90%] object-contain object-top mt-4 pointer-events-none"
        />

        {tests.map((test) => (
          <div
            key={test.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
            style={{ top: test.top, left: test.left }}
          >
            <div className="relative flex items-center justify-center rounded-full w-10 h-10 border-dashed border-black bg-white/30 animate-pulse scale-150">
              test
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileAnatomyGame;
