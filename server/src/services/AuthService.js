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
            throw new AppError('Email and password are requaried', 'missing_data', 400);
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
        const { email, token } = creditials;

        if (!email || !token) {
            throw new AppError("Email and token are required", 400);
        }

        const {data: {user, session}, error} = await this.supabase.auth.verifyOtp({
            email: email,
            token: token,
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
            throw new AppError("Email is required", 'missing_data', 400);
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
            throw new AppError('Refresh token is required', 'missing_refresh_token', 400);
        }

        const {  session, error } = await supabase.auth.refreshSession({
            refresh_token: refreshToken
        });

        if (error || !session) {
            throw new AppError('Invalid or expired refresh token', 'invalid_refresh_token', 401);
        }

        const {  user: profile, error: profileError } = await supabase
            .from('users')
            .select('uuid, is_active, role')
            .eq('uuid', session.user.id)
            .is('deleted_at', 'null')
            .maybeSingle();

        if (profileError || !profile) {
            throw new AppError('User profile not found or deleted', 404);
        }

        if (!profile.is_active) {
            throw new AppError('Account is deactivated', 403);
        }

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
        
        const { data, error } = await this.supabase.from('users').select('*').eq('uuid', userId).is('deleted_at', null).single();

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


    async deleteProfile(userId, token, hard = false) {
        if (!userId) {
            throw new AppError('User ID is required', 'missing_data', 400);
        }

        if (hard) {
            const { error } = await this.supabase
                .from('users')
                .delete()
                .eq('uuid', userId);

            if (error) {
                throw new AppError('Failed to permanently delete user', error.code, 500);
            }

            const { error: supabaseError } = await this.supabase.auth.admin.deleteUser(userId);
            if (supabaseError) {
                throw new AppError(supabaseError.message, supabaseError.code, 500);
            }

            return {};
        }

        return this.softDelete(userId, token);
    }


    async softDelete(userId, token) {

        const { error } = await this.supabase
            .from('users')
            .update({ 
                deleted_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .eq('uuid', userId)
            .is('deleted_at', 'null');

        if (error) {
            throw new AppError('Failed to delete profile', error.code, 500);
        }

        await this.logout(token);

        return {};
    }

}

module.exports = new AuthService();