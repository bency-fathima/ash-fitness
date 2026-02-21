import express from "express";
import * as chatController from "./chat.controller.js";
import { uploader } from "../../middleware/upload.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";




const router  = express.Router()


router.get("/get-chat/:page/:limit/:chatId",chatController.getChatWithClient)
router.post(
  "/upload-media",
  authMiddleware,
  uploader.single("file"),
  chatController.uploadChatMedia
);


export default router;
