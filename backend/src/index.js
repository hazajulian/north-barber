// index.js
// Configura la aplicacion principal de Express.

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";

import authRoutes from "./routes/auth-route.js";
import barberRoutes from "./routes/barber-route.js";
import serviceRoutes from "./routes/service-route.js";
import appointmentRoutes from "./routes/appointment-route.js";
import businessHoursRoutes from "./routes/businessHours-route.js";
import notificationRoutes from "./routes/notification-route.js";
import dashboardRoutes from "./routes/dashboard-route.js";
import auditRoutes from "./routes/audit-route.js";

import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

// Seguridad HTTP.
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Comprime las respuestas.
app.use(compression());

// CORS.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

// Parseo de JSON.
app.use(express.json());

// Sirve archivos estaticos.
app.use("/uploads", express.static("uploads"));

// Logs.
app.use(morgan("dev"));

// Ruta principal.
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "North Barber API is running.",
  });
});

// API.
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/barbers", barberRoutes);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/appointments", appointmentRoutes);
app.use("/api/v1/business-hours", businessHoursRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/audit", auditRoutes);

// Middleware de errores.
app.use(errorHandler);

export default app;