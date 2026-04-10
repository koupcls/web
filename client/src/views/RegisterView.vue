<script setup>
import { ref, reactive } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

// Step management
const currentStep = ref(1)
const isLoading = ref(false)
const error = ref('')
const successMessage = ref('')

// Form data
const formData = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  code: '',
  login: '',
  tag: ''
})

// Validation
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const validatePassword = (password) => {
  return password.length >= 8
}

// Step 1: Email & Password
async function handleStep1() {
  error.value = ''
  
  if (!validateEmail(formData.email)) {
    error.value = 'Введите корректный email'
    return
  }
  
  if (!validatePassword(formData.password)) {
    error.value = 'Пароль должен содержать минимум 8 символов'
    return
  }
  
  if (formData.password !== formData.confirmPassword) {
    error.value = 'Пароли не совпадают'
    return
  }
  
  isLoading.value = true
  
  const result = await authStore.register(formData.email, formData.password)
  
  isLoading.value = false
  
  if (result.success) {
    currentStep.value = 2
    successMessage.value = 'Код подтверждения отправлен на вашу почту'
  } else {
    error.value = result.error
  }
}

// Step 2: OTP Verification
async function handleStep2() {
  error.value = ''
  
  if (!formData.code || formData.code.length < 4) {
    error.value = 'Введите код подтверждения'
    return
  }
  
  isLoading.value = true
  
  const result = await authStore.verifyOTP(formData.email, formData.code)
  
  isLoading.value = false
  
  if (result.success) {
    currentStep.value = 3
  } else {
    error.value = result.error
  }
}

// Step 3: Additional Data
async function handleStep3() {
  error.value = ''
  
  if (!formData.login || formData.login.length < 3) {
    error.value = 'Логин должен содержать минимум 3 символа'
    return
  }
  
  isLoading.value = true
  
  const result = await authStore.updateProfile({
    login: formData.login,
    tag: formData.tag
  })
  
  isLoading.value = false
  
  if (result.success) {
    router.push('/profile')
  } else {
    error.value = result.error
  }
}

function resendCode() {
  authStore.resendVerificationEmail(formData.email)
  successMessage.value = 'Код отправлен повторно'
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}
</script>

