// utils/uploadToCloudinary.js
// Sube imagenes a Cloudinary desde un buffer de Multer.

import cloudinary from "../config/cloudinary.js";

export function uploadToCloudinary(
  fileBuffer,
  folder = "north-barber/barbers"
) {
  return new Promise((resolve, reject) => {
    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
          transformation: [
            {
              width: 900,
              height: 900,
              crop: "limit",
              quality: "auto",
              fetch_format: "auto",
            },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve({
            image_url: result.secure_url,
            image_public_id: result.public_id,
          });
        }
      );

    uploadStream.end(fileBuffer);
  });
}