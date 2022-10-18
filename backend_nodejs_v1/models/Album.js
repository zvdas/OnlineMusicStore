const mongoose = require('mongoose');

const AlbumSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        unique: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    artist: {
        type: String,
        required: [true, 'Please add an artist\'s name'],
    },
    album: {
        name: String,
        genre: String,
        year: Number,
        producer: String,
        rating: Number
    },
    tracks: {
        trackname: String,
        duration: String,
        size: String
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: [true, 'Please add a price amount']
    }
})

module.exports = mongoose.model('Album', AlbumSchema);