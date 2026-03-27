const AppError = require('../utils/AppError');

const authorize = (allowedRoles) => {
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    const roleField = 'role';

    return (req, res, next) => {
        if (!req.user) {
            return next(new AppError('Authentication required', 'not_authenticated', 401));
        }

        const userRole = req.user[roleField];

        if (!roles.includes(userRole)) {
            console.warn(`Access denied: user ${req.user.uuid} has role "${userRole}", required: ${roles.join(', ')}`);
            
            throw new AppError('Insufficient permissions', 'permission_denied', 403);
        }
        
        next();
    };
};

const requireAdmin = authorize('admin');
const requireModerator = authorize(['admin', 'moderator']);

module.exports = {
    authorize,
    requireAdmin,
    requireModerator
};