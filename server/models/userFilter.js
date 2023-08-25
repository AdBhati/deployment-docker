const mongoose = require("mongoose");

const userFilterSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    filter: { type: String },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("UserFilter", userFilterSchema);
