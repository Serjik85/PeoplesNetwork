import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import pg from "pg";

const { Client } = pg;

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://postgres:postgres@localhost:5432/peoples_network";

const root = process.cwd();
const schemaPath = path.join(root, "db", "schema.sql");
const seedPath = path.join(root, "db", "seed.sql");

const client = new Client({ connectionString: databaseUrl });

async function run() {
  const schemaSql = await fs.readFile(schemaPath, "utf-8");
  const seedSql = await fs.readFile(seedPath, "utf-8");

  await client.connect();
  console.log("Connected to database");

  await client.query("begin");
  await client.query(schemaSql);
  await client.query(seedSql);
  await client.query("commit");

  console.log("Database initialized with schema + seed");
}

run()
  .catch(async (error) => {
    console.error("Database init failed:", error);
    try {
      await client.query("rollback");
    } catch {
      // ignore rollback errors
    }
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.end();
  });

