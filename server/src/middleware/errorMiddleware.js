const AppError = require('../utils/AppError');

const handleError = (err, res) => {
    console.log("Error: ", err);

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
        status_code: err.statusCode,
        error_code: err.code
    });
}

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || 'error';
    err.code = err.errorCode || 'error';

    return handleError(err, res);
}

const notFoundMiddleware = (req, res, next) => {
    const err = new AppError(`Route ${req.originalUrl} not found`, 404);
    next(err);
};

module.exports = {handleError, errorMiddleware, notFoundMiddleware};