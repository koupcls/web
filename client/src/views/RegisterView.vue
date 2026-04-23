<template>
  <div class="page-gradient">

    <NavigationButtons 
      :show-home="true" 
      position="top-left"
    />

    <div class="card">
      
      <transition name="fade-slide" mode="out-in">
        <div v-if="currentStep === 1" key="step1" class="step-wrapper">
          <form @submit.prevent="goToStep2" class="register-form">
            <div class="register-header">
              <h1>Создать аккаунт</h1>
              <p class="subtitle">Начните с ввода ваших данных</p>
            </div>
            
            <div class="form-group">
              <label for="identity">Почта</label>
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
                  @input="clearError('identity')"
                />
              </div>
              <span v-if="errors.identity" class="error-text">{{ errors.identity }}</span>
            </div>

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
                  autocomplete="new-password"
                  @input="clearError('password')"
                  @keyup.enter="goToStep2"
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
              <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
            </div>

            <Button 
              variant="primary" 
              :loading="isLoading"
              :disabled="!form.identity || !form.password"
              type="submit"
              class="submit-btn"
            >
              Продолжить
            </Button>

            <p class="login-link">
              Уже есть аккаунт? <a href="#" @click.prevent="onLogin">Войти</a>
            </p>
          </form>
        </div>

        <div v-else-if="currentStep === 2" key="step2" class="step-wrapper">
          <form @submit.prevent="verifyCode" class="register-form">
            <div class="register-header">
              <h1>Подтверждение</h1>
              <p class="subtitle">Введите 6-значный код из письма</p>
            </div>

            <!-- Код подтверждения -->
            <div class="code-input-wrapper">
              <input 
                v-for="(digit, index) in 6" 
                :key="index"
                ref="codeInputs"
                type="text"
                maxlength="1"
                pattern="[0-9]"
                inputmode="numeric"
                :value="verificationCode[index] || ''"
                @input="onCodeInput($event, index)"
                @keydown="onCodeKeydown($event, index)"
                @paste="onCodePaste"
                :disabled="isLoading"
                class="code-input"
                :class="{ 'error': errors.code }"
              />
            </div>
            <span v-if="errors.code" class="error-text code-error">{{ errors.code }}</span>

            <!-- Таймер и повторная отправка -->
            <div class="resend-wrapper">
              <template v-if="resendTimer > 0">
                <span class="timer-text">Отправить код повторно через {{ resendTimer }}с</span>
              </template>
              <template v-else>
                <button 
                  type="button" 
                  class="resend-link" 
                  @click="resendCode"
                  :disabled="isLoading"
                >
                  Отправить код ещё раз
                </button>
              </template>
            </div>

            <!-- Навигация -->
            <div class="step-navigation">
              <Button 
                variant="secondary" 
                type="button"
                @click="goToStep(1)"
                :disabled="isLoading"
                class="nav-btn"
              >
                ← Назад
              </Button>
              <Button 
                variant="primary" 
                :loading="isLoading"
                type="submit"
                :disabled="verificationCode.length !== 6"
                class="nav-btn"
              >
                Далее
              </Button>
            </div>
          </form>
        </div>

            <div v-else-if="currentStep === 3" key="step3" class="step-wrapper">
            <form @submit.prevent="completeRegistration" class="register-form">
                <div class="register-header">
                <h1>Ваш профиль</h1>
                <p class="subtitle">Заполните информацию о себе</p>
                </div>

                <!-- Аватар -->
                <div class="avatar-section">
                <label class="avatar-upload">
                    <div class="avatar-preview" :style="{ backgroundImage: avatarPreview ? `url(${avatarPreview})` : '' }">
                    <span v-if="!avatarPreview" class="avatar-placeholder">👤</span>
                    <span v-if="avatarPreview" class="avatar-change">✎</span>
                    </div>
                    <input 
                    type="file" 
                    accept="image/*" 
                    @change="onAvatarChange"
                    :disabled="isLoading"
                    hidden 
                    />
                </label>
                <span class="avatar-hint">Нажмите, чтобы загрузить фото</span>
                <span v-if="errors.avatar" class="error-text avatar-error">{{ errors.avatar }}</span>
                </div>

                <!-- Уникальный тег -->
                <div class="form-group">
                <label for="tag">Уникальный тег</label>
                <div class="input-wrapper">
                    <span class="input-icon tag-prefix">@</span>
                    <input 
                    v-model="profile.tag"
                    type="text" 
                    id="tag"
                    placeholder="myunique"
                    pattern="[a-zA-Z0-9_]+"
                    maxlength="20"
                    required
                    :disabled="isLoading"
                    @input="onTagInput"
                    @blur="validateTagFormat"
                    />
                </div>
                <span class="hint-text">Только латиница, цифры и _</span>
                <span v-if="errors.tag" class="error-text">{{ errors.tag }}</span>
                </div>

                <!-- 🔹 Логин — теперь редактируемый -->
                <div class="form-group">
                <label for="identity-edit">Логин</label>
                <div class="input-wrapper">
                    <span class="input-icon">👤</span>
                    <input 
                    v-model="profile.login"
                    type="text" 
                    id="identity-edit"
                    placeholder="login"
                    :disabled="isLoading"
                    autocomplete="username"
                    @input="clearError('identity')"
                    />
                </div>
                <span v-if="errors.identity" class="error-text">{{ errors.identity }}</span>
                </div>

                <div class="form-group">
                <label for="bio">О себе</label>
                <textarea 
                    v-model="profile.bio"
                    id="bio"
                    placeholder="Расскажите немного о себе..."
                    maxlength="200"
                    :disabled="isLoading"
                    rows="4"
                    @input="clearError('bio')"
                ></textarea>
                <span class="char-count">{{ profile.bio?.length || 0 }}/200</span>
                <span v-if="errors.bio" class="error-text">{{ errors.bio }}</span>
                </div>

                <!-- Навигация -->
                <div class="step-navigation">
                <Button 
                    variant="secondary" 
                    type="button"
                    @click="goToStep(2)"
                    :disabled="isLoading"
                    class="nav-btn"
                >
                    ← Назад
                </Button>
                <Button 
                    variant="primary" 
                    :loading="isLoading"
                    type="submit"
                    :disabled="!profile.tag || !form.identity"
                    class="nav-btn"
                >
                    Завершить
                </Button>
                </div>
            </form>
            </div>
      </transition>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import Button from '@/components/Button.vue';
