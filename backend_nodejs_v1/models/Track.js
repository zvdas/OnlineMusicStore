const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema({
    track_name: {
        type: String,
        required: [true, 'Please add a name for the Track']
    },
    featuring: String,
    duration: String,
    track_file: {
        type: String,
        default: 'no-track'
    },
    credit: String,
    file_size: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Track', TrackSchema);