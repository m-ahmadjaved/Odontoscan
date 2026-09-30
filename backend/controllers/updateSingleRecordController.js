// controllers/updateSingleRecordController.js
const Record = require('../models/recordsModel');  // Replace with your actual model
const multer = require('multer');  // Import multer
const path = require('path');

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder to save uploaded files (ensure this folder exists)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Append file extension to filename
  }
});
const upload = multer({ storage: storage });

const updateSingleRecordController = async (req, res) => {
  const { id } = req.params;  // The ID of the record to update
  const updatedData = req.body;  // The data to update in the record

  // If a new photo is uploaded, update the photo field in the data
  if (req.file) {
    updatedData.photo = req.file.path; // Assuming you are storing file path in the 'photo' field
  }

  try {
    // Find the record by ID and update it with the new data
    const record = await Record.findByIdAndUpdate(id, updatedData, {
      new: true, // This option returns the updated record
      runValidators: true // This option ensures that any schema validation is enforced
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.status(200).json({ message: 'Record updated successfully', record });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating record: ' + error.message });
  }
};

module.exports = updateSingleRecordController;
