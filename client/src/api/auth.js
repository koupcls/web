import api from "@/composables/useApi"

export const authApi = {
  register: (data) => {
    return api.post('/auth/register', data)
  },
  
  login: (data) => {
    return api.post('/auth/login', data)
  },
  
  verifyOtp: (data) => {
    return api.post('/auth/otp', data)
  },
  
  resendEmail: (data) => {
    return api.get(`/auth/resend-email/${data}`)
  },
  
  refresh: (data) => {
    return api.post('/auth/refresh', data)
  },
  
  logout: () => {
    return api.post('/auth/logout')
  },
  
  getCurrentUser: () => {
    return api.get('/auth/user')
  },
  
  updateProfile: (data) => {
    return api.patch('/auth/user', data)
  },
}