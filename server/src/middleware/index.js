const { authMiddleware } = require('./authMiddleware');
const { errorMiddleware, notFoundMiddleware, handleError } = require('./errorMiddleware');


module.exports = {errorMiddleware, notFoundMiddleware, handleError, authMiddleware};