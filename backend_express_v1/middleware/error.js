const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
    let error = { ...err };

    error.message = err.message;

    // log to console for dev
    console.log(err);

    // Mongoose bad ObjectId Error
    if(err.name === 'CastError') {
        const message = `Resource with id '${err.value}' not found`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key error
    if(err.code === 11000) {
        const message = `Resource with same ${Object.keys(err.keyValue)} already exists` ;
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if(err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    if(req.header('accept')==='*/*') {
        res
            .status(error.statusCode || 500)
            .json({
                success: false,
                error: error.message || 'Internal Server Error'
            });
    } else {
        res
            .status(error.statusCode || 500)
            .render('error', {
                success: false,
                error: error.message || 'Internal Server Error'
            });
    }
}

module.exports = errorHandler;