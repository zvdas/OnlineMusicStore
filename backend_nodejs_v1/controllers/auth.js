const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const UserModel = require('../models/User');

// get token from model, create cookie & send response
const sendTokenResponse = (user, statusCode, res, msg) => {
    // create token
    const token = user.getSignedJwtToken();

    // create cookie
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 60 * 60 * 1000),
        httpOnly: true
    };

    // set secure protocol (https) for cookie in production
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            msg,
            token
        });
}

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

    sendTokenResponse(user, 200, res, 'User registered successfully');
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body;

    // validate email & password
    if (!email || !password) {
        return next(new ErrorResponse('Please provide a valid email & password', 400));
    }
    
    // check for user
    const user = await UserModel.findOne({ email }).select('+password');
    
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    // check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    sendTokenResponse(user, 200, res, 'User logged in successfully');
});

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await UserModel.findById(req.user.id);
    
    res
        .status(200)
        .json({
            success: true,
            data: user
        })
});