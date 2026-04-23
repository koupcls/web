<template>
  <div class="posts-list">
    <div v-if="loading" class="posts-skeleton">
      <div v-for="i in 3" :key="i" class="post-card skeleton"></div>
    </div>
    <div v-else-if="posts?.length" class="posts-grid">
      <!-- Здесь будет реальный список постов -->
      <div v-for="post in posts" :key="post.id" class="post-card">
        {{ post.title }}
      </div>
    </div>
    <div v-else class="empty-state">
      <p>📭 Пока нет постов</p>
      <Button variant="primary" @click="$emit('create')">Создать первый</Button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { profileApi } from '@/api/profile';
import Button from '@/components/Button.vue';

const props = defineProps({
  userId: String,
  status: { type: String, default: 'published' }
});

const emit = defineEmits(['create']);

const loading = ref(true);
const posts = ref([]);

onMounted(async () => {
  if (!props.userId) {
    loading.value = false;
    return;
  }
  try {
    const apiCall = props.status === 'draft' 
      ? profileApi.getUserDrafts(props.userId)
      : profileApi.getUserPosts(props.userId);
    const res = await apiCall;
    posts.value = res.data?.data?.items || [];
  } catch (e) {
    console.warn('Posts load error', e);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.posts-skeleton, .posts-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.post-card {
  padding: 20px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}
.post-card.skeleton {
  height: 100px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #6b7280;
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
</style>