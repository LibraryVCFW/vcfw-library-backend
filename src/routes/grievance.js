import express from "express";
import Grievance from "../models/Grievance.js";
import GrievanceStats from "../models/GrievanceStats.js";

const router = express.Router();

/* 🔢 TRACKING ID GENERATOR */
function generateTrackingId(userType) {
  const prefix = userType === "Student" ? "LGR-STU" : "LGR-TEA";
  const year = new Date().getFullYear();
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${year}-${random}`;
}

/* ================= GET ALL GRIEVANCES ================= */
router.get("/", async (req, res) => {
  const data = await Grievance.find().sort({ createdAt: -1 });
  res.json(data);
});

/* ================= SUBMIT GRIEVANCE ================= */
router.post("/", async (req, res) => {
  try {
    const {
      userType,
      category,
      subject,
      course,
      name,
      phone,
      email,
      department,
      query,
    } = req.body;

    if (!userType || !name || !phone || !email || !department || !query) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const trackingId = generateTrackingId(userType);

    const grievance = await Grievance.create({
      userType,
      trackingId,
      category,
      subject,
      course,
      name,
      phone,
      email,
      department,
      query,
    });

    /* 📊 UPDATE STATS (SUBMITTED) */
    let stats = await GrievanceStats.findOne();
    if (!stats) {
      stats = await GrievanceStats.create({});
    }

    if (userType === "Student") {
      stats.students.submitted += 1;
    } else {
      stats.teachers.submitted += 1;
    }

    await stats.save();

    res.status(201).json({
      message: "Grievance submitted successfully",
      trackingId: grievance.trackingId,
    });
  } catch (err) {
    console.error("Submit grievance error:", err);
    res.status(500).json({ message: "Failed to submit grievance" });
  }
});

/* ================= RESOLVE GRIEVANCE ================= */
router.put("/:id/resolve", async (req, res) => {
  try {
    const { reply } = req.body;

    const updated = await Grievance.findByIdAndUpdate(
      req.params.id,
      {
        status: "Resolved",
        reply,
        resolvedAt: new Date(),
      },
      { new: true }
    );

    /* 📊 UPDATE STATS (RESOLVED) */
    let stats = await GrievanceStats.findOne();
    if (!stats) {
      stats = await GrievanceStats.create({});
    }

    if (updated.userType === "Student") {
      stats.students.resolved += 1;
    } else {
      stats.teachers.resolved += 1;
    }

    await stats.save();

    res.json(updated);
  } catch (err) {
    console.error("Resolve grievance error:", err);
    res.status(500).json({ message: "Failed to resolve grievance" });
  }
});

/* ================= TRACK BY TRACKING ID ================= */
router.get("/track/:trackingId", async (req, res) => {
  const grievance = await Grievance.findOne({
    trackingId: req.params.trackingId,
  });

  if (!grievance) {
    return res.status(404).json({ message: "Invalid Tracking ID" });
  }

  res.json(grievance);
});

/* ================= GRIEVANCE STATS ================= */
router.get("/stats", async (req, res) => {
  let stats = await GrievanceStats.findOne();
  if (!stats) {
    stats = await GrievanceStats.create({});
  }
  res.json(stats);
});

export default router;
