<template>
       <RouterLink to="/" class="logo" @click="handleLogoClick">
        <span class="logo-icon">🍳</span>
        <h1 class="logo-text">Recipy<span>Social</span></h1>
      </RouterLink>
</template>

<script setup>
import { useRouter, RouterLink } from 'vue-router';

const router = useRouter();

const handleLogoClick = (e) => {
    if (router.currentRoute.value.path === '/') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};
</script>

<style scoped>
    .logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  padding: 4px 8px;
  border-radius: 12px;
  transition: all 0.2s;
}

.logo:hover {
  background: rgba(102, 126, 234, 0.08);
}

.logo-icon {
  font-size: 1.5rem;
  animation: bounce 3s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.logo-text {
  font-size: 1.3rem;
  font-weight: 800;
  margin: 0;
  color: #1a1a2e;
  letter-spacing: -0.5px;
}

.logo-text span {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
</style>
