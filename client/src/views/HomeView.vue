<script setup>
import { ref } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'

const featuredCategories = [
  { id: 1, name: 'Завтраки', slug: 'breakfast', color: '#f39c12', count: 124 },
  { id: 2, name: 'Обеды', slug: 'lunch', color: '#e74c3c', count: 89 },
  { id: 3, name: 'Ужины', slug: 'dinner', color: '#9b59b6', count: 156 },
  { id: 4, name: 'Десерты', slug: 'desserts', color: '#e67e22', count: 203 },
  { id: 5, name: 'Закуски', slug: 'snacks', color: '#27ae60', count: 78 },
  { id: 6, name: 'Напитки', slug: 'drinks', color: '#3498db', count: 45 },
]

const popularRecipes = [
  { 
    id: 1, 
    title: 'Домашняя паста карбонара', 
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400', 
    time: '30 мин',
    portions: 4
  },
  { 
    id: 2, 
    title: 'Классический чизкейк', 
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', 
    time: '2 часа',
    portions: 8
  },
  { 
    id: 3, 
    title: 'Азиатский том ям', 
    image: 'https://images.unsplash.com/photo-1548943487-a2e4e43b485c?w=400', 
    time: '45 мин',
    portions: 4
  },
  { 
    id: 4, 
    title: 'Средиземноморский салат', 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400', 
    time: '15 мин',
    portions: 2
  },
]
</script>

<template>
  <AppLayout>
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">Кулинарные рецепты<br>для каждого</h1>
          <p class="hero-subtitle">
            Откройте для себя мир вкусов. Делитесь своими рецептами,<br>
            находите новые идеи и вдохновляйтесь каждый день.
          </p>
          <div class="hero-actions">
            <RouterLink to="/recipes" class="btn btn-primary btn-lg">
              Смотреть рецепты
            </RouterLink>
            <RouterLink to="/register" class="btn btn-outline btn-lg">
              Присоединиться
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section">
      <div class="container">
        <h2 class="section-title">Категории</h2>
        <div class="categories-grid">
          <RouterLink 
            v-for="category in featuredCategories" 
            :key="category.id"
            :to="`/categories/${category.slug}`"
            class="category-card"
            :style="{ borderColor: category.color }"
          >
            <div class="category-icon" :style="{ backgroundColor: category.color + '20' }">
              <span :style="{ color: category.color }">🍽️</span>
            </div>
            <div class="category-info">
              <h3 class="category-name">{{ category.name }}</h3>
              <span class="category-count">{{ category.count }} рецептов</span>
            </div>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Search & Recipes Feed -->
    <section class="recipes-section">
      <div class="container">
        <h2 class="section-title">Популярные рецепты</h2>
        
        <!-- Search Bar -->
        <div class="search-container">
          <div class="search-box">
            <input 
              type="text" 
              placeholder="Поиск рецептов..." 
              class="search-input"
            />
            <button class="search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Recipes Grid -->
        <div class="recipes-grid">
          <RouterLink 
            v-for="recipe in popularRecipes" 
            :key="recipe.id"
            :to="`/recipes/${recipe.id}`"
            class="recipe-card card"
          >
            <img :src="recipe.image" :alt="recipe.title" class="recipe-image" />
            <div class="card-body recipe-body">
              <h3 class="recipe-title">{{ recipe.title }}</h3>
              <div class="recipe-meta">
                <span class="recipe-time">⏱️ {{ recipe.time }}</span>
                <span class="recipe-portions">🍽️ {{ recipe.portions }} порции</span>
              </div>
            </div>
          </RouterLink>
        </div>

        <div class="text-center mt-4">
          <RouterLink to="/recipes" class="btn btn-outline btn-lg">
            Показать все рецепты
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <h3>Делитесь рецептами</h3>
            <p>Публикуйте свои любимые рецепты и делитесь кулинарным опытом с сообществом</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔍</div>
            <h3>Находите новое</h3>
            <p>Ищите рецепты по ингредиентам, категориям и тегам для идеального блюда</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">⭐</div>
            <h3>Сохраняйте избранное</h3>
            <p>Создавайте коллекции любимых рецептов для быстрого доступа</p>
          </div>
        </div>
      </div>
    </section>
  </AppLayout>
</template>

<style scoped>
/* Hero Section */
.hero {
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-bg-tertiary) 100%);
  padding: var(--spacing-3xl) 0;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  margin-bottom: var(--spacing-lg);
  line-height: 1.2;
}

.hero-subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

/* Sections */
.section-title {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
  font-size: var(--font-size-3xl);
}

.categories-section,
.recipes-section,
.features-section {
  padding: var(--spacing-3xl) 0;
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--spacing-lg);
}

.category-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 2px solid transparent;
  transition: all var(--transition-normal);
  text-decoration: none;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.category-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.category-info {
  flex: 1;
}

.category-name {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.category-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

/* Search */
.search-container {
  margin-bottom: var(--spacing-2xl);
}

.search-box {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: var(--spacing-md) var(--spacing-xl);
  padding-right: 60px;
  font-size: var(--font-size-base);
  border: 2px solid var(--color-border-light);
  border-radius: var(--radius-full);
  background-color: var(--color-bg-secondary);
  transition: all var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-accent-primary);
  box-shadow: 0 0 0 4px var(--color-accent-light);
}

.search-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 44px;
  height: 44px;
  border: none;
  background-color: var(--color-accent-primary);
  color: white;
  border-radius: var(--radius-full);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color var(--transition-fast);
}

.search-btn:hover {
  background-color: var(--color-accent-hover);
}

/* Recipes Grid */
.recipes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.recipe-card {
  text-decoration: none;
  color: inherit;
  overflow: hidden;
}

.recipe-image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.recipe-card:hover .recipe-image {
  transform: scale(1.05);
}

.recipe-body {
  padding: var(--spacing-lg);
}

.recipe-title {
  font-family: var(--font-family-base);
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
}

.recipe-meta {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-tertiary);
}

/* Features */
.features-section {
  background-color: var(--color-bg-secondary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-2xl);
}

.feature-card {
  text-align: center;
  padding: var(--spacing-xl);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
}

.feature-card h3 {
  font-family: var(--font-family-base);
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm);
}

.feature-card p {
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    padding: var(--spacing-2xl) 0;
  }
  
  .hero-title {
    font-size: var(--font-size-2xl);
  }
  
  .hero-subtitle {
    font-size: var(--font-size-base);
  }
  
  .categories-section,
  .recipes-section,
  .features-section {
    padding: var(--spacing-2xl) 0;
  }
  
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .recipes-grid {
    grid-template-columns: 1fr;
  }
}
</style>
