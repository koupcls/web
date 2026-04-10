import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const accessToken = ref(localStorage.getItem('access_token') || null)
  const refreshToken = ref(localStorage.getItem('refresh_token') || null)
  const isLoading = ref(false)
  const error = ref(null)

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value)
  const currentUser = computed(() => user.value)

  // Actions
  async function register(email, password) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Registration failed')
      }
      
      return { success: true, email }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  async function verifyOTP(email, code) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Verification failed')
      }
      
      // Store tokens
      accessToken.value = data.access_token
      refreshToken.value = data.refresh_token
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      
      user.value = data.user
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  async function login(email, password) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Login failed')
      }
      
      // Store tokens
      accessToken.value = data.access_token
      refreshToken.value = data.refresh_token
      localStorage.setItem('access_token', data.access_token)
      localStorage.setItem('refresh_token', data.refresh_token)
      
      user.value = data.user
      
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken.value}`
        }
      })
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear local state regardless of API response
      user.value = null
      accessToken.value = null
      refreshToken.value = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }

  async function fetchUser() {
    if (!accessToken.value) return
    
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch('/api/auth/user', {
        headers: { 'Authorization': `Bearer ${accessToken.value}` }
      })
      
      const data = await response.json()
      
      if (response.ok) {
        user.value = data
      } else {
        // Token might be expired, try to refresh
        await refreshAccessToken()
      }
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  async function updateProfile(profileData) {
    isLoading.value = true
    error.value = null
    
    try {
      const response = await fetch('/api/auth/user', {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken.value}`
        },
        body: JSON.stringify(profileData)
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Update failed')
      }
      
      user.value = data
      return { success: true }
    } catch (err) {
      error.value = err.message
      return { success: false, error: err.message }
    } finally {
      isLoading.value = false
    }
  }

  async function refreshAccessToken() {
    if (!refreshToken.value) return false
    
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken.value })
      })
      
      const data = await response.json()
      
      if (response.ok) {
        accessToken.value = data.access_token
        localStorage.setItem('access_token', data.access_token)
        return true
      } else {
        // Refresh failed, clear auth state
        await logout()
        return false
      }
    } catch (err) {
      console.error('Token refresh error:', err)
      return false
    }
  }

  function resendVerificationEmail(email) {
    return fetch('/api/auth/resend-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
  }

  // Initialize auth state on load
  async function initAuth() {
    if (accessToken.value) {
      await fetchUser()
    }
  }

  return {
    // State
    user,
    accessToken,
    refreshToken,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    currentUser,
    // Actions
    register,
    verifyOTP,
    login,
    logout,
    fetchUser,
    updateProfile,
    refreshAccessToken,
    resendVerificationEmail,
    initAuth
  }
})
