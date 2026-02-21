import { assets } from "@/assets/asset";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useAppSelector } from "@/redux/store/hooks";
import React from "react";

const ExpertClientProfileLeftSide = ({
  client,
  clientComplianceStats,
  dashboardStats,
}) => {
  const user = useAppSelector(selectUser);

  const [year] = client?.dob?.split("-") || [];
  const today = new Date();

  let age = year ? today.getFullYear() - year : null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  const profileInfo = [
    {
      img: assets.GenderVector,
      title: "Gender",
      data: client?.gender || "Male",
    },
    {
      img: assets.AgeVector,
      title: "Age",
      data: age ? `${age} y/o` : "N/A",
    },
    {
      img: assets.EmailVector,
      title: "Email Address",
      data: client?.email || "N/A",
    },
    {
      img: assets.PhoneVector,
      title: "Phone Number",
      data: client?.phone || "N/A",
    },
    {
      img: assets.HomeVector,
      title: "Address",
      data: client?.address || "N/A",
    },
  ];

  const role = {
    dietician: "Diet",
    trainer: "Workout",
    therapist: "Therapy",
  };


  return (
    <div className="flex flex-col items-center gap-4 pb-4">
      {/* Profile Header */}
      <div className="w-full bg-white rounded-lg p-6">
        <div className="flex flex-col items-center gap-6">
          <div className="w-full flex justify-end">
            <img
              src={assets.threeDotVector}
              alt="dot menu"
              className="w-[18px] cursor-pointer"
            />
          </div>
          <div className="flex flex-col items-center gap-3">
            <h2 className="font-bold text-[18px]">
              {client?.name || "Client Name"}
            </h2>
            <div className="flex items-center justify-center gap-2 text-[12px]">
              <span className="px-3 py-1 bg-[#F0F0F0] rounded-full text-[#66706D]">
                {client?.programType?.title || "Program"}
              </span>
              <span className="px-3 py-1 bg-[#F0F0F0] rounded-full text-[#66706D]">
                {client?.programType?.plan?.duration}
              </span>
              <span className="px-3 py-1 bg-[#45C4A2] rounded-full text-white">
                {client?.status || "Active"}
              </span>
            </div>
          </div>
          <div className="flex items-center flex-col gap-3 p-4 w-full rounded-lg bg-[#F8F8F8]">
            <div className="flex items-center justify-between w-full">
              <span className="text-[#66706D] text-[13px]">Start Date</span>
              <span className="text-[13px] font-medium">
                {client?.programStartDate
                  ? formatDate(client?.programStartDate)
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between w-full">
              <span className="text-[#66706D] text-[13px]">End Date</span>
              <span className="text-[13px] font-medium">
                {client?.programEndDate
                  ? formatDate(client?.programEndDate)
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Info */}
      <div className="p-6 w-full bg-white rounded-lg flex flex-col items-center gap-5">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-[#9e5608] font-bold text-[16px]">
            Personal Info
          </h2>
          <button>
            <img
              src={assets.threeDotVector}
              alt="dot menu"
              className="w-[18px]"
            />
          </button>
        </div>
        <div className="flex flex-col items-start gap-5 w-full">
          {profileInfo.map((items, i) => (
            <div className="flex items-start gap-4" key={i}>
              <div className="p-2 bg-[#F5F5F5] rounded-full w-9 h-9 flex items-center justify-center">
                <img src={items.img} alt="" className="w-4" />
              </div>
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-[11px] text-[#8C9593]">
                  {items.title}
                </span>
                <span className="text-[13px] font-medium text-[#1E1E1E]">
                  {items.data}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Therapy Compliance */}
      <div className="p-6 w-full bg-white rounded-lg flex flex-col items-center gap-4">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-[#9e5608] font-bold text-[16px]">
            {role[user?.role.toLowerCase()]} Compliance
          </h2>
          <button>
            <img
              src={assets.threeDotVector}
              alt="dot menu"
              className="w-[18px]"
            />
          </button>
        </div>
        <div className="w-full bg-[#F8F8F8] rounded-lg p-4 flex flex-col gap-3">
          <div className="flex justify-between items-center w-full">
            <span className="text-[13px] text-[#1E1E1E] font-medium">
              {role[user?.role.toLowerCase()]} Compliance
            </span>
            <span className="text-[14px] text-[#9e5608] font-bold">
              {clientComplianceStats?.[role?.[user?.role.toLowerCase()]?.toLowerCase()]}%
            </span>
          </div>
          <div className="flex justify-between items-center w-full">
            <span className="text-[13px] text-[#66706D]">Missed Count</span>
            <span className="text-[13px] text-[#1E1E1E] font-medium">
              {user?.role.toLowerCase() == "dietician"
                ? clientComplianceStats?.stats?.missedCount +
                  clientComplianceStats?.stats?.skippedCount
                : 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertClientProfileLeftSide;
