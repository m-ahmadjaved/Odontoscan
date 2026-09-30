const express = require('express');
const router = express.Router();
const User = require("../models/userModel");
const Data = require("../models/recordsModel");

// Forensics count endpoint
router.get("/forensics", async (req, res) => {
  try {
    const forensicCount = await User.countDocuments(); // Adjust with your actual model
    res.json({ count: forensicCount });
  } catch (err) {
    res.status(500).json({ message: "Error fetching forensic count" });
  }
});

// Records by province endpoint
router.get("/records-by-province", async (req, res) => {
  try {
    const records = await Data.aggregate([
      { $group: { _id: "$province", count: { $sum: 1 } } },
    ]); // Adjust with your actual model
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Error fetching records by province" });
  }
});

module.exports = router;
