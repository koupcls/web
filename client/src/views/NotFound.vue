<template>
  <div class="page-gradient">

    <NavigationButtons 
      :show-home="true" 
      position="top-left"
    />

    <div class="container">
      <div class="card">
        
        <!-- Анимированный эмодзи/иллюстрация -->
        <div class="notfound-visual">
          <div class="floating-emoji">🔍</div>
          <div class="error-code">404</div>
        </div>

        <!-- Текст -->
        <div class="notfound-content">
          <h1>Страница не найдена</h1>
          <p class="subtitle">
            Упс! Похоже, вы заблудились.<br>
            Такой страницы не существует или она была перемещена.
          </p>

          <!-- Кнопки действий -->
          <div class="actions">
            <Button variant="primary" @click="goHome" class="btn-home">
              На главную
            </Button>
            <Button variant="secondary" @click="goBack" class="btn-back">
              ← Назад
            </Button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Button from '@/components/Button.vue';
import NavigationButtons from '@/components/NavigationButtons.vue';

const router = useRouter();

const goHome = () => {
  router.push('/');
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
};

const goTo = (path) => {
  router.push(path);
};
</script>

<style scoped>

.notfound-page::before {
  content: '';
  position: absolute;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  top: -200px;
  right: -200px;
  animation: float 20s ease-in-out infinite;
}

.notfound-page::after {
  content: '';
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  bottom: -100px;
  left: -100px;
  animation: float 15s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30px, -30px) scale(1.05); }
  66% { transform: translate(-20px, 20px) scale(0.95); }
}

.container {
  width: 100%;
  max-width: 500px;
  position: relative;
  z-index: 1;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Декоративные круги внутри карточки */
.decoration {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  pointer-events: none;
}

.decoration-1 {
  width: 200px;
  height: 200px;
  top: -80px;
  right: -80px;
}

.decoration-2 {
  width: 150px;
  height: 150px;
  bottom: -60px;
  left: -60px;
}

/* ========== ВИЗУАЛ: 404 ========== */
.notfound-visual {
  margin-bottom: 32px;
  position: relative;
}

.floating-emoji {
  font-size: 4rem;
  margin-bottom: 16px;
  animation: bounce 2s ease-in-out infinite;
  display: inline-block;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

.error-code {
  font-size: 6rem;
  font-weight: 900;
  color: transparent;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  background-clip: text;
  line-height: 1;
  letter-spacing: -4px;
  position: relative;
}

.error-code .pulse {
  display: inline-block;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(0.95); }
}

/* ========== КОНТЕНТ ========== */
.notfound-content h1 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #1a1a2e;
  margin: 0 0 16px;
}

.subtitle {
  color: #6b7280;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 32px;
}

/* Кнопки */
.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.btn-home,
.btn-back {
  min-width: 140px;
  padding: 12px 24px;
  font-weight: 600;
}

/* Полезные ссылки */
.help-links {
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
}

.help-links span {
  display: block;
  font-size: 0.85rem;
  color: #9ca3af;
  margin-bottom: 12px;
}

.links {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.links a {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 8px;
  transition: all 0.2s;
}

.links a:hover {
  background: rgba(102, 126, 234, 0.1);
  color: #764ba2;
}

/* ========== АДАПТИВНОСТЬ ========== */
@media (max-width: 480px) {
  .notfound-card {
    padding: 40px 28px;
  }
  
  .error-code {
    font-size: 4.5rem;
    letter-spacing: -2px;
  }
  
  .floating-emoji {
    font-size: 3rem;
  }
  
  .notfound-content h1 {
    font-size: 1.5rem;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .btn-home,
  .btn-back {
    width: 100%;
  }
}

/* ========== ДОПОЛНИТЕЛЬНЫЕ АНИМАЦИИ ========== */
/* Плавное появление элементов */
.notfound-content {
  animation: fadeIn 0.6s ease-out 0.2s both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Эффект при наведении на карточку */
.notfound-card:hover {
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.35);
  transition: box-shadow 0.3s ease;
}
</style>