import { useToast } from '@/composables/useToast';
import { useAuthStore } from '@/stores/authStore';
import { authApi } from '@/api/auth';
import NavigationButtons from '@/components/NavigationButtons.vue';

const router = useRouter();
const toast = useToast();

const authStore = useAuthStore();

const currentStep = ref(1);
const isLoading = ref(false);
const showPassword = ref(false);

const form = reactive({
  identity: 'kirillkulik657@gmail.com',
  password: 'passwrod12345678'
});

const verificationCode = ref([]);
const codeInputs = ref([]);

const profile = reactive({
  login: '',
  tag: '',
  bio: '',
  avatar: null
});

const avatarPreview = ref(null);

const errors = reactive({
  identity: '',
  password: '',
  code: '',
  tag: '',
  bio: '',
  avatar: ''
});

const resendTimer = ref(0);
let timerInterval = null;

const goToStep = (step) => {
  currentStep.value = step;
  clearAllErrors();
};

const goToStep2 = async () => {
  if (!validateStep1()) return;

    isLoading.value = true;

  try {
    await authStore.register({email: form.identity, password: form.password});
  } 
  
  catch(error) {    

    if (error.response.data.error_code === "waiting_verification") {
        
        authStore.setEmail(form.identity);

        try {
            await authStore.resendCode();
        }

        catch(error) {
            if (error?.response?.data?.message) {
            toast.showError(error.response.data.message);
            } else if (error?.message) {
            toast.showError(error.message);
            } else {
            toast.showError('Произошла ошибка. Попробуйте позже');
            }
        }
        
        startResendTimer();
        goToStep(2);
        toast.showInfo('Код отправлен на вашу почту');
        setTimeout(() => codeInputs.value[0]?.focus(), 100);
        return;
    }

    console.error('Ошибка регистрации:', error);
    
    if (error?.response?.data?.message) {
      toast.showError(error.response.data.message);
    } else if (error?.message) {
      toast.showError(error.message);
    } else {
      toast.showError('Произошла ошибка. Попробуйте позже');
    }

    return;
  } 
  finally {
    isLoading.value = false;
  }

  startResendTimer();
  goToStep(2);
  toast.showInfo('Код отправлен на вашу почту');
  setTimeout(() => codeInputs.value[0]?.focus(), 100);
};

