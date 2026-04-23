<template>
  <button
    :type="type"
    class="button"
    :class="[
      `button--${variant}`, 
      { 
        'button--loading': loading,
        'button--disabled': disabled || loading 
      }
    ]"
    :disabled="disabled || loading"
  >
    <!-- Используем вынесенный компонент -->
    <Spinner 
      v-if="loading" 
      :color="spinnerColor" 
      :secondary-color="spinnerSecondaryColor"
    />
    
    <span class="button__content" :class="{ 'button__content--hidden': loading && hideTextOnLoad }">
      <slot>{{ name }}</slot>
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue';
import Spinner from '@/components/Spinner.vue';

const props = defineProps({
  type: { 
    type: String, 
    default: 'button' 
  },
  name: {
    type: String,
    default: 'Кнопка'
  },
  variant: { 
    type: String, 
    default: 'primary',
    validator: v => ['primary', 'secondary', 'danger'].includes(v)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  hideTextOnLoad: {
    type: Boolean,
    default: true
  }
});

const spinnerColor = computed(() => {
  if (props.variant === 'secondary') return '#667eea';
  return 'white';
});

const spinnerSecondaryColor = computed(() => {
  if (props.variant === 'secondary') return 'rgba(102, 126, 234, 0.3)';
  return 'rgba(255, 255, 255, 0.3)';
});
</script>

<style scoped>
.button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-weight: 600;
  font-size: 16px;
  font-family: inherit;
  border-radius: 12px;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: none;
  white-space: nowrap;
  padding: 14px 28px;
  min-width: 120px;
}

.button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
  transform: none !important;
}

.button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.button:active:not(:disabled) {
  transform: translateY(0);
}

/* --- Цвета кнопок --- */
.button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.button--primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #5568d3 0%, #6639b5 100%);
}

.button--secondary {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.button--secondary:hover:not(:disabled) {
  background: rgba(102, 126, 234, 0.1);
}

.button--danger {
  background: #ef4444;
  color: white;
}

.button--danger:hover:not(:disabled) {
  background: #dc2626;
}

/* --- Контент --- */
.button__content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease;
}

.button__content--hidden {
  opacity: 0;
  position: absolute;
  pointer-events: none;
}

/* Пульсация кнопки при загрузке */
.button--loading {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
</style>