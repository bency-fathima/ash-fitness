import React from "react";

export default function KpiCard({ title, value, icon, bg, iconColor, cardBg }) {
  return (
    <div
      className={`flex items-center justify-between w-full p-4 rounded-2xl ${
        cardBg ? "" : "bg-[#F8F8F8]"
      }`}
      style={{ backgroundColor: cardBg }}
    >
      <div className="flex flex-col items-start gap-2">
        <span className="text-[#66706D] text-[12px]">{title}</span>
        <p className="text-[#9e5608] text-[20px] font-bold ">{value}</p>
      </div>
      <div
        className="w-12 h-12 flex items-center justify-center rounded-[22px]"
        style={{ backgroundColor: bg }}
      >
        <img
          src={icon}
          alt={title}
          className="w-6 h-6"
          style={{ filter: iconColor ? "brightness(0) invert(1)" : "none" }}
        />
      </div>
    </div>
  );
}
