import React from "react";
import { assets } from "@/assets/asset";

export default function HeroCard({ program }) {
  return (
    <div className="relative w-full h-[320px] rounded-[32px] overflow-hidden shadow-sm">
      <img
        src={assets.wl}
        alt="Weight Loss"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-l from-black/50 via-transparent to-transparent flex items-center p-8">
        <h1 className="text-white text-[32px] font-bold max-w-[200px] leading-none text-right absolute right-10 bottom-10 drop-shadow-lg">
          {program?.title}
        </h1>
      </div>
    </div>
  );
}
