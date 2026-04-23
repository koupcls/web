<template>
  <div 
    class="spinner" 
    :class="`spinner--${sizeName}`"
    :style="{
      borderColor: secondaryColor,
      borderTopColor: color
    }"
  ></div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  size: {
    type: String,
    default: 'md' // sm, md, lg
  },
  color: {
    type: String,
    default: 'currentColor' // Цвет вращающейся части
  },
  secondaryColor: {
    type: String,
    default: 'rgba(255, 255, 255, 0.3)' // Цвет фона (трека)
  }
});

const sizeName = computed(() => props.size);
</script>

<style scoped>
.spinner {
  border-radius: 50%;
  border-width: 2px;
  border-style: solid;
  animation: spin 0.8s linear infinite;
}

/* Размеры */
.spinner--sm {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.spinner--md {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.spinner--lg {
  width: 40px;
  height: 40px;
  border-width: 3px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>