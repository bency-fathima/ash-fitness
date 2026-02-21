import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import router1 from "./routes/index.js";
import cors from "cors";
import { connectRedis } from "./redis/redisClient.js"
import morgan from "morgan";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import initSocket from "./utils/socket.js";
import { startImageCleanupTask } from "./utils/cronJobs.js";
import "./utils/payroll.cron.js";





const app = express();
dotenv.config();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5000",
];

if (process.env.FRONTEND_URL_PROD) {
  const prodUrl = process.env.FRONTEND_URL_PROD.replace(/\/$/, "");
  allowedOrigins.push(prodUrl);
  // Add www variant if not already present
  if (prodUrl.includes("https://") && !prodUrl.includes("www.")) {
    allowedOrigins.push(prodUrl.replace("https://", "https://www."));
  }
}
if (process.env.BACKEND_URL_PROD) {
  allowedOrigins.push(process.env.BACKEND_URL_PROD);
}

// CORS MUST COME VERY EARLY
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "x-access-token",
      "Accept",
      "X-Requested-With",
      "Range"
    ],
    credentials: true,
    exposedHeaders: ["x-access-token", "Content-Range"],
    preflightContinue: false,
    optionsSuccessStatus: 204
  })
);

// BODY PARSER MUST COME AFTER CORS
app.use(express.json());
app.use(cookieParser())

app.use("/uploads", express.static("uploads"));
app.use(morgan("dev"));

app.use("/api/v1", router1);

const server = http.createServer(app)


const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket"]
})

initSocket(io);

await connectRedis()
mongoose
  .connect(process.env.MONGOURI)
  .then(() => {
    console.log("connected");
    // Start the cleanup scheduler after DB connection
    startImageCleanupTask();
  })
  .catch(() => console.log("not connected"));

server.listen(process.env.PORT, () =>
  console.log(`server is running at port ${process.env.PORT}`)
);
