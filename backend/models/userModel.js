const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

/**
 * User Schema — defines admin and forensic users for ODONTO-SCAN.
 *
 * The system supports two roles with different permissions:
 *   - "admin"     → manages users, records, and system settings
 *   - "forensic"  → uploads radiographs and performs matching only
 *
 * @field username  {String}  Unique login identifier. Required.
 * @field password  {String}  bcrypt-hashed password. Required. Never stored in plaintext.
 * @field role      {String}  Enum: "admin" | "forensic". Defaults to "forensic".
 *
 * @hook pre("save") — Hashes the password with bcrypt (10 salt rounds) before
 *                     saving, but only when the password has actually changed.
 *                     This prevents re-hashing an already-hashed password on
 *                     unrelated updates.
 */
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "forensic"],
    required: true,
    default: "forensic",
  },
});

// Hash password before saving, but only when the password field is new or changed.
// Skip the hash if this is an existing document and the password hasn't been touched.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") && !this.isNew) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("User", userSchema);
