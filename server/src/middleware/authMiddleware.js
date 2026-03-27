const { AuthError } = require('@supabase/supabase-js/dist/index.cjs');
const { supabase } = require('../config/supabase');
const AppError = require('../utils/AppError');
const catchAsync  = require('../utils/catchAsync');

// Проверка авторизован ли пользователь
const authMiddleware = catchAsync(async (req, res, next) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
        throw new AppError('No token provided', 401);
    }

    const token = header.split(' ')[1];

    const { data: {user}, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
        throw new AppError('Invalid token', 401);
    }

    const {data, error: profileError } = await supabase.from('users').select('*').eq('uuid', user.id).is('deleted_at', null).single();



    if (profileError || !data) {
        throw new AppError('User profile not found', 404);
    }

    if (!data.is_active) {
        throw new AppError('Profile is deactivated', 403);
    }

    req.user = data;
    res.auth = user;

    if (next != null) next();
})

// Проверка наличия роли у пользователя
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            throw new AppError('You do not have permission to perform this action', 403);
        }
        next();
    };
};

module.exports = {
    authMiddleware,
    checkRole,
};