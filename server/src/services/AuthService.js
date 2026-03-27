const AppError = require('../utils/AppError');
const { supabase } = require('../config/supabase');

class AuthService {
    constructor() {
        this.supabase = supabase;
    }


    async register(userData) {
        const {email, login, password, tag, tagPreferences } = userData;

        if (!email || !password) {
            throw new AppError('Email and password are requaried', 400);
        }

        const { data: {user}, error } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                login,
                tag,
                tagPreferences
            }
        });

        if (error) {
            throw new AppError(error.message, 400);
        }

        return user;
    }


    async login(creditials) {
        const { email, password } = creditials;

        const { data: {user, session}, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            throw new AppError(error.message, 400);
        }

        return {user, session};
    }


    async logout(accessToken) {
        await this.supabase.auth.admin.signOut(accessToken);
    }


    async getCurrentUser(userId) {
        
        const { data, error } = await supabase.from('users').select('*').eq('uuid', userId).is('deleted_at', null).single();

        console.log(data);

        if (error || !data) {
            throw new AppError(error.message, 404);
        }

        return data;
    }


    async updateProfile(userId, updateData) {
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
            throw new AppError('Failed to update profile', 400);
        }

        return data;
    }
}

module.exports = new AuthService();