import { assets } from "@/assets/asset";
import React from "react";

const ExpertClientProfileRightSide = ({ client }) => {

  const beforeMeasurements = client?.measurementHistory[0];

  const currentMeasurements = client?.measurementHistory[client?.measurementHistory.length - 1];

  const measurements = [
    { label: "Chest", before: beforeMeasurements?.chest, current: currentMeasurements?.chest, color: "#9e5608" },
    { label: "Waist", before: beforeMeasurements?.waist, current: currentMeasurements?.waist, color: "#F4DBC7" },
    { label: "Hips", before: beforeMeasurements?.hip, current: currentMeasurements?.hip, color: "#EBF3F2" },
  ];

  return (
    <div className="flex flex-col items-center gap-4 pb-4">
      {/* Weight Progress */}
      <div className="flex flex-col items-center w-full p-6 bg-white rounded-lg gap-4">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-[16px] font-bold text-[#9e5608]">
            Weight Progress
          </h3>
          <button>
            <img src={assets.threeDotVector} alt="" className="w-[18px]" />
          </button>
        </div>
        <div className="w-full bg-[#F8F8F8] rounded-lg flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between w-full">
            <span className="text-[13px] text-[#1E1E1E]">Today</span>
            <span className="text-[14px] font-bold text-[#9e5608]">{client?.weightHistory[client?.weightHistory.length - 1].weight} kg</span>
          </div>
          <div className="flex flex-col w-full gap-3 border-t border-[#DBDEDD] pt-3">
            <div className="flex items-center justify-between w-full">
              <span className="text-[13px] text-[#66706D]">Start</span>
              <span className="text-[13px] font-medium text-[#1E1E1E]">
                {client?.currentWeight ? `${client.currentWeight} kg` : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-[13px] text-[#66706D]">Change</span>
              <span className="text-[13px] font-medium text-[#1E1E1E]">
                {client?.weightHistory[client?.weightHistory.length - 1]?.weight - client?.weightHistory[0]?.weight} kg
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Measurements */}
      <div className="flex flex-col items-center w-full p-6 bg-white rounded-lg gap-4">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-[16px] font-bold text-[#9e5608]">Measurements</h3>
          <button>
            <img src={assets.threeDotVector} alt="" className="w-[18px]" />
          </button>
        </div>
        <div className="flex flex-col items-center w-full gap-3">
          {measurements.map((item, i) => (
            <div
              key={i}
              className="flex w-full items-stretch rounded-lg bg-[#F8F8F8] overflow-hidden"
            >
              <div
                className="w-1.5"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="flex-1 flex justify-between items-center p-3 pl-3">
                <span className="text-[13px] text-[#1E1E1E] font-medium">
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-[#66706D]">
                    Before <span className="text-[#1E1E1E]">{item.before}</span>
                  </span>
                  <div className="h-3 w-[1px] bg-[#DBDEDD]"></div>
                  <span className="text-[13px] text-[#9e5608] font-bold">
                    {item.current}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpertClientProfileRightSide;
