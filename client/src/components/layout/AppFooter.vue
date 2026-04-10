<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <!-- About -->
        <div class="footer-section">
          <h4>Recipy</h4>
          <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); line-height: 1.6;">
            Платформа для поиска и публикации кулинарных рецептов. 
            Делитесь своими любимыми блюдами с миром.
          </p>
        </div>

        <!-- Navigation -->
        <div class="footer-section">
          <h4>Навигация</h4>
          <ul class="footer-links">
            <li><RouterLink to="/">Главная</RouterLink></li>
            <li><RouterLink to="/recipes">Рецепты</RouterLink></li>
            <li><RouterLink to="/categories">Категории</RouterLink></li>
            <li><RouterLink to="/about">О нас</RouterLink></li>
          </ul>
        </div>

        <!-- Categories -->
        <div class="footer-section">
          <h4>Категории</h4>
          <ul class="footer-links">
            <li><RouterLink to="/categories?filter=breakfast">Завтраки</RouterLink></li>
            <li><RouterLink to="/categories?filter=lunch">Обеды</RouterLink></li>
            <li><RouterLink to="/categories?filter=dinner">Ужины</RouterLink></li>
            <li><RouterLink to="/categories?filter=desserts">Десерты</RouterLink></li>
          </ul>
        </div>

        <!-- Contact -->
        <div class="footer-section">
          <h4>Контакты</h4>
          <ul class="footer-links">
            <li><a href="mailto:support@recipy.com">support@recipy.com</a></li>
            <li><a href="#">Telegram</a></li>
            <li><a href="#">VKontakte</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} Recipy. Все права защищены.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
p {
  color: var(--color-text-secondary);
}
</style>
