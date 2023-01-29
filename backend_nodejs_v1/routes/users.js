const express = require('express');

const {
  getUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById,
} = require('../controllers/users');

const User = require('../models/User');

const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

// use protect & authorize
const { protect, authorize } = require('../middleware/auth');

// all routes below will be protected & authorized
router.use(protect);
router.use(authorize('admin'));

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: APIs to perform CRUD operations on users
 * /api/v1/users:
 *   get:
 *     tags:
 *       - Users
 *     description: Retrieve a list of all the users from the database. The list is paginated and one user is displayed per page.
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Resource not found
 *   post:
 *     tags:
 *       - Users
 *     description: Add a user to the database. User needs to login (under "Authorization") before executing this endpoint.
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Success
 *       401:
 *         description: User not authorized to access this route
 */
router
  .route('/')
  .get(advancedResults(User), getUsers)
  .post(createUser);

/**
 * @openapi
 * /api/v1/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     description: Retrieve a user by id from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the album to retrieve
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
 *       - Users
 *     description: Update users By id. User needs to login (under "Authorization") before executing this endpoint.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric ID of the user to update
 *         schema:
 *           type: string
 *           example: 6361ff4314b08a4853714b68
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Resource not found
 *       401:
 *         description: User not authorized to access this route
 *   delete:
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Numeric id of the user to delete
 *         schema:
 *           type: string
 *           example: 6361ff4314b08a4853714b68
 *     description: Delete users by id. User needs to login (under "Authorization") before executing this endpoint.
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
  .get(getUserById)
  .put(updateUserById)
  .delete(deleteUserById);

module.exports = router;
