import multer from "multer";

const fileFilter = (req, file, cb) => {
  const allowedMime = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ];

  cb(null, allowedMime.includes(file.mimetype));
};

const storage = process.env.CLOUDINARY_CLOUD_NAME
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: "uploads",
      filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
      },
    });

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
