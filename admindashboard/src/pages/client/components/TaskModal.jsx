import React, { useState } from "react";
import { X } from "lucide-react";
import { assets } from "@/assets/asset";
import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "@/redux/store/hooks";
import { uploadTask } from "@/redux/features/tasks/task.thunk";
import { toast } from "react-toastify";

export default function TaskModal({ task, onClose, onSuccess }) {
  const [fileName, setFileName] = useState("Upload File");
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");
  const [showVideoModal, setShowVideoModal] = useState(false);
  const dispatch = useDispatch();
  const { tasks } = useAppSelector((state) => state.tasks);

  // Find live submission data for the current modal task
  const currentSubmission = tasks?.find(
    (t) =>
      t.globalDayIndex === task.globalDayIndex &&
      t.exerciseIndex === task.exerciseIndex &&
      t.taskType === task.type,
  );

  const effectiveTask = {
    ...task,
    status: currentSubmission?.status || task.status || "todo",
    submission: currentSubmission || task.submission,
  };

  const [uploading, setUploading] = useState(false);
  const [videoWatched, setVideoWatched] = useState(false);

  const isMeal = effectiveTask.type === "Meal";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.info(
        isMeal
          ? "Please upload a photo of your meal."
          : "Please upload a photo or video proof.",
      );
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("notes", comment);

      if (task.programId && task.programId !== "") {
        formData.append("programId", task.programId);
      }
      formData.append("weekIndex", task.weekIndex || 1);
      formData.append("dayIndex", task.dayIndex || 1);
      formData.append("globalDayIndex", task.globalDayIndex || 1);
      formData.append(
        "exerciseIndex",
        task.exerciseIndex !== undefined ? task.exerciseIndex : 0,
      );
      formData.append("taskType", task.type || "Workout");

      const result = await dispatch(uploadTask(formData));

      if (uploadTask.fulfilled.match(result)) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(
          result.payload ||
            "Submission failed. Please check your connection and try again.",
        );
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(
        "An unexpected error occurred: " + (err.message || "Unknown error"),
      );
    } finally {
      setUploading(false);
    }
  };

  const isPending = effectiveTask.status === "pending";
  const isVerified = effectiveTask.status === "verified";
  const isRejected = effectiveTask.status === "rejected";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/5 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-[400px] h-full bg-white shadow-2xl flex flex-col p-6 pb-24 lg:pb-6 animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-[#9e5608] text-[18px] font-bold">
              {effectiveTask.name}
            </h1>
            {isVerified && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                VERIFIED
              </span>
            )}
            {isPending && (
              <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">
                PENDING
              </span>
            )}
            {isRejected && (
              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                REJECTED
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2 -mr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-sm">
            <img
              src={
                isMeal
                  ? effectiveTask.name?.toLowerCase().includes("breakfast")
                    ? assets.breakfast
                    : assets.MealPlaceholder
                  : assets.Workout
              }
              alt={effectiveTask.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-2">
            <p className="text-[13px] text-gray-800 leading-relaxed font-medium">
              {effectiveTask.notes}
            </p>
            {isRejected && effectiveTask.submission?.adminComment && (
              <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                <p className="text-xs text-red-800 font-bold mb-1">
                  Expert Feedback:
                </p>
                <p className="text-xs text-red-700">
                  {effectiveTask.submission.adminComment}
                </p>
              </div>
            )}
            {(isPending || isVerified || isRejected) &&
              effectiveTask.submission?.file && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-2">
                    Your Submission:
                  </p>
                  <div className="rounded-xl overflow-hidden border border-gray-100">
                    {effectiveTask.submission.file.match(
                      /\.(mp4|webm|ogg)$/i,
                    ) ? (
                      <video
                        src={`${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${effectiveTask.submission.file}`}
                        controls
                        className="w-full h-auto"
                      />
                    ) : (
                      <img
                        src={`${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${effectiveTask.submission.file}`}
                        alt="Your Proof"
                        className="w-full h-auto"
                      />
                    )}
                  </div>
                  {effectiveTask.submission.notes && (
                    <p className="text-[12px] text-gray-600 mt-2 italic px-1">
                      "{effectiveTask.submission.notes}"
                    </p>
                  )}
                </div>
              )}
          </div>

          {/* PDF Card / Guide Card */}
          <div className="flex items-center justify-between bg-[#FDF8F3] p-4 rounded-[20px] border border-[#FBEAD9]/50">
            <div className="flex items-center gap-4">
              {/* <div className="w-11 h-11 bg-[#FBEAD9] flex items-center justify-center rounded-xl shadow-sm">
                <img src={assets.pdfVector} alt="pdf" className="w-5 h-5" />
              </div> */}
              <div>
                <p className="text-[14px] font-bold text-gray-800 leading-none mb-1.5">
                  {isMeal
                    ? "Healthy Diet Plan Guide"
                    : effectiveTask.mediaName || "Exercise Guide"}
                </p>
                {/* <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">
                  PDF • 2.4 MB
                </p> */}
              </div>
            </div>
            <button
              onClick={() => setShowVideoModal(true)}
              className="bg-[#9e5608] text-white text-[12px] font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-[#083d38] transition-colors"
            >
              View
            </button>
          </div>

          {(isMeal || videoWatched) && !isVerified && !isPending && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-700 block">
                  {isMeal ? "Meal Comment" : "Exercise Comment"}
                </label>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={
                    isMeal
                      ? "Add any details about your meal..."
                      : "Add Comment"
                  }
                  className="w-full border border-gray-100 bg-gray-50/30 focus:bg-white focus:border-[#9e5608] focus:outline-none p-3 px-4 text-[13px] rounded-xl transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-700 block">
                  {isMeal ? "Meal Attachment" : "Exercise Attachment"}
                </label>
                <label className="w-full flex items-center justify-between border border-gray-100 bg-gray-50/30 rounded-xl p-1.5 cursor-pointer hover:bg-white hover:border-gray-200 transition-all">
                  <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-[13px] font-bold truncate max-w-[150px]">
                    {fileName}
                  </span>
                  <span className="text-[13px] text-gray-400 font-medium pr-4">
                    {isMeal ? "Upload Meal Photo" : "Upload Photo or video"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept={isMeal ? "image/*" : "video/*,image/*"}
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between gap-3 pt-6 mt-6 border-t border-gray-50 bg-white">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-600 px-6 py-3.5 rounded-xl text-[14px] font-bold hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          {(isMeal || videoWatched) && !isVerified && !isPending && (
            <button
              onClick={handleUpload}
              disabled={uploading || !file}
              className="flex-1 bg-[#9e5608] text-white px-6 py-3.5 rounded-xl text-[14px] font-bold hover:bg-[#083d38] transition-colors shadow-lg shadow-emerald-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Submitting..." : "Mark as Done"}
            </button>
          )}
        </div>
      </div>

      {/* Video/Image Modal */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowVideoModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 shrink-0">
              <h2 className="text-[#9e5608] text-lg font-bold">
                {isMeal ? "Dietary Recommendation" : "Exercise Video"}
              </h2>
              <button
                onClick={() => setShowVideoModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-4 overflow-y-auto">
              {isMeal ? (
                <div className="w-full rounded-xl overflow-hidden shadow-inner bg-gray-50 text-center">
                  <img
                    src={assets.MealPlaceholder}
                    alt="Healthy Meal"
                    className="w-full h-auto max-h-[60vh] object-contain mx-auto"
                    onLoad={() => setVideoWatched(true)}
                  />
                </div>
              ) : (
                <div className="w-full flex justify-center bg-black rounded-xl overflow-hidden">
                  <video
                    controls
                    autoPlay
                    className="max-w-full max-h-[60vh] object-contain"
                    src={effectiveTask.url}
                    onEnded={() => setVideoWatched(true)}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {videoWatched && (
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="w-full bg-[#9e5608] text-white py-3.5 rounded-xl font-bold hover:bg-[#083d38] transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500 shrink-0"
                >
                  {isMeal ? "Continue to Log Meal" : "Mark as Done & Continue"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
