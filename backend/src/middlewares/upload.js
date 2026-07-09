// middlewares/upload.js
// Configura la subida de imagenes utilizando Multer en memoria.

import path from "path";
import multer from "multer";

const storage = multer.memoryStorage();

function imageFilter(req, file, callback) {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "application/octet-stream",
  ];

  const allowedExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
  ];

  const extension = path
    .extname(file.originalname)
    .toLowerCase();

  const validMime = allowedMimeTypes.includes(file.mimetype);
  const validExtension = allowedExtensions.includes(extension);

  if (!validMime || !validExtension) {
    return callback(
      new Error("Only JPG, PNG and WEBP images are allowed.")
    );
  }

  callback(null, true);
}

export const uploadBarberImage = multer({
  storage,

  fileFilter: imageFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});