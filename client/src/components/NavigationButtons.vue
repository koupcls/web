<template>
  <div class="navigation-buttons" :class="position">
    <button
      v-if="showBack"
      class="nav-button back-button"
      @click="goBack"
      :title="backTitle"
      :aria-label="backTitle"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    </button>
    
    <button
      v-if="showHome"
      class="nav-button home-button"
      @click="goHome"
      :title="homeTitle"
      :aria-label="homeTitle"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  showBack: {
    type: Boolean,
    default: true
  },
  showHome: {
    type: Boolean,
    default: true
  },
  backTitle: {
    type: String,
    default: 'Назад'
  },
  homeTitle: {
    type: String,
    default: 'На главную'
  },
  homePath: {
    type: String,
    default: '/'
  },
  position: {
    type: String,
    default: 'top-right',
    validator: (value) => ['top-right', 'top-left', 'bottom-right', 'bottom-left'].includes(value)
  }
});

const router = useRouter();

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push(props.homePath);
  }
};

const goHome = () => {
  router.push(props.homePath);
};
</script>

<style scoped>
.navigation-buttons {
  position: fixed;
  display: flex;
  gap: 12px;
  z-index: 1000;
  padding: 20px;
}

/* Позиционирование */
.navigation-buttons.top-right {
  top: 0;
  right: 0;
}

.navigation-buttons.top-left {
  top: 0;
  left: 0;
}

.navigation-buttons.bottom-right {
  bottom: 0;
  right: 0;
}

.navigation-buttons.bottom-left {
  bottom: 0;
  left: 0;
}

.nav-button {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.nav-button:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.25);
}

.nav-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Анимация при наведении */
.nav-button svg {
  transition: transform 0.2s ease;
}

.back-button:hover svg {
  transform: translateX(-2px);
}

.home-button:hover svg {
  transform: translateY(-2px);
}

/* Мобильная адаптация */
@media (max-width: 768px) {
  .navigation-buttons {
    padding: 16px;
    gap: 10px;
  }

  .nav-button {
    width: 40px;
    height: 40px;
  }

  .nav-button svg {
    width: 18px;
    height: 18px;
  }
}

/* Для очень маленьких экранов */
@media (max-width: 380px) {
  .nav-button {
    width: 38px;
    height: 38px;
  }
}
</style>