const authService = require('../services/AuthService');
const { AppError } = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

class AuthController {
    
    register = catchAsync(async (req, res) => {
        const user = await authService.register(req.body);

        console.log("AuthController::: ", user);

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: {
                user
            }
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


    getCurrentUser = catchAsync(async (req, res) => {
        const user = await authService.getCurrentUser(req.user.uuid);

        res.json({
            success: true,
            data: {
                user: user
            }
        });
    });


    
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
}

module.exports = new AuthController();