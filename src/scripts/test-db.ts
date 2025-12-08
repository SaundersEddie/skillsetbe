import path from "path";
import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function main() {
  console.log("DATABASE_URL in test-db:", process.env.DATABASE_URL);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("✅ Connected to Postgres successfully from Mac using pg Client.");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("❌ Error connecting with pg Client:", err);
  process.exit(1);
});
