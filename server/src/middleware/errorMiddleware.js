const AppError = require('../utils/AppError');

const handleError = (err, res) => {
    console.log("Error: ", err);

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        statusCode: err.statusCode
    });
}

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'error';

    return handleError(err, res);
}

const notFoundMiddleware = (req, res, next) => {
    const err = new AppError(`Route ${req.originalUrl} not found`, 404);
    next(err);
};

module.exports = {handleError, errorMiddleware, notFoundMiddleware};