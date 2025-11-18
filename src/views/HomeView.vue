<template>
  <div v-if="!isAuthenticated">
    <main>
      <TheWelcome />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import TheWelcome from '../components/TheWelcome.vue'

const router = useRouter()
const authStore = useAuthStore()

const isAuthenticated = computed(() => authStore.isAuthenticated)

onMounted(() => {
  if (isAuthenticated.value) {
    router.push('/dashboard')
  }
})
</script>