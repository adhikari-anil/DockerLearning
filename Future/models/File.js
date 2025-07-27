const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  original_name: { type: String, required: true },
  file_name: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  uuid: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now() },
  expiresAt: { type: Date, required: true },
});

fileSchema.index({ expiresAt: 1 }, { expiresAfterSeconds: 0 });

module.exports = mongoose.model("File", fileSchema);