const verifyCode = async () => {
  if (verificationCode.value.length !== 6) {
    errors.code = 'Введите все 6 цифр кода';
    return;
  }
  
  isLoading.value = true;
  try {
    const code = verificationCode.value.join('');
    
    try {
       const res =  await authStore.confirmCode(code);
       authStore.setTokens(res.data.data.session?.access_token, res.data.data.session?.refresh_token)
    }

    catch (error) {

        if (error.response.data.error_code === "otp_expired") {
            toast.showError("Неверный код! Попробуйте ещё раз");
            return;
        }

        if (error?.response?.data?.message) {
        toast.showError(error.response.data.message);
        } else if (error?.message) {
        toast.showError(error.message);
        } else {
        toast.showError('Произошла ошибка. Попробуйте позже');
        }

         return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    goToStep(3);
    
  } catch (error) {
    console.error('Ошибка проверки кода:', error);
    errors.code = 'Неверный код. Попробуйте ещё раз';
    clearCode();
  } finally {
    isLoading.value = false;
  }
};

const completeRegistration = async () => {
  if (!validateStep3()) return;
  
  isLoading.value = true;
  try {
    const formData = new FormData();
    formData.append('login', profile.login);
    formData.append('tag', profile.tag);
    formData.append('bio', profile.bio || '');
    if (profile.avatar) {
      formData.append('avatar', profile.avatar);
    }
    
    try {
        await authStore.updateProfile(formData);
    }

    catch(error) {

        if (error?.response?.data?.message) {
        toast.showError(error.response.data.message);
        } else if (error?.message) {
        toast.showError(error.message);
        } else {
        toast.showError('Произошла ошибка. Попробуйте позже');
        }
        return;
    }
    
    toast.showSuccess('Аккаунт создан! Добро пожаловать');
    setTimeout(() => {
      router.push('/');
    }, 1000);
    
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    
    if (error?.response?.data?.errors) {
      const serverErrors = error.response.data.errors;
      if (serverErrors.tag) errors.tag = 'Этот тег уже занят';
      if (serverErrors.identity) errors.identity = 'Пользователь уже существует';
    }
    
    toast.showError('Не удалось создать аккаунт. Попробуйте позже');
  } finally {
    isLoading.value = false;
  }
};

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const onCodeInput = (event, index) => {
  const value = event.target.value.replace(/[^0-9]/g, '');
  
  if (value) {
    verificationCode.value[index] = value;
    
    if (index < 5 && codeInputs.value[index + 1]) {
      codeInputs.value[index + 1].focus();
    }
    
    if (verificationCode.value.filter(Boolean).length === 6) {
      clearError('code');
    }
  } else {
    verificationCode.value[index] = '';
  }
};

const onCodeKeydown = (event, index) => {
  if (event.key === 'Backspace' && !verificationCode.value[index] && index > 0) {
    codeInputs.value[index - 1]?.focus();
  }
  
  // Стрелки для навигации
  if (event.key === 'ArrowLeft' && index > 0) {
    codeInputs.value[index - 1]?.focus();
  }
  if (event.key === 'ArrowRight' && index < 5) {
    codeInputs.value[index + 1]?.focus();
  }
};

const onCodePaste = (event) => {
  event.preventDefault();
  const pasted = event.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
  
  if (pasted.length === 6) {
    verificationCode.value = pasted.split('');
    clearError('code');
    
    setTimeout(() => {
      codeInputs.value[5]?.focus();
    }, 0);
  }
};

const clearCode = () => {
  verificationCode.value = [];
  codeInputs.value[0]?.focus();
};

const onAvatarChange = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  
  // Валидация типа
  if (!file.type.startsWith('image/')) {
    errors.avatar = 'Загрузите изображение (JPG, PNG, GIF)';
    return;
  }
  
  // Валидация размера (макс 5МБ)
  if (file.size > 5 * 1024 * 1024) {
    errors.avatar = 'Размер файла не должен превышать 5МБ';
    return;
  }
  
  clearError('avatar');
  profile.avatar = file;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    avatarPreview.value = e.target?.result;
  };
  reader.readAsDataURL(file);
};

