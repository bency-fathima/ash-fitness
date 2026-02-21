import React from "react";

export default function LegendHeader() {
  const items = [
    { label: "Diet", color: "bg-[#EBF3F2]" },
    { label: "Workout", color: "bg-[#F4DBC7]" },
    { label: "Therapy", color: "bg-[#9e5608]" },
  ];

  return (
    <div className="flex gap-4 mb-4 items-center">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${item.color}`} />
          <span className="text-[10px] font-bold text-gray-400">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
