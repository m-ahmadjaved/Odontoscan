const path = require('path');
const fs = require('fs');
const Person = require('../models/recordsModel');
const similarity = require('image-similarity'); // Assuming you're using image-similarity package

async function matchRadiographController(req, res) {
    try {
        const uploadedFilePath = req.file.path; // Path to the uploaded radiograph
        const allRecords = await Person.find(); // Get all records from the database

        let highestSimilarity = 0;
        let bestMatch = null;

        // Loop through all records in the database
        for (const record of allRecords) {
            const databaseFilePath = path.resolve(record.radiograph); // Path to the radiograph in the database

            // Check if the file exists in the system
            if (!fs.existsSync(databaseFilePath)) {
                console.log(`File not found for ${record.name}: ${databaseFilePath}`);
                continue;
            }

            // Calculate similarity between the uploaded file and the one in the database
            const similarityScore = await similarity(uploadedFilePath, databaseFilePath);

            // If similarity is higher than the previous one, update the best match
            if (similarityScore > highestSimilarity) {
                highestSimilarity = similarityScore;
                bestMatch = record;
            }
        }

        if (bestMatch) {
            const similarityPercentage = (highestSimilarity * 100).toFixed(2); // Convert to percentage

            // Convert the 'photo' path to a valid URL (replace backslashes with forward slashes)
            const photoUrl = `http://localhost:3000/${bestMatch.photo.replace(/\\/g, '/')}`;

            res.json({
                message: 'Best match found',
                similarity: `${similarityPercentage}%`, // Return similarity as percentage
                matchedRecord: {
                    ...bestMatch._doc,  // Spread the matched record fields
                    photoUrl: photoUrl, // Add the full URL to the photo
                },
            });
        } else {
            res.status(404).json({ message: 'No matching radiographs found' });
        }
    } catch (error) {
        console.error('Error while matching radiographs:', error);
        res.status(500).json({
            message: 'An error occurred while matching radiographs.',
            error: error.message,
        });
    }
}

module.exports = { matchRadiographController };
