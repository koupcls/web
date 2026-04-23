<template>
  <nav class="sidebar">
    <Logo/>

    <div class="sidebar-nav">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="nav-item"
        :class="{ active: modelValue === tab.id }"
        @click="$emit('update:modelValue', tab.id)"
      >
        <span class="nav-icon">{{ tab.icon }}</span>
        <span class="nav-label">{{ tab.label }}</span>
        <span v-if="tab.count !== undefined && tab.count > 0" class="nav-count">
          {{ tab.count }}
        </span>
      </button>
    </div>

    <div class="sidebar-footer">
      <div class="user-mini">
        <div class="user-avatar">
          <img v-if="user?.avatar_url" :src="user.avatar_url" :alt="user.login" />
          <span v-else>{{ userInitials }}</span>
        </div>
        <div class="user-info">
          <div class="user-name">{{ user?.login }}</div>
          <div class="user-tag">@{{ user?.tag }}</div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue';
import Logo from '../Logo.vue';

const props = defineProps({
  modelValue: String,
  tabs: Array,
  user: Object
});

defineEmits(['update:modelValue']);

const userInitials = computed(() => {
  if (!props.user?.login) return '👤';
  const letters = props.user.login.replace(/[^a-zA-Zа-яА-Я]/g, '').slice(0, 2).toUpperCase();
  return letters || '👤';
});
</script>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  background: white;
  border-right: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
}


.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
}

.nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  color: #64748b;
  transition: all 0.2s;
  margin-bottom: 4px;
}

.nav-item:hover {
  background: #f8fafc;
  color: #0f172a;
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
  font-weight: 600;
}

.nav-icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
}

.nav-label {
  flex: 1;
  text-align: left;
}

.nav-count {
  background: #f1f5f9;
  color: #64748b;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
}

.nav-item.active .nav-count {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid #f1f5f9;
}

.user-mini {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  cursor: pointer;
  transition: background 0.2s;
}

.user-mini:hover {
  background: #f1f5f9;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-avatar span {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: #0f172a;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-tag {
  color: #64748b;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }
}
</style>