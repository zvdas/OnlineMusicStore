const mongoose = require('mongoose');
const slugify = require('slugify');

const TrackSchema = new mongoose.Schema({
    track_name: {
        type: String,
        trim: true,
        required: [true, 'Please add a name for the Track']
    },
    track_slug: String,
    featuring: String,
    duration: String,
    track_file: {
        type: String,
        default: 'no-track'
    },
    track_data: String,
    credit: String,
    file_size: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    album: {
        type: mongoose.Schema.ObjectId,
        // reference to model for relationship
        ref: 'Album',
        required: true
    }
});

// create track slug from the name
TrackSchema.pre('save', function(next) {
    this.track_slug = slugify(this.track_name, { lower: true });
    next();
});

module.exports = mongoose.model('Track', TrackSchema);