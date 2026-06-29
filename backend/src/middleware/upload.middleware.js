import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  const isValid = allowedTypes.test(ext) && allowedTypes.test(mime);

  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error("Only images *.jpeg, *.jpg and *.png are allowed"));
  }
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
