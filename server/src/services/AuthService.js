const AppError = require('../utils/AppError');
const { supabase } = require('../config/supabase');
const { json } = require('express');

class AuthService {
    constructor() {
        this.supabase = supabase;
    }


    async register(creditials) {
        const {email, password} = creditials;

        if (!email || !password) {
            throw new AppError('Необходимы почта и пароль', 'missing_data', 400);
        }

        const { data: {user}, error: regError } = await this.supabase.auth.signUp({
            email: email,
            password: password,
            email_confirm: false
        });

        if (regError) {
            throw new AppError(regError.message, regError.code, 400);
        }

        return {email: user.email};
    }

    async verifyOtpToken(creditials) {

        const { email, code } = creditials;

        if (!email || !code) {
            throw new AppError("Необходимы почта и код", 400);
        }

        const {data: {user, session}, error} = await this.supabase.auth.verifyOtp({
            email: email,
            token: code,
            type: 'email'
        });

        if (error) {
            throw new AppError(error.message, error.code, 401);
        }



        return {
        session: {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            token_type: session.token_type,
            expires_in: session.expires_in,
            expires_at: session.expires_at
        },
        user: {
            id: user.id,
            email: user.email,
            email_confirmed_at: user.email_confirmed_at,
            created_at: user.created_at
        }
    };
    }

    async resendConfirmationEmail(creditials) {
        const {email} = creditials;

        if (!email) {
            throw new AppError("Необходима почта", 'missing_data', 400);
        }

        const {error} = await this.supabase.auth.resend({
            type: 'signup',
            email: email
        });

        if (error) {
            throw new AppError(error.message, error.code, 401);
        }

        return {};
    }


    async refreshAccessToken(refreshToken) {
        if (!refreshToken) {
            throw new AppError('Необходим refresh токен', 'missing_refresh_token', 400);
        }

        const {  session, error } = await supabase.auth.refreshSession({
            refresh_token: refreshToken
        });

        if (error || !session) {
            throw new AppError('Неправильный или протухший токен', 'invalid_refresh_token', 401);
        }

        const {  user: profile, error: profileError } = await supabase
            .from('users')
            .select('uuid, is_active, role')
            .eq('uuid', session.user.id)
            .is('deleted_at', 'null')
            .maybeSingle();

        if (profileError || !profile) {
            throw new AppError('Пользователь не найден', 'not_found', 404);
        }

        if (!profile.is_active) {
            throw new AppError('Account is deactivated', 'accaout_deactivated', 403);
        }

        console.log(profile);
        console.log(session);

        return {
            accessToken: session.access_token,
            refreshToken: session.refresh_token,
            tokenType: session.token_type,
            user: {
                id: profile.uuid,
                email: session.user.email,
                role: profile.role
            }
        };
    }

    async login(creditials) {
        const { email, password } = creditials;

        if (!email || !password) {
            throw new AppError('Email and password are requaried', 'missing_data', 400);
        }        

        const { data: {user, session}, error } = await this.supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            throw new AppError(error.message, error.code, 400);
        }

        return {
        session: {
            access_token: session.access_token,
            refresh_token: session.refresh_token,
            token_type: session.token_type,
            expires_in: session.expires_in,
            expires_at: session.expires_at
        },
        user: {
            id: user.id,
            email: user.email,
            email_confirmed_at: user.email_confirmed_at,
            created_at: user.created_at
        }};
    }


    async logout(accessToken) {
        if (!accessToken) {
            throw new AppError("Token is required", 'missing_accsess_token', 400);
        }

        const {error} = await this.supabase.auth.admin.signOut(accessToken);

        if (error) {
            throw new AppError(error.message, error.code, error.status);
        }

        return {};
    }


    async getUser(userId) {

        if (!userId) {
            throw new AppError("UserId is required", "missing_data", 400);
        }
        
        const { data, error } = await this.supabase
        .from('users')
        .select('*')
        .eq('uuid', userId)
        .single();

        if (error || !data) {
            throw new AppError(error.message, error.code, 404);
        }

        return data;
    }

    async getAllUsers() {
        const {data, error} = await this.supabase.from('users').select('*').is('deleted_at', null);

        if (error || !data) {
            throw new AppError(error.message, error.code, 404);
        }

        return data;
    }


    async updateProfile(userId, updateData) {

        if (!userId || !updateData) {
            throw new AppError("User ID and update data are required", "missing_data", 401);
        }

        const {  data, error } = await this.supabase
            .from('users')
            .update({
                ...updateData,
                updated_at: new Date()
            })
            .eq('uuid', userId)
            .select()
            .single();

        if (error) {
            throw new AppError('Failed to update profile', error.code, 400);
        }

        return data;
    }


    async hardDelete(userID) {
        if (!userID) {
            throw new AppError('Необходим ID пользователя', 'missing_data', 400);
        }

        const { data: user, error } = await this.supabase
                .from('users')
                .delete()
                .eq('uuid', userID)
                .single()

        if (!user) {
            throw new AppError('Пользователь с ID ' + userID + ' не найден', 'not_found', 404);
        }

        if (error) {
            throw new AppError('Не удалось удалить пользователя', 'delete_failed', 500);
        }

        const { error: supabaseError } = await this.supabase.auth.admin.deleteUser(userId);
        if (supabaseError) {
            throw new AppError(supabaseError.message, supabaseError.code, supabaseError.status);
        }
    }

    async delete(userID) {
        if (!userID) {
            throw new AppError('Необходим ID пользователя', 'missing_data', 400);
        }

        const { data: user, error } = await this.supabase
                .from('users')
                .update({ 
                    deleted_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('uuid', userID)
                .is('deleted_at', 'null')
                .single();

        if (error) {
            console.log(error);
            throw new AppError('Не удалось удалить пользователя', 'delete_failed', 500);
        }
    }

}

module.exports = new AuthService();