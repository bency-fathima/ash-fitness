import React, { useState } from "react";
import {
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { verifyTask, rejectTask } from "@/redux/features/tasks/task.thunk";
import { toast } from "react-toastify";

export default function ReviewDrawer({ review, onClose }) {
  if (!review) return null;
  const dispatch = useDispatch();

  const [expandedSections, setExpandedSections] = useState({
    details: true,
    file: true,
  });
  const [expandedTaskIndex, setExpandedTaskIndex] = useState(null);
  const [comment, setComment] = useState("");
  const [processing, setProcessing] = useState(false);

  // Check if this is a grouped task or single task
  const isGroupedTasks = review.tasks && Array.isArray(review.tasks);
  const tasks = isGroupedTasks ? review.tasks : [review];

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleTask = (index) => {
    setExpandedTaskIndex(expandedTaskIndex === index ? null : index);
  };

  const handleApprove = async () => {
    setProcessing(true);
    if (isGroupedTasks) {
      // Approve all tasks in the group
      for (const task of tasks) {
        await dispatch(verifyTask(task?._id));
      }
    } else {
      await dispatch(verifyTask(review?._id));
    }
    setProcessing(false);
    onClose();
  };

  const handleImprove = async () => {
    if (!comment) {
      toast.info("Please provide a comment for improvement");
      return;
    }
    setProcessing(true);
    if (isGroupedTasks) {
      // Reject all tasks in the group with the same comment
      for (const task of tasks) {
        await dispatch(rejectTask({ id: task?._id, comment }));
      }
    } else {
      await dispatch(rejectTask({ id: review?._id, comment }));
    }
    setProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/5 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-[360px] h-full bg-[#F8F9FA] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-5 pb-4 bg-white border-b border-gray-200">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-[16px] text-gray-900">
              Task Review
            </h2>
            <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-[12px] font-semibold rounded-full uppercase">
              {review.status}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Client Details */}
          <div className="bg-white rounded-xl p-4 space-y-3">
            <button
              onClick={() => toggleSection("details")}
              className="w-full flex items-center justify-between"
            >
              <h3 className="text-[13px] font-semibold text-gray-500 uppercase">
                Client Details
              </h3>
              {expandedSections.details ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>

            {expandedSections.details && (
              <div className="space-y-2 pt-2 border-t border-gray-50">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-gray-500">Client Name</span>
                  <span className="text-[13px] text-gray-900 font-medium">
                    {review.userId?.name || tasks[0]?.userId?.name}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-gray-500">Program</span>
                  <span className="text-[13px] text-gray-900 font-medium">
                    {review.programId?.title || tasks[0]?.programId?.title || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-gray-500">Day</span>
                  <span className="text-[13px] text-gray-900 font-medium">
                    Day {review.globalDayIndex || tasks[0]?.globalDayIndex}
                  </span>
                </div>

                {isGroupedTasks && (
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] text-gray-500">Total Tasks</span>
                    <span className="text-[13px] text-gray-900 font-medium">
                      {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-gray-500">Submitted</span>
                  <span className="text-[13px] text-gray-900 font-medium">
                    {new Date(review.createdAt || tasks[0]?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Submission Preview */}
          <div className="bg-white rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection("file")}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <h3 className="text-[14px] font-semibold text-gray-900">
                Submission{isGroupedTasks && tasks.length > 1 ? 's' : ''} Proof
              </h3>
              {expandedSections.file ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>

            {expandedSections.file && (
              <div className="border-t border-gray-100">
                {isGroupedTasks ? (
                  // Show accordion for multiple tasks
                  <div className="space-y-2 p-4">
                    {tasks.map((task, index) => (
                      <div
                        key={task?._id}
                        className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm"
                      >
                        {/* Accordion Header */}
                        <button
                          onClick={() => toggleTask(index)}
                          className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-bold text-gray-800">
                              {task.taskType} - Ex {task.exerciseIndex + 1}
                            </span>
                          </div>
                          {expandedTaskIndex === index ? (
                            <ChevronUp className="w-4 h-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-gray-400" />
                          )}
                        </button>

                        {/* Accordion Content */}
                        {expandedTaskIndex === index && (
                          <div className="px-3 pb-3 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200 border-t border-gray-100">
                            <div className="pt-2">
                              <label className="text-[11px] text-gray-500 mb-1 block">
                                Client's Notes
                              </label>
                              <div className="bg-gray-50 rounded-lg p-2">
                                <p className="text-[12px] text-gray-700 leading-relaxed">
                                  {task.notes || "No notes provided"}
                                </p>
                              </div>
                            </div>

                            {task.file && (
                              <div className="rounded-lg overflow-hidden border border-gray-100">
                                {task.file.match(/\.(mp4|webm|ogg)$/i) ? (
                                  <video
                                    src={`${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${task.file}`}
                                    controls
                                    className="w-full h-auto"
                                  />
                                ) : (
                                  <img
                                    src={`${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${task.file}`}
                                    alt="Proof"
                                    className="w-full h-auto"
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  // Show single task
                  <div className="px-4 pb-4 space-y-3">
                    <div className="pt-3">
                      <label className="text-[12px] text-gray-500 mb-2 block">
                        Client's Notes
                      </label>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-[12px] text-gray-700 leading-relaxed">
                          {review.notes || "No notes provided"}
                        </p>
                      </div>
                    </div>

                    {review.file && (
                      <div className="rounded-lg overflow-hidden border border-gray-100">
                        {review.file.match(/\.(mp4|webm|ogg)$/i) ? (
                          <video
                            src={`${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${review.file}`}
                            controls
                            className="w-full h-auto"
                          />
                        ) : (
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${review.file}`}
                            alt="Proof"
                            className="w-full h-auto"
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Review Section */}
          <div className="bg-white rounded-xl p-4 space-y-3">
            <h3 className="text-[13px] font-semibold text-gray-500 uppercase">
              Your Feedback
            </h3>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Provide feedback for the client..."
              className="w-full h-24 text-[13px] border border-gray-200 rounded-lg p-3 focus:outline-none focus:border-[#9e5608] bg-gray-50/50"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 pt-4 bg-white border-t border-gray-200 flex gap-3">
          <button
            onClick={handleImprove}
            disabled={processing}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-[14px] disabled:opacity-50"
          >
            Needs Work
          </button>
          <button
            onClick={handleApprove}
            disabled={processing}
            className="flex-1 px-4 py-3 bg-[#9e5608] text-white rounded-lg hover:bg-[#083d37] transition-colors font-medium text-[14px] disabled:opacity-50"
          >
            {processing ? "..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}
