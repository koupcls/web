<template>
  <div class="notifications">
    <div v-if="loading" class="notifications-skeleton">
      <div v-for="i in 4" :key="i" class="notification-item skeleton"></div>
    </div>
    <div v-else-if="notifications?.length" class="notifications-list">
      <div 
        v-for="note in notifications" 
        :key="note.id" 
        class="notification-item"
        :class="{ unread: !note.read }"
      >
        <span class="note-icon">
          {{ note.type === 'like' ? '❤️' : note.type === 'comment' ? '💬' : '👤' }}
        </span>
        <div class="note-content">
          <p class="note-message">{{ note.message }}</p>
          <span class="note-time">{{ formatTime(note.created_at) }}</span>
        </div>
      </div>
    </div>
    <div v-else class="empty-state">
      <p>🔕 Нет новых оповещений</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { profileApi } from '@/api/profile';

const loading = ref(true);
const notifications = ref([]);

const formatTime = (iso) => {
  const date = new Date(iso);
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
};

onMounted(async () => {
  try {
    const res = await profileApi.getNotifications();
    notifications.value = res.data?.data?.notifications || [];
  } catch (e) {
    console.warn('Notifications load error', e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.notifications-skeleton, .notifications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.notification-item {
  display: flex;
  gap: 12px;
  padding: 14px;
  border-radius: 12px;
  background: #f8fafc;
  border-left: 3px solid transparent;
  transition: all 0.2s;
}
.notification-item.unread {
  background: rgba(102, 126, 234, 0.08);
  border-left-color: #667eea;
}
.notification-item.skeleton {
  height: 60px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.note-icon { font-size: 1.2rem; }
.note-content { flex: 1; }
.note-message { margin: 0 0 4px; font-size: 0.95rem; color: #1a1a2e; }
.note-time { font-size: 0.8rem; color: #9ca3af; }
.empty-state {
  text-align: center;
  padding: 30px 20px;
  color: #6b7280;
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>