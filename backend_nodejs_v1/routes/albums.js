const express = require('express');

const {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbumById,
  deleteAlbumById,
  albumPhotoUpload,
} = require('../controllers/albums');

// use other resource routers
const trackRouter = require('./tracks');
const reviewRouter = require('./reviews');

// use advancedResults middleware with album model
const AlbumModel = require('../models/Album');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

// use protect & authorize middleware
const { protect, authorize } = require('../middleware/auth');

// re-route to other resource routers
router
  .use('/:albumId/tracks', trackRouter)
  .use('/:albumId/reviews', reviewRouter);

router
  .route('/')
  .get(
    advancedResults(AlbumModel, {
      path: 'tracks',
      select: 'track_name featuring duration file_size',
    }),
    getAlbums
  )
  .post(protect, authorize('publisher', 'admin'), createAlbum);

router
  .route('/:id')
  .get(getAlbumById)
  .put(protect, authorize('publisher', 'admin'), updateAlbumById)
  .delete(protect, authorize('publisher', 'admin'), deleteAlbumById);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), albumPhotoUpload);

module.exports = router;
