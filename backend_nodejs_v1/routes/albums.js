const express = require('express');

const { getAlbums, getAlbumById, createAlbum, updateAlbumById, deleteAlbumById, albumPhotoUpload } = require('../controllers/albums');

// use other resource routers
const trackRouter = require('./tracks');

// use advancedResults middleware with album model
const AlbumModel = require('../models/Album');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

// re-route to other resource routers
router
    .use('/:albumId/tracks', trackRouter);

router
    .route('/')
    .get(advancedResults(AlbumModel, { path: 'tracks', select: 'track_name featuring duration file_size'}), getAlbums)
    .post(createAlbum);

router
    .route('/:id')
    .get(getAlbumById)
    .put(updateAlbumById)
    .delete(deleteAlbumById);

router
    .route('/:id/photo')
    .put(albumPhotoUpload);

module.exports = router;