// utils/hashPassword.js
// Genera un hash seguro para contrasenas usando bcrypt.

import bcrypt from "bcrypt";

const password = process.argv[2];

if (!password) {
  console.log("Usage: node src/utils/hashPassword.js your_password");
  process.exit(1);
}

const saltRounds = 10;
const hash = await bcrypt.hash(password, saltRounds);

console.log(hash);