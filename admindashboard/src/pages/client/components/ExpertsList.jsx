import React from "react";
import { assets } from "@/assets/asset";
import { BsChatLeftDots } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function ExpertsList({ expert }) {
const navigate = useNavigate();
  const experts = [
    { role: "Trainer", name: expert?.filter((expert) => expert?.role === "Trainer").map((expert) => expert?.name) || "N/A", icon: assets.profileVector },
    { role: "Dietitian", name: expert?.filter((expert) => expert?.role === "Dietician").map((expert) => expert?.name) || "N/A", icon: assets.profileVector },
    { role: "Therapist", name: expert?.filter((expert) => expert?.role === "Therapist").map((expert) => expert?.name) || "N/A", icon: assets.profileVector },
  ];

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm mt-4">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-[#9e5608] font-bold text-sm">Experts</h3>
        <img
          src={assets.threeDotVector}
          alt="more"
          className="w-4 h-4 cursor-pointer"
        />
      </div>
      <div className="space-y-5">
        {experts.map((expert, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 bg-gray-50 flex items-center justify-center rounded-full border border-gray-100 shadow-sm">
                <img
                  src={expert.icon}
                  alt={expert.role}
                  className="w-5 h-5 opacity-70"
                />
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold leading-none mb-1.5 uppercase tracking-wider">
                  {expert.role}
                </p>
                <p className="text-[14px] font-bold text-gray-800 leading-none">
                  {expert.name}
                </p>
              </div>
            </div>
            <div className="w-7 h-7 flex items-center justify-center bg-[#EBF3F2] rounded-lg border border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors shadow-sm">
              <BsChatLeftDots className="w-3.5 h-3.5 font-bold " onClick={()=>navigate("/client/chats")}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
