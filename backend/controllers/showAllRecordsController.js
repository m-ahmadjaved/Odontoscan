// showAllRecordsController.js
const Record = require('../models/recordsModel');

// Show All Records
exports.showAllRecords = async (req, res) => {
    try {
        const records = await Record.find({}); // Fetch all records from database

        // Debugging: Log fetched records
        console.log(records);

        if (records.length === 0) {
            return res.status(404).json({ message: 'No records found' });
        }

        res.status(200).json({ message: 'All records fetched successfully', records });
    } catch (error) {
        console.error("Error fetching records:", error); // Log any error details
        res.status(500).json({ message: 'Error fetching records', error: error.message });
    }
};
