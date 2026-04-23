<template>
  <div class="page-gradient">
    <NavigationButtons 
      :show-home="true" 
      position="top-left"
    />
    <div class="card">
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="login-header">
          <h1>Вход в систему</h1>
          <p class="subtitle">Введите ваши данные для продолжения</p>
        </div>
        
        <div class="form-group">
          <label for="identity">Почта или логин</label>
          <div class="input-wrapper">
            <span class="input-icon">👤</span>
            <input 
              v-model="form.identity" 
              type="text" 
              id="identity" 
              placeholder="example@mail.com"
              required 
              :disabled="isLoading"
              autocomplete="username"
            />
          </div>
        </div>

        <!-- 🔐 Поле пароля с кнопкой видимости -->
        <div class="form-group">
          <label for="password">Пароль</label>
          <div class="input-wrapper">
            <span class="input-icon">🔒</span>
            <input 
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              placeholder="••••••••" 
              required 
              :disabled="isLoading"
              autocomplete="current-password"
              @keyup.enter="handleLogin"
            />
            <button 
              type="button"
              class="toggle-password"
              @click="togglePassword"
              :disabled="isLoading"
              :aria-label="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
              tabindex="-1"
            >

                <svg class="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">                  
                  <path v-if="!showPassword" d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle v-if="!showPassword" cx="12" cy="12" r="3"/>
                  
                  <path v-else d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  
                </svg>

            </button>
          </div>
        </div>

        <Button 
          variant="primary" 
          :loading="isLoading"
          :disabled="!form.identity || !form.password"
          type="submit"
          class="submit-btn"
        >
          Войти
        </Button>

        <p class="signup-link">
          Нет аккаунта? <a href="#" @click.prevent="onSignUp">Зарегистрироваться</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/Button.vue';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/composables/useToast';
import NavigationButtons from '@/components/NavigationButtons.vue';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const isLoading = ref(false);
const rememberMe = ref(false);
const showPassword = ref(false);

const form = reactive({
  identity: 'kirillkulik657@gmail.com',
  password: 'passwrod12345678'
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  if (!form.identity.trim() || !form.password.trim()) {
    toast.showError('Заполните все поля формы');
    return;
  }

  isLoading.value = true;

  try {
    console.log('Вызов login...');
    const result = await authStore.login({ ...form });

    if (authStore.access_token) {
      toast.showSuccess('Успешный вход!');
      setTimeout(() => {
        router.push('/');
      }, 800);
    } else {
      const message = result?.data.message || 'Неверный логин или пароль';
      toast.showError(message);
    }
  } catch(error) {
    console.error('Ошибка в handleLogin:', error);
    
    if (error?.response?.status === 401) {
      toast.showError('Неверный логин или пароль');
    } else if (error?.response?.status === 403) {
      toast.showError('Аккаунт заблокирован');
    } else if (error?.response?.data?.message) {
      toast.showError(error.response.data.message);
    } else if (error?.message) {
      toast.showError(error.message);
    } else {
      toast.showError('Произошла ошибка. Попробуйте позже');
    }
  } finally {
    isLoading.value = false;
  }
};

const onForgotPassword = () => {
  router.push('/forgot-password');
};

const onSignUp = () => {
  router.push('/register');
};
</script>

<style scoped>

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px 0;
}

.subtitle {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  font-size: 18px;
  color: #9ca3af;
  z-index: 1;
  pointer-events: none;
}

.form-group input {
  width: 100%;
  padding: 14px 14px 14px 44px;
  font-size: 15px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s ease;
  background: #f9fafb;
  color: #1a1a2e;
  padding-right: 44px; /* Место для кнопки глаза */
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.form-group input::placeholder {
  color: #9ca3af;
}

/* 🔑 Кнопка показа/скрытия пароля */
.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
  z-index: 2;
}

.toggle-password:hover:not(:disabled) {
  background: rgba(102, 126, 234, 0.1);
}

.toggle-password:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.toggle-password:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}

.eye-icon {
  font-size: 18px;
  line-height: 1;
  user-select: none;
  transition: transform 0.2s ease;
}

.toggle-password:active .eye-icon {
  transform: scale(0.9);
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  font-size: 14px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #374151;
  cursor: pointer;
  user-select: none;
}

.remember-me input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #667eea;
  cursor: pointer;
}

.forgot-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #764ba2;
  text-decoration: underline;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
}

.signup-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #6b7280;
}

.signup-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.signup-link a:hover {
  text-decoration: underline;
}

.eye-icon {
  width: 20px;
  height: 20px;
  color: #6b7280;
  transition: color 0.2s ease;
}

.toggle-password:hover:not(:disabled) .eye-icon {
  color: #667eea;
}

/* Адаптивность */
@media (max-width: 480px) {
  .login-card {
    padding: 32px 24px;
  }
  
  .login-header h1 {
    font-size: 24px;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>