<template>
  <div class="min-h-screen bg-gray-100 flex">
    <!-- Sidebar -->
    <div class="hidden lg:flex lg:flex-shrink-0">
      <div class="flex flex-col w-64 bg-white shadow-lg">
        <div class="flex items-center justify-center h-16 bg-indigo-600">
          <h1 class="text-white text-xl font-bold">Finanzas</h1>
        </div>
        <nav class="mt-8 flex-1">
          <router-link
            to="/dashboard"
            class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200"
            :class="{ 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600': $route.name === 'dashboard' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
            </svg>
            Dashboard
          </router-link>
          <router-link
            to="/expenses"
            class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200"
            :class="{ 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600': $route.name === 'expenses' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
            </svg>
            Gastos
          </router-link>
          <router-link
            to="/incomes"
            class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200"
            :class="{ 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600': $route.name === 'incomes' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
            Ingresos
          </router-link>
          <router-link
            to="/categories"
            class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200"
            :class="{ 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600': $route.name === 'categories' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            Categorías
          </router-link>
          <router-link
            to="/tags"
            class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200"
            :class="{ 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600': $route.name === 'tags' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            Etiquetas
          </router-link>
          <router-link
            to="/payment-methods"
            class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200"
            :class="{ 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600': $route.name === 'payment-methods' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
            Métodos de Pago
          </router-link>
          <router-link
            to="/investments"
            class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200"
            :class="{ 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600': $route.name === 'investments' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
            Inversiones
          </router-link>
          <router-link
            to="/financial-products"
            class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200"
            :class="{ 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600': $route.name === 'financial-products' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            Productos Financieros
          </router-link>
          <router-link
            to="/debts"
            class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200"
            :class="{ 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600': $route.name === 'debts' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"></path>
            </svg>
            Deudas
          </router-link>
          <router-link
            to="/budgets"
            class="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors duration-200"
            :class="{ 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600': $route.name === 'budgets' }"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            Presupuestos
          </router-link>
        </nav>
        <div class="p-4">
          <button
            @click="handleLogout"
            class="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-red-600 transition-colors duration-200 rounded"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <header class="bg-white shadow-sm">
        <div class="px-6 py-4">
          <h2 class="text-2xl font-semibold text-gray-900">{{ pageTitle }}</h2>
        </div>
      </header>
      <main class="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    dashboard: 'Dashboard',
    expenses: 'Gastos',
    incomes: 'Ingresos',
    categories: 'Categorías',
    tags: 'Etiquetas',
    'payment-methods': 'Métodos de Pago',
    investments: 'Inversiones',
    'financial-products': 'Productos Financieros',
    debts: 'Deudas',
    budgets: 'Presupuestos'
  }
  return titles[route.name as string] || 'Finanzas Personales'
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>