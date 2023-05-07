const mongoose = require('mongoose');
const slugify = require('slugify');

/**
 * @openapi
 * components:
 *   schemas:
 *     Album:
 *       type: object
 *       properties:
 *         album_name: 
 *           type: string
 *           required: true
 *         cover_photo:
 *           type: string
 *         artist_slug:
 *           type: string
 *         genre:
 *           type: string
 *         year:
 *           type: number
 *         producer:
 *           type: string
 *         description:
 *           type: string
 *         album_url:
 *           type: string
 *       additionalProperties: false
 */
const AlbumSchema = new mongoose.Schema(
  {
    album_name: {
      type: String,
      required: [true, 'Please add a name for the Album'],
      unique: true,
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    album_slug: String,
    // to slugify the url path (ie) "Admiral Bob" => "admiral-bob" for parsing url
    cover_photo: {
      type: String,
      default: 'no-photo.jpg',
    },
    // cover_photo_data: String,
    artist: {
      type: String,
      required: [true, "Please add an artist's name"],
    },
    artist_slug: String,
    genre: String,
    year: Number,
    producer: String,
    averageRating: {
      type: Number,
      min: [1, 'Rating must be atleast 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    description: {
      type: String,
      maxlength: [500, 'Name cannot exceed 500 characters'],
    },
    album_url: String,
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// create album slug from the name
AlbumSchema.pre('save', function (next) {
  this.album_slug = slugify(this.album_name, { lower: true });
  this.artist_slug = slugify(this.artist, { lower: true });
  next();
});

// reverse populate with virtuals
AlbumSchema.virtual('tracks', {
  ref: 'Track',
  localField: '_id',
  foreignField: 'album',
  justOne: false,
});

AlbumSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'album',
  justOne: false,
});

// cascade delete tracks when an album is deleted
AlbumSchema.pre('remove', async function (next) {
  await this.model('Track').deleteMany({ album: this._id });
  // await this.model('Review').deleteMany({ album: this._id });
  next();
});

module.exports = mongoose.model('Album', AlbumSchema);
