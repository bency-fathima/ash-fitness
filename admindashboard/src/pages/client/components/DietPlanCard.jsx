import React from "react";
import { assets } from "@/assets/asset";

export default function DietPlanCard({
  isProgramStarted = true,
  startDate,
  dietPlanPdf,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleViewPdf = () => {
    if (dietPlanPdf) {
      const fullUrl = `${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${dietPlanPdf}`;
      window.open(fullUrl, "_blank");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm mt-4">
      <h3 className="text-[#9e5608] font-bold text-sm mb-5 leading-none">
        Diet Plan
      </h3>
      {!isProgramStarted ? (
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <p className="text-[#9e5608] font-semibold text-sm">
            Program starts on
          </p>
          <p className="text-2xl font-bold text-[#9e5608] mt-2">
            {formatDate(startDate)}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Your daily plan will appear here once the program begins.
          </p>
        </div>
      ) : dietPlanPdf ? (
        <div className="flex items-center justify-between bg-[#FDF8F3] p-4 rounded-[20px] border border-[#FBEAD9]/50">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-[#FBEAD9] flex items-center justify-center rounded-xl shadow-sm">
              <img src={assets.pdfVector} alt="pdf" className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[14px] font-bold text-gray-800 leading-none mb-1.5 max-w-[150px] truncate">
                {dietPlanPdf.split("/").pop()}
              </p>
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">
                PDF
              </p>
            </div>
          </div>
          <button
            onClick={handleViewPdf}
            className="bg-white text-[12px] font-bold px-4 py-2 rounded-xl border border-gray-100 shadow-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            View
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-4 text-center border-dashed border-2 border-gray-100 rounded-2xl">
          <p className="text-gray-400 text-sm">No diet plan assigned yet</p>
        </div>
      )}
    </div>
  );
}
