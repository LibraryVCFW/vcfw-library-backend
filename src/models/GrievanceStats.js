import mongoose from "mongoose";

const grievanceStatsSchema = new mongoose.Schema({
  students: {
    submitted: { type: Number, default: 0 },
    resolved: { type: Number, default: 0 },
  },
  teachers: {
    submitted: { type: Number, default: 0 },
    resolved: { type: Number, default: 0 },
  },
});

const GrievanceStats = mongoose.model(
  "GrievanceStats",
  grievanceStatsSchema
);

export default GrievanceStats;
