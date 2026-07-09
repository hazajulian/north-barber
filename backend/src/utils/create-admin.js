// utils/create-admin.js
// Crea un administrador inicial para desarrollo.

import "dotenv/config";
import bcrypt from "bcrypt";
import pool from "../config/database.js";

const admin = {
  name: "Admin North Barber",
  email: "admin@northbarber.com",
  password: "Admin123!",
  role: "admin",
};

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash(
      admin.password,
      10
    );

    await pool.query(
      `
      INSERT INTO users (
        name,
        email,
        password,
        role,
        is_active
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [
        admin.name,
        admin.email,
        hashedPassword,
        admin.role,
        true,
      ]
    );

    console.log("\nAdministrador creado correctamente.\n");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: ${admin.password}\n`);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

createAdmin();