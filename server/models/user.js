const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    salutation: {
      type: String,
      enum: [
        "Mr.",
        "Ms.",
        "Mrs",
      ],
    },
    firstName: { type: String },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    gender: {
      type: String,
      enum: [
        "Male",
        "Female",
        "Prefer Not To Say",
      ],
    },
    roleId: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("User", userSchema);