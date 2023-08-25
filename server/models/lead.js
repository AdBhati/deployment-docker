const mongoose = require("mongoose");
const { leadEnum, leadTypeEnum } = require("../utils/constants");


const leadSchema = new mongoose.Schema(
  {
    salutation: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    company: { type: String },
    phone: { type: String },
    email: { type: String },
    subject: { type: String },
    status: {
      type: String,
      enum: leadEnum,
      default: leadEnum[0],
    },
    legacyId: { type: String },
    type: { type: String, enum: leadTypeEnum, default: leadTypeEnum[0] },
    isDeleted: { type: Boolean, default: false }, // New field
    taskIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },

  { timestamps: true }
);

module.exports = new mongoose.model("Lead", leadSchema);
