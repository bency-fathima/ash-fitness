import React from "react";

const HeadLeftSide = ({ Head }) => {
  const profileDetails = [
    {
      title: "Category",
      content: Head?.programCategory?.name || "N/A",
    },
    {
      title: "Base Salary",
      content: `₹${Head?.salary?.toLocaleString() || "0"}/m`,
    },
    {
      title: "Specialization",
      content: Head?.specialization?.join(", ") || "N/A",
    },
    {
      title: "Experience",
      content: `${Head?.experience || "0"} Years`,
    },
    {
      title: "Certifications",
      content: Head?.qualification || "N/A",
    },
  ];

  return (
    <div className=" flex flex-col gap-4 h-">
      <div className="bg-white rounded-2xl p-8 flex flex-col gap-8 shadow-sm ">
        {/* Header with Name and Badges */}
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-xl text-gray-800">{Head?.name}</h2>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-[#F0F0F0] rounded-full text-[11px] font-medium text-gray-600">
              {Head?.role}
            </span>
            <span className="px-3 py-1 bg-[#45C4A2] rounded-full text-[11px] font-medium text-white">
              {Head?.status}
            </span>
          </div>
        </div>

        {/* Details Table */}
        <div className="flex flex-col w-full border-t border-gray-50">
          {profileDetails.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-5 border-b border-gray-50"
            >
              <span className="text-[#66706D] text-sm font-medium">
                {item.title}
              </span>
              <span className="text-sm font-bold text-gray-800 text-right max-w-[60%]">
                {item.content}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeadLeftSide;
