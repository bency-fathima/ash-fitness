import React from "react";

const AdminCenterSide = ({ admin }) => {
  const personalInfo = [
    {
      title: "Gender",
      content: admin?.gender || "N/A",
    },
    {
      title: "Age",
      content: admin?.dob
        ? `${new Date().getFullYear() - new Date(admin.dob).getFullYear()} y/o`
        : "N/A",
    },
    {
      title: "Email Address",
      content: admin?.email || "N/A",
    },
    {
      title: "Phone Number",
      content: admin?.phone || "N/A",
    },
    {
      title: "Address",
      content: admin?.address || "N/A",
    },
  ];

  return (
    <div className=" flex flex-col gap-4">
      <div className="bg-white rounded-2xl p-8 flex flex-col gap-8 shadow-sm ">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[#9e5608] font-bold text-lg">Personal Info</h2>
        </div>

        {/* Details Table */}
        <div className="flex flex-col w-full border-t border-gray-50">
          {personalInfo.map((item, i) => (
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

export default AdminCenterSide;
