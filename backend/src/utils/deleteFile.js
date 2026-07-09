// utils/deleteFile.js
// Elimina imagenes locales antiguas o imagenes de Cloudinary.

import fs from "fs/promises";
import path from "path";

import cloudinary from "../config/cloudinary.js";

export async function deleteFile(filePath, publicId = null) {
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
      return;
    } catch (error) {
      console.error("Failed to delete Cloudinary image:");
      console.error(error);
      return;
    }
  }

  if (!filePath || /^https?:\/\//i.test(filePath)) {
    return;
  }

  try {
    const relativePath = filePath.replace(/^[/\\]+/, "");

    const absolutePath = path.join(
      process.cwd(),
      relativePath
    );

    await fs.unlink(absolutePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      return;
    }

    console.error("Failed to delete local file:");
    console.error(error);
  }
}