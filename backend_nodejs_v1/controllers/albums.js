const AlbumModel = require('../models/Album');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all albums
// @route   GET /api/v1/albums
// @access  Public
exports.getAlbums = asyncHandler(async(req, res, next) => {
    const albums = await AlbumModel.find();

    res
        .status(200)
        .json({ 
            success: true, 
            count: albums.length, 
            data: albums 
        });
});

// @desc    Get album by ID
// @route   GET /api/v1/albums/:id
// @access  Public
exports.getAlbumById = asyncHandler(async(req, res, next) => {
    const album = await AlbumModel.findById(req.params.id);

    // error for correctly formatted id not present in database
    if(!album) {
        return next(new ErrorResponse(`Album with id '${req.params.id}' not found`, 404));
    }

    res
        .status(200)
        .json({ 
            success: true, 
            data: album 
        });    
});

// @desc    Create new album
// @route   POST /api/v1/albums
// @access  Private
exports.createAlbum = asyncHandler(async(req, res, next) => {
    const albums = await AlbumModel.create(req.body);

    res
        .status(201)
        .json({ 
            success: true, 
            msg: 'Album created successfully' 
        });    
});

// @desc    Update an album
// @route   PUT /api/v1/albums/:id
// @access  Private
exports.updateAlbumById = asyncHandler(async(req, res, next) => {
    const album = await AlbumModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    // error for correctly formatted id not present in database
    if(!album) {
        return next(new ErrorResponse(`Album with id '${req.params.id}' not found`, 404));
    }

    res
        .status(200)
        .json({ 
            success: true, 
            msg: `Album with id '${req.params.id}' updated successfully`, 
            data: album 
            });    
});

// @desc    Delete an album
// @route   DELETE /api/v1/albums/:id
// @access  Private
exports.deleteAlbumById = asyncHandler(async(req, res, next) => {
    const album = await AlbumModel.findByIdAndDelete(req.params.id);

    // error for correctly formatted id not present in database
    if(!album) {
        return next(new ErrorResponse(`Album with id '${req.params.id}' not found`, 404));
    }

    res
        .status(200)
        .json({ 
            success: true, 
            msg: `Album with id '${req.params.id}' deleted successfully` 
        });    
});