<template>
  <div class="profile-card">
    <!-- Cover Image -->
    <div class="cover-image" :style="{ backgroundImage: `url(${coverImage})` }">
      <div class="cover-overlay"></div>
    </div>

    <div class="profile-content">
      <!-- Avatar -->
      <div class="avatar-wrapper">
        <div class="avatar">
          <img 
            v-if="user?.avatar_url && !avatarError" 
            :src="user.avatar_url" 
            :alt="user.login"
            @error="handleAvatarError"
          />
          <span v-else class="avatar-placeholder">{{ avatarInitials }}</span>
        </div>
        <span v-if="user?.is_online" class="online-indicator" title="Онлайн"></span>
      </div>

      <!-- User Info -->
      <div class="user-info">
        <div class="name-row">
          <h1 class="display-name">{{ user?.login }}</h1>
          <span v-if="user?.is_verified" class="verified-badge" title="Подтверждён">✓</span>
        </div>
        <p class="username">@{{ user?.tag }}</p>
        
        <p v-if="user?.bio" class="bio">{{ user.bio }}</p>

        <div class="meta-info">
          <span class="meta-item">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {{ registrationDate }}
          </span>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-grid">
        <div class="stat-card" @click="emit('navigate', 'following')">
          <div class="stat-value">{{ user?.follows_count || 0 }}</div>
          <div class="stat-label">подписок</div>
        </div>
        <div class="stat-card" @click="emit('navigate', 'followers')">
          <div class="stat-value">{{ user?.followers_count || 0 }}</div>
          <div class="stat-label">подписчиков</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ user?.total_posts || 0 }}</div>
          <div class="stat-label">постов</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ user?.total_likes || 0 }}</div>
          <div class="stat-label">лайков</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  user: Object,
  coverImage: String
});

const emit = defineEmits(['navigate']);

const avatarError = ref(false);

const avatarInitials = computed(() => {
  if (!props.user?.login) return '👤';
  const letters = props.user.login.replace(/[^a-zA-Zа-яА-Я]/g, '').slice(0, 2).toUpperCase();
  return letters || '👤';
});

const registrationDate = computed(() => {
  if (!props.user?.created_at) return '';
  const date = new Date(props.user.created_at);
  return date.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
});

const handleAvatarError = () => {
  avatarError.value = true;
};
</script>

<style scoped>
.profile-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
}

.cover-image {
  height: 160px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.cover-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.4) 100%);
}

.profile-content {
  padding: 0 24px 24px;
  position: relative;
}

.avatar-wrapper {
  position: relative;
  margin-top: -50px;
  margin-bottom: 16px;
  display: inline-block;
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: 4px solid white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  font-size: 2rem;
  font-weight: 700;
  color: white;
}

.online-indicator {
  position: absolute;
  bottom: 8px;
  right: 8px;
  width: 14px;
  height: 14px;
  background: #10b981;
  border: 3px solid white;
  border-radius: 50%;
}

.user-info {
  margin-bottom: 20px;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.display-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.verified-badge {
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.username {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 12px;
}

.bio {
  color: #334155;
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 12px;
  white-space: pre-wrap;
}

.meta-info {
  color: #64748b;
  font-size: 0.9rem;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

.stat-card {
  text-align: center;
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  cursor: pointer;
  transition: all 0.2s;
}

.stat-card:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  transform: translateY(-2px);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

@media (max-width: 768px) {
  .profile-card {
    border-radius: 0;
    margin-bottom: 0;
    box-shadow: none;
  }

  .cover-image {
    height: 140px;
  }

  .profile-content {
    padding: 0 16px 16px;
  }

  .avatar-wrapper {
    margin-top: -40px;
  }

  .avatar {
    width: 80px;
    height: 80px;
    border-width: 3px;
  }

  .avatar-placeholder {
    font-size: 1.5rem;
  }

  .display-name {
    font-size: 1.25rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .stat-card {
    padding: 10px;
  }

  .stat-value {
    font-size: 1.25rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }
}
</style>