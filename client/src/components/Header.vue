<template>
  <header class="main-header" :class="{ 'scrolled': isScrolled }">
    <div class="header-container">
      
      <!-- Логотип -->
     <Logo/>

      <!-- Навигация для десктопа -->
      <nav class="desktop-nav" v-if="isDesktop">
        <RouterLink to="/feed" class="nav-link" active-class="active">Лента</RouterLink>
        <RouterLink to="/explore" class="nav-link" active-class="active">Поиск</RouterLink>
        <RouterLink to="/create" class="nav-link" active-class="active">
          <Button class="create-btn">＋ Создать</Button>
        </RouterLink>
      </nav>

      <!-- Правая часть: авторизация / профиль -->
      <div class="auth-section">
        
        <!-- Не авторизован -->
        <template v-if="!authStore.isAuthenticated">
          <RouterLink to="/login" class="auth-link">
            <Button variant="secondary" class="btn-login">Войти</Button>
          </RouterLink>
          <RouterLink to="/register" class="auth-link">
            <Button variant="primary" class="btn-register">Регистрация</Button>
          </RouterLink>
        </template>

        <!-- Авторизован: профиль -->
        <template v-else>
          <div class="profile-wrapper" ref="profileRef">
            <button 
              class="profile-trigger" 
              @click="toggleDropdown"
              :aria-expanded="dropdownOpen"
              aria-haspopup="true"
            >
              <div class="avatar-small" :class="{ 'has-role': profile?.role && profile.role !== 'user' }">
                <img 
                  v-if="profile?.avatar_url && !avatarError" 
                  :src="profile.avatar_url" 
                  :alt="profile.login"
                  @error="handleAvatarError"
                />
                <span v-else class="avatar-initials">{{ avatarInitials }}</span>
                <!-- Бейдж роли -->
                <span v-if="profile?.role && profile.role !== 'user'" class="role-dot" :title="roleTitle">
                  {{ roleIcon }}
                </span>
              </div>
              <span class="profile-name">{{ profile?.login }}</span>
              <span class="dropdown-arrow" :class="{ open: dropdownOpen }">▼</span>
            </button>

            <!-- Выпадающее меню -->
            <transition name="dropdown">
              <div 
                v-if="dropdownOpen" 
                class="profile-dropdown"
                @click.stop
              >
                <div class="dropdown-header">
                  <div class="avatar-small">
                    <img 
                      v-if="profile?.avatar_url && !avatarError" 
                      :src="profile.avatar_url" 
                      :alt="profile.login"
                    />
                    <span v-else>{{ avatarInitials }}</span>
                  </div>
                  <div>
                    <p class="dropdown-login">{{ profile?.login }}</p>
                    <p class="dropdown-email">{{ profile?.email }}</p>
                  </div>
                </div>
                
                <div class="dropdown-divider"></div>
                
                <RouterLink to="/profile" class="dropdown-item" @click="closeDropdown">
                  <span class="item-icon">👤</span>
                  Мой профиль
                </RouterLink>
                <RouterLink to="/profile?tab=settings" class="dropdown-item" @click="closeDropdown">
                  <span class="item-icon">⚙️</span>
                  Настройки
                </RouterLink>
                <RouterLink to="/bookmarks" class="dropdown-item" @click="closeDropdown">
                  <span class="item-icon">🔖</span>
                  Закладки
                </RouterLink>
                
                <div class="dropdown-divider"></div>
                
                <button class="dropdown-item danger" @click="handleLogout">
                  <span class="item-icon">🚪</span>
                  Выйти
                </button>
              </div>
            </transition>
          </div>
        </template>

      </div>

      <!-- Мобильное меню: гамбургер -->
      <button class="mobile-toggle" @click="mobileMenuOpen = !mobileMenuOpen" aria-label="Меню">
        <span class="hamburger" :class="{ open: mobileMenuOpen }"></span>
      </button>

    </div>

    <!-- Мобильное меню (выезжающее) -->
    <transition name="slide">
      <div v-if="mobileMenuOpen" class="mobile-menu">
        <nav class="mobile-nav">
          <RouterLink to="/feed" class="mobile-link" @click="mobileMenuOpen = false">📰 Лента</RouterLink>
          <RouterLink to="/explore" class="mobile-link" @click="mobileMenuOpen = false">🔍 Поиск</RouterLink>
          <RouterLink to="/create" class="mobile-link create" @click="mobileMenuOpen = false">＋ Создать рецепт</RouterLink>
          
          <template v-if="authStore.isAuthenticated">
            <div class="mobile-divider"></div>
            <RouterLink to="/profile" class="mobile-link" @click="mobileMenuOpen = false">👤 Профиль</RouterLink>
            <RouterLink to="/profile?tab=settings" class="mobile-link" @click="mobileMenuOpen = false">⚙️ Настройки</RouterLink>
            <button class="mobile-link logout" @click="handleLogoutMobile">🚪 Выйти</button>
          </template>
          
          <template v-else>
            <div class="mobile-divider"></div>
            <RouterLink to="/login" class="mobile-link" @click="mobileMenuOpen = false">Войти</RouterLink>
            <RouterLink to="/register" class="mobile-link primary" @click="mobileMenuOpen = false">Регистрация</RouterLink>
          </template>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/composables/useToast';
