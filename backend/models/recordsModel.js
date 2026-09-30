const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    province: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    radiograph: {
        type: String,
        required: true,
    },
});

const RecordData = mongoose.model('ForensicData', RecordSchema);

module.exports = RecordData;
