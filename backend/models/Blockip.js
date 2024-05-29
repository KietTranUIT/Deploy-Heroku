const mongoose = require("mongoose");

const blockipSchema = new mongoose.Schema({
  email: {
    type: String,
    ref: "User",
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
}, { timestamps: true });
blockipSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });

module.exports = mongoose.model("blockip", blockipSchema);
