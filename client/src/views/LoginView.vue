<script setup>
import { ref, reactive } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)
const error = ref('')

const formData = reactive({
  email: '',
  password: ''
})

async function handleLogin() {
  error.value = ''
  isLoading.value = true
  
  const result = await authStore.login(formData.email, formData.password)
  
  isLoading.value = false
  
  if (result.success) {
    router.push('/profile')
  } else {
    error.value = result.error
  }
}
</script>

<template>
  <AppLayout>
    <div class="auth-container">
      <div class="auth-card card">
        <div class="card-body">
          <h2 class="auth-title">Вход в аккаунт</h2>
          <p class="auth-subtitle">Добро пожаловать обратно</p>

          <form @submit.prevent="handleLogin">
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
                placeholder="Введите пароль"
                required
              />
            </div>

            <div v-if="error" class="form-error mb-2">{{ error }}</div>

            <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="isLoading">
              <span v-if="isLoading" class="spinner mr-2"></span>
              {{ isLoading ? 'Вход...' : 'Войти' }}
            </button>
          </form>

          <div class="auth-footer mt-3 text-center">
            <p>
              Нет аккаунта? 
              <RouterLink to="/register">Зарегистрироваться</RouterLink>
            </p>
            <p class="mt-2">
              <a href="#" class="forgot-link">Забыли пароль?</a>
            </p>
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
  max-width: 420px;
  width: 100%;
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
}

.w-100 {
  width: 100%;
}

.mr-2 {
  margin-right: var(--spacing-sm);
}

.forgot-link {
  color: var(--color-accent-primary);
  font-size: var(--font-size-sm);
}

.forgot-link:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 480px) {
  .auth-container {
    padding: var(--spacing-lg) 0;
  }
}
</style>
