const express = require('express');

const {
  getReviews,
  getReviewById,
  createReview,
  updateReviewById,
  deleteReviewById,
} = require('../controllers/reviews');

const Review = require('../models/Review');

const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

// use protect & authorize
const { protect, authorize } = require('../middleware/auth');

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'album',
      select: 'album_name description',
    }),
    getReviews
  )
  .post(protect, authorize('user', 'admin'), createReview);

router
  .route('/:id')
  .get(getReviewById)
  .put(protect, authorize('user', 'admin'), updateReviewById)
  .delete(protect, authorize('user', 'admin'), deleteReviewById);

module.exports = router;
