import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import { requireAuth, requireRole } from "./middleware/authMiddleware";
import prisma from "./lib/prisma";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "skillset-backend" });
});

// Auth routes
app.use("/auth", authRoutes);

// Example protected route:
// GET /me – requires valid token
app.get("/me", requireAuth, async (req, res) => {
  // req.user comes from middleware
  const user = (req as any).user; // or cast to AuthedRequest

  res.json({
    id: user.userId,
    email: user.email,
    role: user.role,
  });
});

// Example admin-only test route
app.get("/admin/test", requireAuth, requireRole("admin"), (_req, res) => {
  res.json({ ok: true, message: "You are an admin." });
});

// Example: list skills (auth required or not, your call)
app.get("/skills", requireAuth, async (_req, res) => {
  const skills = await prisma.skill.findMany();
  res.json(skills);
});

export default app;
