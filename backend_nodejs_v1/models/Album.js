const mongoose = require('mongoose');
const slugify = require('slugify');

const AlbumSchema =  new mongoose.Schema({
    album_name: {
        type: String,
        required: [true, 'Please add a name for the Album'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    slug: String,
    // to slugify the url path (ie) "Admiral Bob" => "admiral-bob" for parsing url
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
    album_url: String,
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

// create album slug from the name
AlbumSchema.pre('save', function(next) {
    this.slug = slugify(this.album_name, { lower: true });
    next();
});

module.exports = mongoose.model('Album', AlbumSchema);