const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for the review'],
    maxLength: 100,
  },
  text: {
    type: String,
    required: [true, 'Please add some text'],
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating between 1 and 5'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  album: {
    type: mongoose.Schema.ObjectId,
    // reference to model for relationship
    ref: 'Album',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

// prevent user from submitting more than one review per album
ReviewSchema.index({ album: 1, user: 1 }, { unique: true });

// static method to get the average rating and save
ReviewSchema.statics.getAverageRating = async function (albumId) {
  const obj = await this.aggregate([
    {
      $match: { album: albumId },
    },
    {
      $group: { _id: '$album', averageRating: { $avg: '$rating' } },
    },
  ]);

  // update rating in database and add as a field
  try {
    await this.model('Album').findByIdAndUpdate(albumId, {
      averageRating: obj[0].averageRating,
    });
  } catch (err) {
    console.log(err);
  }
};

// call getAverageRating after save
ReviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.album);
});

// call getAverageRating before remove
ReviewSchema.pre('remove', function () {
  this.constructor.getAverageRating(this.album);
});

module.exports = mongoose.model('Review', ReviewSchema);
