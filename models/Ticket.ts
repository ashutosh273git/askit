import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["TODO", "ASSIGNED", "IN_PROGRESS", "DONE"],
      default: "TODO",
    },
    createdBy: { type: String, required: true },
    assignedTo: { type: String, default: null },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    deadline: {
      type: Date,
    },
    headline: { type: String },
    relatedSkills: { type: [String], default: [] },
  },
  { timestamps: true }
);

export default mongoose.models.Ticket ||
  mongoose.model("Ticket", ticketSchema);
