import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
    },
    publisher: {
      type: String,
      trim: true,
    },
    year: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Book", "Journal", "E-book", "Magazine", "Other"],
      default: "Book",
    },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model("Resource", resourceSchema);
export default Resource;
