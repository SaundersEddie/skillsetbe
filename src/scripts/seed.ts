import "dotenv/config";
import prisma from "../lib/prisma";

async function main() {
  console.log("Clearing existing data...");

  // Order matters because of foreign key constraints
  await prisma.evidence.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  console.log("Seeding users...");

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      // NOTE: this is NOT a real hash – auth is not implemented yet.
      // We'll replace this with a proper hashed password when we add auth logic.
      passwordHash: "CHANGE_ME_LATER",
      role: "admin",
    },
  });

  console.log("Seeding skills...");

  const frontendSkill = await prisma.skill.create({
    data: {
      name: "React",
      category: "Frontend",
      level: 4,
    },
  });

  const backendSkill = await prisma.skill.create({
    data: {
      name: "Node.js / TypeScript",
      category: "Backend",
      level: 4,
    },
  });

  const dbSkill = await prisma.skill.create({
    data: {
      name: "PostgreSQL / Prisma",
      category: "Database",
      level: 3,
    },
  });

  console.log("Seeding projects...");

  const skillTrackerProject = await prisma.project.create({
    data: {
      name: "SkillStacker / Skillset App",
      desc: "Full-stack skill tracking portfolio project with React, TS backend, and PostgreSQL.",
    },
  });

  const mudProject = await prisma.project.create({
    data: {
      name: "Shattered Realms MUD",
      desc: "Python-based MUD showcasing asynchronous networking, game loops, and data-driven world building.",
    },
  });

  console.log("Seeding evidence...");

  await prisma.evidence.createMany({
    data: [
      {
        userId: adminUser.id,
        skillId: frontendSkill.id,
        projectId: skillTrackerProject.id,
        desc: "Built React-based frontend with Tailwind, consuming TypeScript API.",
        link: "https://github.com/your-org/skillsetfe",
      },
      {
        userId: adminUser.id,
        skillId: backendSkill.id,
        projectId: skillTrackerProject.id,
        desc: "Implemented Node/Express backend in TypeScript with Prisma and unit tests.",
        link: "https://github.com/your-org/skillsetbe",
      },
      {
        userId: adminUser.id,
        skillId: dbSkill.id,
        projectId: skillTrackerProject.id,
        desc: "Designed relational model in PostgreSQL and managed schema via Prisma migrations.",
        link: "",
      },
      {
        userId: adminUser.id,
        skillId: backendSkill.id,
        projectId: mudProject.id,
        desc: "Showcases server-side game logic, telnet sessions, and async IO patterns.",
        link: "https://github.com/your-org/shattered-realms-mud",
      },
    ],
  });

  console.log("Seed data created successfully.");
}

main()
  .catch((err) => {
    console.error("Error while seeding database:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
