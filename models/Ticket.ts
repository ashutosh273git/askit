import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  status: { type: String, default: "TODO"},
  createdBy: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  assignedTo: {type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
  priority: {type: String},
  deadline: {type: String},
  headline: {type: String},
  relatedSkills: {type: String}
}, {timestamps: true});

export default mongoose.model("Ticket", ticketSchema);
