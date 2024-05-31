const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema;

const codeSchema = new mongoose.Schema({
  secret: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});
codeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 1800 });

module.exports = mongoose.model("Code", codeSchema);
