const express = require('express');

const { getAlbums, getAlbumById, createAlbum, updateAlbumById, deleteAlbumById } = require('../controllers/albums');

const router = express.Router();

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