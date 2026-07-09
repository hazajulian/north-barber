// middlewares/upload.js
// Configura la subida de imagenes utilizando Multer.

import fs from "fs";
import path from "path";

import multer from "multer";

import { generateFilename } from "../utils/file.js";

const uploadDirectory = path.resolve("uploads/barbers");

// Crea la carpeta automaticamente si no existe.
fs.mkdirSync(uploadDirectory, {
  recursive: true,
});

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, uploadDirectory);
  },

  filename(req, file, callback) {
    callback(null, generateFilename(file.originalname));
  },
});

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

  const extension = path.extname(file.originalname).toLowerCase();

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