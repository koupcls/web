const authService = require('../services/AuthService');
const { AppError } = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

class AuthController {
    
    register = catchAsync(async (req, res) => {
        const email = await authService.register(req.body);

        res.status(201).json({
            success: true,
            message: 'Registration successful. Waiting otp verification.',
            data: {
                email
            }
        });
    });

    verifyOtpToken = catchAsync(async (req, res) => {
        const {user,session} = await authService.verifyOtpToken(req.body);

        res.status(201).json({
            success: true,
            message: 'Token verified',
            data: {
                session,
                user
            }
        });
    })

    resendConfirmationEmail = catchAsync(async (req, res) => {
        const {} = await authService.resendConfirmationEmail(req.body);

        res.status(201).json({
            success: true
        });
    })

    refresh = catchAsync(async (req, res) => {
        const { refresh_token } = req.body;

        const tokens = await authService.refreshAccessToken(refresh_token);

        res.json({
            success: true,
            message: 'Tokens refreshed successfully',
            tokens
        });
    });

    login = catchAsync(async (req, res) => {
        const {user, session} = await authService.login(req.body);

        res.status(201).json({
            success: true,
            message: 'Login successful',
            data: {
                user,
                session
            }
        });
    });


    logout = catchAsync(async (req, res) => {
        const token = req.headers.authorization?.split(' ')[1];
        await authService.logout(token);
        
        res.json({
            success: true,
            message: 'Logout successful'
        });
    })


    getUser = catchAsync(async (req, res) => {
        const user = await authService.getUser(req.user.uuid);

        res.json({
            success: true,
            data: {
                user: user
            }
        });
    });

    getAllUsers =  catchAsync(async (req, res) => {
        const data = await authService.getAllUsers();

        res.json({
            success: true,
            data
        });
    })


    
    updateProfile = catchAsync(async (req, res) => {
        const user = await authService.updateProfile(req.user.uuid, req.body);
        
        res.json({
            success: true,
            message: 'Profile updated',
            data: { 
                user: user 
            }
        });
    });

    deleteProfile = catchAsync(async (req, res) => {
        const token = req.headers.authorization?.split(' ')[1];
        const {} = await authService.deleteProfile(req.user.uuid, token, false);

        res.json({
            success: true,
            message: 'Profile deleted'
        })
    })

    hardDeleteProfile = catchAsync(async (req, res) => {
        const token = req.headers.authorization?.split(' ')[1];
        const {} = await authService.deleteProfile(req.body.target_user.uuid, token, true);

        res.json({
            success: true,
            message: 'Profile deleted'
        })
    })
}

module.exports = new AuthController();