const mongoose = require("mongoose");

const failedloginSchema = new mongoose.Schema({
  email: {
    type: String,
    ref: "User",
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });
failedloginSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 });

module.exports = mongoose.model("failedlogin", failedloginSchema);
