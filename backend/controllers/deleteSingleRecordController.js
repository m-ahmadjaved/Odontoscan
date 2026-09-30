// controllers/deleteSingleRecordController.js

const Record = require('../models/recordsModel');  // Replace with your actual model

const deleteSingleRecordController = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the record by its ID
    const record = await Record.findByIdAndDelete(id);

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.status(200).json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting record' });
  }
};

module.exports = deleteSingleRecordController;
