<script setup>
import { ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const route = useRoute()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="header">
    <div class="container header-content">
      <!-- Logo -->
      <RouterLink to="/" class="header-logo" @click="closeMenu">
        <span>🍳</span>
        <span>Recipy</span>
      </RouterLink>

      <!-- Navigation -->
      <nav :class="['header-nav', { active: isMenuOpen }]">
        <RouterLink 
          to="/" 
          class="nav-link"
          :class="{ active: route.path === '/' }"
          @click="closeMenu"
        >
          Главная
        </RouterLink>
        <RouterLink 
          to="/recipes" 
          class="nav-link"
          :class="{ active: route.path.startsWith('/recipes') }"
          @click="closeMenu"
        >
          Рецепты
        </RouterLink>
        <RouterLink 
          to="/categories" 
          class="nav-link"
          :class="{ active: route.path.startsWith('/categories') }"
          @click="closeMenu"
        >
          Категории
        </RouterLink>
        <RouterLink 
          v-if="authStore.isAuthenticated"
          to="/dashboard" 
          class="nav-link"
          :class="{ active: route.path.startsWith('/dashboard') }"
          @click="closeMenu"
        >
          Дэшборд
        </RouterLink>
      </nav>

      <!-- Actions -->
      <div class="header-actions">
        <template v-if="authStore.isAuthenticated">
          <RouterLink to="/profile" class="btn btn-outline btn-sm" @click="closeMenu">
            Профиль
          </RouterLink>
          <button class="btn btn-primary btn-sm" @click="authStore.logout()">
            Выйти
          </button>
        </template>
        <template v-else>
          <RouterLink to="/login" class="btn btn-outline btn-sm" @click="closeMenu">
            Войти
          </RouterLink>
          <RouterLink to="/register" class="btn btn-primary btn-sm" @click="closeMenu">
            Регистрация
          </RouterLink>
        </template>
        
        <!-- Mobile menu toggle -->
        <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.menu-toggle {
  display: none;
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }
  
  .header-actions .btn {
    display: none;
  }
  
  .header-nav.active ~ .header-actions .btn {
    display: inline-flex;
  }
}
</style>
