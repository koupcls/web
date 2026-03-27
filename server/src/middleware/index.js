const authenticate = require('./authenticate');
const { errorMiddleware, notFoundMiddleware, handleError } = require('./errorMiddleware');
const { authorize, requireAdmin, requireModerator } = require('./authorize');


module.exports = {errorMiddleware, notFoundMiddleware, handleError, authenticate, authorize, requireAdmin, requireModerator};