// utils/file.js
// Genera nombres unicos para archivos subidos.

import path from "path";

export function generateFilename(originalName) {
  const extension = path.extname(originalName);

  const timestamp = Date.now();

  const random = Math.floor(Math.random() * 1000000);

  return `${timestamp}-${random}${extension}`;
}