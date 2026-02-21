import React from "react";
import { X } from "lucide-react";

export default function DailyTaskDrawer({
  selectedDate,
  tasks,
  allMissed,
  onClose,
  // onSkip,
  onTaskClick,
}) {
  if (!selectedDate) return null;

  const statusColors = {
    verified: "bg-green-50 text-green-700 border-green-200",
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    todo: "bg-gray-50 text-gray-700 border-gray-200",
    missed: "bg-gray-100 text-gray-700 border-gray-300",
    completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    skipped: "bg-orange-50 text-orange-700 border-orange-200",
    "in review": "bg-purple-50 text-purple-700 border-purple-200",
    improve: "bg-orange-50 text-orange-700 border-orange-200",
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex lg:justify-end items-end lg:items-stretch">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/20 lg:bg-black/5 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full lg:w-[320px] lg:h-full max-h-[70vh] lg:max-h-none bg-white shadow-2xl flex flex-col rounded-t-3xl lg:rounded-none animate-in slide-in-from-bottom lg:slide-in-from-right duration-300 pb-24 lg:pb-0">
        <div className="flex justify-between items-center p-5 lg:p-6 pb-4 border-b border-gray-100">
          {/* Mobile handle bar */}
          <div className="lg:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full"></div>

          <h2 className="font-bold text-[15px] lg:text-[16px] text-gray-800">
            {formatDate(selectedDate)}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-2.5 lg:space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {allMissed ? (
             <div className="text-center py-12 text-gray-500">
               <p className="text-[14px]">You were not logged in that day</p>
             </div>
          ) : tasks && tasks.length > 0 ? (
            tasks.map((task, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-3.5 lg:py-3 px-4 bg-gray-50/50 rounded-xl hover:bg-gray-50 transition-colors"
                onClick={() => onTaskClick && onTaskClick(task)} // Add click handler
              >
                <span className="text-[14px] lg:text-[15px] font-medium text-gray-800">
                  {task.name}
                </span>
                <div className="flex items-center gap-2">
                  {task.type === "Meal" &&
                    (task.status === "todo" || task.status === "pending") && (
                      // Removed restricted skip button
                      <></>
                    )}
                  <span
                    className={`text-[11px] lg:text-[12px] font-semibold px-2.5 lg:px-3 py-1 rounded-full border ${
                      statusColors[task.status.toLowerCase()] ||
                      statusColors.pending
                    }`}
                  >
                    {task.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">
              <p className="text-[14px]">No tasks for this day</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
