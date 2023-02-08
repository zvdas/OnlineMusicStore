const express = require('express');

const {
  getAlbums,
  getAlbumById,
  getCreateAlbum,
  createAlbum,
  updateAlbumById,
  deleteAlbumById,
  albumPhotoUpload,
} = require('../controllers/albums');

// use other resource routers
const trackRouter = require('./tracks');
const userRouter = require('./users');
const reviewRouter = require('./reviews');

// use advancedResults middleware with album model
const AlbumModel = require('../models/Album');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

// use protect & authorize middleware
const { protect, authorize } = require('../middleware/auth');
const fileUpload = require('express-fileupload');

// re-route to other resource routers
router
  .use('/:albumId/tracks', trackRouter)
  .use('/:albumId/users', userRouter)
  .use('/:albumId/reviews', reviewRouter);

/**
 * @openapi
 * tags:
 *   name: Albums
 *   description: APIs to perform CRUD operations on albums
 * /api/v1/albums:
 *   get:
 *     tags:
 *       - Albums
 *     description: Retrieve a list of all the albums from the database. The list is paginated and one album is displayed per page.
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Resource not found
 *   post:
 *     tags:
 *       - Albums
 *     description: Add an album to the database.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Album'
 *     responses:
 *       201:
 *         description: Success
 *       401:
 *         description: User not authorized to access this route
*/
router
  .route('/')
  .get(
    advancedResults(AlbumModel, [
      {
        path: 'tracks',
        select: 'track_name featuring duration file_size track_file',
      },
      'reviews',
      'user'
    ]),
    getAlbums)
    .post(protect, authorize('publisher', 'admin'), createAlbum);

router
  .route('/newalbum')
  .get(protect, authorize('publisher', 'admin'), getCreateAlbum);

/**
 * @openapi
 * /api/v1/albums/{id}:
 *   get:
 *     tags:
 *       - Albums
 *     description: Get Albums By ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric id of the album to retrieve
 *         schema:
 *           type: string
 *           example: 6361ff4314b08a4853714b68
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Resource not found
 *   put:
 *     tags:
 *       - Albums
 *     description: Update albums by id. User needs to login (under "Authorization") before executing this endpoint.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric id of the album to update
 *         schema:
 *           type: string
 *           example: 6361ff4314b08a4853714b68
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Album'
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Resource not found
 *       401:
 *         description: User not authorized to access this route
 *   delete:
 *     tags:
 *       - Albums
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric id of the album to delete
 *         schema:
 *           type: string
 *           example: 6361ff4314b08a4853714b68
 *     description: Delete albums by id. User needs to login (under "Authorization") before executing this endpoint.
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
  .get(getAlbumById)
  .put(protect, authorize('publisher', 'admin'), updateAlbumById)
  .delete(protect, authorize('publisher', 'admin'), deleteAlbumById);

/**
 * @openapi
 * /api/v1/albums/{id}/photo:
 *   put:
 *     tags:
 *       - Albums
 *     description: Upload a Cover Photo for the Albums By ID. User needs to login (under "Authorization") before executing this endpoint.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric id of the album for which cover photo is to be uploaded
 *         schema:
 *           type: string
 *           example: 6361ff4314b08a4853714b68
 *     requestBody:
 *       required: true     
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Resource not found
 *       401:
 *         description: User not authorized to access this route
 */
router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), albumPhotoUpload);

module.exports = router;