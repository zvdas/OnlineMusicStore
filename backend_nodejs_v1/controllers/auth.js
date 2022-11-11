const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const UserModel = require('../models/User');

// @desc    Register a user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async(req, res, next) => {
    const { name, email, password, role } = req.body;

    // create user
    const user = await UserModel.create({
        name,
        email,
        password,
        role
    })

    // create token
    const token = user.getSignedJwtToken();

    res
        .status(200)
        .json({
            success: true,
            msg: `User registered successfully`,
            token
        });
});