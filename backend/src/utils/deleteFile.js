// utils/deleteFile.js
// Elimina archivos del disco si existen.

import fs from "fs/promises";
import path from "path";

export async function deleteFile(filePath) {
  if (!filePath) {
    return;
  }

  try {
    // Convierte:
    // /uploads/barbers/imagen.png
    // en:
    // uploads/barbers/imagen.png
    const relativePath = filePath.replace(/^[/\\]+/, "");

    const absolutePath = path.join(
      process.cwd(),
      relativePath
    );

    await fs.unlink(absolutePath);
  } catch (error) {
    // Si el archivo ya no existe simplemente lo ignoramos.
    if (error.code === "ENOENT") {
      return;
    }

    console.error("Failed to delete file:");
    console.error(error);
  }
}