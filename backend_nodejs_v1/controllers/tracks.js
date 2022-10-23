const TrackModel = require('../models/Track');

// @desc    Get all tracks
// @route   GET /api/v1/tracks
// @access  Public
exports.getTracks = async(req, res) => {
    const tracks = await TrackModel.find();

    res.status(200).json({ success: true, count: tracks.length, data: tracks });
}

// @desc    Get track by ID
// @route   GET /api/v1/tracks/:id
// @access  Public
exports.getTrackById = async(req, res) => {
    const track = await TrackModel.findById(req.params.id);

    res.status(200).json({ success: true, data: track });
}

// @desc    Create new track
// @route   POST /api/v1/tracks
// @access  Private
exports.createTrack = async(req, res) => {
    const track = await TrackModel.create(req.body);

    res.status(201).json({ success: true, msg: 'Track created successfully' });
}

// @desc    Update track by ID
// @route   PUT /api/v1/tracks/:id
// @access  Private
exports.updateTrackById = async(req, res) => {
    const track = await TrackModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({ success: true, msg: `Track with id ${req.params.id} updated successfully`, data: track });
}

// @desc    Delete track by ID
// @route   DELETE /api/v1/tracks/:id
// @access  Private
exports.deleteTrackById = async(req, res) => {
    const track = await TrackModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, msg: `Track with id ${req.params.id} deleted successfully` });
}