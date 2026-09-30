// authController.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Debugging: log the user object and password hash
    console.log("User found:", user.username);
    console.log("Stored hash:", user.password);
    console.log("Provided password:", password);

    // Compare the provided password with the stored hashed password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", isPasswordMatch);

    if (!isPasswordMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, user.role);
    res
      .status(200)
      .json({ message: "Login successful", token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
