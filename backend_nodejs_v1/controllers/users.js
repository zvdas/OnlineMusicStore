const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const UserModel = require('../models/User');

// @desc    Get all users
// @route   GET /api/v1/auth/users
// @access  Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  if(req.header('accept')==='*/*') {
    res
      .status(200)
      .json(res.advancedResults);
  } else {
    res
      .status(200)
      .render('users', {results: res.advancedResults, user: req.cookies.user});
  }
});

// @desc    Get user by ID
// @route   GET /api/v1/auth/users/:id
// @access  Private/Admin
exports.getUserById = asyncHandler(async (req, res, next) => {
  const result = await UserModel.findById(req.params.id);

  if (!result) {
    next(new ErrorResponse(`User with  id ${req.params.id} not found`, 404));
  }

  if(req.header('accept')==='*/*') {
    res
      .status(200)
      .json({ 
        success: true, 
        data: result 
      });
  } else {
    res
      .status(200)
      .render('user-detail', { result, user: req.cookies.user });
  }
});

// @desc    Create a user
// @route   POST /api/v1/auth/users
// @access  Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await UserModel.create(req.body);

  if(req.header('accept')==='*/*') {
    res
      .status(201)
      .json({ 
        success: true, 
        msg: 'User created successfully', 
        data: user 
      });
  } else {
    res
      .status(201)
      .render('user-detail', { 
        msg: 'User created successfully', 
        result, 
        user: req.cookies.user 
      });
  }
});

// @desc    Update a user
// @route   PUT /api/v1/auth/users/:id
// @access  Private/Admin
exports.updateUserById = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    next(new ErrorResponse(`User with  id ${req.params.id} not found`, 404));
  }

  if(req.header('accept')==='*/*') {
    res
      .status(200)
      .json({
        success: true,
        msg: `User with id ${req.params.id} updated successfully`,
        data: user,
      });
    } else {
      res
      .status(200)
      .render('user-detail', {
        msg: `User with id ${req.params.id} updated successfully`,
        result, 
        user: req.cookies.user 
      });
  }
});

// @desc    Delete a user
// @route   DELETE /api/v1/auth/users/:id
// @access  Private/Admin
exports.deleteUserById = asyncHandler(async (req, res, next) => {
  const user = await UserModel.findByIdAndDelete(req.params.id);

  if (!user) {
    next(new ErrorResponse(`User with  id ${req.params.id} not found`, 404));
  }

  if(req.header('accept')==='*/*') {
    res
      .status(200)
      .json({
        success: true,
        msg: `User with id ${req.params.id} deleted successfully`,
      });
  } else {
    res
      .status(200)
      .redirect('/api/v1/users');
  }
});
