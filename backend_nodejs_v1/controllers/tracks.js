const fs = require('fs');
const path = require('path');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const TrackModel = require('../models/Track');
const AlbumModel = require('../models/Album');

// @desc    Get all tracks
// @route   GET /api/v1/tracks
// @route   GET /api/v1/albums/:albumId/tracks
// @access  Public
exports.getTracks = asyncHandler(async (req, res, next) => {
  if (req.params.albumId) {
    // get all tracks for a particular album (by album id)
    const tracks = await TrackModel.find({ album: req.params.albumId });

    if(req.header('accept')==='*/*') {
      res
        .status(200)
        .json({
          success: true,
          count: tracks.length,
          data: tracks,
        });
    } else {
      res
        .status(200)
        .render('tracks', { album_id: req.params.albumId, tracks, user: req.cookies.user });
    }
  } else {
    if(req.header('accept')==='*/*') {
      res
        .status(200)
        .json(res.advancedResults);
    } else {
      res
        .status(200)
        .render('tracks', { tracks: res.advancedResults, user: req.cookies.user });
    }
  }
});

// @desc    Get track by ID
// @route   GET /api/v1/tracks/:id
// @access  Public
exports.getTrackById = asyncHandler(async (req, res, next) => {
  const track = await TrackModel.findById(req.params.id).populate({
    path: 'album',
    select: 'album_name album_url createdAt album_slug artist_slug',
  });

  // error for correctly formatted id not present in database
  if (!track) {
    return next(
      new ErrorResponse(`Track with id '${req.params.id}' not found`, 404)
    );
  }

  if(req.header('accept')==='*/*') {
    res
      .status(200)
      .json({
        success: true,
        data: track,
      });
  } else {
    res
      .status(200)
      .render('track-detail', { msg: '', track, user: req.cookies.user });
  }
});

// @desc    Get create new track page
// @route   GET /api/v1/albums/:albumId/tracks/newtrack
// @access  Private
exports.getCreateTrack = asyncHandler(async (req, res, next) => {
  const album_id = req.params.albumId;

  res
    .status(200)
    .render('track-detail', {
      msg: '',
      track: {},
      album_id,
      albums: req.cookies.albums,
      user: req.cookies.user
    });
});

// @desc    Create new track
// @route   POST /api/v1/albums/:albumId/tracks
// @access  Private
exports.createTrack = asyncHandler(async (req, res, next) => {
  // set the 'album' field in TrackSchema & request body to the request albumId of params
  req.body.album = req.params.albumId;

  // add user to the request body
  req.body.user = req.user.id;

  const album = await AlbumModel.findById(req.params.albumId);

  if (!album) {
    return next(
      new ErrorResponse(`Album with id ${req.params.albumId} not found`, 404)
    );
  }

  // ensure the user is the album owner or admin
  if (album.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with ID '${req.user.id}' is not authorized to add tracks to album with ID '${album._id}'`,
        401
      )
    );
  }

  const track = await TrackModel.create(req.body);

  if(req.header('accept')==='*/*') {
    res
      .status(201)
      .json({
        success: true,
        msg: 'Track created successfully',
      });
  } else {
    res
      .status(201)
      .render('track-detail', { 
        msg: 'Track created successfully',
        track, 
        user: req.cookies.user 
      });
  }
});

// @desc    Update track by ID
// @route   PUT /api/v1/tracks/:id
// @access  Private
exports.updateTrackById = asyncHandler(async (req, res, next) => {
  let track = await TrackModel.findById(req.params.id);

  // error for correctly formatted id not present in database
  if (!track) {
    return next(
      new ErrorResponse(`Track with id '${req.params.id}' not found`, 404)
    );
  }

  // ensure user is track owner or admin
  if (track.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with ID '${req.user.id}' is not authorized to update this track`,
        401
      )
    );
  }

  track = await TrackModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if(req.header('accept')==='*/*') {
    res
      .status(200)
      .json({
        success: true,
        msg: `Track with id ${req.params.id} updated successfully`,
        data: track,
      });
  } else {
    res
      .status(200)
      .render('track-detail', {
        msg: `Track with id ${req.params.id} updated successfully`,
        track, 
        user: req.cookies.user
      });
  }
});

