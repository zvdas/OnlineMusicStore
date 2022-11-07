const TrackModel = require('../models/Track');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all tracks
// @route   GET /api/v1/tracks
// @route   GET /api/v1/albums/:albumId/tracks
// @access  Public
exports.getTracks = asyncHandler(async(req, res, next) => {
    let query;

    if (req.params.albumId) {
        // get all tracks for a particular album (by album id)
        query = TrackModel.find({ album: req.params.albumId });
    } else {
        query = TrackModel.find().populate({ path: 'album', select: 'album_name album_url createdAt' });
    }

    const tracks = await query;

    res
        .status(200)
        .json({ 
            success: true, 
            count: tracks.length, 
            data: tracks 
        });
});

// @desc    Get track by ID
// @route   GET /api/v1/tracks/:id
// @access  Public
exports.getTrackById = asyncHandler(async(req, res, next) => {
    const track = await TrackModel.findById(req.params.id);

    // error for correctly formatted id not present in database
    if(!track) {
        return next(new ErrorResponse(`Track with id '${req.params.id}' not found`, 404));
    }

    res
        .status(200)
        .json({ 
            success: true, 
            data: track 
        });
});

// @desc    Create new track
// @route   POST /api/v1/tracks
// @access  Private
exports.createTrack = asyncHandler(async(req, res, next) => {
    const track = await TrackModel.create(req.body);

    res
        .status(201)
        .json({ 
            success: true, 
            msg: 'Track created successfully' 
        });
});

// @desc    Update track by ID
// @route   PUT /api/v1/tracks/:id
// @access  Private
exports.updateTrackById = asyncHandler(async(req, res, next) => {
    const track = await TrackModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    // error for correctly formatted id not present in database
    if(!track) {
        return next(new ErrorResponse(`Track with id '${req.params.id}' not found`, 404));
    }

    res
        .status(200)
        .json({ 
            success: true, 
            msg: `Track with id ${req.params.id} updated successfully`, data: track 
        });
});

// @desc    Delete track by ID
// @route   DELETE /api/v1/tracks/:id
// @access  Private
exports.deleteTrackById = asyncHandler(async(req, res, next) => {
    const track = await TrackModel.findByIdAndDelete(req.params.id);

    // error for correctly formatted id not present in database
    if(!track) {
        return next(new ErrorResponse(`Track with id '${req.params.id}' not found`, 404));
    }

    res
        .status(200)
        .json({ 
            success: true, 
            msg: `Track with id ${req.params.id} deleted successfully` 
        });
});