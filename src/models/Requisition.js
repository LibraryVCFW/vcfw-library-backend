import mongoose from "mongoose";

const requisitionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    department: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true },

    category: {
      type: String,
      enum: ["Teacher", "Student", "Others"],
      required: true,
    },

    type: {
      type: String,
      enum: ["Book", "Journal"],
      required: true,
    },
    
    status: {
  type: String,
  enum: ["Pending", "Processed"],
  default: "Pending",
    },

    title: { type: String, required: true },
    author: String,
    edition: String,
    publisher: String,

    issn: String,
    researchArea: String,

    remark: String,
  },
  {
    timestamps: true,
  }
);

const Requisition = mongoose.model("Requisition", requisitionSchema);
export default Requisition;
