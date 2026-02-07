import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";
import Grievance from "./models/Grievance.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB error:", err.message);
    process.exit(1);
  });

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


// 🗑️ AUTO DELETE GRIEVANCES OLDER THAN 15 DAYS
setInterval(async () => {
  try {
    const fifteenDaysAgo = new Date(
      Date.now() - 15 * 24 * 60 * 60 * 1000
    );

    await Grievance.deleteMany({
      createdAt: { $lt: fifteenDaysAgo },
    });

  } catch (err) {
    console.error("Auto delete error:", err);
  }
}, 24 * 60 * 60 * 1000); // runs once a day
