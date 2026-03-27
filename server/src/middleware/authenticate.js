const {supabase} = require('../config/supabase');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

const authenticate = catchAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        throw new AppError('Authentication required. Provide Bearer token', 'missing_access_token', 401);
    }

    const token = authHeader.split(' ')[1];

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authUser) {
        throw new AppError('Invalid or expired token', 'invalid_token', 401);
    }

    const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('uuid', authUser.id)
        .is('deleted_at', 'null')
        .maybeSingle();

    if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw new AppError('Failed to load user profile', 'fetch_error', 500);
    }

    if (!userProfile) {
        throw new AppError('User profile not found or deleted', 'not_found', 404);
    }

    req.auth = authUser;
    req.user = userProfile;

    next();
});

module.exports = authenticate;