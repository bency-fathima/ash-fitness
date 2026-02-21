import React, { useState } from "react";

const DonutChart = ({
  size = 180,
  strokeWidth = 20,
  percentage,
  high,
  medium,
  low,
}) => {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Gap size (in percentage of circle)
  const gap = (0.8 / 100) * circumference;

  // Convert % to lengths and subtract gap
  const greenLen = (high / 100) * circumference - gap;
  const lightGreenLen = (medium / 100) * circumference - gap;
  const peachLen = (low / 100) * circumference - gap;

  // Segment data for tooltips
  const segments = [
    { label: "Programs", value: high, color: "#9e5608" },
    { label: "Experts", value: medium, color: "#EBF3F2" },
    { label: "Clients", value: low, color: "#F4DBC7" },
  ];

  const handleMouseMove = (e, segment) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setHoveredSegment(segment);
  };

  const handleMouseLeave = () => {
    setHoveredSegment(null);
  };

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size}>
        {/* Programs - Dark Green */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#9e5608"
          strokeWidth={
            hoveredSegment === "Programs" ? strokeWidth + 4 : strokeWidth
          }
          strokeDasharray={`${greenLen} ${circumference}`}
          strokeDashoffset={0}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ cursor: "pointer", transition: "stroke-width 0.2s" }}
          onMouseMove={(e) => handleMouseMove(e, "Programs")}
          onMouseLeave={handleMouseLeave}
        />

        {/* Clients - Peach */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#F4DBC7"
          strokeWidth={
            hoveredSegment === "Clients" ? strokeWidth + 4 : strokeWidth
          }
          strokeDasharray={`${peachLen} ${circumference}`}
          strokeDashoffset={-(greenLen + lightGreenLen + gap * 2)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ cursor: "pointer", transition: "stroke-width 0.2s" }}
          onMouseMove={(e) => handleMouseMove(e, "Clients")}
          onMouseLeave={handleMouseLeave}
        />

        {/* Experts - Light Green */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#EBF3F2"
          strokeWidth={
            hoveredSegment === "Experts" ? strokeWidth + 4 : strokeWidth
          }
          strokeDasharray={`${lightGreenLen} ${circumference}`}
          strokeDashoffset={-(greenLen + gap)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ cursor: "pointer", transition: "stroke-width 0.2s" }}
          onMouseMove={(e) => handleMouseMove(e, "Experts")}
          onMouseLeave={handleMouseLeave}
        />
      </svg>

      {/* Center Text */}
      <div className="absolute text-center pointer-events-none">
        <p className="text-[#66706D] text-[11px]">Avg Compliance</p>
        <p className="text-[#9e5608] text-[16px] font-bold">{percentage}%</p>
      </div>

      {/* Tooltip */}
      {hoveredSegment && (
        <div
          className="absolute bg-white p-3 shadow-2xl rounded-2xl border border-gray-50 pointer-events-none z-10"
          style={{
            left: `${tooltipPosition.x + 10}px`,
            top: `${tooltipPosition.y - 40}px`,
          }}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: segments.find(
                    (s) => s.label === hoveredSegment,
                  )?.color,
                }}
              />
              <span className="text-[11px] font-bold text-gray-800">
                {hoveredSegment}
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#9e5608] ml-4">
              {segments.find((s) => s.label === hoveredSegment)?.value}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonutChart;
