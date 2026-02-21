import { Mic, Paperclip, Square, ChevronLeft } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import chatShimmer from "../../../assets/ChatShimmer.json";
import Lottie from "lottie-react";

const formatDuration = (totalSeconds = 0) => {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  return `${mins}:${secs}`;
};

const getMessageType = (msg) => {
  if (msg?.messageType) return msg.messageType;
  if (!msg?.mediaUrl) return "text";

  const mimeType = msg?.mediaMeta?.mimeType || "";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "voice";
  if (/\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(msg.mediaUrl)) return "image";
  return "voice";
};

const ChatWindow = ({
  client,
  messages,
  message,
  setMessage,
  messageHandlers,
  user,
  onlineUsers = [],
  handleImageUpload,
  handleVoiceUpload,
  isUploadingMedia = false,
  onBack,
}) => {
  const isClientOnline = client && onlineUsers.includes(client?._id);
  const fileInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const recordingStartedAtRef = useRef(0);
  const recordingTimerRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const stopTimer = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
  };

  const stopStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      stopTimer();
      stopStream();
    };
  }, []);

  const startRecording = async () => {
    if (
      typeof MediaRecorder === "undefined" ||
      !navigator?.mediaDevices?.getUserMedia
    ) {
      console.error("Voice recording is not supported in this browser");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];

      const supportsPreferredMime =
        MediaRecorder.isTypeSupported &&
        MediaRecorder.isTypeSupported("audio/webm;codecs=opus");
      const recorder = supportsPreferredMime
        ? new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;
      recordingStartedAtRef.current = Date.now();
      setRecordingSeconds(0);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setIsRecording(false);
        setRecordingSeconds(0);
        stopTimer();
        stopStream();
        console.error("Unable to record voice message");
      };

      recorder.onstop = async () => {
        setIsRecording(false);
        stopTimer();
        stopStream();

        const elapsedSeconds = Math.max(
          1,
          Math.round((Date.now() - recordingStartedAtRef.current) / 1000)
        );
        setRecordingSeconds(0);

        const audioBlob = new Blob(audioChunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        audioChunksRef.current = [];
        mediaRecorderRef.current = null;

        if (audioBlob.size > 0 && handleVoiceUpload) {
          await handleVoiceUpload(audioBlob, elapsedSeconds);
        }
      };

      recorder.start();
      setIsRecording(true);
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      setIsRecording(false);
      setRecordingSeconds(0);
      stopTimer();
      stopStream();
      console.error("Microphone permission denied:", error);
    }
  };

  const toggleRecording = async () => {
    if (isUploadingMedia) return;

    if (isRecording) {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      return;
    }

    await startRecording();
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || !handleImageUpload) return;
    await handleImageUpload(file);
  };

  const renderMessageBody = (msg) => {
    const type = getMessageType(msg);

    if (type === "image" && msg.mediaUrl) {
      return (
        <div className="space-y-2">
          <img
            src={msg.mediaUrl}
            alt={msg?.mediaMeta?.name || "Shared image"}
            className="max-h-64 w-full rounded-xl object-cover"
          />
          {msg.message && <p>{msg.message}</p>}
        </div>
      );
    }

    if (type === "voice" && msg.mediaUrl) {
      const duration = Number(msg?.mediaMeta?.duration || 0);

      return (
        <div className="space-y-1">
          <audio controls src={msg.mediaUrl} className="max-w-full w-64" />
          {duration > 0 && (
            <p className="text-[11px] text-gray-600">
              Duration: {formatDuration(duration)}
            </p>
          )}
        </div>
      );
    }

    return msg.message;
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {client ? (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Chat Header */}
          <div className="bg-white rounded-t-lg px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="lg:hidden p-1.5 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Back to chat list"
              >
                <ChevronLeft size={24} />
              </button>
              <div className="w-12 h-12 rounded-full bg-[#E8B5AD] flex items-center justify-center text-white font-semibold">
                {client?.name?.split(" ")?.[0]?.[0]}
              </div>
              <div>
                <h1 className="text-[#9e5608] font-semibold">{client.name}</h1>
                <p className="text-sm">{client?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-gray-600">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isClientOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
                <span>{isClientOnline ? "Online" : "Offline"}</span>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 border-20 border-white rounded-b-lg">
            {messages.map((msg, index) => {
              const isMe = msg.sender === user?._id;

              return (
                <div
                  key={`${msg.time || index}-${index}`}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  {!isMe && (
                    <div className="w-10 h-10 rounded-full bg-[#D4A5A0] flex items-center justify-center text-white text-sm font-semibold shrink-0">
                      {client?.name?.split(" ")?.[0]?.[0]}
                      {client?.name?.split(" ")?.[1]?.[0]}
                    </div>
                  )}

                  <div className={`max-w-md ${!isMe ? "ml-3" : ""}`}>
                    <div
                      className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${
                        isMe
                          ? "bg-[#E8F5E9] text-gray-800"
                          : "bg-white text-gray-800"
                      }`}
                    >
                      {renderMessageBody(msg)}
                    </div>

                    <div
                      className={`mt-1 text-[11px] text-gray-500 ${
                        isMe ? "text-right" : "text-left"
                      }`}
                    >
                      {new Date(msg.time).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input */}
          <div className="bg-white rounded-b-lg px-6 py-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
            />

            {(isRecording || isUploadingMedia) && (
              <p className="text-xs text-gray-500 mb-2">
                {isRecording
                  ? `Recording voice... ${formatDuration(recordingSeconds)}`
                  : "Uploading media..."}
              </p>
            )}

            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 transition"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingMedia || isRecording}
              >
                <Paperclip size={20} />
              </button>
              <input
                type="text"
                placeholder="Type something..."
                value={message}
                className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    message.trim() &&
                    !isUploadingMedia &&
                    !isRecording
                  ) {
                    messageHandlers();
                  }
                }}
              />
              <button
                type="button"
                className={`transition ${
                  isRecording
                    ? "text-red-600 hover:text-red-700"
                    : "text-gray-400 hover:text-gray-600"
                }`}
                onClick={toggleRecording}
                disabled={isUploadingMedia}
              >
                {isRecording ? <Square size={20} /> : <Mic size={20} />}
              </button>
              <button
                type="submit"
                disabled={!message.trim() || isUploadingMedia || isRecording}
                className={`bg-[#2D7A6D] text-white px-5 py-2 rounded-lg font-medium transition ${
                  message.trim() && !isUploadingMedia && !isRecording
                    ? "hover:bg-[#1f5a4f]"
                    : "opacity-50 cursor-not-allowed"
                }`}
                onClick={() => messageHandlers()}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="flex items-center justify-center w-full h-full">
          <Lottie
            animationData={chatShimmer}
            loop
            style={{ width: 600, height: 600 }}
            autoPlay
          />
        </p>
      )}
    </div>
  );
};

export default ChatWindow;
