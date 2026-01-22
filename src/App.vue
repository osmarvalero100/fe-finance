<template>
  <div id="app">
    <MainLayout v-if="isAuthenticated && !$route.meta.public">
      <RouterView />
    </MainLayout>
    <RouterView v-else />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import apiService from '@/services/api'
import MainLayout from '@/layouts/MainLayout.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

onMounted(() => {
  apiService.onUnauthorized(() => {
    authStore.logout()
    router.push('/login')
  })
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>