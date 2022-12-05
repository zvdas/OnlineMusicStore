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

router.route('/').get(advancedResults(User), getUsers).post(createUser);

router
  .route('/:id')
  .get(getUserById)
  .put(updateUserById)
  .delete(deleteUserById);

module.exports = router;
