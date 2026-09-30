const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const deleteAllRecordsController = require("../controllers/deleteAllRecordsController");

// Delete All Records Route
router.delete(
  "/delete-all",
  authMiddleware.authenticate,
  authMiddleware.authorize("admin"),
  deleteAllRecordsController
);

module.exports = router;
