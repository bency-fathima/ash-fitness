/* eslint-disable react-hooks/preserve-manual-memoization */
import { assets } from "@/assets/asset";
import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUserSubmissions } from "@/redux/features/tasks/task.thunk";

const statusStyles = {
  Completed: {
    bg: "#E6F4F1",
    textsColor: "#137528",
    border: "#B7DFBA",
  },
  Verified: {
    bg: "#E6F4F1",
    textsColor: "#137528",
    border: "#B7DFBA",
  },
  Skipped: {
    bg: "#FFFAE0",
    textsColor: "#936900",
    border: "#F8D87B",
  },
  Missed: {
    bg: "#FFF0ED",
    textsColor: "#B13116",
    border: "#FAC6BD",
  },
  Rejected: {
    bg: "#FFF0ED",
    textsColor: "#B13116",
    border: "#FAC6BD",
  },
  Pending: {
    bg: "#F2F3F5",
    textsColor: "#54595D",
    border: "#D7DCDF",
  },
};

const ProfileCenterSide = ({ client }) => {
  const dispatch = useDispatch();
  const { selectedUserTasks } = useSelector((state) => state.tasks);

  useEffect(() => {
    if (client?._id) {
      dispatch(getAllUserSubmissions(client?._id));
    }
  }, [client?._id, dispatch]);

  const todaysTasks = useMemo(() => {
    if (!selectedUserTasks || !client) return [];

    // Filter for current global day
    const currentDayTasks = selectedUserTasks.filter(
      (task) => task.globalDayIndex === client.currentGlobalDay,
    );

    return currentDayTasks.map((task) => {
      let status = "Pending";
      if (task.status === "verified") status = "Completed";
      else if (task.status === "skipped") status = "Skipped";
      else if (task.status === "rejected")
        status = "Missed"; // Or Rejected
      else if (task.status === "missed") status = "Missed";

      return {
        img: assets.tickVector, // specific icon per type?
        heading: task.taskType || "Task",
        contend:
          task.notes ||
          (task.exerciseIndex !== undefined
            ? `Exercise ${task.exerciseIndex + 1}`
            : "No details"),
        status: status,
      };
    });
  }, [selectedUserTasks, client?.currentGlobalDay]);

  const healthDetails = [
    {
      heading: "Medical Conditions",
      data: client?.medicalConditions,
    },
    {
      heading: "Allergies",
      data: client?.allergies,
    },
    {
      heading: "Food Preference",
      data: [client?.foodPreferences],
    },
    {
      heading: "Fitness Goal",
      data: [client?.goals || client?.programType?.title],
    },
    {
      heading: "Current Weight",
      data: [`${client?.currentWeight} kg`],
    },
    {
      heading: "Target Weight",
      data: [`${client?.targetWeight} kg`],
    },
  ];

  return (
    <div className=" flex flex-col items-center gap-4 pb-4">
      {/* Health Details */}
      <div className="p-4 flex flex-col items-center gap-4 w-full bg-white rounded-lg">
        <div className="w-full flex justify-between items-center">
          <h2 className="font-bold text-[16px] text-[#9e5608]">
            Health Details
          </h2>
          <button>
            <img src={assets.threeDotVector} alt="dot menu" className="w-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2.5 w-full">
          {healthDetails.map((items, i) => (
            <div key={i} className="p-3.5 bg-[#F8F8F8] rounded-lg w-full">
              <div className="w-full flex flex-col items-start gap-2">
                <span className="px-1.5 py-1 bg-[#F0F0F0] text-[11px] rounded-sm">
                  {items.heading}
                </span>
                <span className="text-[12px] text-[#9e5608] ">
                  {items?.data?.join(", ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Program Summary */}
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="w-full flex justify-between items-center">
          <h2 className="font-bold text-[16px] text-[#9e5608]">
            Health Details
          </h2>
          <button>
            <img src={assets.threeDotVector} alt="dot menu" className="w-3.5" />
          </button>
        </div>
      </div>
      <div className="flex items-center  gap-[7.5px] w-full">
        <div className="p-4 bg-white rounded-2xl w-[50%]">
          <div className="flex flex-col items-start gap-1 ">
            <span className="text-[11px] text-[#66706D]">Program Type</span>
            <span className="font-bold text-[12px]">
              {client?.programType?.title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-6 p-4 bg-white rounded-2xl w-[50%]">
          <div className="flex flex-col items-start gap-1 w-full">
            <span className="text-[11px] text-[#66706D]">Plan Duration</span>
            <span className="font-bold text-[12px]">
              {client?.programType?.plan?.duration}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1 w-full">
            <p className="text-[12px] text-[#66706D]">
              <span className="text-[#9e5608] font-bold">
                {client?.programType?.plan?.duration
                  ? (
                      (client?.currentGlobalDay /
                        client?.programType?.plan?.duration.split(" ")[0]) *
                      100
                    ).toFixed(0)
                  : 0}
                %
              </span>{" "}
              / 100%
            </p>
            <div className="relative w-25 bg-gray-200 rounded-full h-2 overflow-visible">
              <div
                className="h-full bg-[#F4DBC7] transition-all duration-500 ease-out rounded-l-full"
                style={{
                  width:
                    (client?.currentGlobalDay /
                      client?.programType?.plan?.duration.split(" ")[0]) *
                    100,
                }}
              />
              <span
                className={`absolute  -top-0.5 w-0.5 h-3 bg-[#9e5608]`}
                style={{
                  left: `${(client?.currentGlobalDay / client?.programType?.plan?.duration.split(" ")[0]) * 100}%`,
                }}
              ></span>
            </div>
          </div>
        </div>
      </div>
      {/* Today’s Task */}
      <div className="w-full flex flex-col items-center gap-4 p-4 bg-white rounded-lg">
        <div className="w-full flex justify-between items-center">
          <h2 className="font-bold text-[16px] text-[#9e5608]">Today’s Task</h2>
          <button>
            <img src={assets.threeDotVector} alt="dot menu" className="w-3.5" />
          </button>
        </div>
        <div className="w-full flex flex-col items-center">
          {todaysTasks.length === 0 ? (
            <div className="py-4 text-center w-full">
              <span className="text-[13px] text-[#66706D]">
                No tasks logged for today yet.
              </span>
            </div>
          ) : (
            todaysTasks.map((items, i) => {
              const styles = statusStyles[items.status] || statusStyles.Pending;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between w-full py-4 border-b border-b-[#DBDEDD]"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="p-3 rounded-full "
                      style={{ backgroundColor: styles.bg }}
                    >
                      <img
                        src={items.img}
                        alt=""
                        className="w-[17px] h-[17px]"
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-[11px] text-[#9e5608] font-bold">
                        {items.heading}
                      </span>
                      <span className="text-[12px]">{items.contend}</span>
                    </div>
                  </div>
                  <div
                    className="border  px-2 py-0.5 rounded-full flex items-center"
                    style={{
                      background: styles.bg,
                      borderColor: styles.border,
                    }}
                  >
                    <span
                      className=" text-[11px] "
                      style={{ color: styles.textsColor }}
                    >
                      {items.status}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCenterSide;
