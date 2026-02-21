import { ChatModel } from "../modules/chat/chat.model.js";
let ioInstance;


// auth middleware for sockeyt.io
const socketAuth = (socket, next) => {
  const { userId, token } = socket.handshake.auth;

  if (!userId || !token) {
    return next(new Error("Unauthorized"));
  }

  // OPTIONAL: JWT verify here

  socket.userId = userId;
  next();
};

// room join handlers

const joinHandler = (io, socket) => {
  socket.on("join_room", ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on("broadcast", ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on("join_task_rooms", ({ role }) => {
    const lowerRole = (role || "").toLowerCase();
    const adminRoles = ["admin", "expert", "head", "founder"];
    if (adminRoles.includes(lowerRole)) {
      socket.join("admin_tasks");
      console.log(`Socket ${socket.id} joined admin_tasks room`);
    }
  });
};


// message Handlers
const messageHandler = (io, socket) => {
  socket.on("send_message", async (payload = {}, ack) => {
    const {
      roomId,
      text = "",
      reciever,
      receiver,
      messageType = "text",
      mediaUrl = "",
      mediaMeta = {},
    } = payload;

    const receiverId = reciever || receiver;
    const trimmedText = typeof text === "string" ? text.trim() : "";
    const hasMedia = Boolean(mediaUrl);

    if (!roomId || !receiverId || (!trimmedText && !hasMedia)) {
      ack?.({ ok: false, error: "Invalid message payload" });
      return;
    }

    const msg = {
      roomId,
      sender: socket.userId,
      reciever: receiverId,
      message: trimmedText,
      messageType: hasMedia ? messageType : "text",
      mediaUrl: hasMedia ? mediaUrl : "",
      mediaMeta: mediaMeta || {},
      time: new Date(),
    };

    try {
      await ChatModel.updateOne(
        { roomId },
        {
          $setOnInsert: {
            roomId,
            participants: [socket.userId, receiverId],
          },
          $push: { messages: msg },
        },
        { upsert: true }
      );

      // Every user socket joins a personal room on connect, so emit there.
      io.to(socket.userId).to(receiverId).emit("new_message", msg);

      ack?.({ ok: true });
    } catch (error) {
      console.error("send_message error:", error);
      ack?.({ ok: false, error: "Message failed" });
    }
  });
};



export default function initSocket(io) {
  ioInstance = io;
  const onlineUsers = new Map(); // userId -> socketId

  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log("User Connected:", socket.userId);
    socket.join(socket.userId); // Join a room specifically for this user

    // Add user to online users
    onlineUsers.set(socket.userId, socket.id);

    // Broadcast updated online users list to all clients
    io.emit("online_users", Array.from(onlineUsers.keys()));

    joinHandler(io, socket);
    messageHandler(io, socket);

    socket.on("leave_room", ({ roomId }) => {
      socket.leave(roomId);
    });

    // Get current online users
    socket.on("get_online_users", (callback) => {
      callback?.(Array.from(onlineUsers.keys()));
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.userId);

      // Remove user from online users
      onlineUsers.delete(socket.userId);

      // Broadcast updated online users list to all clients
      io.emit("online_users", Array.from(onlineUsers.keys()));
    });
  });
}

export const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.io not initialized");
  }
  return ioInstance;
};
