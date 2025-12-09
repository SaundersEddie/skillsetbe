import { Router } from "express";
import { authenticateUser } from "../services/authService";

const router = Router();

// POST /auth/login { email, password }
router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await authenticateUser(email, password);
    if (!result) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    return res.json(result);
  } catch (err) {
    console.error("[auth] Error in /auth/login:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
