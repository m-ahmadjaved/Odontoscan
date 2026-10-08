// controllers/updateSingleRecordController.js
const mongoose = require('mongoose');
const Record = require('../models/recordsModel');
const multer = require('multer');
const path = require('path');
const { validateRequired } = require('../utils/validateInput');

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

/**
 * Update a single record by ID.
 *
 * Validates the record ID is a well-formed MongoDB ObjectId, ensures at
 * least one field is being updated, and returns 400/404/500 with clear
 * messages instead of leaking Mongoose cast errors.
 *
 * @param   {Object} req            Express request object
 * @param   {Object} req.params     Must contain { id }
 * @param   {Object} req.body       Update payload (at least one field)
 * @param   {Object} res            Express response object
 * @returns {Object}                200 with updated record on success
 *                                  400 if id is invalid or body is empty
 *                                  404 if record not found
 *                                  500 on unexpected server error
 * @access  Admin
 */
const updateSingleRecordController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    // 1. Validate the ID is a well-formed MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid record ID format.' });
    }

    // 2. If a new photo is uploaded, add it to the update payload
    if (req.file) {
      updatedData.photo = req.file.path;
    }

    // 3. Ensure at least one field is being updated
    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({
        message: 'No update data provided. Send at least one field to update.',
      });
    }

    // 4. Perform the update
    const record = await Record.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found.' });
    }

    return res.status(200).json({
      message: 'Record updated successfully.',
      record,
    });
  } catch (error) {
    // Mongoose validation errors are the client's fault (400), not the server's
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        message: 'Validation failed.',
        errors: messages,
      });
    }

    // Log full details server-side; return a generic message to the client
    console.error('[updateSingleRecordController] Unexpected error:', error);
    return res.status(500).json({
      message: 'Something went wrong. Please try again.',
    });
  }
};

module.exports = updateSingleRecordController;
