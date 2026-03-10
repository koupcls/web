<script setup>
// Можно добавить реактивность позже, когда понадобится
// import { ref, onMounted } from 'vue'
</script>

<template>
  <div class="container">
    <div class="card">
      <div class="logo">🍳</div>
      <h1>Recipy</h1>
      
      <div class="status">Всё работает!</div>
      
      <p>
        Платформа для поиска и публикации кулинарных рецептов.<br>
        Скоро здесь будет полноценное приложение.
      </p>
      
      <div class="badges">
        <span class="badge">Vue 3</span>
        <span class="badge">Node.js</span>
        <span class="badge">Supabase</span>
        <span class="badge">Pinia</span>
      </div>
      
      <div class="footer">
        <a href="https://github.com/koupcls/web" target="_blank" rel="noopener">
          GitHub →
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: #333;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 480px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.logo {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  color: #e67e22;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #d4edda;
  color: #155724;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 500;
  margin: 1rem 0;
}

.status::before {
  content: "●";
  color: #28a745;
  font-size: 0.8rem;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-bottom: 1rem;
}

.badge {
  display: inline-block;
  background: #f8f9fa;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #495057;
}

.footer {
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #999;
}

.footer a {
  color: #e67e22;
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}
</style>