const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// Add Forensic User
exports.addForensicUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = new User({ username, password, role: "forensic" }); // Don't hash the password here
    await newUser.save();
    res
      .status(201)
      .json({ message: "Forensic user added successfully", user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding forensic user", error: error.message });
  }
};
