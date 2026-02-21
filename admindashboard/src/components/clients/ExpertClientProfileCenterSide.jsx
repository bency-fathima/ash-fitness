import { assets } from "@/assets/asset";
import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyTask, rejectTask } from "@/redux/features/tasks/task.thunk";
import { toast } from "react-toastify";
import { ChevronDown, ChevronUp } from "lucide-react";
import { selectUser } from "@/redux/features/auth/auth.selectores";

const ExpertClientProfileCenterSide = ({ client, pendingTasks }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [comment, setComment] = useState("");
  const [processing, setProcessing] = useState(null); // stores task ID being processed
  const [expandedTaskIndex, setExpandedTaskIndex] = useState(null);

  // Group tasks for THIS client by day
  const groupedTasks = useMemo(() => {
    if (!pendingTasks || !client?._id) return [];

    let clientTasks = pendingTasks.filter(
      (task) => task.userId?._id === client?._id,
    );

    // Filter based on Expert Role
    if (user?.role) {
      const lowerRole = user.role.toLowerCase();
      if (lowerRole.includes("trainer")) {
        clientTasks = clientTasks.filter((t) => t.taskType === "Workout");
      } else if (
        lowerRole.includes("dietician") ||
        lowerRole.includes("dietitian")
      ) {
        clientTasks = clientTasks.filter((t) => t.taskType === "Meal");
      } else if (lowerRole.includes("therapist")) {
        clientTasks = clientTasks.filter((t) => t.taskType === "Therapy");
      }
    }

    if (clientTasks.length === 0) return [];

    const groups = {};
    clientTasks.forEach((task) => {
      const key = task.globalDayIndex;
      if (!groups[key]) {
        groups[key] = {
          globalDayIndex: task.globalDayIndex,
          weekIndex: task.weekIndex,
          dayIndex: task.dayIndex,
          tasks: [],
          createdAt: task.createdAt,
        };
      }
      groups[key].tasks.push(task);
    });

    return Object.values(groups).sort(
      (a, b) => b.globalDayIndex - a.globalDayIndex,
    );
  }, [pendingTasks, client?._id]);

  const toggleTask = (index) => {
    setExpandedTaskIndex(expandedTaskIndex === index ? null : index);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "verified": return "bg-green-100 text-green-700";
      case "rejected": return "bg-red-100 text-red-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "skipped": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const handleApprove = async (taskGroup) => {
    setProcessing(`approve-${taskGroup.globalDayIndex}`);
    try {
      const pendingTasksToVerify = taskGroup.tasks.filter(t => t.status === 'pending');
      for (const task of pendingTasksToVerify) {
        await dispatch(verifyTask(task?._id)).unwrap();
      }
      toast.success("Tasks approved successfully");
    } catch (error) {
      toast.error(error || "Failed to approve tasks");
    } finally {
      setProcessing(null);
    }
  };

  const handleImprove = async (taskGroup) => {
    if (!comment) {
      toast.info("Please provide a comment for improvement");
      return;
    }
    setProcessing(`reject-${taskGroup.globalDayIndex}`);
    try {
      const pendingTasksToReject = taskGroup.tasks.filter(t => t.status === 'pending');
      for (const task of pendingTasksToReject) {
        await dispatch(rejectTask({ id: task?._id, comment })).unwrap();
      }
      toast.success("Feedback sent to client");
      setComment("");
    } catch (error) {
      toast.error(error || "Failed to send feedback");
    } finally {
      setProcessing(null);
    }
  };

  const healthDetails = [
    {
      heading: "Medical Conditions",
      data: client?.medicalConditions?.length
        ? client.medicalConditions.join(", ")
        : "None",
    },
    {
      heading: "Allergies",
      data: client?.allergies?.length ? client.allergies.join(", ") : "None",
    },
    {
      heading: "Food Preference",
      data: client?.foodPreferences || "Veg",
    },
    {
      heading: "Fitness Goal",
      data: client?.goals || client?.programType?.title || "Weight Loss",
    },
    {
      heading: "Current Weight",
      data: client?.currentWeight ? `${client.currentWeight} kg` : "N/A",
    },
    {
      heading: "Target Weight",
      data: client?.targetWeight ? `${client.targetWeight} kg` : "N/A",
    },
  ];

  return (
    <div className="flex flex-col items-center gap-4 pb-4">
      {/* Health Details */}
      <div className="p-6 flex flex-col items-center gap-4 w-full bg-white rounded-lg">
        <div className="w-full flex justify-between items-center">
          <h2 className="font-bold text-[16px] text-[#9e5608]">
            Health Details
          </h2>
          <button>
            <img
              src={assets.threeDotVector}
              alt="dot menu"
              className="w-[18px]"
            />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
          {healthDetails.map((item, i) => (
            <div
              key={i}
              className="p-4 bg-[#F8F8F8] rounded-lg w-full flex flex-col gap-2"
            >
              <span className="px-2 py-1 bg-[#F0F0F0] text-[11px] text-[#66706D] rounded-md w-max">
                {item.heading}
              </span>
              <span className="text-[13px] text-[#9e5608] font-medium break-all">
                {item.data}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Program Summary */}
      <div className="p-6 flex flex-col items-center gap-4 w-full bg-white rounded-lg">
        <div className="w-full flex justify-between items-center">
          <h2 className="font-bold text-[16px] text-[#9e5608]">
            Program Summary
          </h2>
          <button>
            <img
              src={assets.threeDotVector}
              alt="dot menu"
              className="w-[18px]"
            />
          </button>
        </div>
        <div className="flex items-center gap-4 w-full">
          <div className="p-4 bg-[#F8F8F8] rounded-lg w-1/2 flex flex-col gap-1">
            <span className="text-[12px] text-[#66706D]">Program Type</span>
            <span className="text-[14px] font-bold text-[#1E1E1E]">
              {client?.programType?.title || "N/A"}
            </span>
          </div>
          <div className="p-4 bg-[#F8F8F8] rounded-lg w-1/2 flex flex-col gap-2">
            <div className="flex justify-between items-center w-full">
              <span className="text-[12px] text-[#66706D]">Plan Duration</span>
              <span className="text-[12px] text-[#66706D]">
                <span className="text-[#9e5608] font-bold">
                  {(() => {
                    const durationStr = client?.programType?.plan?.duration || "";
                    const durationVal = parseInt(durationStr.split(" ")[0]) || 0;
                    const day = client?.currentGlobalDay || 0;
                    if (durationVal === 0) return 0;
                    const pct = (day / durationVal) * 100;
                    return isNaN(pct) ? 0 : pct.toFixed(0);
                  })()}
                  %
                </span>{" "}
                / 100%
              </span>
            </div>
            <div className="w-full">
              <span className="text-[14px] font-bold text-[#1E1E1E]">
                {client?.programType?.plan?.duration}
              </span>
            </div>
            <div className="relative w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-[#9e5608] rounded-full"
                style={{
                  width: `${(() => {
                    const durationStr = client?.programType?.plan?.duration || "";
                    const durationVal = parseInt(durationStr.split(" ")[0]) || 0;
                    const day = client?.currentGlobalDay || 0;
                    if (durationVal === 0) return "0%";
                    const pct = (day / durationVal) * 100;
                    return `${Math.min(isNaN(pct) ? 0 : pct, 100)}%`;
                  })()}`,
                }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Task History Area */}
      <div className="w-full flex flex-col items-center gap-4 p-6 bg-white rounded-lg min-h-[200px]">
        <div className="w-full flex justify-between items-center mb-2">
          <h2 className="font-bold text-[16px] text-[#9e5608]">
            Task History
          </h2>
          <div className="flex items-center gap-2 bg-[#F8F8F8] px-3 py-1.5 rounded-md cursor-pointer">
            <span className="text-[12px] text-[#1E1E1E] font-medium">
              {groupedTasks.length} Days Logged
            </span>
          </div>
        </div>

        {groupedTasks.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center flex-1 h-full py-8">
            <span className="text-[#66706D] text-[14px]">
              No Submissions Found
            </span>
          </div>
        ) : (
          <div className="w-full flex flex-col gap-4">
            {groupedTasks.map((group, gIndex) => {
              const hasPending = group.tasks.some(t => t.status === "pending");
              return (
              <div
                key={gIndex}
                className="border border-gray-100 rounded-xl overflow-hidden bg-[#FBFBFB]"
              >
                {/* Day Header */}
                <button
                  onClick={() => toggleTask(gIndex)}
                  className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors border-b border-gray-50"
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-[14px] font-bold text-[#9e5608]">
                      Day {group.globalDayIndex} Submissions
                    </span>
                    <span className="text-[11px] text-[#66706D]">
                      {new Date(group.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                     {hasPending && (
                        <span className="px-2 py-0.5 bg-yellow-50 text-yellow-600 text-[10px] font-bold rounded uppercase">
                            Pending Review
                        </span>
                     )}
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded uppercase">
                      {group.tasks.length}{" "}
                      {group.tasks.length === 1 ? "Task" : "Tasks"}
                    </span>
                    {expandedTaskIndex === gIndex ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </div>
                </button>

                {expandedTaskIndex === gIndex && (
                  <div className="p-4 space-y-4 animate-in fade-in duration-200">
                    {group.tasks.map((task) => (
                      <div
                        key={task?._id}
                        className="bg-white p-3 rounded-lg border border-gray-50 shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-[12px] font-bold text-[#1E1E1E]">
                              {task.taskType}
                            </span>
                            {task.exerciseIndex !== undefined && (
                              <span className="text-[11px] text-[#66706D] ml-2">
                                Ex {task.exerciseIndex + 1}
                              </span>
                            )}
                          </div>
                            <div className="flex flex-col items-end gap-1">
                                <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${getStatusColor(task.status)}`}>
                                    {task.status}
                                </span>
                                <span className="text-[10px] text-[#66706D]">
                                    {new Date(task.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        </div>

                        {task.notes && (
                          <div className="bg-[#F8F8F8] p-2 rounded text-[12px] text-[#333] mb-3 leading-relaxed italic">
                            "{task.notes}"
                          </div>
                        )}
                        
                         {task.adminComment && (
                          <div className="bg-red-50 p-2 rounded text-[12px] text-red-600 mb-3 leading-relaxed border border-red-100">
                            Feedback: "{task.adminComment}"
                          </div>
                        )}

                        {task.file && (
                          <div className="rounded-lg overflow-hidden border border-gray-100 max-h-[300px] flex justify-center bg-gray-50">
                            {task.file.match(/\.(mp4|webm|ogg)$/i) ? (
                              <video
                                src={`${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${task.file}`}
                                controls
                                className="max-w-full h-auto"
                              />
                            ) : (
                              <img
                                src={`${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${task.file}`}
                                alt="Proof"
                                className="max-w-full h-auto object-contain"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Feedback and Actions */}
                    {hasPending && (
                        <div className="pt-2 space-y-3">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-medium text-[#66706D]">
                            Coach Feedback
                            </label>
                            <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Provide feedback if revisions are needed..."
                            className="w-full h-20 text-[13px] border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[#9e5608] bg-white"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                            onClick={() => handleImprove(group)}
                            disabled={!!processing}
                            className="flex-1 px-4 py-2 border border-[#D4A5A0] text-[#D4A5A0] rounded-lg hover:bg-red-50 transition-colors font-medium text-[13px] disabled:opacity-50"
                            >
                            {processing === `reject-${group.globalDayIndex}`
                                ? "Processing..."
                                : "Needs Work"}
                            </button>
                            <button
                            onClick={() => handleApprove(group)}
                            disabled={!!processing}
                            className="flex-1 px-4 py-2 bg-[#9e5608] text-white rounded-lg hover:bg-[#083d37] transition-colors font-medium text-[13px] disabled:opacity-50"
                            >
                            {processing === `approve-${group.globalDayIndex}`
                                ? "Processing..."
                                : "Approve Pending"}
                            </button>
                        </div>
                        </div>
                    )}
                  </div>
                )}
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpertClientProfileCenterSide;
