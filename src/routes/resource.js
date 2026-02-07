import express from "express";
import Resource from "../models/Resource.js";

const router = express.Router();

/* ================= GET ALL RESOURCES ================= */
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err) {
    console.error("Fetch resources error:", err);
    res.status(500).json({ message: "Failed to fetch resources" });
  }
});

/* ================= ADD NEW RESOURCE ================= */
router.post("/", async (req, res) => {
  try {
    const { title, author, publisher, year, type } = req.body;

    // Basic validation
    if (!title || !type) {
      return res.status(400).json({
        message: "Title and Type are required",
      });
    }

    const resource = await Resource.create({
      title,
      author,
      publisher,
      year,
      type,
    });

    res.status(201).json(resource);
  } catch (err) {
    console.error("Add resource error:", err);
    res.status(500).json({ message: "Failed to add resource" });
  }
});

/* ================= DELETE RESOURCE ================= */
router.delete("/:id", async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: "Resource deleted successfully" });
  } catch (err) {
    console.error("Delete resource error:", err);
    res.status(500).json({ message: "Failed to delete resource" });
  }
});

export default router;
