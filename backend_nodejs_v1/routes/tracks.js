const express = require('express');

const { getTracks, createTrack, getTrackById, updateTrackById, deleteTrackById } = require('../controllers/tracks');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(getTracks)
    .post(createTrack);

router
    .route('/:id')
    .get(getTrackById)
    .put(updateTrackById)
    .delete(deleteTrackById)

module.exports = router;