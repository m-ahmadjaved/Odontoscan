const express = require("express");
const router = express.Router();
const Record = require("../models/recordsModel"); // Ensure this model is correctly set up
const User = require("../models/userModel");     // Ensure this model is correctly set up

// GET total record count
router.get("/records/count", async (req, res) => {
  try {
    const count = await Record.countDocuments();  // Make sure your Record model is valid
    res.json({ count });
  } catch (err) {
    console.error("Error fetching record count:", err);
    res.status(500).json({ error: "Server error" });
  }
}); 

// GET user count by roles
router.get("/users/roles", async (req, res) => {
  try {
    const users = await User.find({}, "role");  // Ensure the 'role' field exists in your User model
    const roleCounts = {};

    users.forEach((user) => {
      const role = user.role || "unknown";  // Default to 'unknown' if role is undefined
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });

    res.json(roleCounts);
  } catch (err) {
    console.error("Error fetching user roles:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET record count by province
router.get("/records/provinces", async (req, res) => {
  try {
    const records = await Record.find({}, "province");
    const provinceCounts = {};

    records.forEach((record) => {
      const province = record.province?.trim() || "Unknown";
      provinceCounts[province] = (provinceCounts[province] || 0) + 1;
    });

    res.json(provinceCounts);
  } catch (err) {
    console.error("Error fetching record provinces:", err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