import Logo from './Logo.vue';
import Button from './Button.vue';

const router = useRouter();
const { showSuccess } = useToast();
const authStore = useAuthStore();

// Состояния
const dropdownOpen = ref(false);
const mobileMenuOpen = ref(false);
const isScrolled = ref(false);
const isDesktop = ref(window.innerWidth >= 768);
const profileRef = ref(null);
const avatarError = ref(false);

// Профиль из store
const profile = computed(() => authStore.user);

// Инициалы для аватара
const avatarInitials = computed(() => {
  if (!profile.value?.login) return '👤';
  const letters = profile.value.login.replace(/[^a-zA-Zа-яА-Я]/g, '').slice(0, 2).toUpperCase();
  return letters || '👤';
});

// Роль пользователя
const roleIcon = computed(() => {
  const roles = { admin: '👑', moderator: '🛡️' };
  return roles[profile.value?.role] || '';
});

const roleTitle = computed(() => {
  const titles = { admin: 'Администратор', moderator: 'Модератор' };
  return titles[profile.value?.role] || '';
});

// Обработчики
const handleLogoClick = (e) => {
  // Если уже на главной — просто скролл вверх
  if (router.currentRoute.value.path === '/') {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const closeDropdown = () => {
  dropdownOpen.value = false;
};

const handleAvatarError = () => {
  avatarError.value = true;
};

const handleLogout = async () => {
  closeDropdown();
  await authStore.logout();
  showSuccess('Вы вышли из аккаунта 👋', 'info');
  router.push('/');
};

const handleLogoutMobile = async () => {
  mobileMenuOpen.value = false;
  await authStore.logout();
  showSuccess('Вы вышли из аккаунта 👋', 'info');
  router.push('/');
};

// Закрытие дропдауна при клике вне
const handleClickOutside = (e) => {
  if (profileRef.value && !profileRef.value.contains(e.target)) {
    closeDropdown();
  }
};

// Отслеживание скролла для эффекта шапки
const handleScroll = () => {
  isScrolled.value = window.scrollY > 10;
};

// Ресайз для определения десктопа
const handleResize = () => {
  isDesktop.value = window.innerWidth >= 768;
  if (isDesktop.value) mobileMenuOpen.value = false;
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('resize', handleResize);
  handleScroll();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
/* ========== HEADER BASE ========== */
.main-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  transition: all 0.3s ease;
}

.main-header.scrolled {
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 4px 30px rgba(102, 126, 234, 0.15);
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

/* ========== DESKTOP NAV ========== */
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f8fafc;
  padding: 4px;
  border-radius: 16px;
  border: 1px solid rgba(102, 126, 234, 0.1);
}

.nav-link {
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 500;
  color: #6b7280;
  transition: all 0.2s;
}

.nav-link:hover {
  color: #1a1a2e;
  background: rgba(102, 126, 234, 0.08);
}

.nav-link.active {
  background: white;
  color: #667eea;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.create-btn {
  padding: 8px 14px;
  font-weight: 500;
}

/* ========== AUTH SECTION ========== */
.auth-section {
  display: flex;
  align-items: center;
}

.auth-link {
  text-decoration: none;
}

.btn-login {
  color: #667eea !important;
  background: transparent !important;
  border-color: #667eea !important;
}

.btn-login:hover {
  background: rgba(102, 126, 234, 0.08) !important;
}

.btn-register {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  border: none !important;
  color: white !important;
  margin-left: 10px;
}

/* ========== PROFILE DROPDOWN ========== */
.profile-wrapper {
  position: relative;
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 12px 6px 6px;
  background: transparent;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.profile-trigger:hover {
  background: rgba(102, 126, 234, 0.08);
}

.avatar-small {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  flex-shrink: 0;
}

.avatar-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
}

.avatar-small.has-role {
  box-shadow: 0 0 0 2px white, 0 0 0 4px #667eea;
}

.role-dot {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  border: 2px solid #667eea;
}

.profile-name {
  font-weight: 600;
  color: #1a1a2e;
  font-size: 0.95rem;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dropdown-arrow {
  font-size: 0.6rem;
  color: #9ca3af;
  transition: transform 0.2s;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

/* Dropdown menu */
.profile-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 260px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.15);
  overflow: hidden;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08), rgba(118, 75, 162, 0.08));
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
}

