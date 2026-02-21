import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});


export const uploader = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 500,
  },
});
