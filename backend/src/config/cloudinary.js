// config/cloudinary.js
// Configura Cloudinary usando CLOUDINARY_URL.

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  secure: true,
});

export default cloudinary;