import express from "express";
import Requisition from "../models/Requisition.js";

const router = express.Router();

/* ================= GET ALL REQUISITIONS ================= */
router.get("/", async (req, res) => {
  try {
    const data = await Requisition.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error("GET requisitions error:", err);
    res.status(500).json({ message: "Failed to fetch requisitions" });
  }
});

/* ================= UPDATE STATUS ================= */
router.put("/:id/status", async (req, res) => {
  try {
    const updated = await Requisition.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
});

/* ================= ADD NEW REQUISITION ================= */
router.post("/", async (req, res) => {
  try {
    const requisition = await Requisition.create(req.body);
    res.status(201).json(requisition);
  } catch (err) {
    console.error("ADD requisition error:", err);
    res.status(500).json({ message: "Failed to submit requisition" });
  }
});

export default router;
