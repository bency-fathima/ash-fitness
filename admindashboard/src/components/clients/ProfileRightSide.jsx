import { assets } from '@/assets/asset';
import React from 'react'

const ProfileRightSide = ({ client }) => {

  const compliance = [
  {
    title: "Chest",
    Before: client?.measurementHistory[0]?.chest ?? 0 + " cm",
    after:  client?.measurementHistory[client?.measurementHistory.length - 1]?.chest ?? 0 + " cm",
    color: "#9e5608",
  },
  {
    title: "Waist",
    Before: client?.measurementHistory[0]?.waist ?? 0 + " cm",
    after:  client?.measurementHistory[client?.measurementHistory.length - 1]?.waist ?? 0 + " cm",
    color: "#EBF3F2",
  },
  {
    title: "Hips",
    Before: client?.measurementHistory[0]?.hip ?? 0 + " cm",
    after:  client?.measurementHistory[client?.measurementHistory.length - 1]?.hip ?? 0 + " cm",
    color: "#F4DBC7",
  },
];
  return (
    <div className=" flex flex-col items-center gap-4 pb-4">
      {/* calender */}
      <div className="flex flex-col items-center w-full bg-white rounded-lg">
        
      </div>
      {/* Weight Progress */}
      <div className="flex flex-col items-center w-full p-4 bg-white rounded-lg gap-4">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-[16px] font-bold text-[#9e5608]">
            Weight Progress
          </h3>
          <button>
            <img src={assets.threeDotVector} alt="" className="w-[13px]" />
          </button>
        </div>
        <div className="w-full bg-[#F8F8F8] rounded-lg flex flex-col items-center gap-5 p-3">
          <div className="flex items-center justify-between w-full ">
            <span className="text-[12px] ">Today</span>
            <span className="text-[14px] font-bold text-[#9e5608]">
              {client?.weightHistory[client?.weightHistory.length - 1].weight} kg
            </span>
          </div>
          <div className="flex flex-col items-center w-full gap-2">
            <div className="flex items-center justify-between w-full ">
              <span className="text-[12px] text-[#66706D]">Start</span>
              <span className="text-[12px]">{client?.weightHistory[0].weight} kg</span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-[12px] text-[#66706D]">Change</span>
              <span className="text-[12px]">{client?.weightHistory[client?.weightHistory.length - 1].weight - client?.weightHistory[0].weight} kg</span>
            </div>
          </div>
        </div>
      </div>
      {/* Measurements */}
      <div className="flex flex-col items-center w-full p-4 bg-white rounded-lg gap-4">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-[16px] font-bold text-[#9e5608]">Measurements</h3>
          <button>
            <img src={assets.threeDotVector} alt="" className="w-[13px]" />
          </button>
        </div>
        <div className="flex flex-col items-center w-full gap-2.5">
          {compliance.map((items, i) => (
            <div
              key={i}
              className="relative w-full rounded-l-sm rounded-r-lg pl-4 p-2 bg-[#F8F8F8]"
            >
              <div
                className="absolute left-0 top-0 w-2 h-full  rounded-xs"
                style={{ background: items.color }}
              ></div>
              <div className="w-full flex items-center justify-between">
                <p className="text-[12px] ">{items.title}</p>
                <div>
                  <span className="text-[12px] text-[#66706D] px-1.5 border-r border-r-[#DBDEDD]">
                    Before{" "}
                    <span className="text-black text-[10px]">
                      {items.Before}
                    </span>
                  </span>
                  <span className="px-1.5 text-[11px] font-bold text-[#9e5608]">
                    {items.after}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Daily Activity Log */}
      {/* <div className="flex flex-col items-center w-full gap-4">
        <div className="flex items-center justify-between w-full">
          <h3 className="text-[16px] font-bold text-[#9e5608]">
            Daily Activity Log
          </h3>
          <button>
            <img src={assets.threeDotVector} alt="" className="w-[13px]" />
          </button>
        </div>
        <div className="flex flex-col items-center w-full">
          {dailyActivityLog.map((items, i) => (
            <div
              key={i}
              className="flex items-center gap-4 justify-start w-full"
            >
              <div
                className={`${
                  i % 2 === 0 ? "bg-[#9e5608]" : "bg-[#F4DBC7]"
                } rounded-full p-2`}
              >
                {i % 2 === 0 ? (
                  <img
                    src={assets.bellVector}
                    alt="bell vector"
                    className="w-4 h-3.5"
                  />
                ) : (
                  <img
                    src={assets.greenBellVector}
                    alt="bell vector"
                    className="w-4 h-3.5"
                  />
                )}
              </div>
              <div className="flex flex-col items-start gap-2 w-full py-3 border-b border-b-[#DBDEDD]">
                <span className="text-[12px] leading-[150%]">
                  {items.title}
                </span>
                <span className="text-[10px] text-[#66706D] leading-[150%]">
                  {items.date}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default ProfileRightSide;