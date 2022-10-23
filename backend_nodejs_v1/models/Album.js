const mongoose = require('mongoose');

const AlbumSchema =  new mongoose.Schema({
    album_name: {
        type: String,
        required: [true, 'Please add a name for the Album'],
        unique: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    cover_photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    artist: {
        type: String,
        required: [true, 'Please add an artist\'s name'],
    },
    genre: {
        type: String
    },
    year: {
        type: Number
    },
    producer: {
        type: String
    },
    rating: {
        type: Number
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