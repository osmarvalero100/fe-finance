<template>
  <div class="space-y-6">
    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Gastos</p>
            <p class="text-2xl font-semibold text-gray-900">${{ totalExpenses }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Total Ingresos</p>
            <p class="text-2xl font-semibold text-gray-900">${{ totalIncomes }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Balance</p>
            <p class="text-2xl font-semibold text-gray-900">${{ balance }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-lg shadow-sm border">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">Presupuestos Activos</p>
            <p class="text-2xl font-semibold text-gray-900">{{ activeBudgets }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="bg-white rounded-lg shadow-sm border">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Transacciones Recientes</h3>
      </div>
      <div class="p-6">
        <div v-if="loading" class="text-center py-4">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
        <div v-else-if="recentTransactions.length === 0" class="text-center py-4 text-gray-500">
          No hay transacciones recientes
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="transaction in recentTransactions"
            :key="transaction.id"
            class="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
          >
            <div class="flex items-center">
              <div
                :class="[
                  'p-2 rounded-lg',
                  transaction.type === 'expense' ? 'bg-red-100' : 'bg-green-100'
                ]"
              >
                <svg
                  class="w-5 h-5"
                  :class="transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    v-if="transaction.type === 'expense'"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                  ></path>
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  ></path>
                </svg>
              </div>
              <div class="ml-4">
                <p class="text-sm font-medium text-gray-900">{{ transaction.description }}</p>
                <p class="text-sm text-gray-500">{{ transaction.category?.name || 'Sin categoría' }}</p>
              </div>
            </div>
            <div class="text-right">
              <p
                :class="[
                  'text-sm font-medium',
                  transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                ]"
              >
                {{ transaction.type === 'expense' ? '-' : '+' }}${{ transaction.amount }}
              </p>
              <p class="text-sm text-gray-500">{{ formatDate(transaction.date) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiService from '@/services/api'
import type { ExpenseResponse, IncomeResponse } from '@/types/api'

interface Transaction extends ExpenseResponse {
  type: 'expense' | 'income'
}

const totalExpenses = ref('0.00')
const totalIncomes = ref('0.00')
const balance = ref('0.00')
const activeBudgets = ref(0)
const recentTransactions = ref<Transaction[]>([])
const loading = ref(true)

const fetchDashboardData = async () => {
  try {
    loading.value = true

    // Fetch recent expenses
    const expensesResponse = await apiService.instance.get('/expenses/', {
      params: { limit: 5, skip: 0 }
    })
    const expenses: ExpenseResponse[] = expensesResponse.data

    // Fetch recent incomes
    const incomesResponse = await apiService.instance.get('/incomes/', {
      params: { limit: 5, skip: 0 }
    })
    const incomes: IncomeResponse[] = incomesResponse.data

    // Combine and sort by date
    const transactions: Transaction[] = [
      ...expenses.map(exp => ({ ...exp, type: 'expense' as const })),
      ...incomes.map(inc => ({ ...inc, type: 'income' as const }))
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)

    recentTransactions.value = transactions

    // Calculate totals (simplified - in real app, you'd fetch summaries from API)
    const totalExp = expenses.reduce((sum, exp) => sum + exp.amount, 0)
    const totalInc = incomes.reduce((sum, inc) => sum + inc.amount, 0)

    totalExpenses.value = totalExp.toFixed(2)
    totalIncomes.value = totalInc.toFixed(2)
    balance.value = (totalInc - totalExp).toFixed(2)

    // Fetch budgets count
    const budgetsResponse = await apiService.instance.get('/budgets/', {
      params: { is_active: true }
    })
    activeBudgets.value = budgetsResponse.data.length

  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

onMounted(() => {
  fetchDashboardData()
})
</script>