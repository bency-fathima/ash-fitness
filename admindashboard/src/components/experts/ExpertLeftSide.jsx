import React, { useEffect, useMemo, useState } from "react";
import {
  MoreHorizontal,
  Star,
  MessageSquare,
  User,
  Calendar,
  Mail,
  Phone,
  MapPin,
  X,
} from "lucide-react";
import { useMatch } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getChats } from "@/redux/features/chat/chat.thunk";

const getPrivateRoomId = (u1, u2) =>
  `private:${[String(u1), String(u2)].sort().join("_")}`;

const getMessageType = (msg) => {
  if (msg?.messageType) return msg.messageType;
  if (!msg?.mediaUrl) return "text";

  const mimeType = msg?.mediaMeta?.mimeType || "";
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "voice";
  if (/\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(msg.mediaUrl)) return "image";
  return "voice";
};

const ExpertLeftSide = ({ expert }) => {
  const dispatch = useDispatch();
  const [isChatMonitorOpen, setIsChatMonitorOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [monitorMessages, setMonitorMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [chatError, setChatError] = useState("");

  const assignedClients = useMemo(
    () =>
      Array.isArray(expert?.assignedUsers)
        ? expert.assignedUsers.filter((client) => client?._id)
        : [],
    [expert?.assignedUsers],
  );

  useEffect(() => {
    if (!isChatMonitorOpen) return;
    if (!selectedClient && assignedClients.length > 0) {
      setSelectedClient(assignedClients[0]);
    }
  }, [isChatMonitorOpen, selectedClient, assignedClients]);

  useEffect(() => {
    if (!isChatMonitorOpen || !expert?._id || !selectedClient?._id) {
      setMonitorMessages([]);
      return;
    }

    let isMounted = true;

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      setChatError("");

      try {
        const roomId = getPrivateRoomId(expert?._id, selectedClient?._id);
        const response = await dispatch(
          getChats({ page: 1, limit: 300, chatId: roomId }),
        ).unwrap();

        if (!isMounted) return;
        setMonitorMessages(Array.isArray(response?.messages) ? response.messages : []);
      } catch (error) {
        if (!isMounted) return;
        setMonitorMessages([]);
        setChatError(
          typeof error === "string" ? error : "Failed to load chat messages",
        );
      } finally {
        if (isMounted) {
          setIsLoadingMessages(false);
        }
      }
    };

    fetchMessages();

    return () => {
      isMounted = false;
    };
  }, [dispatch, isChatMonitorOpen, expert?._id, selectedClient?._id]);

  const closeMonitor = () => {
    setIsChatMonitorOpen(false);
    setSelectedClient(null);
    setMonitorMessages([]);
    setChatError("");
  };

  const profileDetails = [
    {
      label: "Joined Date",
      value: expert?.createdAt?.split("T")[0] || "14 Feb 2023",
    },
    {
      label: "Working Days",
      value:
        expert?.workingDays
          ?.map((day) => day.charAt(0).toUpperCase() + day.slice(1))
          .join(" - ") || "Mon - Fri",
    },
    {
      label: "Working Hours",
      value: `${expert?.workingHours?.[0]?.startTime || "9"} - ${
        expert?.workingHours?.[0]?.endTime || "6"
      }`,
    },
    { label: "Base Salary", value: `₹${expert?.salary || "34,200"}/m` },
  ];

  const personalInfo = [
    {
      icon: <User size={16} />,
      label: "Gender",
      value: expert?.gender || "Female",
    },
    {
      icon: <Calendar size={16} />,
      label: "Age",
      value: `${
        new Date().getFullYear() -
        new Date(expert?.dob || "1994-01-01").getFullYear()
      } y/o`,
    },
    {
      icon: <Mail size={16} />,
      label: "Email Address",
      value: expert?.email || "priya.m@gmail.com",
    },
    {
      icon: <Phone size={16} />,
      label: "Phone Number",
      value: expert?.phone || "+91 98472 11238",
    },
    {
      icon: <MapPin size={16} />,
      label: "Address",
      value: expert?.address || "221B Baker Street, London, United Kingdom",
    },
  ];

  const specialization = [
    { label: "Role", content: expert?.role || "Dietitian" },
    {
      label: "Specialization",
      content:
        expert?.specialization.join(", ") ||
        "PCOD Diet Plans, Therapeutic Diets, Weight-loss Programs, Thyroid",
    },
    {
      label: "Experience",
      content: expert?.experience ? `${expert.experience} Years` : "7 Years",
    },
    {
      label: "Certifications",
      content: expert?.qualification || "M.Sc. Clinical Nutrition",
    },
    {
      label: "Languages",
      content:
        expert?.languages
          ?.map((l) => l.charAt(0).toUpperCase() + l.slice(1))
          .join(", ") || "English, Hindi, Malayalam",
    },
  ];

  const isFounderPage = useMatch("/founder/experts/profile/:id");
  const isHeadPage = useMatch("/head/experts/profile/:id");

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6  pb-4 sm:pb-6">
      {/* Profile Card */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm relative flex flex-col items-center">
        <button className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <MoreHorizontal size={18} className="sm:w-5 sm:h-5" />
        </button>

        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-3 sm:mb-4 flex items-center justify-center text-[#9e5608] font-bold text-xl sm:text-2xl">
          {expert?.name?.[0]}
        </div>

        <h2 className="text-base sm:text-lg font-bold text-[#011412] mb-2 sm:mb-3 text-center">
          {expert?.name || "Priya Menon"}
        </h2>

        <div className="flex flex-wrap justify-center gap-2 mb-4 sm:mb-6">
          <span className="px-2.5 sm:px-3 py-1 bg-[#F8F9FA] rounded-full text-[9px] sm:text-[10px] font-bold text-[#66706D] uppercase tracking-wider">
            {expert?.role || "Dietitian"}
          </span>
          <span className="px-2.5 sm:px-3 py-1 bg-[#FAF3E0] rounded-full text-[9px] sm:text-[10px] font-bold text-[#DAA520] flex items-center gap-1">
            <Star size={10} fill="currentColor" /> {expert?.avgRating || "0"}
          </span>
          <span className="px-2.5 sm:px-3 py-1 bg-[#E7F9F4] rounded-full text-[9px] sm:text-[10px] font-bold text-[#00A389]">
            {expert?.status || "Active"}
          </span>
        </div>

        <div className="w-full space-y-2">
          {profileDetails.map((item, i) => (
            <div
              key={i}
              className="flex justify-between items-center bg-[#F8F8F8] p-3 rounded-xl"
            >
              <span className="text-[11px] sm:text-xs text-[#66706D] font-medium">
                {item.label}
              </span>
              <span className="text-[11px] sm:text-xs font-medium text-black wrap-break-word">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Monitoring */}
      {!isFounderPage && !isHeadPage && (
        <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm">
          <h3 className="text-sm font-bold text-[#9e5608] mb-1">
            Chat Monitoring
          </h3>
          <p className="text-[10px] text-[#66706D] mb-3 sm:mb-4">
            Monitor expert-client chats
          </p>
          <button
            onClick={() => setIsChatMonitorOpen(true)}
            className="w-full py-2.5 bg-[#9e5608] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#083a35] transition-colors"
          >
            <MessageSquare size={16} /> View Chat
          </button>
        </div>
      )}

      {isChatMonitorOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 p-4 sm:p-8 flex items-center justify-center">
          <div className="w-full max-w-5xl h-[85vh] bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="h-full min-h-0 grid grid-rows-[220px_minmax(0,1fr)] md:grid-rows-1 md:grid-cols-[260px_minmax(0,1fr)]">
              <div className="border-b md:border-b-0 md:border-r border-gray-100 min-h-0 overflow-y-auto">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#9e5608]">
                      Chat Monitoring
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      {expert?.name || "Expert"}
                    </p>
                  </div>
                  <button
                    onClick={closeMonitor}
                    className="p-1 rounded-md hover:bg-gray-100 text-gray-500"
                  >
                    <X size={16} />
                  </button>
                </div>

                {assignedClients.length === 0 ? (
                  <p className="p-4 text-xs text-gray-500">
                    No assigned clients found for this expert.
                  </p>
                ) : (
                  <div className="p-2 space-y-1">
                    {assignedClients.map((client) => {
                      const isActive = selectedClient?._id === client?._id;
                      return (
                        <button
                          key={client?._id}
                          onClick={() => setSelectedClient(client)}
                          className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                            isActive
                              ? "bg-[#EBF3F2] text-[#9e5608]"
                              : "hover:bg-gray-50 text-gray-700"
                          }`}
                        >
                          <p className="text-xs font-semibold truncate">{client.name}</p>
                          <p className="text-[11px] text-gray-500 truncate">
                            {client.email || client.role || "Client"}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="min-h-0 flex flex-col bg-[#F8FAFB]">
                <div className="px-4 py-3 border-b border-gray-100 bg-white">
                  <h4 className="text-sm font-bold text-[#9e5608]">
                    {selectedClient?.name || "Select a client"}
                  </h4>
                  <p className="text-[11px] text-gray-500">
                    Expert-client conversation history
                  </p>
                </div>

                <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
                  {isLoadingMessages ? (
                    <p className="text-sm text-gray-500">Loading messages...</p>
                  ) : chatError ? (
                    <p className="text-sm text-red-500">{chatError}</p>
                  ) : !selectedClient ? (
                    <p className="text-sm text-gray-500">
                      Choose a client to view chat history.
                    </p>
                  ) : monitorMessages.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No messages found between this expert and client.
                    </p>
                  ) : (
                    monitorMessages.map((msg, idx) => {
                      const isExpertMessage =
                        String(msg?.sender) === String(expert?._id);
                      const messageType = getMessageType(msg);

                      return (
                        <div
                          key={`${msg?.time || idx}-${idx}`}
                          className={`flex ${isExpertMessage ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl px-3 py-2 shadow-sm ${
                              isExpertMessage
                                ? "bg-[#E7F9F4] text-[#073B35]"
                                : "bg-white text-[#1F2937]"
                            }`}
                          >
                            {messageType === "image" && msg?.mediaUrl && (
                              <img
                                src={msg.mediaUrl}
                                alt={msg?.mediaMeta?.name || "Image"}
                                className="rounded-lg max-h-56 w-auto mb-2"
                              />
                            )}

                            {messageType === "voice" && msg?.mediaUrl && (
                              <audio controls src={msg.mediaUrl} className="mb-2 max-w-full" />
                            )}

                            {msg?.message && (
                              <p className="text-xs whitespace-pre-wrap break-words">
                                {msg.message}
                              </p>
                            )}

                            <p className="mt-1 text-[10px] text-gray-500">
                              {msg?.time
                                ? new Date(msg.time).toLocaleString()
                                : "Unknown time"}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Personal Info */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h3 className="text-sm font-bold text-[#9e5608]">Personal Info</h3>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <MoreHorizontal size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {personalInfo.map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EBF3F2] flex items-center justify-center text-[#9e5608] shrink-0">
                {item.icon}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[10px] text-[#66706D] font-medium">
                  {item.label}
                </span>
                <span className="text-[11px] font-bold text-[#011412] leading-tight mt-0.5 wrap-break-word">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Role & Specialization */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
        <h3 className="text-sm font-bold text-[#9e5608] mb-4 sm:mb-6">
          Role & Specialization
        </h3>
        <div className="space-y-4 sm:space-y-5">
          {specialization.map((item, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 p-3.5 bg-[#F8F8F8] rounded-2xl"
            >
              <span className="w-fit px-2 py-0.5 bg-[#F0F0F0] text-[10px] font-bold text-[#66706D] rounded">
                {item.label}
              </span>
              <p className="text-[11px] font-bold text-[#9e5608] leading-relaxed wrap-break-word">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExpertLeftSide;
