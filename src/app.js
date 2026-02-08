import express from "express";
import cors from "cors";

import noticeRoutes from "./routes/notice.js";
import grievanceRoutes from "./routes/grievance.js";
import requisitionRoutes from "./routes/requisition.js";
import resourceRoutes from "./routes/resource.js";
import adminRoutes from "./routes/admin.js";

const app = express();

/* ================= CORS (FIXED FOR NETLIFY + RENDER) ================= */
app.use(
  cors({
    origin: [
      "https://vcfwlibrary.org",
      "https://www.vcfwlibrary.org",
      "http://localhost:5173"
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

/* HANDLE PREFLIGHT */
app.options("*", cors());

/* BODY PARSER */
app.use(express.json());

/* ROUTES */
app.use("/api/notices", noticeRoutes);
app.use("/api/grievances", grievanceRoutes);
app.use("/api/requisitions", requisitionRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/admin", adminRoutes);

/* EXPORT */
export default app;
