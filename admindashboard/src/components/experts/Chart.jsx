import React from "react";

const DonutChart = ({
  size = 180,
  strokeWidth = 20,
  percentage ,
  high,
  medium,
  low,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Gap size (in percentage of circle)
  const gap = (0.8 / 100) * circumference;

  // Convert % to lengths and subtract gap
  const greenLen = (high / 100) * circumference - gap;
  const lightGreenLen = (medium / 100) * circumference - gap;
  const peachLen = (low / 100) * circumference - gap;

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size}>
        {/* 55% - Dark Green */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#9e5608"
          strokeWidth={strokeWidth}
          strokeDasharray={`${greenLen} ${circumference}`}
          strokeDashoffset={0}
          //   strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />

        {/* 15% - Peach */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F4DBC7"
          strokeWidth={strokeWidth}
          strokeDasharray={`${peachLen} ${circumference}`}
          strokeDashoffset={-(greenLen + lightGreenLen + gap * 2)}
          //   strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />

        {/* 30% - Light Green */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#EBF3F2"
          strokeWidth={strokeWidth}
          strokeDasharray={`${lightGreenLen} ${circumference}`}
          strokeDashoffset={-(greenLen + gap)}
          //   strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      {/* Center Text */}
      <div className="absolute text-center">
        <p className="text-[#66706D] text-[11px]">Avg Compliance</p>
        <p className="text-[#9e5608] text-[16px] font-bold">{percentage}%</p>
      </div>
    </div>
  );
};

export default DonutChart;
