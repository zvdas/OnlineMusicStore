const express = require('express');

const { getAlbums, getAlbumById, createAlbum, updateAlbumById, deleteAlbumById } = require('../controllers/albums');

// use other resource routers
const trackRouter = require('./tracks');

const router = express.Router();

// re-route to other resource routers
router
    .use('/:albumId/tracks', trackRouter);

router
    .route('/')
    .get(getAlbums)
    .post(createAlbum);

router
    .route('/:id')
    .get(getAlbumById)
    .put(updateAlbumById)
    .delete(deleteAlbumById);


module.exports = router;