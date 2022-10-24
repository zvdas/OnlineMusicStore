const mongoose = require('mongoose');

const AlbumSchema =  new mongoose.Schema({
    album_name: {
        type: String,
        required: [true, 'Please add a name for the Album'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    slug: String,
    // to slugify the url path (ie) "Hear Me Now" => "hear-me-now" for parsing url
    cover_photo: {
        type: String,
        default: 'no-photo.jpg'
    },
    artist: {
        type: String,
        required: [true, 'Please add an artist\'s name'],
    },
    genre: String,
    year: Number,
    producer: String,
    averageRating: {
        type: Number,
        min: [1, 'Rating must be atleast 1'],
        max: [5, 'Rating cannot be more than 5']
    },
    description: {
        type: String,
        maxlength: [500, 'Name cannot exceed 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price amount']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Album', AlbumSchema);