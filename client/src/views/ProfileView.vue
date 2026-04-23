<template>
  <div class="profile-page">
    <!-- Desktop Sidebar -->
    <SidebarMenu 
      v-if="!isMobile"
      v-model="activeTab"
      :tabs="tabs"
      :user="profile"
    />

    <!-- Mobile Menu -->
    <MobileMenu
      v-else
      v-model="activeTab"
      :tabs="tabs"
      :user="profile"
    />

    <!-- Main Content -->
    <main class="main-content" :class="{ 'has-sidebar': !isMobile }">
      <!-- Gradient Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">Профиль</h1>
        </div>
      </div>

      <div class="content-wrapper">
        <!-- Profile Card -->
        <ProfileCard 
          :user="profile"
          :coverImage="coverImage"
          @navigate="handleNavigate"
        />

        <!-- Tab Content -->
        <div class="tab-content">
          <!-- Posts -->
          <div v-if="activeTab === 'posts'" class="tab-pane">
            <PostsList :user-id="profile?.uuid" status="published" />
          </div>

          <!-- Drafts -->
          <div v-else-if="activeTab === 'drafts'" class="tab-pane">
            <PostsList :user-id="profile?.uuid" status="draft" />
          </div>

          <!-- Followers -->
          <div v-else-if="activeTab === 'followers'" class="tab-pane">
            <EmptyState 
              icon="👥" 
              title="Подписчики" 
              message="Здесь будут ваши подписчики"
            />
          </div>

          <!-- Following -->
          <div v-else-if="activeTab === 'following'" class="tab-pane">
            <EmptyState 
              icon="👤" 
              title="Подписки" 
              message="Вы пока ни на кого не подписаны"
            />
          </div>

          <!-- Notifications -->
          <div v-else-if="activeTab === 'notifications'" class="tab-pane">
            <NotificationsList />
          </div>

          <!-- Settings -->
          <div v-else-if="activeTab === 'settings'" class="tab-pane">
            <SettingsForm 
              :profile="profile" 
              @saved="onProfileSaved" 
              @logout="handleLogout" 
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/composables/useToast';
import { profileApi } from '@/api/profile';
import MobileMenu from '@/components/profile/MobileMenu.vue';
import ProfileCard from '@/components/profile/ProfileCard.vue';
import PostsList from '@/components/profile/PostsList.vue';
import NotificationsList from '@/components/profile/NotificationsList.vue';
import SettingsForm from '@/components/profile/SettingsForm.vue';
import EmptyState from '@/components/profile/EmptyState.vue';
import SidebarMenu from '@/components/profile/SideBarMenu.vue'

const router = useRouter();
const { showSuccess } = useToast();
const authStore = useAuthStore();

const profile = ref(null);
const activeTab = ref('posts');
const isMobile = ref(window.innerWidth <= 768);

const coverImage = computed(() => {
  return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
});

const tabs = computed(() => [
  { id: 'posts', label: 'Посты', icon: '📝', count: profile.value?.total_posts || 0 },
  { id: 'drafts', label: 'Черновики', icon: '📄', count: profile.value?.drafts_count || 0 },
  { id: 'followers', label: 'Подписчики', icon: '👥', count: profile.value?.followers_count || 0 },
  { id: 'following', label: 'Подписки', icon: '👤', count: profile.value?.follows_count || 0 },
  { id: 'notifications', label: 'Оповещения', icon: '🔔' },
  { id: 'settings', label: 'Настройки', icon: '⚙️' }
]);

const handleNavigate = (tabId) => {
  activeTab.value = tabId;
};

const onProfileSaved = (updatedData) => {
  profile.value = { ...profile.value, ...updatedData };
  showSuccess('Профиль обновлён ✨', 'success');
};

const handleLogout = async () => {
  await authStore.logout();
  showSuccess('Вы вышли из аккаунта 👋', 'info');
  router.push('/');
};

const fetchProfile = async () => {
  try {
    const res = await profileApi.getProfile();
    if (res.data?.success) {
      profile.value = res.data.data.user;
      authStore.user = profile.value;
    }
  } catch (e) {
    showSuccess('Не удалось загрузить профиль', 'error');
  }
};

const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login');
    return;
  }
  
  await fetchProfile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
});
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
}

.main-content {
  flex: 1;
  min-height: 100vh;
  padding-bottom: 80px;
}

.main-content.has-sidebar {
  margin-left: 260px;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 32px 40px;
  margin-bottom: 24px;
}

.header-content {
  max-width: 900px;
  margin: 0 auto;
}

.page-title {
  color: white;
  font-size: 2rem;
  font-weight: 800;
  margin: 0;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 24px;
}

.tab-content {
  background: white;
  border-radius: 20px;
  padding: 24px;
  min-height: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.tab-pane {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@media (max-width: 768px) {
  .main-content {
    padding-bottom: 80px;
  }

  .page-header {
    padding: 24px 16px;
    margin-bottom: 0;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .content-wrapper {
    padding: 0;
  }

  .tab-content {
    border-radius: 0;
    padding: 16px;
    box-shadow: none;
  }
}
</style>