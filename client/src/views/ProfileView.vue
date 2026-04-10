<script setup>
import { ref, reactive } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const isLoading = ref(false)
const error = ref('')
const successMessage = ref('')

const formData = reactive({
  login: authStore.user?.login || '',
  tag: authStore.user?.tag || '',
  bio: authStore.user?.bio || '',
  avatarUrl: authStore.user?.avatar_url || '',
  isPrivate: authStore.user?.is_private || false
})

async function handleUpdate() {
  error.value = ''
  successMessage.value = ''
  isLoading.value = true
  
  const result = await authStore.updateProfile(formData)
  
  isLoading.value = false
  
  if (result.success) {
    successMessage.value = 'Профиль успешно обновлён'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } else {
    error.value = result.error
  }
}
</script>

<template>
  <AppLayout>
    <div class="profile-container">
      <div class="container">
        <h1 class="page-title">Профиль</h1>
        
        <div class="profile-grid">
          <!-- Profile Card -->
          <div class="profile-card card">
            <div class="card-body profile-card-body">
              <div class="avatar-section">
                <div class="avatar-placeholder">
                  {{ formData.login?.charAt(0).toUpperCase() || 'U' }}
                </div>
                <div class="user-info">
                  <h2 class="user-name">{{ formData.login || 'Пользователь' }}</h2>
                  <p class="user-email">{{ authStore.user?.email }}</p>
                  <span v-if="formData.tag" class="user-tag">{{ formData.tag }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Edit Form -->
          <div class="edit-card card">
            <div class="card-body">
              <h3 class="form-section-title">Редактировать профиль</h3>
              
              <form @submit.prevent="handleUpdate">
                <div class="form-group">
                  <label class="form-label" for="login">Логин</label>
                  <input
                    id="login"
                    v-model="formData.login"
                    type="text"
                    class="form-input"
                    placeholder="Ваш логин"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label" for="tag">Тег</label>
                  <input
                    id="tag"
                    v-model="formData.tag"
                    type="text"
                    class="form-input"
                    placeholder="#foodlover"
                  />
                </div>

                <div class="form-group">
                  <label class="form-label" for="bio">О себе</label>
                  <textarea
                    id="bio"
                    v-model="formData.bio"
                    class="form-textarea"
                    placeholder="Расскажите немного о себе..."
                    rows="4"
                  ></textarea>
                </div>

                <div class="form-group">
                  <label class="form-label" for="avatarUrl">URL аватара</label>
                  <input
                    id="avatarUrl"
                    v-model="formData.avatarUrl"
                    type="url"
                    class="form-input"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div class="form-group">
                  <label class="form-checkbox-label">
                    <input
                      v-model="formData.isPrivate"
                      type="checkbox"
                      class="form-checkbox"
                    />
                    <span>Приватный профиль</span>
                  </label>
                </div>

                <div v-if="error" class="form-error mb-2">{{ error }}</div>
                <div v-if="successMessage" class="text-success mb-2">{{ successMessage }}</div>

                <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="isLoading">
                  <span v-if="isLoading" class="spinner mr-2"></span>
                  {{ isLoading ? 'Сохранение...' : 'Сохранить изменения' }}
                </button>
              </form>
            </div>
          </div>

          <!-- Account Info -->
          <div class="info-card card">
            <div class="card-body">
              <h3 class="form-section-title">Информация об аккаунте</h3>
              
              <div class="info-list">
                <div class="info-item">
                  <span class="info-label">Email:</span>
                  <span class="info-value">{{ authStore.user?.email }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Роль:</span>
                  <span class="info-value badge">{{ authStore.user?.role || 'user' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">Дата регистрации:</span>
                  <span class="info-value">{{ new Date().toLocaleDateString('ru-RU') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.profile-container {
  padding: var(--spacing-2xl) 0;
}

.page-title {
  margin-bottom: var(--spacing-2xl);
  font-size: var(--font-size-3xl);
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-xl);
  max-width: 800px;
}

.profile-card-body {
  text-align: center;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-hover));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: var(--font-weight-bold);
}

.user-name {
  font-family: var(--font-family-base);
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-xs);
}

.user-email {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-sm);
}

.user-tag {
  display: inline-block;
  background-color: var(--color-accent-light);
  color: var(--color-accent-primary);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.form-section-title {
  font-family: var(--font-family-base);
  font-size: var(--font-size-lg);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border-light);
}

.form-checkbox-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  font-size: var(--font-size-base);
}

.form-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
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

.info-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--color-border-light);
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.info-value {
  font-weight: var(--font-weight-medium);
}

.badge {
  display: inline-block;
  background-color: var(--color-bg-tertiary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  text-transform: capitalize;
}

/* Responsive */
@media (min-width: 768px) {
  .profile-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .profile-card {
    grid-column: 1 / -1;
  }
}
</style>
