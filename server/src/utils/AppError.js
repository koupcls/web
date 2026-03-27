class AppError extends Error {
    constructor(message, errorCode, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AppError;