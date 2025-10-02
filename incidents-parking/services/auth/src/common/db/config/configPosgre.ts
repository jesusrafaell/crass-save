import dotenvFlow from "dotenv-flow";
import { Pool, types } from "pg";
import path from "path";

dotenvFlow.config({
  silent: true,
});

types.setTypeParser(1700, "text", parseFloat);

const sqlDirectoryPath = path.join(__dirname, "..", "sql");

const pool = new Pool({
  host: process.env.HOST_DB,
  database: process.env.NAME_DB,
  user: process.env.USER_DB,
  password: process.env.PASS_DB,
  port: Number(process.env.PORT_DB),
  ssl: {
    // Aceptar certificados autofirmados
    rejectUnauthorized: false,
  },
});

export const postgressConnect = async () => {
  try {
    await pool.connect();

    console.log("Conected DB Postgres", process.env.NAME_DB);
  } catch (error) {
    console.error("Error DB postgres conection:", error);
    throw new Error("Error DB postgres");
  }
};

export default pool;
