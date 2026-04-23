import { defineStore } from "pinia";
import { authApi } from "@/api/auth";
import { useToast } from "@/composables/useToast";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        email: localStorage.getItem('email') || null,
        access_token: localStorage.getItem('access_token') || null,
        refresh_token: localStorage.getItem('refresh_token') || null,
        isAuthChecked: false
    }),

    getters: {
        isAuthenticated: (state) => !!state.user
    },

    actions: {
        setEmail(email) {
            this.email = email;
            localStorage.setItem('email', this.email);
        },

        setTokens(access, refresh) {
            this.access_token = access;
            this.refresh_token = refresh;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
        },

        async setUserData() {
            const userData = await authApi.getCurrentUser();
            if (userData?.data) {
                this.user = userData.data.data.user;
                this.setEmail(this.user.email);
            }
        },

        async checkAuth() {
            if (!this.access_token || !this.refresh_token) {
                this.logoutLocal();
                this.isAuthChecked = true;
                return false;
            }

            try {
                await this.setUserData();
                this.isAuthChecked = true;
                return true;
            } catch (e) {
                try {
                    await this.refresh();
                    await this.setUserData();
                    this.isAuthChecked = true;
                    return true;
                } catch (err) {
                    this.logoutLocal();
                    this.isAuthChecked = true;
                    return false;
                }
            }
        },

        async login(credentials) {
            const res = await authApi.login(credentials);

            if (res?.data) {
                this.setTokens(
                    res.data.data.session?.access_token,
                    res.data.data.session?.refresh_token
                );
            }

            await this.setUserData();
            return res;
        },

        async register(credentials) {
            const res = await authApi.register(credentials);
            this.setEmail(credentials.email);
            return res;
        },

        async refresh() {
            const res = await authApi.refresh(this.refresh_token);

            this.setTokens(
                res.data.data.access_token,
                res.data.data.refresh_token
            );

            return res.data.data.access_token;
        },

        logoutLocal() {
            this.user = null;
            this.access_token = null;
            this.refresh_token = null;
            this.email = null;

            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('email');
        },

        async logout() {
            try {
                await authApi.logout();
            } catch (e) {
                console.error(e);
            } finally {
                this.logoutLocal();
            }
        }
    }
});