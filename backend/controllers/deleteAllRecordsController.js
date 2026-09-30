const Record = require("../models/recordsModel");

// Delete All Records Controller
const deleteAllRecordsController = async (req, res) => {
  try {
    // Ensure only admin can perform this action (add your authorization logic here)
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Delete all records
    await Record.deleteMany({});
    res
      .status(200)
      .json({ message: "All records have been deleted successfully!" });
  } catch (error) {
    console.error("Error deleting all records:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting records." });
  }
};

module.exports = deleteAllRecordsController;
