<template>
  <div class="mobile-menu-overlay" v-if="isOpen" @click="closeMenu"></div>
  
  <nav class="mobile-menu" :class="{ open: isOpen }">
    <div class="mobile-menu-header">
      <div class="user-info">
        <div class="user-avatar">
          <img v-if="user?.avatar_url" :src="user.avatar_url" :alt="user.login" />
          <span v-else>{{ userInitials }}</span>
        </div>
        <div class="user-details">
          <div class="user-name">{{ user?.login }}</div>
          <div class="user-tag">@{{ user?.tag }}</div>
        </div>
      </div>
      <button class="close-btn" @click="closeMenu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <div class="mobile-menu-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="nav-item"
        :class="{ active: modelValue === tab.id }"
        @click="selectTab(tab.id)"
      >
        <span class="nav-icon">{{ tab.icon }}</span>
        <span class="nav-label">{{ tab.label }}</span>
        <span v-if="tab.count !== undefined && tab.count > 0" class="nav-count">
          {{ tab.count }}
        </span>
      </button>
    </div>
  </nav>

  <!-- Bottom Navigation -->
  <div class="bottom-nav">
    <button
      v-for="tab in visibleTabs"
      :key="tab.id"
      class="bottom-nav-item"
      :class="{ active: modelValue === tab.id }"
      @click="$emit('update:modelValue', tab.id)"
    >
      <span class="bottom-nav-icon">{{ tab.icon }}</span>
      <span class="bottom-nav-label">{{ tab.label }}</span>
      <span v-if="tab.count !== undefined && tab.count > 0" class="bottom-nav-count">
        {{ tab.count }}
      </span>
    </button>
    
    <button class="bottom-nav-item menu-toggle" @click="openMenu">
      <span class="bottom-nav-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </span>
      <span class="bottom-nav-label">Ещё</span>
    </button>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  modelValue: String,
  tabs: Array,
  user: Object
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);

const visibleTabs = computed(() => {
  return props.tabs?.slice(0, 4) || [];
});

const userInitials = computed(() => {
  if (!props.user?.login) return '👤';
  const letters = props.user.login.replace(/[^a-zA-Zа-яА-Я]/g, '').slice(0, 2).toUpperCase();
  return letters || '👤';
});

const openMenu = () => {
  isOpen.value = true;
  document.body.style.overflow = 'hidden';
};

const closeMenu = () => {
  isOpen.value = false;
  document.body.style.overflow = '';
};

const selectTab = (tabId) => {
  emit('update:modelValue', tabId);
  closeMenu();
};
</script>

<style scoped>
.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 280px;
  height: 100vh;
  background: white;
  z-index: 1001;
  transition: right 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
}

.mobile-menu.open {
  right: 0;
}

.mobile-menu-header {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-avatar span {
  font-weight: 600;
  font-size: 1rem;
}

.user-details {
  flex: 1;
}

.user-name {
  font-weight: 600;
  font-size: 1rem;
}

.user-tag {
  opacity: 0.9;
  font-size: 0.85rem;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.mobile-menu-nav {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: none;
  background: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  color: #64748b;
  transition: all 0.2s;
  margin-bottom: 8px;
}

.nav-item:hover {
  background: #f8fafc;
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
  font-weight: 600;
}

.nav-icon {
  font-size: 1.5rem;
  width: 28px;
  text-align: center;
}

.nav-label {
  flex: 1;
  text-align: left;
}

.nav-count {
  background: #f1f5f9;
  color: #64748b;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.nav-item.active .nav-count {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

/* Bottom Navigation */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-top: 1px solid #e2e8f0;
  display: flex;
  padding: 8px 0;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 99;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
}

.bottom-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border: none;
  background: none;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
  position: relative;
}

.bottom-nav-item.active {
  color: #667eea;
}

.bottom-nav-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bottom-nav-label {
  font-size: 0.7rem;
  font-weight: 500;
}

.bottom-nav-count {
  position: absolute;
  top: 4px;
  right: 50%;
  transform: translateX(12px);
  background: #ef4444;
  color: white;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 2px 5px;
  border-radius: 10px;
  min-width: 16px;
  text-align: center;
}

.menu-toggle {
  color: #64748b;
}

.menu-toggle.active {
  color: #667eea;
}

@media (min-width: 769px) {
  .mobile-menu,
  .mobile-menu-overlay,
  .bottom-nav {
    display: none;
  }
}
</style>