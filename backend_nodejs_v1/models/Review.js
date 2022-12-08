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

module.exports = mongoose.model('Review', ReviewSchema);
