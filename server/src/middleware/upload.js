import multer from "multer";
// import fs from "fs";
// import path from "path";

// Allowed image types
const allowedMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
    "video/mp4",
  "video/quicktime", // mov
  "video/x-msvideo", // avi (optional)
];

// Storage
const storage = multer.memoryStorage();

// Validate image
const fileFilter = (req, file, cb) => {
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error("Only JPG, PNG and WEBP images are allowed."));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
  fileSize: 100 * 1024 * 1024, // 100MB
},
});

export default upload;