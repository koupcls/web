import axios from 'axios'
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({  
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})


api.interceptors.request.use(
  
  (config) => {
    const authStore = useAuthStore()
    if (authStore.access_token) {
      config.headers.Authorization = `Bearer ${authStore.access_token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore()
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const newToken = await authStore.refresh() 
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return api(originalRequest)
      } catch (refreshError) {
        authStore.logout() 
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api