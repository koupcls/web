<template>
  <Header></Header>
  <div class="page-gradient">
    <div class="container home">
      
      <div class="home-card">
        
        <div class="hero">
          <div class="emoji">🍝</div>
          <h1>Добро пожаловать</h1>
          <p>
            Делись рецептами, находи вдохновение и создавай свою коллекцию блюд
          </p>
        </div>

        <!-- skeleton feed -->
        <div class="feed">
          <div v-for="i in 3" :key="i" class="recipe-card">
            <div class="img-skeleton"></div>
            <div class="text-skeleton title"></div>
            <div class="text-skeleton short"></div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue';

</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
}

.home-card {
  width: 100%;
  max-width: 700px;
  background: white;
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 25px 80px rgba(0,0,0,0.25);
  animation: fadeUp 0.5s ease;
}

/* hero */
.hero {
  text-align: center;
  margin-bottom: 30px;
}

.emoji {
  font-size: 3rem;
  margin-bottom: 10px;
}

.hero h1 {
  font-size: 28px;
  margin-bottom: 10px;
}

.hero p {
  color: #6b7280;
}

/* skeleton */
.feed {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.recipe-card {
  padding: 16px;
  border-radius: 16px;
  background: #f9fafb;
  animation: fadeUp 0.6s ease;
}

.img-skeleton {
  height: 140px;
  border-radius: 12px;
  background: linear-gradient(90deg,#eee,#ddd,#eee);
  margin-bottom: 12px;
}

.text-skeleton {
  height: 10px;
  border-radius: 6px;
  background: #e5e7eb;
  margin-bottom: 8px;
}

.text-skeleton.title {
  width: 60%;
  height: 14px;
}

.text-skeleton.short {
  width: 40%;
}
</style>