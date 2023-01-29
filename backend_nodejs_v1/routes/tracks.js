const express = require('express');

const { getTracks, createTrack, getTrackById, updateTrackById, deleteTrackById, trackAudioUpload } = require('../controllers/tracks');

// use advancedResults middleware with track model
const TrackModel = require('../models/Track');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

// use protect & authorize middleware
const { protect, authorize } = require('../middleware/auth');

/**
 * @openapi
 * tags:
 *   name: Tracks
 *   descriptions: APIs to perform CRUD operations on tracks
 * /api/v1/tracks:
 *   get:
 *     tags:
 *       - Tracks
 *     descriptions: Retrieve a list of all the tracks from the database. The list is paginated and one track is displayed per page.
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Response not found
 * /api/v1/albums/{album_id}/tracks:
 *   post:
 *     tags:
 *       - Tracks
 *     description: Add a track to a selected album in the database.
 *     parameters:
 *       - in: path
 *         name: album_id
 *         required: true
 *         description: Numeric id of the album to which the track is to be added.
 *         schema:
 *           type: string
 *           example: 6361ff4314b08a4853714b69
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Track'
 *     responses:
 *       201:
 *         description: Success
 *       401:
 *         description: User not authorized to access this route
 */
router
    .route('/')
    .get(advancedResults(TrackModel, { path: 'album', select: 'album_name album_url createdAt' }), getTracks)
    .post(protect, authorize('publisher', 'admin'), createTrack);

/**
 * @openapi
 * /api/v1/tracks/{id}:
 *   get:
 *     tags:
 *       - Tracks
 *     description: Get Tracks By ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric id of the track to retrieve
 *         schema:
 *           type: string
 *           example: 63674371637b3b4560a9cb77
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Resource not found
 *   put:
 *     tags:
 *       - Tracks
 *     description: Update tracks by id. User needs to login (under "Authorization") before executing this endpoint.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric id of the track to update
 *         schema:
 *           type: string
 *           example: 63674371637b3b4560a9cb77
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Track'
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Resource not found
 *       401:
 *         description: User not authorized to access this route
 *   delete:
 *     tags:
 *       - Tracks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric id of the track to delete
 *         schema:
 *           type: string
 *           example: 63674371637b3b4560a9cb77
 *     description: Delete tracks by id. User needs to login (under "Authorization") before executing this endpoint.
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Resource not found
 *       401:
 *         description: User not authorized to access this route
*/
router
    .route('/:id')
    .get(getTrackById)
    .put(protect, authorize('publisher', 'admin'), updateTrackById)
    .delete(protect, authorize('publisher', 'admin'), deleteTrackById);

/**
 * @openapi
 * api/v1/albums/{id}/audio:
 *   put:
 *     tags:
 *       - Tracks
 *     description: Upload a music track to a selected album by id. User needs to login (under "Authorization") before executing this endpoint.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric id of the album to which the track is to be uploaded
 *         schema:
 *           type: string
 *           example: 63674371637b3b4560a9cb77
 *       - in: formData
 *         consumes:
 *           - multipart/form-data
 *         name: track_name
 *         required: true
 *         description: The track file to upload
 *         schema:
 *           type: file
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Resource not found
 *       401:
 *         description: User not authorized to access this route
 */
router
    .route('/:id/audio')
    .put(protect, authorize('publisher', 'admin'), trackAudioUpload);

module.exports = router;