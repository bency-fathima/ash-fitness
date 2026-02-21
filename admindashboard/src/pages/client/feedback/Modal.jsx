import React, { useState } from "react";
import { X } from "lucide-react";
import { selectUser } from "@/redux/features/auth/auth.selectores";
import { useAppSelector } from "@/redux/store/hooks";
import { useDispatch } from "react-redux";
import { createFeedback } from "@/redux/features/client/client.thunk";
import { toast } from "react-toastify";

export default function Modal({ expert, onClose, fetchFeedbackData }) {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const user = useAppSelector(selectUser);

  const handleSubmit = async () => {
    try {
      const values = {
        expertId: expert?._id,
        rating,
        feedback,
        userId: user?._id,
      };

      await dispatch(createFeedback(values)).unwrap();

      fetchFeedbackData();
      toast.success("Feedback submitted successfully");
    } catch (error) {
      // Display the specific error message from backend
      const errorMessage =
        error?.message || error || "Failed to submit feedback";
      toast.error(errorMessage);
    } finally {
      onClose();
      setRating(0);
      setFeedback("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer - Full screen on mobile, sidebar on desktop */}
      <div className="relative w-full lg:w-[400px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex justify-between items-center p-4 lg:p-6 lg:pb-4 border-b border-gray-100">
          <h2 className="font-bold text-[16px] lg:text-[18px] text-[#9e5608]">
            Rate Your Experience
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 lg:w-6 lg:h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6">
          {/* Expert Info */}
          <div className="flex gap-3 lg:gap-4 items-center">
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-[#D4A5A0] flex items-center justify-center text-white text-base lg:text-lg font-semibold shrink-0">
              {expert?.name?.split(" ")?.[0]?.[0]}
              {expert?.name?.split(" ")?.[1]?.[0]}
            </div>
            <div className="flex-1 space-y-1 lg:space-y-2">
              <h3 className="font-semibold text-[15px] lg:text-[15px] text-gray-800">
                {expert.name}
              </h3>
              <div className="flex flex-row gap-2">
                <p className="text-[11px] text-gray-600 px-2.5 lg:px-3 py-1 rounded-full bg-gray-100 font-medium capitalize">
                  {expert.role}
                </p>
                <p className="text-[11px] px-2.5 lg:px-3 py-1 rounded-full bg-emerald-500 text-white font-medium">
                  {expert.status}
                </p>
              </div>
            </div>
          </div>

          {/* Rating Section */}
          <div className="space-y-3">
            <p className="text-[14px] lg:text-[13px] font-semibold text-gray-700">
              Your Rating
            </p>
            <div className="flex gap-2 lg:gap-2 bg-gray-50 p-3 lg:p-3 rounded-xl justify-center lg:justify-start">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-4xl lg:text-3xl transition-colors ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="space-y-3">
            <p className="text-[14px] lg:text-[13px] font-semibold text-gray-700">
              Share your feedback
            </p>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50/30 focus:bg-white focus:border-[#9e5608] focus:outline-none rounded-xl p-4 text-[13px] min-h-[160px] lg:min-h-[140px] resize-none transition-all"
              placeholder="Character limit: 300-500 chars"
              maxLength={500}
            />
          </div>
        </div>

        {/* Buttons - Mobile has Cancel + Submit, Desktop has only Submit */}
        <div className="p-4 pb-20 lg:p-6 lg:pt-4 border-t border-gray-100 space-y-3 lg:space-y-0">
          {/* Cancel button - Mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-xl text-[14px] font-semibold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            className="bg-[#9e5608] w-full text-white px-6 py-3.5 lg:py-3.5 rounded-xl text-[14px] font-bold hover:bg-[#083d38] transition-colors shadow-lg shadow-emerald-900/10"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
