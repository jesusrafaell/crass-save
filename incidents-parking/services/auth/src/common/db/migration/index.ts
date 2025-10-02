import fs from "fs";
import path from "path";
import pool from "../config/configPosgre";
import { PoolClient } from "pg";

const runMigration = async (client: PoolClient, fileName: string) => {
  const filePath = path.join(__dirname, "migrations", fileName);
  const query = fs.readFileSync(filePath, "utf8");

  try {
    await client.query(query);
  } catch (error) {
    console.error(`Error executing migration ${fileName}:`, error);
  }
};

const migrate = async () => {
  try {
    // const client = await pool.connect();
    // await runMigration(client, 'company.sql');
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
  process.exit(0);
};

migrate();
