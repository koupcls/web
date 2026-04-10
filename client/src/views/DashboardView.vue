<script setup>
import { ref, computed } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

// Mock data for demonstration
const entities = ref([
  { id: 1, name: 'Пользователи', slug: 'users', count: 234, icon: '👤' },
  { id: 2, name: 'Теги', slug: 'tags', count: 56, icon: '🏷️' },
  { id: 3, name: 'Категории', slug: 'categories', count: 12, icon: '📁' },
  { id: 4, name: 'Ингредиенты', slug: 'ingredients', count: 189, icon: '🥕' },
  { id: 5, name: 'Размерности', slug: 'measurements', count: 24, icon: '⚖️' },
  { id: 6, name: 'Рецепты', slug: 'recipes', count: 445, icon: '📝' },
])

const selectedEntity = ref('users')
const searchQuery = ref('')
const items = ref([
  { id: 1, email: 'user1@example.com', login: 'chef_alex', role: 'user', created: '2024-01-15' },
  { id: 2, email: 'admin@recipy.com', login: 'admin', role: 'admin', created: '2024-01-10' },
  { id: 3, email: 'moderator@recipy.com', login: 'mod_jane', role: 'moderator', created: '2024-01-12' },
  { id: 4, email: 'cook@example.com', login: 'home_cook', role: 'user', created: '2024-02-01' },
  { id: 5, email: 'baker@example.com', login: 'sweet_baker', role: 'user', created: '2024-02-05' },
])

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value
  return items.value.filter(item => 
    item.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.login.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const currentEntityInfo = computed(() => {
  return entities.value.find(e => e.slug === selectedEntity.value)
})
</script>

<template>
  <AppLayout>
    <div class="dashboard-container">
      <div class="container">
        <h1 class="page-title">Дэшборд</h1>
        
        <div class="dashboard-grid">
          <!-- Sidebar with entity types -->
          <aside class="dashboard-sidebar">
            <nav class="entity-nav">
              <RouterLink
                v-for="entity in entities"
                :key="entity.id"
                :to="`/dashboard/${entity.slug}`"
                @click.prevent="selectedEntity = entity.slug"
                :class="['entity-link', { active: selectedEntity === entity.slug }]"
              >
                <span class="entity-icon">{{ entity.icon }}</span>
                <span class="entity-name">{{ entity.name }}</span>
                <span class="entity-count">{{ entity.count }}</span>
              </RouterLink>
            </nav>
          </aside>

          <!-- Main content area -->
          <main class="dashboard-main">
            <!-- Header with search and actions -->
            <div class="dashboard-header">
              <div class="header-left">
                <h2 class="section-title">{{ currentEntityInfo?.name }}</h2>
                <span class="item-count">{{ currentEntityInfo?.count }} записей</span>
              </div>
              
              <div class="header-right">
                <div class="search-box">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Поиск..."
                    class="search-input"
                  />
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="m21 21-4.35-4.35"/>
                  </svg>
                </div>
                
                <button class="btn btn-primary">
                  <span>+ Добавить</span>
                </button>
              </div>
            </div>

            <!-- Data Table -->
            <div class="table-container card">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Логин</th>
                    <th>Роль</th>
                    <th>Дата создания</th>
                    <th>Действия</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in filteredItems" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.email }}</td>
                    <td>{{ item.login }}</td>
                    <td>
                      <span :class="['badge', `badge-${item.role}`]">
                        {{ item.role }}
                      </span>
                    </td>
                    <td>{{ item.created }}</td>
                    <td>
                      <div class="action-buttons">
                        <button class="btn-icon" title="Редактировать">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button class="btn-icon btn-danger" title="Удалить">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <!-- Empty state -->
              <div v-if="filteredItems.length === 0" class="empty-state">
                <p>Ничего не найдено</p>
              </div>
            </div>

            <!-- Pagination -->
            <div class="pagination">
              <button class="btn btn-outline btn-sm" disabled>← Назад</button>
              <span class="page-info">Страница 1 из 5</span>
              <button class="btn btn-outline btn-sm">Вперёд →</button>
            </div>
          </main>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<style scoped>
.dashboard-container {
  padding: var(--spacing-2xl) 0;
}

.page-title {
  margin-bottom: var(--spacing-2xl);
  font-size: var(--font-size-3xl);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: var(--spacing-xl);
}

/* Sidebar */
.dashboard-sidebar {
  position: sticky;
  top: calc(var(--header-height) + var(--spacing-xl));
  height: fit-content;
}

.entity-nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}

.entity-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.entity-link:hover {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.entity-link.active {
  background-color: var(--color-accent-light);
  color: var(--color-accent-primary);
}

.entity-icon {
  font-size: 1.25rem;
}

.entity-name {
  flex: 1;
  font-weight: var(--font-weight-medium);
}

.entity-count {
  background-color: var(--color-bg-tertiary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
}

/* Main Content */
.dashboard-main {
  min-width: 0;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.header-left {
  display: flex;
  align-items: baseline;
  gap: var(--spacing-md);
}

.section-title {
  font-family: var(--font-family-base);
  font-size: var(--font-size-xl);
  margin: 0;
}

.item-count {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.search-box {
  position: relative;
}

.search-box input {
  width: 250px;
  padding: var(--spacing-sm) var(--spacing-md);
  padding-right: 40px;
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
}

.search-box svg {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
}

/* Table */
.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--color-border-light);
}

.data-table th {
  background-color: var(--color-bg-tertiary);
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.data-table td {
  font-size: var(--font-size-sm);
}

.data-table tr:hover {
  background-color: var(--color-bg-tertiary);
}

.badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: capitalize;
}

.badge-user {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-secondary);
}

.badge-admin {
  background-color: var(--color-accent-light);
  color: var(--color-accent-primary);
}

.badge-moderator {
  background-color: #e8f4fd;
  color: var(--color-info);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: var(--spacing-sm);
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  background-color: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: all var(--transition-fast);
}

.btn-icon:hover {
  background-color: var(--color-accent-light);
  color: var(--color-accent-primary);
}

.btn-icon.btn-danger:hover {
  background-color: #fee;
  color: var(--color-error);
}

/* Empty State */
.empty-state {
  padding: var(--spacing-2xl);
  text-align: center;
  color: var(--color-text-tertiary);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
}

.page-info {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

/* Responsive */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-sidebar {
    position: static;
  }
  
  .entity-nav {
    flex-direction: row;
    overflow-x: auto;
  }
  
  .entity-link {
    white-space: nowrap;
  }
}

@media (max-width: 768px) {
  .dashboard-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-right {
    flex-direction: column;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .data-table th,
  .data-table td {
    padding: var(--spacing-sm);
  }
}
</style>
