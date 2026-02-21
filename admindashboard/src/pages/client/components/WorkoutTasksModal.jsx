import React, { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { useDispatch } from "react-redux";
import { uploadMultipleWorkoutTasks } from "@/redux/features/tasks/task.thunk";
import { useAppSelector } from "@/redux/store/hooks";
import { toast } from "react-toastify";
import { assets } from "@/assets/asset";

export default function WorkoutTasksModal({
  workoutTasks,
  onClose,
  onSuccess,
}) {
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [fileName, setFileName] = useState("Upload File");
  const [file, setFile] = useState(null);
  const [comment, setComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [watchedVideos, setWatchedVideos] = useState(new Set());
  const [currentVideoEnded, setCurrentVideoEnded] = useState(false);
  const dispatch = useDispatch();
  const { tasks } = useAppSelector((state) => state.tasks);

  // Get overall status
  const getOverallStatus = () => {
    const submissions = workoutTasks.map((task) => {
      return tasks?.find(
        (t) =>
          t.globalDayIndex === task.globalDayIndex &&
          t.exerciseIndex === task.exerciseIndex &&
          t.taskType === task.type,
      );
    });

    const allVerified = submissions.every((s) => s?.status === "verified");
    const anyPending = submissions.some((s) => s?.status === "pending");
    const anyRejected = submissions.some((s) => s?.status === "rejected");

    if (allVerified) return "verified";
    if (anyPending) return "pending";
    if (anyRejected) return "rejected";
    return "todo";
  };

  const overallStatus = getOverallStatus();
  const isPending = overallStatus === "pending";
  const isVerified = overallStatus === "verified";
  const isRejected = overallStatus === "rejected";

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleVideoView = (videoUrl, exerciseName, exerciseIndex) => {
    setSelectedVideo({
      url: videoUrl,
      name: exerciseName,
      index: exerciseIndex,
    });
    setCurrentVideoEnded(false);
    setShowVideoModal(true);
  };

  const handleVideoEnd = () => {
    setCurrentVideoEnded(true);
    if (selectedVideo) {
      setWatchedVideos((prev) => new Set([...prev, selectedVideo.index]));
    }
  };

  const handleCloseVideoModal = () => {
    setShowVideoModal(false);
    setSelectedVideo(null);
    setCurrentVideoEnded(false);
  };

  // Check if all videos have been watched
  const allVideosWatched = workoutTasks.every(
    (task, index) => !task.url || watchedVideos.has(index),
  );

  // Check if user has watched at least one video (first video)
  const hasWatchedAnyVideo = watchedVideos.size > 0;

  const handleSubmit = async () => {
    if (!file) {
      toast.info("Please upload a photo or video proof.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("notes", comment);

      const exerciseIndices = workoutTasks.map((task) => task.exerciseIndex);
      formData.append("exerciseIndices", JSON.stringify(exerciseIndices));

      formData.append("programId", workoutTasks[0].programId || "");
      formData.append("weekIndex", workoutTasks[0].weekIndex || 1);
      formData.append("dayIndex", workoutTasks[0].dayIndex || 1);
      formData.append("globalDayIndex", workoutTasks[0].globalDayIndex || 1);

      const result = await dispatch(uploadMultipleWorkoutTasks(formData));

      if (uploadMultipleWorkoutTasks.fulfilled.match(result)) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(result.payload || "Submission failed. Please try again.");
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

  const toggleAccordion = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

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
            <h1 className="text-[#9e5608] text-[18px] font-bold">Workout</h1>
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
          {/* Hero Image */}
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-sm">
            <img
              src={assets.Workout}
              alt="Workout"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Exercise Accordion List */}
          <div className="space-y-3">
            <p className="text-[12px] font-bold text-gray-700 uppercase tracking-wide">
              Today's Exercises
            </p>
            {workoutTasks.map((exercise, index) => {
              const submission = tasks?.find(
                (t) =>
                  t.globalDayIndex === exercise.globalDayIndex &&
                  t.exerciseIndex === exercise.exerciseIndex &&
                  t.taskType === exercise.type,
              );

              const exerciseStatus = submission?.status || "todo";
              const isExpanded = expandedIndex === index;

              return (
                <div
                  key={index}
                  className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm"
                >
                  {/* Accordion Header */}
                  <button
                    onClick={() => toggleAccordion(index)}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[14px] font-bold text-gray-800">
                        {exercise.name}
                      </span>
                      {exerciseStatus === "verified" && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                          ✓
                        </span>
                      )}
                      {exerciseStatus === "pending" && (
                        <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">
                          ⏱
                        </span>
                      )}
                      {exerciseStatus === "rejected" && (
                        <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">
                          ✗
                        </span>
                      )}
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <p className="text-[13px] text-gray-800 leading-relaxed font-medium">
                        {exercise.notes}
                      </p>

                      {/* Rejection Comment */}
                      {exerciseStatus === "rejected" &&
                        submission?.adminComment && (
                          <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                            <p className="text-xs text-red-800 font-bold mb-1">
                              Expert Feedback:
                            </p>
                            <p className="text-xs text-red-700">
                              {submission.adminComment}
                            </p>
                          </div>
                        )}

                      {/* Submitted File */}
                      {(exerciseStatus === "pending" ||
                        exerciseStatus === "verified" ||
                        exerciseStatus === "rejected") &&
                        submission?.file && (
                          <div className="mt-4">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-2">
                              Your Submission:
                            </p>
                            <div className="rounded-xl overflow-hidden border border-gray-100">
                              {submission.file.match(/\.(mp4|webm|ogg)$/i) ? (
                                <video
                                  src={`${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${submission.file}`}
                                  controls
                                  className="w-full h-auto"
                                />
                              ) : (
                                <img
                                  src={`${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}${submission.file}`}
                                  alt="Your Proof"
                                  className="w-full h-auto"
                                />
                              )}
                            </div>
                            {submission.notes && (
                              <p className="text-[12px] text-gray-600 mt-2 italic px-1">
                                "{submission.notes}"
                              </p>
                            )}
                          </div>
                        )}

                      {/* View Video Button */}
                      {exercise.url && (
                        <div className="flex items-center justify-between bg-[#FDF8F3] p-3 rounded-[20px] border border-[#FBEAD9]/50">
                          <div className="flex items-center gap-3">
                            <div>
                              <p className="text-[13px] font-bold text-gray-800 leading-none">
                                {exercise.mediaName || "Exercise Guide"}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() =>
                              handleVideoView(
                                exercise.url,
                                exercise.name,
                                index,
                              )
                            }
                            className="bg-[#9e5608] text-white text-[12px] font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-[#083d38] transition-colors"
                          >
                            View
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Upload Section - Only show if at least one video watched and not verified/pending */}
          {hasWatchedAnyVideo && !isVerified && !isPending && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-700 block">
                  Exercise Comment
                </label>
                <input
                  type="text"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add Comment"
                  className="w-full border border-gray-100 bg-gray-50/30 focus:bg-white focus:border-[#9e5608] focus:outline-none p-3 px-4 text-[13px] rounded-xl transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[12px] font-bold text-gray-700 block">
                  Exercise Attachment
                </label>
                <label className="w-full flex items-center justify-between border border-gray-100 bg-gray-50/30 rounded-xl p-1.5 cursor-pointer hover:bg-white hover:border-gray-200 transition-all">
                  <span className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-[13px] font-bold truncate max-w-[150px]">
                    {fileName}
                  </span>
                  <span className="text-[13px] text-gray-400 font-medium pr-4">
                    Upload Photo or video
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="video/*,image/*"
                  />
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between gap-3 pt-6 mt-6 border-t border-gray-50 bg-white">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-600 px-6 py-3.5 rounded-xl text-[14px] font-bold hover:bg-gray-200 transition-colors"
          >
            {isVerified || isPending ? "Close" : "Cancel"}
          </button>
          {hasWatchedAnyVideo && !isVerified && !isPending && (
            <button
              onClick={handleSubmit}
              disabled={uploading || !file || !allVideosWatched}
              className="flex-1 bg-[#9e5608] text-white px-6 py-3.5 rounded-xl text-[14px] font-bold hover:bg-[#083d38] transition-colors shadow-lg shadow-emerald-900/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Submitting..." : "Mark as Done"}
            </button>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCloseVideoModal}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100 shrink-0">
              <h2 className="text-[#9e5608] text-lg font-bold">
                {selectedVideo.name}
              </h2>
              <button
                onClick={handleCloseVideoModal}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="p-4 flex flex-col gap-4 overflow-y-auto">
              <div className="w-full flex items-center justify-center bg-black rounded-xl overflow-hidden">
                <video
                  controls
                  autoPlay
                  className="w-full h-auto max-h-[60vh] object-contain"
                  src={selectedVideo.url}
                  onEnded={handleVideoEnd}
                >
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Show button only after first video ends, or immediately for subsequent videos */}
              {(currentVideoEnded || hasWatchedAnyVideo) && (
                <button
                  onClick={handleCloseVideoModal}
                  className="w-full bg-[#9e5608] text-white py-3.5 rounded-xl font-bold hover:bg-[#083d38] transition-colors animate-in fade-in slide-in-from-bottom-4 duration-500 shrink-0"
                >
                  Mark as Done & Continue
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