const startResendTimer = () => {
  resendTimer.value = 30;
  
  timerInterval = setInterval(() => {
    resendTimer.value--;
    if (resendTimer.value <= 0) {
      clearInterval(timerInterval);
    }
  }, 1000);
};

const resendCode = async () => {
  if (resendTimer.value > 0 || isLoading.value) return;
  
  isLoading.value = true;
  try {

    try {
        await authStore.resendCode();
    }

    catch(error) {
         if (error?.response?.data?.message) {
        toast.showError(error.response.data.message);
        } else if (error?.message) {
        toast.showError(error.message);
        } else {
        toast.showError('Произошла ошибка. Попробуйте позже');
        }
    }
    
    startResendTimer();
    toast.showInfo('Код отправлен повторно');
    clearCode();
    
  } catch (error) {
    console.error('Ошибка повторной отправки:', error);
    toast.showError('Не удалось отправить код. Попробуйте позже');
  } finally {
    isLoading.value = false;
  }
};

const validateStep1 = () => {
  let isValid = true;
  clearErrors(['identity', 'password']);
  
  if (!form.identity.trim()) {
    errors.identity = 'Введите почту';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.identity) && form.identity.length < 5) {
    errors.identity = 'Введите корректную почту (мин. 5 символов)';
    isValid = false;
  }
  
  if (!form.password) {
    errors.password = 'Введите пароль';
    isValid = false;
  } else if (form.password.length < 8) {
    errors.password = 'Пароль должен содержать минимум 8 символов';
    isValid = false;
  }
  
  return isValid;
};

const validateStep3 = () => {
  let isValid = true;
  clearErrors(['tag', 'bio', 'avatar']);
  
  if (!profile.tag.trim()) {
    errors.tag = 'Введите уникальный тег';
    isValid = false;
  } else if (!/^[a-zA-Z0-9_]+$/.test(profile.tag)) {
    errors.tag = 'Только латиница, цифры и подчёркивание';
    isValid = false;
  }
  
  if (profile.bio && profile.bio.length > 200) {
    errors.bio = 'Максимум 200 символов';
    isValid = false;
  }
  
  return isValid;
};

const clearError = (field) => {
  errors[field] = '';
};

const clearErrors = (fields) => {
  fields.forEach(field => clearError(field));
};

const clearAllErrors = () => {
  Object.keys(errors).forEach(key => errors[key] = '');
};

// 🔄 Переход на страницу входа
const onLogin = () => {
  router.push('/login');
};

// ♻️ Очистка таймера при размонтировании
onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
});
</script>

<style scoped>
.step-wrapper {
  width: 100%;
}

/* ========== АНИМАЦИИ ПЕРЕХОДОВ ========== */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* ========== ЗАГОЛОВОК ========== */
.register-header {
  text-align: center;
  margin-bottom: 32px;
}

