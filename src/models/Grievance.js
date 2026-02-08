import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema(
  {
    /* USER TYPE */
    userType: {
      type: String,
      enum: ["Student", "Teacher"],
      required: true,
    },

    /* TRACKING */
    trackingId: {
      type: String,
      unique: true,
      required: true,
    },

    /* STUDENT-SPECIFIC */
    category: {
      type: String,
      enum: [
        "Book Availability",
        "Facility Issues",
        "Library Hours",
        "Staff Behaviour",
        "Other",
      ],
      required: function () {
        return this.userType === "Student";
      },
    },

    subject: {
      type: String,
    },

    course: {
      type: String,
      enum: ["General", "Honours"],
    },

    /* COMMON DETAILS */
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    department: { type: String, required: true },

    /* QUERY */
    query: { type: String, required: true },

    /* LIBRARIAN SIDE */
    status: {
      type: String,
      enum: ["Pending", "Resolved"],
      default: "Pending",
    },
    reply: String,
    resolvedAt: Date,
  },
  {
    timestamps: true,
  }
);

const Grievance = mongoose.model("Grievance", grievanceSchema);
export default Grievance;
