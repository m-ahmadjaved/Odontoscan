const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "forensic"],
    required: true,
    default: "forensic", // Set default role as 'forensic'
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") && !this.isNew) return next(); // Skip hashing if password is not modified or new
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error); // Ensure we pass the error to next()
  }
});

module.exports = mongoose.model("User", userSchema);
