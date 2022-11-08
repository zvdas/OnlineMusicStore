const path = require('path');
const AlbumModel = require('../models/Album');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all albums
// @route   GET /api/v1/albums
// @access  Public
exports.getAlbums = asyncHandler(async(req, res, next) => {
    let query;

    // copy req.query
    const reqQuery = { ...req.query };

    // fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    // loop over removeFields and remove them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // create query string
    let queryStr = JSON.stringify(req.query);

    // create query operators ($gt, $gte, etc...)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // const albums = await AlbumModel.find();

    // finding resource
    query = AlbumModel.find(JSON.parse(queryStr)).populate({ path: 'tracks', select: 'track_name featuring duration file_size' });
    
    // select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    
    // sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        // default sort by createdAt field if no sort specified
        query = query.sort('-createdAt');
    }

    // pagination
        // parse the page number from query (which is a string) to a number of base 10
        // if no page number is specified, set default as 1
    const page = parseInt(req.query.page, 10) || 1;
        // if no limit is specified, set default as 1 resource per page
    const limit = parseInt(req.query.limit, 10) || 1;
        // skip some resources (start index from)
    const startIndex = (page - 1) * limit;
        // end index at
    const endIndex = page * limit;
        // total resources
    const total = await AlbumModel.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // executing query
    const albums = await query;

    // pagination result
    const pagination = {};

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1
        }
    }

    pagination.curr = {
        page
    }

    if (endIndex < total) {
        pagination.next = {
            page: page + 1
        }
    }

    res
        .status(200)
        .json({ 
            success: true, 
            count: albums.length, 
            pagination,
            total,
            limit,
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
            // data: albums,
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
    const album = await AlbumModel.findById(req.params.id);

    // error for correctly formatted id not present in database
    if(!album) {
        return next(new ErrorResponse(`Album with id '${req.params.id}' not found`, 404));
    }

    album.remove();

    res
        .status(200)
        .json({ 
            success: true, 
            msg: `Album with id '${req.params.id}' deleted successfully` 
        });    
});

// @desc    Upload a cover photo for album
// @route   PUT /api/v1/albums/:id/photo
// @access  Private
exports.albumPhotoUpload = asyncHandler(async(req, res, next) => {
    const album = await AlbumModel.findById(req.params.id);

    // error for correctly formatted id not present in database
    if(!album) {
        return next(new ErrorResponse(`Album with id '${req.params.id}' not found`, 404));
    }

    if(!req.files) {
        return next(new ErrorResponse(`Kindly upload a file`, 400));
    }

    const file = req.files.photo;

    // ensure the image is a photo
    if(!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse(`Kindly upload an image file`, 400));
    }
    
    let max_photo_size = process.env.MAX_PHOTO_UPLOAD.split('*')[0] * process.env.MAX_PHOTO_UPLOAD.split('*')[1] * process.env.MAX_PHOTO_UPLOAD.split('*')[2];
    let mbs = process.env.MAX_PHOTO_UPLOAD.split('*')[1] * process.env.MAX_PHOTO_UPLOAD.split('*')[2];

    // check file size (should be less than MAX_PHOTO_UPLOAD in config.env)
    if(file.size > max_photo_size) {
        return next(new ErrorResponse(`The uploaded image exceeds ${max_photo_size/mbs}MB. Kindly upload a smaller image.`, 400));
    }

    // create custom filename
    file.name = `cover_photo_${album.slug}${path.parse(file.name).ext}`;

    // upload the file
    file.mv(`${process.env.PHOTO_UPLOAD_PATH}/${file.name}`, async err => {
        if(err) {
            return next(new ErrorResponse(`Problem with file upload. ${err}`, 500));
        }

        await AlbumModel.findByIdAndUpdate(req.params.id, { cover_photo: file.name })
        
        res
            .status(200)
            .json({ 
                success: true, 
                msg: `Cover photo uploaded to album with id '${req.params.id}' successfully`,
                data: file.name
            });    
    })
});