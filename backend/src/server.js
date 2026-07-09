// server.js
// Inicia el servidor y comprueba la conexion con MySQL.

import "dotenv/config";

import app from "./index.js";
import { connectDatabase } from "./config/database.js";

const PORT = process.env.PORT || 3000;

// Inicia la aplicacion.
async function startServer() {
  try {
    await connectDatabase();
  } catch (error) {
    console.error("MySQL connection failed. Server will start anyway.");
    console.error(error);
  }

  app.listen(PORT, () => {
    console.log(`North Barber API running on port ${PORT}`);
  });
}

startServer();