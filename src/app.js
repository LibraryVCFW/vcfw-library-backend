import express from "express";
import cors from "cors";

import noticeRoutes from "./routes/notice.js";
import grievanceRoutes from "./routes/grievance.js";
import requisitionRoutes from "./routes/requisition.js";
import resourceRoutes from "./routes/resource.js";
import adminRoutes from "./routes/admin.js";

const app = express();

/* MIDDLEWARE */
app.use(cors());
app.use(express.json());

/* ROUTES */
app.use("/api/notices", noticeRoutes);
app.use("/api/grievances", grievanceRoutes);
app.use("/api/requisitions", requisitionRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/admin", adminRoutes);

/* DEFAULT EXPORT — THIS IS CRITICAL */
export default app;
