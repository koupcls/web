import api from "@/composables/useApi";

export const profileApi = {
  // Получение данных профиля (текущего пользователя)
  getProfile: () => api.get('/auth/user'),
  
  // Обновление профиля
  updateProfile: (data) => api.patch('/auth/user', data),
  
  // Получение постов пользователя
  getUserPosts: (userId, { page = 1, limit = 10, status = 'published' } = {}) => 
    api.get('/posts', {
      params: { author: userId, page, limit, status }
    }),
  
  // Получение черновиков
  getUserDrafts: (userId, { page = 1, limit = 10 } = {}) =>
    api.get('/posts', {
      params: { author: userId, page, limit, status: 'draft' }
    }),
  
  // Получение уведомлений (заглушка)
  getNotifications: () => {
    // TODO: заменить на реальный эндпоинт, когда будет готов
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: {
            success: true,
            data: {
              notifications: [
                { id: 1, type: 'like', message: 'Ваш рецепт понравился пользователю @chef_anna', read: false, created_at: new Date().toISOString() },
                { id: 2, type: 'comment', message: 'Новый комментарий к "Паста карбонара"', read: true, created_at: new Date().toISOString() },
                { id: 3, type: 'follow', message: '@foodie_mike начал следить за вами', read: false, created_at: new Date().toISOString() }
              ],
              meta: { unread_count: 2 }
            }
          }
        });
      }, 800);
    });
  }
};