// @desc    Delete track by ID
// @route   DELETE /api/v1/tracks/:id
// @access  Private
exports.deleteTrackById = asyncHandler(async (req, res, next) => {
  let track = await TrackModel.findById(req.params.id);

  // error for correctly formatted id not present in database
  if (!track) {
    return next(
      new ErrorResponse(`Track with id '${req.params.id}' not found`, 404)
    );
  }

  // ensure user is track owner or admin
  if (track.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with ID '${req.user.id}' is not authorized to delete this track`,
        401
      )
    );
  }

  await track.remove();

  if(req.header('accept')==='*/*') {
    res
      .status(200)
      .json({
        success: true,
        msg: `Track with id ${req.params.id} deleted successfully`,
      });
  } else {
    res
      .status(200)
      .redirect('/api/v1/tracks');
  }
});

// @desc    Upload an audio track for a track
// @route   PUT /api/v1/tracks/:id/audio
// @access  Private
exports.trackAudioUpload = asyncHandler(async (req, res, next) => {
  const track = await TrackModel.findById(req.params.id).populate('album');

  // error for correctly formatted id not present in database
  if (!track) {
    return next(
      new ErrorResponse(`Track with id '${req.params.id}' not found`, 404)
    );
  }

  // ensure user is track owner or admin
  if (track.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with ID '${req.user.id}' is not authorized to upload a file for this track`,
        401
      )
    );
  }

  if (!req.files) {
    return next(new ErrorResponse(`Kindly upload a file`, 400));
  }

  const file = req.files.audio;

  // ensure the file is audio type
  if (!file.mimetype.includes('audio')) {
    return next(new ErrorResponse(`Kindly upload an audio file`, 400));
  }

  let max_track_size =
    process.env.MAX_TRACK_UPLOAD.split('*')[0] *
    process.env.MAX_TRACK_UPLOAD.split('*')[1] *
    process.env.MAX_TRACK_UPLOAD.split('*')[2];
  let mbs =
    process.env.MAX_TRACK_UPLOAD.split('*')[1] *
    process.env.MAX_TRACK_UPLOAD.split('*')[2];

  // check file size (should be less than MAX_TRACK_UPLOAD in config.env)
  if (file.size > max_track_size) {
    return next(
      new ErrorResponse(
        `The uploaded track exceeds ${
          max_track_size / mbs
        }MB. Kindly upload a smaller image.`,
        400
      )
    );
  }

  // create custom filename
  file.name = `${track.album.artist_slug}_-_${track.track_slug}${
    path.parse(file.name).ext
  }`;

  // create folder with artist-album name if it doesn't exist
  const folder_path = `${process.env.PHOTO_UPLOAD_PATH}/${track.album.artist_slug}-${track.album.album_slug}`;

  if (!fs.existsSync(folder_path)) {
    fs.mkdir(`${folder_path}`, async (err) => {
      if (err) {
        return next(
          new ErrorResponse(`Problem with folder creation. ${err}`, 500)
        );
      }
    });
  }

  // convert the file to buffer string and send to database
  // const audio_base64 = req.files.audio.data.toString('base64');

  // upload the file
  file.mv(`${folder_path}/${file.name}`, async (err) => {
    if (err) {
      return next(new ErrorResponse(`Problem with file upload. ${err}`, 500));
    }

    await TrackModel.findByIdAndUpdate(req.params.id, {
      track_file: file.name,
      // track_data: audio_base64,
    });

    if(req.header('accept')==='*/*') {
      res
        .status(200)
        .json({
          success: true,
          msg: `Track uploaded to track with id '${req.params.id}' successfully`,
          data: file.name,
        });
    } else {
      res
        .status(200)
        .render('track-detail', {
          msg: `Track uploaded to track with id '${req.params.id}' successfully`,
          track, 
          user: req.cookies.user
        });      
    }
  });
});
