import React, { useState } from "react";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
import { assignDietPlan } from "@/redux/features/client/client.thunk";
import { toast } from "react-toastify";

export default function AssignDietPlanDrawer({ isOpen, onClose, clientId }) {
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);
  const [mealCount, setMealCount] = useState(6);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please upload a PDF file");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("mealCount", mealCount);

    try {
      await dispatch(assignDietPlan({ clientId, formData })).unwrap();
      toast.success("Diet plan assigned successfully");
      onClose();
      setFile(null);
      setMealCount(6);
    } catch (error) {
      toast.error(error || "Failed to assign diet plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex lg:justify-end items-end lg:items-stretch">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/20 lg:bg-black/5 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full lg:w-[340px] lg:h-full max-h-[85vh] lg:max-h-none bg-white shadow-2xl flex flex-col rounded-t-3xl lg:rounded-none animate-in slide-in-from-bottom lg:slide-in-from-right duration-300 pb-24 lg:pb-0">
        {/* Header */}
        <div className="flex justify-between items-center p-5 lg:p-6 pb-4 border-b border-gray-100">
           {/* Mobile handle bar */}
          <div className="lg:hidden absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-gray-300 rounded-full"></div>

          <h2 className="text-[16px] lg:text-xl font-bold text-[#9e5608]">
            Assign Diet Plan
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Meal Type Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              Meal Count
            </h3>
            <div className="grid py-5  rounded-xl">
              <input
                type="number"
                min="1"
                max="10"
                value={mealCount}
                onChange={(e) => setMealCount(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#9e5608]/50"
              />
            </div>
          </div>

          {/* Attachment */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Attachment
            </h3>
            <div className="flex border border-gray-200 rounded-lg bg-white overflow-hidden">
                <label className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-3 cursor-pointer transition-colors border-r border-gray-200">
                    Upload File
                    <input type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
                </label>
                <div className="flex-1 px-4 py-3 text-sm text-gray-500 truncate flex items-center">
                    {file ? file.name : "Upload PDF"}
                </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 lg:p-6 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-[#9e5608] text-white font-semibold py-3.5 rounded-xl hover:bg-[#083d38] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save & Update"}
          </button>
        </div>
      </div>
    </div>
  );
}