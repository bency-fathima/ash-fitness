import { selectUser } from "@/redux/features/auth/auth.selectores";
import { getChat } from "@/redux/features/chat/chat.selecters";
import { getChats, uploadChatMedia } from "@/redux/features/chat/chat.thunk";
import { socket } from "@/utils/socket";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChastList from "./ChastList";
import ChatWindow from "./ChatWindow";
import { getUsersAssignedToACoach } from "@/redux/features/coach/coach.thunk";
import { selectAssignedClients } from "@/redux/features/coach/coach.selector";
import { getAdminProfile } from "@/redux/features/admins/admin.thunk";

export default function Chats() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const chats = useSelector(getChat);
  const clients = useSelector(selectAssignedClients);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true,
  );

  const [client, setChatClient] = useState(null);
  const [adminContact, setAdminContact] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const getPrivateRoomId = (u1, u2) => `private:${[u1, u2].sort().join("_")}`;

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const clearUnreadForUser = useCallback((chatUserId) => {
    if (!chatUserId) return;

    setUnreadCounts((prev) => {
      if (!prev[chatUserId]) return prev;
      const next = { ...prev };
      delete next[chatUserId];
      return next;
    });
  }, []);

  const fetchAllExperts = useCallback(() => {
    if (!user?._id) return;
    dispatch(getUsersAssignedToACoach({ coachId: user?._id, page: 1, limit: 100 }));
  }, [dispatch, user?._id]);

  useEffect(() => {
    const adminId =
      typeof user?.adminId === "object" ? user?.adminId?._id : user?.adminId;
    if (!adminId) return;

    let isMounted = true;

    dispatch(getAdminProfile(adminId))
      .unwrap()
      .then((admin) => {
        if (!isMounted || !admin?._id) return;
        setAdminContact({
          ...admin,
          role: admin?.role || "Admin",
        });
      })
      .catch(() => {
        if (!isMounted) return;
        setAdminContact(null);
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch, user?.adminId]);

  const chatContacts = useMemo(() => {
    const contactsMap = new Map();

    if (adminContact?._id) {
      contactsMap.set(String(adminContact?._id), adminContact);
    }

    (clients || []).forEach((assignedClient) => {
      if (assignedClient?._id) {
        contactsMap.set(String(assignedClient?._id), assignedClient);
      }
    });

    return Array.from(contactsMap.values());
  }, [adminContact, clients]);

  useEffect(() => {
    fetchAllExperts();
    if (!user?._id) return;

    socket.auth = {
      userId: user?._id,
      token: localStorage.getItem("token"),
    };

    socket.connect();

    // Listen for online users updates
    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    // Request current online users
    socket.emit("get_online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("online_users");
      socket.disconnect();
    };
  }, [fetchAllExperts, user?._id]);


  const chatClient = (selectedClient) => {
    if (client) {
      const prevRoom = getPrivateRoomId(user?._id, client?._id);
      socket.emit("leave_room", { roomId: prevRoom });
    }

    const roomId = getPrivateRoomId(user?._id, selectedClient?._id);
    socket.emit("join_room", { roomId });
    setChatClient(selectedClient);
    setShowChatWindow(true);
    clearUnreadForUser(selectedClient?._id);
  };

  const handleBackToList = () => {
    setShowChatWindow(false);
  };

  useEffect(() => {
    if (!client) return;

    dispatch(
      getChats({
        page: 1,
        limit: 30,
        chatId: getPrivateRoomId(user?._id, client?._id),
      })
    );
  }, [client, user?._id, dispatch]);

  useEffect(() => {
    if (chats?.messages) {
      setMessages(chats.messages);
    }
  }, [chats]);

  useEffect(() => {
    const onNewMessage = (msg) => {
      if (!msg?.roomId) return;

      const selectedRoom = client
        ? getPrivateRoomId(user?._id, client?._id)
        : null;
      const roomMatchesSelected = Boolean(
        selectedRoom && msg.roomId === selectedRoom,
      );
      const isIncoming = msg.sender !== user?._id;
      const partnerId = isIncoming ? msg.sender : msg.reciever;
      const chatWindowVisible = isDesktop || showChatWindow;

      if (roomMatchesSelected) {
        setMessages((prev) => [...prev, msg]);

        if (isIncoming && !chatWindowVisible && partnerId) {
          setUnreadCounts((prev) => ({
            ...prev,
            [partnerId]: (prev[partnerId] || 0) + 1,
          }));
        }

        if (isIncoming && chatWindowVisible) {
          clearUnreadForUser(partnerId);
        }
        return;
      }

      if (isIncoming && partnerId) {
        setUnreadCounts((prev) => ({
          ...prev,
          [partnerId]: (prev[partnerId] || 0) + 1,
        }));
      }
    };

    socket.on("new_message", onNewMessage);
    return () => socket.off("new_message", onNewMessage);
  }, [client, clearUnreadForUser, isDesktop, showChatWindow, user?._id]);

  const sendSocketMessage = useCallback(
    ({
      text = "",
      messageType = "text",
      mediaUrl = "",
      mediaMeta = {},
    } = {}) => {
      if (!client) return;

      const roomId = getPrivateRoomId(user?._id, client?._id);
      const trimmedText = text.trim();
      const hasMedia = Boolean(mediaUrl);

      if (!trimmedText && !hasMedia) return;

      socket.emit(
        "send_message",
        {
          roomId,
          text: trimmedText,
          reciever: client?._id,
          messageType,
          mediaUrl,
          mediaMeta,
        },
        (ack) => {
          if (!ack?.ok) console.error(ack?.error || "Message failed");
        }
      );
    },
    [client, user?._id]
  );

  const messageHandlers = () => {
    if (!message.trim()) return;
    sendSocketMessage({ text: message, messageType: "text" });
    setMessage("");
  };

  const uploadAndSendMedia = useCallback(
    async (file, messageType, mediaMeta = {}) => {
      if (!file || !client) return;

      setIsUploadingMedia(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const uploadResponse = await dispatch(
          uploadChatMedia({ formData })
        ).unwrap();

        if (!uploadResponse?.url) {
          throw new Error("Upload response missing media URL");
        }

        sendSocketMessage({
          messageType,
          mediaUrl: uploadResponse.url,
          mediaMeta: {
            name: uploadResponse.name || file.name,
            mimeType: uploadResponse.mimeType || file.type,
            size: uploadResponse.size || file.size,
            ...mediaMeta,
          },
        });
      } catch (error) {
        console.error("Media upload failed:", error);
      } finally {
        setIsUploadingMedia(false);
      }
    },
    [client, dispatch, sendSocketMessage]
  );

  const handleImageUpload = async (file) => {
    if (!file?.type?.startsWith("image/")) return;
    await uploadAndSendMedia(file, "image");
  };

  const handleVoiceUpload = async (audioBlob, durationInSeconds = 0) => {
    if (!audioBlob) return;

    const extension =
      audioBlob.type?.split("/")[1]?.split(";")[0] || "webm";
    const file = new File([audioBlob], `voice-${Date.now()}.${extension}`, {
      type: audioBlob.type || "audio/webm",
    });

    await uploadAndSendMedia(file, "voice", {
      duration: durationInSeconds,
    });
  };

  useEffect(() => {
    setMessages([]);
  }, [client]);


  return (
    <div className="flex h-[calc(100vh-120px)] gap-5">
      <>
        <div
          className={`${
            showChatWindow ? "hidden lg:block" : "block"
          } w-full lg:w-80`}
        >
          {/* Middle - Chat List */}
          <ChastList
            clients={chatContacts}
            chatClient={chatClient}
            client={client}
            onlineUsers={onlineUsers}
            unreadCounts={unreadCounts}
          />
        </div>

        <div
          className={`${
            showChatWindow ? "block" : "hidden lg:block"
          } w-full lg:flex-1`}
        >
          {/* Right - Chat Window */}
          <ChatWindow
            client={client}
            messages={messages}
            message={message}
            setMessage={setMessage}
            messageHandlers={messageHandlers}
            user={user}
            onlineUsers={onlineUsers}
            onBack={handleBackToList}
            handleImageUpload={handleImageUpload}
            handleVoiceUpload={handleVoiceUpload}
            isUploadingMedia={isUploadingMedia}
          />
        </div>
      </>
    </div>
  );
}