.register-header h1 {
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

/* ========== ФОРМА ========== */
.register-form {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-group {
  margin-bottom: 4px;
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

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 14px 14px 14px 44px;
  font-size: 15px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  transition: all 0.2s ease;
  background: #f9fafb;
  color: #1a1a2e;
  font-family: inherit;
  resize: vertical;
}

.form-group textarea {
  padding: 14px;
  padding-left: 14px;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.form-group input:disabled,
.form-group textarea:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.input-disabled {
  width: 100%;
  padding: 14px 14px 14px 44px;
  font-size: 15px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #9ca3af;
}

/* 🔐 Кнопка показа пароля */
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

.eye-icon {
  width: 20px;
  height: 20px;
  color: #6b7280;
  transition: color 0.2s ease;
}

.toggle-password:hover:not(:disabled) .eye-icon {
  color: #667eea;
}

/* 🔢 Поля ввода кода */
.code-input-wrapper {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin: 24px 0 8px;
}

.code-input {
  width: 48px;
  height: 56px;
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #f9fafb;
  color: #1a1a2e;
  transition: all 0.2s ease;
}

.code-input:focus {
  outline: none;
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.15);
  transform: translateY(-2px);
}

.code-input.error {
  border-color: #ef4444;
  animation: shake 0.4s ease;
}

.code-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  75% { transform: translateX(6px); }
}

.code-error {
  display: block;
  text-align: center;
  margin-top: 4px;
}

/* ⏱️ Таймер и повторная отправка */
.resend-wrapper {
  text-align: center;
  margin: 16px 0 24px;
  min-height: 24px;
}

.timer-text {
  font-size: 14px;
  color: #6b7280;
}

.resend-link {
  background: none;
  border: none;
  color: #667eea;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.resend-link:hover:not(:disabled) {
  color: #764ba2;
  text-decoration: underline;
}

.resend-link:disabled {
  color: #9ca3af;
  cursor: not-allowed;
}

/* 🖼️ Аватар */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 8px 0 24px;
}

.avatar-upload {
  cursor: pointer;
  margin-bottom: 10px;
}

.avatar-preview {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 3px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  background-size: cover;
  background-position: center;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.avatar-preview:hover {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.avatar-placeholder {
  font-size: 36px;
  color: #9ca3af;
}

.avatar-change {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(102, 126, 234, 0.9);
  color: white;
  font-size: 20px;
  opacity: 0;
  transition: opacity 0.2s;
}

.avatar-preview:hover .avatar-change {
  opacity: 1;
}

.avatar-hint {
  font-size: 13px;
  color: #6b7280;
}

.avatar-error {
  margin-top: 6px;
}

/* 💬 Подсказки и счётчики */
.hint-text {
  display: block;
  font-size: 12px;
  color: #9ca3af;
  margin-top: 4px;
}

.char-count {
  display: block;
  font-size: 12px;
  color: #9ca3af;
  text-align: right;
  margin-top: 4px;
}

/* ❌ Ошибки */
.error-text {
  display: block;
  font-size: 13px;
  color: #ef4444;
  margin-top: 6px;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 🔘 Кнопки */
.submit-btn {
  width: 100%;
  padding: 14px;
  font-size: 16px;
  font-weight: 600;
  margin-top: 8px;
}

.step-navigation {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.nav-btn {
  flex: 1;
  padding: 14px;
  font-size: 15px;
  font-weight: 600;
}

/* 🔗 Ссылки */
.login-link,
.signup-link {
  text-align: center;
  margin-top: 24px;
  font-size: 14px;
  color: #6b7280;
}

.login-link a,
.signup-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.login-link a:hover,
.signup-link a:hover {
  text-decoration: underline;
}

/* 📱 Адаптивность */
@media (max-width: 480px) {
  .register-card {
    padding: 32px 24px;
    margin: 10px;
  }
  
  .register-header h1 {
    font-size: 24px;
  }
  
  .code-input {
    width: 42px;
    height: 50px;
    font-size: 20px;
  }
  
  .code-input-wrapper {
    gap: 8px;
  }
  
  .step-navigation {
    flex-direction: column;
  }
  
  .nav-btn {
    width: 100%;
  }
}

/* 🎨 Дополнительные стили для скролла текста */
.form-group textarea {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f9fafb;
}

.form-group textarea::-webkit-scrollbar {
  width: 6px;
}

.form-group textarea::-webkit-scrollbar-track {
  background: #f9fafb;
  border-radius: 3px;
}

.form-group textarea::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.form-group textarea::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>