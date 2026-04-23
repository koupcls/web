// src/composables/useToast.js
import { useToast as useVueToast } from 'vue-toastification'

export const useToast = () => {
  const toast = useVueToast()

  return {
    showSuccess: (message) => toast.success(message, {
      timeout: 3000,
      closeOnClick: true,
      pauseOnFocusLoss: false
    }),
    showError: (message) => toast.error(message, {
      timeout: 4000,
      closeOnClick: true,
      pauseOnFocusLoss: false
    }),
    showInfo: (message) => toast.info(message, {
      timeout: 3000
    }),
    showWarning: (message) => toast.warning(message, {
      timeout: 3500
    })
  }
}