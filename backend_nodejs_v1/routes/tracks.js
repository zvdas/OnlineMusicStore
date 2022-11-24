const express = require('express');

const { getTracks, createTrack, getTrackById, updateTrackById, deleteTrackById, trackAudioUpload } = require('../controllers/tracks');

// use advancedResults middleware with track model
const TrackModel = require('../models/Track');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

// use protect & authorize middleware
const { protect, authorize } = require('../middleware/auth');

router
    .route('/')
    .get(advancedResults(TrackModel, { path: 'album', select: 'album_name album_url createdAt' }), getTracks)
    .post(protect, authorize('publisher', 'admin'), createTrack);

router
    .route('/:id')
    .get(getTrackById)
    .put(protect, authorize('publisher', 'admin'), updateTrackById)
    .delete(protect, authorize('publisher', 'admin'), deleteTrackById);

router
    .route('/:id/audio')
    .put(protect, authorize('publisher', 'admin'), trackAudioUpload);

module.exports = router;