import express from "express";
const router = express.Router();

router.post("/login", (req, res) => {
  res.json({ message: "Admin login placeholder" });
});

export default router;
