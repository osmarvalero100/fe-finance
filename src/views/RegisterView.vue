<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Registrarse
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-4 py-3 shadow-sm border border-gray-200 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-md focus:z-10 sm:text-sm"
              placeholder="Email"
              v-model="userData.email"
            />
          </div>
          <div>
            <label for="username" class="sr-only">Usuario</label>
            <input
              id="username"
              name="username"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-4 py-3 shadow-sm border border-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-md focus:z-10 sm:text-sm"
              placeholder="Usuario"
              v-model="userData.username"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-4 py-3 shadow-sm border border-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-md focus:z-10 sm:text-sm"
              placeholder="Contraseña"
              v-model="userData.password"
            />
          </div>
          <div>
            <label for="full_name" class="sr-only">Nombre Completo</label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              class="appearance-none rounded-none relative block w-full px-4 py-3 shadow-sm border border-gray-200 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-md focus:z-10 sm:text-sm"
              placeholder="Nombre Completo (opcional)"
              v-model="userData.full_name"
            />
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button
            type="submit"
            :disabled="loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
            <span v-else>Registrarse</span>
          </button>
        </div>

        <div class="text-center">
          <router-link
            to="/login"
            class="font-medium text-indigo-600 hover:text-indigo-500"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const userData = ref({
  email: '',
  username: '',
  password: '',
  full_name: ''
})

const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''

  try {
    await authStore.register(userData.value)
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.response?.data?.detail || 'Error al registrarse'
  } finally {
    loading.value = false
  }
}
</script>