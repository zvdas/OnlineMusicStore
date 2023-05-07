const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponse = require('../utils/errorResponse');
const UserModel = require('../models/User');

// protect routes
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // get the token from request headers
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
        // get the token from cookie
        token = req.cookies.token;
    }

    // ensure the token exists
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    try {
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // get the currently logged in user
        req.user = await UserModel.findById(decoded.id);

        next();
    } catch (error) {
        return next(new ErrorResponse(`Error: ${error}`, 401));
    }
})

// grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User with role '${req.user.role}' is not authorized to access this route`, 401));
        }
        next();
    }
};