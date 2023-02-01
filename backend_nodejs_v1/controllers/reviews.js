const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const ReviewModel = require('../models/Review');
const AlbumModel = require('../models/Album');

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @route   GET /api/v1/albums/:albumId/reviews
// @access  Public
exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.albumId) {
    const reviews = await ReviewModel.find({ album: req.params.albumId });

    if(req.header('accept')==='*/*') {
      return res
        .status(200)
        .json({
          success: true,
          count: reviews.length,
          data: reviews,
        });
    } else {

    }
  } else {
    if(req.header('accept')==='*/*') {
      res
        .status(200)
        .json(res.advancedResults);
    } else {
      
    }
  }
});

// @desc    Get review by ID
// @route   GET /api/v1/reviews/:id
// @access  Public
exports.getReviewById = asyncHandler(async (req, res, next) => {
  const review = await ReviewModel.findById(req.params.id).populate({
    path: 'album',
    select: 'album_name description',
  });

  if (!review) {
    next(new ErrorResponse(`Review with  id ${req.params.id} not found`, 404));
  }

  if(req.header('accept')==='*/*') {
    res
      .status(200)
      .json({ 
        success: true, 
        data: review 
      });
  } else {

  }
});

// @desc    Create a review
// @route   POST /api/v1/albums/:albumId/reviews
// @access  Private/User
exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.album = req.params.albumId;
  req.body.user = req.user.id;

  const album = await AlbumModel.findById(req.params.albumId);

  if (!album) {
    return next(
      new ErrorResponse(`Album with id '${req.params.albumId}' not found`, 404)
    );
  }

  const review = await ReviewModel.create(req.body);

  if(req.header('accept')==='*/*') {
    res
      .status(201)
      .json({ 
        success: true, 
        msg: 'Review created successfully', 
        data: review 
      });
  } else {

  }
});

// @desc    Update a review
// @route   PUT /api/v1/reviews/:id
// @access  Private/User
exports.updateReviewById = asyncHandler(async (req, res, next) => {
  const review = await ReviewModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!review) {
    next(new ErrorResponse(`Review with  id ${req.params.id} not found`, 404));
  }

  // ensure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== admin) {
    next(
      new ErrorResponse(
        `User with  id ${req.user.id} not authorized to update review`,
        401
      )
    );
  }

  if(req.header('accept')==='*/*') {
    res
      .status(200)
      .json({
        success: true,
        msg: `Review with id ${req.params.id} updated successfully`,
        data: review,
      });
  } else {

  }
});

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private/User
exports.deleteReviewById = asyncHandler(async (req, res, next) => {
  const review = await ReviewModel.findByIdAndDelete(req.params.id);

  if (!review) {
    next(new ErrorResponse(`Review with  id ${req.params.id} not found`, 404));
  }

  // ensure review belongs to user or user is admin
  if (review.user.toString() !== req.user.id && req.user.role !== admin) {
    next(
      new ErrorResponse(
        `User with  id ${req.user.id} not authorized to delete review`,
        401
      )
    );
  }

  if(req.header('accept')==='*/*') {
    res
      .status(200)
      .json({
        success: true,
        msg: `Review with id ${req.params.id} deleted successfully`,
      });
  } else {

  }
});