.dropdown-header .avatar-small {
  width: 44px;
  height: 44px;
}

.dropdown-login {
  font-weight: 700;
  color: #1a1a2e;
  margin: 0;
  font-size: 1rem;
}

.dropdown-email {
  font-size: 0.8rem;
  color: #6b7280;
  margin: 2px 0 0;
}

.dropdown-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 4px 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  text-decoration: none;
  color: #374151;
  font-size: 0.95rem;
  transition: all 0.2s;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background: rgba(102, 126, 234, 0.08);
  color: #667eea;
}

.dropdown-item.danger {
  color: #dc2626;
}

.dropdown-item.danger:hover {
  background: #fee2e2;
}

.item-icon {
  font-size: 1.1rem;
  width: 20px;
  text-align: center;
}

/* Dropdown transition */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* ========== MOBILE TOGGLE ========== */
.mobile-toggle {
  display: none;
  width: 40px;
  height: 40px;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.mobile-toggle:hover {
  background: rgba(102, 126, 234, 0.08);
}

.hamburger {
  width: 20px;
  height: 2px;
  background: #1a1a2e;
  border-radius: 2px;
  position: relative;
  transition: background 0.2s;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 2px;
  background: #1a1a2e;
  border-radius: 2px;
  left: 0;
  transition: transform 0.3s;
}

.hamburger::before { top: -6px; }
.hamburger::after { top: 6px; }

.hamburger.open {
  background: transparent;
}
.hamburger.open::before { transform: rotate(45deg) translate(4px, 4px); }
.hamburger.open::after { transform: rotate(-45deg) translate(4px, -4px); }

/* ========== MOBILE MENU ========== */
.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  padding: 16px;
  animation: slideDown 0.3s ease;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 12px;
  text-decoration: none;
  color: #374151;
  font-weight: 500;
  font-size: 1rem;
  transition: all 0.2s;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.mobile-link:hover {
  background: rgba(102, 126, 234, 0.08);
  color: #667eea;
}

.mobile-link.create {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
  justify-content: center;
  font-weight: 600;
}

.mobile-link.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white !important;
  justify-content: center;
  font-weight: 600;
}

.mobile-link.logout {
  color: #dc2626;
}

.mobile-link.logout:hover {
  background: #fee2e2;
}

.mobile-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 8px 0;
}

/* Slide transition for mobile menu */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* ========== ADAPTIVE ========== */
@media (max-width: 768px) {
  .desktop-nav,
  .auth-section > .auth-link:first-child {
    display: none;
  }
  
  .mobile-toggle {
    display: flex;
  }
  
  .header-container {
    padding: 0.6rem 1rem;
  }
  
  .logo-text {
    font-size: 1.15rem;
  }
  
  .profile-name {
    display: none;
  }
  
  .dropdown-arrow {
    display: none;
  }
  
  .profile-trigger {
    padding: 4px;
  }
  
  .profile-dropdown {
    right: -12px;
    width: 280px;
  }
}

@media (max-width: 360px) {
  .logo-icon { font-size: 1.3rem; }
  .logo-text { font-size: 1rem; }
}
</style>