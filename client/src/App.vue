<template>
    <RouterView />
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
auth.checkAuth()
</script>

<style>
</style>    