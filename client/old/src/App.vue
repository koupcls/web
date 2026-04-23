    <!-- src/App.vue -->
    <template>
    <div id="app-wrapper">
        <!-- ✅ Хедер на всех страницах -->
        <UiHeader />
        
        <!-- Основной контент с отступом под хедер -->
        <main class="app-main">
        <router-view v-slot="{ Component, route }">
            <transition 
            :name="route.meta.transition || 'fade'" 
            mode="out-in"
            >
            <component :is="Component" :key="route.fullPath" />
            </transition>
        </router-view>
        </main>
        
        <!-- Футер (если нужен) -->
        <UiFooter v-if="!isAuthPage" />
    </div>
    </template>

    <script setup>
    import { computed } from 'vue'
    import { useRoute } from 'vue-router'
    import UiHeader from '@/components/ui/UiHeader.vue'
    import UiFooter from '@/components/ui/UiFooter.vue'

    const route = useRoute()

    // Не показывать футер на страницах авторизации (опционально)
    const isAuthPage = computed(() => 
    ['login', 'register'].includes(route.name)
    )
    </script>

    <style>
    #app-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    }

    .app-main {
    flex: 1;
    /* Отступ не нужен — хедер sticky, контент начинается сразу под ним */
    }

    /* Глобальные переходы */
    .fade-enter-active,
    .fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
    opacity: 0;
    transform: translateY(8px);
    }
    </style>    