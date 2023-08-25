const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["ADMIN", "USER", "SUPER_ADMIN"],
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("Role", roleSchema);
