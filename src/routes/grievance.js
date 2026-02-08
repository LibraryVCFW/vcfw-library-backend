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
  try {
    const data = await Grievance.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error("Fetch grievances error:", err);
    res.status(500).json({ message: "Failed to fetch grievances" });
  }
});

/* ================= SUBMIT GRIEVANCE (SAFE) ================= */
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

    /* BASIC VALIDATION */
    if (!userType || !name || !phone || !email || !department || !query) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const trackingId = generateTrackingId(userType);

    /* BUILD PAYLOAD SAFELY */
    const payload = {
      userType,
      trackingId,
      name,
      phone,
      email,
      department,
      query,
    };

    /* STUDENT-ONLY FIELDS */
    if (userType === "Student") {
      payload.category = category;
      payload.subject = subject;
      payload.course = course;
    }

    const grievance = await Grievance.create(payload);

    /* 📊 UPDATE STATS (ULTRA SAFE) */
    let stats = await GrievanceStats.findOne();
    if (!stats) {
      stats = await GrievanceStats.create({});
    }

    stats.students.submitted ??= 0;
    stats.teachers.submitted ??= 0;

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

    if (!reply) {
      return res.status(400).json({ message: "Reply is required" });
    }

    const updated = await Grievance.findByIdAndUpdate(
      req.params.id,
      {
        status: "Resolved",
        reply,
        resolvedAt: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    /* 📊 UPDATE STATS (RESOLVED SAFE) */
    let stats = await GrievanceStats.findOne();
    if (!stats) {
      stats = await GrievanceStats.create({});
    }

    stats.students.resolved ??= 0;
    stats.teachers.resolved ??= 0;

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
  try {
    const grievance = await Grievance.findOne({
      trackingId: req.params.trackingId,
    });

    if (!grievance) {
      return res.status(404).json({ message: "Invalid Tracking ID" });
    }

    res.json(grievance);
  } catch (err) {
    console.error("Track grievance error:", err);
    res.status(500).json({ message: "Failed to track grievance" });
  }
});

/* ================= GRIEVANCE STATS ================= */
router.get("/stats", async (req, res) => {
  try {
    let stats = await GrievanceStats.findOne();
    if (!stats) {
      stats = await GrievanceStats.create({});
    }
    res.json(stats);
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Failed to load stats" });
  }
});

export default router;
