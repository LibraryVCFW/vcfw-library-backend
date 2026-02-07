import express from "express";
import Notice from "../models/Notice.js";

const router = express.Router();

/* ================= GET ALL NOTICES ================= */
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    console.error("GET notices error:", err);
    res.status(500).json({ message: "Failed to fetch notices" });
  }
});

/* ================= ADD NOTICE ================= */
router.post("/", async (req, res) => {
  try {
    const { title, description, link } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title and description are required" });
    }

    const notice = await Notice.create({
      title,
      description,
      link: link || "",
    });

    res.status(201).json(notice);
  } catch (err) {
    console.error("ADD notice error:", err);
    res.status(500).json({ message: "Failed to add notice" });
  }
});

/* ================= UPDATE NOTICE ================= */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Notice.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Notice not found" });
    }

    res.json(updated);
  } catch (err) {
    console.error("UPDATE notice error:", err);
    res.status(500).json({ message: "Failed to update notice" });
  }
});

/* ================= DELETE NOTICE ================= */
router.delete("/:id", async (req, res) => {
  try {
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error("DELETE notice error:", err);
    res.status(500).json({ message: "Failed to delete notice" });
  }
});

export default router;
