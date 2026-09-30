// controllers/showSingleRecordController.js
const Record = require('../models/recordsModel');

const showSingleRecordController = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await Record.findById(id);
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    res.json({ record });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching record', error });
  }
};

module.exports = showSingleRecordController;
