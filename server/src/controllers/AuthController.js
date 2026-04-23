const authService = require('../services/AuthService');
const catchAsync = require('../utils/catchAsync');

class AuthController {
    
    register = catchAsync(async (req, res) => {
        const {email} = await authService.register(req.body);

        console.log("0");

        res.status(201).json({
            success: true,
            message: 'Успешная регистрациая. Ожидание подверждения OTP кода',
            data: {
                email
            }
        });
    });

    verifyOtpCode = catchAsync(async (req, res) => {

        console.log("verif");
        console.log(req.body);

        const {user,session} = await authService.verifyOtpCode(req.body);

        res.status(201).json({
            success: true,
            message: 'Код подтверждён',
            data: {
                session,
                user
            }
        });
    })

    resendConfirmationEmail = catchAsync(async (req, res) => {
        const {} = await authService.resendConfirmationEmail(req.params.email);

        res.status(201).json({
            success: true
        });
    })

    refresh = catchAsync(async (req, res) => {
        const { refresh_token } = req.body;

        const tokens = await authService.refreshAccessToken(refresh_token);

        res.json({
            success: true,
            message: 'Токен успешно обновлён',
            tokens
        });
    });

    login = catchAsync(async (req, res) => {
        const {user, session} = await authService.login(req.body);

        res.status(201).json({
            success: true,
            message: 'Успешный login',
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
            message: 'Успешный logout'
        });
    })


    getUser = catchAsync(async (req, res) => {
        const user = await authService.getUser(req.params.id || req.user.uuid);

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
        const user = await authService.updateProfile(req.params.id || req.user.uuid, req.body);
        
        res.json({
            success: true,
            message: 'Профиль успешно обновлён',
            data: { 
                user: user 
            }
        });
    });

    delete = catchAsync(async (req, res) => {
        await authService.delete(req.params.id);
        
        res.json({
            success: true,
            message: 'Пользователь успешно удалён'
        });
    })

    hardDelete = catchAsync(async (req, res) => {
        await authService.hardDelete(req.params.id);
        
        res.json({
            success: true,
            message: 'Пользователь успешно удалён'
        });
    })
}

module.exports = new AuthController();