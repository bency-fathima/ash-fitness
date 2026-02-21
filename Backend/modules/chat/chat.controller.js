import * as service from "./chat.service.js";


export const getChatWithClient = async (req, res) => {
  try {
    const {page,limit,chatId} =req.params;
    const chat = await service.getchats(page,limit,chatId);
    res.status(200).json({ success: true, data: chat });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const uploadChatMedia = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      url: fileUrl,
      name: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