<template>
  <AppLayout>
    <div class="auth-container">
      <div class="auth-card card">
        <div class="card-body">
          <!-- Progress Steps -->
          <div class="progress-steps">
            <div 
              v-for="step in 3" 
              :key="step"
              :class="['progress-step', { 
                active: step === currentStep, 
                completed: step < currentStep 
              }]"
            >
              <span class="progress-number">{{ step }}</span>
              <span class="progress-line" v-if="step < 3"></span>
            </div>
          </div>

          <!-- Step 1: Email & Password -->
          <div v-if="currentStep === 1" class="auth-step animate-fade-in">
            <h2 class="auth-title">Создать аккаунт</h2>
            <p class="auth-subtitle">Заполните данные для регистрации</p>

            <form @submit.prevent="handleStep1">
              <div class="form-group">
                <label class="form-label" for="email">Email</label>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  class="form-input"
                  placeholder="example@mail.com"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="password">Пароль</label>
                <input
                  id="password"
                  v-model="formData.password"
                  type="password"
                  class="form-input"
                  placeholder="Минимум 8 символов"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="confirmPassword">Подтвердите пароль</label>
                <input
                  id="confirmPassword"
                  v-model="formData.confirmPassword"
                  type="password"
                  class="form-input"
                  placeholder="Повторите пароль"
                  required
                />
              </div>

              <div v-if="error" class="form-error mb-2">{{ error }}</div>
              <div v-if="successMessage" class="text-success mb-2">{{ successMessage }}</div>

              <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="isLoading">
                <span v-if="isLoading" class="spinner mr-2"></span>
                {{ isLoading ? 'Отправка...' : 'Продолжить' }}
              </button>
            </form>

            <div class="auth-footer mt-3 text-center">
              <p>
                Уже есть аккаунт? 
                <RouterLink to="/login">Войти</RouterLink>
              </p>
            </div>
          </div>

          <!-- Step 2: OTP Verification -->
          <div v-if="currentStep === 2" class="auth-step animate-fade-in">
            <h2 class="auth-title">Подтверждение email</h2>
            <p class="auth-subtitle">
              Введите код из письма, отправленного на<br>
              <strong>{{ formData.email }}</strong>
            </p>

            <form @submit.prevent="handleStep2">
              <div class="form-group">
                <label class="form-label" for="code">Код подтверждения</label>
                <input
                  id="code"
                  v-model="formData.code"
                  type="text"
                  class="form-input text-center"
                  placeholder="0000"
                  maxlength="6"
                  pattern="[0-9]*"
                  inputmode="numeric"
                  required
                />
              </div>

              <div v-if="error" class="form-error mb-2">{{ error }}</div>
              <div v-if="successMessage" class="text-success mb-2">{{ successMessage }}</div>

              <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="isLoading">
                <span v-if="isLoading" class="spinner mr-2"></span>
                {{ isLoading ? 'Проверка...' : 'Подтвердить' }}
              </button>

              <button 
                type="button" 
                class="btn btn-link w-100 mt-2"
                @click="resendCode"
              >
                Отправить код повторно
              </button>
            </form>

            <div class="auth-footer mt-3 text-center">
              <p>
                Ошибка с email? 
                <a href="#" @click.prevent="currentStep = 1">Изменить</a>
              </p>
            </div>
          </div>

          <!-- Step 3: Additional Data -->
          <div v-if="currentStep === 3" class="auth-step animate-fade-in">
            <h2 class="auth-title">Последний шаг</h2>
            <p class="auth-subtitle">Расскажите немного о себе</p>

            <form @submit.prevent="handleStep3">
              <div class="form-group">
                <label class="form-label" for="login">Логин *</label>
                <input
                  id="login"
                  v-model="formData.login"
                  type="text"
                  class="form-input"
                  placeholder="Как к вам обращаться"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label" for="tag">Тег (необязательно)</label>
                <input
                  id="tag"
                  v-model="formData.tag"
                  type="text"
                  class="form-input"
                  placeholder="#foodlover"
                />
                <small class="form-hint">Например: #chef, #homecook, #vegan</small>
              </div>

              <div v-if="error" class="form-error mb-2">{{ error }}</div>

              <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="isLoading">
                <span v-if="isLoading" class="spinner mr-2"></span>
                {{ isLoading ? 'Сохранение...' : 'Завершить регистрацию' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.auth-container {
  min-height: calc(100vh - var(--header-height) - 300px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl) 0;
}

.auth-card {
  max-width: 450px;
  width: 100%;
}

.auth-step {
  padding: var(--spacing-md);
}

.auth-title {
  text-align: center;
  margin-bottom: var(--spacing-sm);
  font-size: var(--font-size-2xl);
}

.auth-subtitle {
  text-align: center;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
}

/* Progress Steps */
.progress-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: var(--spacing-2xl);
}

.progress-step {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.progress-number {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-tertiary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  transition: all var(--transition-normal);
}

.progress-step.active .progress-number {
  background-color: var(--color-accent-primary);
  color: white;
}

.progress-step.completed .progress-number {
  background-color: var(--color-success);
  color: white;
}

.progress-line {
  width: 60px;
  height: 2px;
  background-color: var(--color-border-light);
  transition: background-color var(--transition-normal);
}

.progress-step.completed .progress-line {
  background-color: var(--color-success);
}

/* Form Styles */
.form-hint {
  display: block;
  margin-top: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.text-success {
  color: var(--color-success);
  font-size: var(--font-size-sm);
}

.w-100 {
  width: 100%;
}

.mr-2 {
  margin-right: var(--spacing-sm);
}

.btn-link {
  background: none;
  border: none;
  color: var(--color-accent-primary);
  cursor: pointer;
  font-size: var(--font-size-sm);
  padding: var(--spacing-sm);
}

.btn-link:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .auth-container {
    padding: var(--spacing-lg) 0;
  }
  
  .progress-line {
    width: 40px;
  }
}
</style>
