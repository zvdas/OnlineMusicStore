const express = require('express');

const {
  getReviews,
  getReviewById,
  getCreateReview,
  createReview,
  updateReviewById,
  deleteReviewById,
} = require('../controllers/reviews');

const Review = require('../models/Review');

const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

// use protect & authorize
const { protect, authorize } = require('../middleware/auth');

/**
 * @openapi
 * tags:
 *   name: Reviews
 *   description: APIs to perform CRUD operations on reviews
 * /api/v1/reviews:
 *   get:
 *     tags:
 *       - Reviews
 *     description: Retrieve a list of all the reviews from the database. The list is paginated and one album is displayed per page.
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Resource not found
 * /api/v1/albums/{album_id}/reviews:
 *   post:
 *     tags:
 *       - Reviews
 *     description: Add a review to a selected album in the database.
 *     parameters:
 *       - in: path
 *         name: album_id
 *         required: true
 *         description: Numeric id of the album to which the review is to be added.
 *         schema:
 *           type: string
 *           example: 6361ff4314b08a4853714b69
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Success
 *       401:
 *         description: User not authorized to access this route
 */
router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'album',
      select: 'album_name description',
    }),
    getReviews
  )
  .post(protect, authorize('user', 'admin'), createReview);

router
  .route('/newreview')
  .get(protect, authorize('user', 'admin'), getCreateReview);

/**
 * @openapi
 * /api/v1/reviews/{id}:
 *   get:
 *     tags:
 *       - Reviews
 *     description: Get reviews by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric id of the review to retrieve
 *         schema:
 *           type: string
 *           example: 6391f2da06b0ab9e53864436
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Resource not found
 *   put:
 *     tags:
 *       - Reviews
 *     description: Update reviews by id. User needs to login (under "Authorization") before executing this endpoint.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric id of the review to update
 *         schema:
 *           type: string
 *           example: 6391f2da06b0ab9e53864436
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Resource not found
 *       401:
 *         description: User not authorized to access this route
 *   delete:
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric id of the review to delete
 *         schema:
 *           type: string
 *           example: 6391f2da06b0ab9e53864436
 *     description: Delete reviews by id. User needs to login (under "Authorization") before executing this endpoint.
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
  .get(getReviewById)
  .put(protect, authorize('user', 'admin'), updateReviewById)
  .delete(protect, authorize('user', 'admin'), deleteReviewById);

module.exports = router;
