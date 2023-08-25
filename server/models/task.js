const mongoose = require("mongoose");
const { taskEnum, priorityEnum, emailTypeEnum } = require("../utils/constants");

const taskSchema = new mongoose.Schema(
  {
    legacyId: { type: String },
    title: { type: String },
    type: {
      type: String,
      required: true,
      enum: emailTypeEnum,
      default: emailTypeEnum[0],
    },
    email: { type: String, required: true },
    description: { type: String },
    body: { type: String },
    remarks: { type: String },
    priority: {
      type: String,
      enum: priorityEnum,
      default: priorityEnum[0],
    },

    leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: {
      type: String,
      enum: taskEnum,
      default: taskEnum[0],
    },
    invoiceNumber: {
      type: String,
      default: null,
    },
    isCompleted: { type: Boolean, default: false }, // New field
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Task", taskSchema);
