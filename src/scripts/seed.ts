import path from "path";
import dotenv from "dotenv";
import { Client } from "pg";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

async function main() {
  console.log("[seed] DATABASE_URL:", process.env.DATABASE_URL);

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();
  console.log("[seed] Connected to Postgres.");

  console.log("[seed] Clearing existing data...");
  // Reset all tables and identities, cascading to dependent rows
  await client.query(
    'TRUNCATE TABLE "Evidence", "Skill", "Project", "User" RESTART IDENTITY CASCADE;'
  );

  console.log("[seed] Seeding users...");
  const adminUserRes = await client.query(
    `
    INSERT INTO "User" ("email", "passwordHash", "role", "updatedAt")
    VALUES ($1, $2, $3, NOW())
    RETURNING "id";
  `,
    ["admin@example.com", "CHANGE_ME_LATER", "admin"]
  );
  const adminUserId: number = adminUserRes.rows[0].id;

  console.log("[seed] Seeding skills...");
  const frontendRes = await client.query(
    `
    INSERT INTO "Skill" ("name", "category", "level", "updatedAt")
    VALUES ($1, $2, $3, NOW())
    RETURNING "id";
  `,
    ["React", "Frontend", 4]
  );
  const frontendSkillId: number = frontendRes.rows[0].id;

  const backendRes = await client.query(
    `
    INSERT INTO "Skill" ("name", "category", "level", "updatedAt")
    VALUES ($1, $2, $3, NOW())
    RETURNING "id";
  `,
    ["Node.js / TypeScript", "Backend", 4]
  );
  const backendSkillId: number = backendRes.rows[0].id;

  const dbRes = await client.query(
    `
    INSERT INTO "Skill" ("name", "category", "level", "updatedAt")
    VALUES ($1, $2, $3, NOW())
    RETURNING "id";
  `,
    ["PostgreSQL / Prisma", "Database", 3]
  );
  const dbSkillId: number = dbRes.rows[0].id;

  console.log("[seed] Seeding projects...");
  const skillTrackerRes = await client.query(
    `
    INSERT INTO "Project" ("name", "desc", "updatedAt")
    VALUES ($1, $2, NOW())
    RETURNING "id";
  `,
    [
      "SkillStacker / Skillset App",
      "Full-stack skill tracking portfolio project with React, TS backend, and PostgreSQL.",
    ]
  );
  const skillTrackerProjectId: number = skillTrackerRes.rows[0].id;

  const mudProjectRes = await client.query(
    `
    INSERT INTO "Project" ("name", "desc", "updatedAt")
    VALUES ($1, $2, NOW())
    RETURNING "id";
  `,
    [
      "Shattered Realms MUD",
      "Python-based MUD showcasing async networking and data-driven world building.",
    ]
  );
  const mudProjectId: number = mudProjectRes.rows[0].id;

  console.log("[seed] Seeding evidence...");
  await client.query(
    `
    INSERT INTO "Evidence" ("userId", "skillId", "projectId", "desc", "link")
    VALUES 
      ($1, $2, $3, $4, $5),
      ($1, $6, $3, $7, $8),
      ($1, $9, $3, $10, $11),
      ($1, $6, $12, $13, $14);
  `,
    [
      adminUserId, // 1
      frontendSkillId, // 2
      skillTrackerProjectId, // 3
      "Built React-based frontend with Tailwind, consuming TypeScript API.", // 4
      "https://github.com/your-org/skillsetfe", // 5

      backendSkillId, // 6
      "Implemented Node/Express backend in TypeScript with Prisma and unit tests.", // 7
      "https://github.com/your-org/skillsetbe", // 8

      dbSkillId, // 9
      "Designed relational model in PostgreSQL and managed schema via Prisma migrations.", // 10
      "", // 11

      mudProjectId, // 12
      "Showcases server-side game logic, telnet sessions, and async IO patterns.", // 13
      "https://github.com/your-org/shattered-realms-mud", // 14
    ]
  );

  console.log("[seed] Seed data created successfully.");

  await client.end();
}

main().catch((err) => {
  console.error("[seed] Error while seeding database:", err);
  process.exit(1);
});
