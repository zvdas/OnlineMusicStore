const express = require('express');

const { getTracks, createTrack, getTrackById, updateTrackById, deleteTrackById, trackAudioUpload } = require('../controllers/tracks');

// use advancedResults middleware with track model
const TrackModel = require('../models/Track');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(advancedResults(TrackModel, { path: 'album', select: 'album_name album_url createdAt' }), getTracks)
    .post(createTrack);

router
    .route('/:id')
    .get(getTrackById)
    .put(updateTrackById)
    .delete(deleteTrackById);

router
    .route('/:id/audio')
    .put(trackAudioUpload);

module.exports = router;