<template>
  <form @submit.prevent="onSubmit" class="settings-form">
    <!-- Аватар -->
    <div class="form-group">
      <label>Аватар (URL)</label>
      <input 
        v-model="form.avatar_url" 
        type="url" 
        class="input" 
        placeholder="https://example.com/avatar.jpg"
      />
    </div>

    <!-- Логин -->
    <div class="form-group">
      <label>Логин</label>
      <input 
        v-model="form.login" 
        type="text" 
        class="input" 
        maxlength="30"
        required
      />
    </div>

    <!-- Тег -->
    <div class="form-group">
      <label>Тег</label>
      <input 
        v-model="form.tag" 
        type="text" 
        class="input" 
        placeholder="например: кето-шеф"
        maxlength="50"
      />
    </div>

    <!-- Био -->
    <div class="form-group">
      <label>О себе</label>
      <textarea 
        v-model="form.bio" 
        class="input" 
        rows="3" 
        maxlength="200"
        placeholder="Расскажите немного о себе..."
      />
    </div>

    <!-- Приватный профиль -->
    <div class="form-group checkbox">
      <label class="checkbox-label">
        <input v-model="form.is_private" type="checkbox" />
        <span>🔒 Приватный профиль (посты видят только подписчики)</span>
      </label>
    </div>

    <div class="form-actions">
      <Button type="submit" variant="primary" :disabled="saving">
        {{ saving ? 'Сохранение...' : 'Сохранить изменения' }}
      </Button>
      <Button type="button" variant="danger" @click="$emit('logout')" class="btn-logout">
        Выйти из аккаунта
      </Button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useToast } from '@/composables/useToast';
import { profileApi } from '@/api/profile';
import Button from '@/components/Button.vue';

const props = defineProps({ profile: Object });
const emit = defineEmits(['saved', 'logout']);
const { showToast } = useToast();

const form = ref({
  avatar_url: '',
  login: '',
  tag: '',
  bio: '',
  is_private: false
});

const saving = ref(false);

// Синхронизация с пропсами
watch(() => props.profile, (newVal) => {
  if (newVal) {
    form.value = {
      avatar_url: newVal.avatar_url || '',
      login: newVal.login || '',
      tag: newVal.tag || '',
      bio: newVal.bio || '',
      is_private: newVal.is_private || false
    };
  }
}, { immediate: true });

const onSubmit = async () => {
  saving.value = true;
  try {
    const payload = { ...form.value };
    // Убираем пустые значения, если нужно
    const res = await profileApi.updateProfile(payload);
    if (res.data?.success) {
      emit('saved', res.data.data.user);
    }
  } catch (e) {
    const msg = e.response?.data?.error?.message || 'Ошибка при сохранении';
    showToast(msg, 'error');
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.form-group label {
  display: block;
  font-weight: 600;
  color: #1a1a2e;
  margin-bottom: 8px;
  font-size: 0.95rem;
}
.input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  background: #f9fafb;
  font-size: 1rem;
  transition: 0.2s;
}
.input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102,126,234,0.1);
}
textarea.input { resize: vertical; min-height: 80px; }
.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
}
.checkbox-label input {
  width: 18px;
  height: 18px;
  accent-color: #667eea;
}
.form-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}
.btn-logout {
  background: #fee2e2 !important;
  color: #dc2626 !important;
  border-color: #fecaca !important;
}
.btn-logout:hover {
  background: #fecaca !important;
}
</style>