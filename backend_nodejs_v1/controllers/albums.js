const AlbumModel = require('../models/Album');

// @desc    Get all albums
// @route   GET /api/v1/albums
// @access  private
exports.getAlbums = async(req, res) => {
    const albums = await AlbumModel.find();

    res.status(200).json({ success: true, count: albums.length, data: albums });
}

// @desc    Get album by ID
// @route   GET /api/v1/albums/:id
// @access  private
exports.getAlbumById = async(req, res) => {
    const album = await AlbumModel.findById(req.params.id);

    res.status(200).json({ success: true, data: album });
}

// @desc    Create new album
// @route   POST /api/v1/albums
// @access  private
exports.createAlbum = async(req, res) => {
    const albums = await AlbumModel.create(req.body);

    res.status(201).json({ success: true, msg: 'Album created successfully' });
}

// @desc    Update an album
// @route   PUT /api/v1/albums/:id
// @access  private
exports.updateAlbumById = async(req, res) => {
    const album = await AlbumModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    res.status(200).json({ success: true, msg: `Album with id ${req.params.id} updated successfully`, data: album });
}

// @desc    Delete an album
// @route   DELETE /api/v1/albums/:id
// @access  private
exports.deleteAlbumById = async(req, res) => {
    const album = await AlbumModel.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, msg: `Album with id ${req.params.id} deleted successfully` });
}