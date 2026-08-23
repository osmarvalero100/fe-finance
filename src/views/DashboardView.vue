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
            <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(totalExpenses) }}</p>
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
            <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(totalIncomes) }}</p>
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
            <p class="text-2xl font-semibold text-gray-900">{{ formatCurrency(balance) }}</p>
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

    <!-- Date Filters for Chart -->
    <div class="bg-white p-4 rounded-lg shadow-sm border flex items-end gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 font-semibold mb-1">Fecha desde</label>
        <input
          v-model="filters.date_from"
          @change="fetchChartData"
          type="date"
          class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 font-semibold mb-1">Fecha hasta</label>
        <input
          v-model="filters.date_to"
          @change="fetchChartData"
          type="date"
          class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2 px-3"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Chart -->
      <div class="bg-white rounded-lg shadow-sm border flex flex-col">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">Gastos por Categoría</h3>
        </div>
        <div class="p-6 flex-grow flex flex-col min-h-[300px]">
          <div v-if="chartLoading" class="flex-grow flex items-center justify-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
          <div v-else-if="chartData.datasets[0].data.length === 0" class="flex-grow flex items-center justify-center text-gray-500">
            No hay gastos en este período
          </div>
          <div v-else class="relative flex-grow flex items-center justify-center">
            <Doughnut :key="chartKey" :data="chartData" :options="chartOptions" />
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="bg-white rounded-lg shadow-sm border flex flex-col">
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
                <p class="text-sm text-gray-500">{{ transaction.category_name || 'Sin categoría' }}</p>
              </div>
            </div>
            <div class="text-right">
              <p
                :class="[
                  'text-sm font-medium',
                  transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'
                ]"
              >
                {{ transaction.type === 'expense' ? '-' : '+' }}{{ formatCurrency(transaction.amount) }}
              </p>
              <p class="text-sm text-gray-500">{{ formatDate(transaction.date) }}</p>
            </div>
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
import { formatCurrency } from '@/utils/formatters'
import type { ExpenseResponse, IncomeResponse } from '@/types/api'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'vue-chartjs'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Transaction {
  id: number
  amount: number
  description: string
  date: string
  type: 'expense' | 'income'
  category_name?: string
}

const totalExpenses = ref(0)
const totalIncomes = ref(0)
const balance = ref(0)
const activeBudgets = ref(0)
const recentTransactions = ref<Transaction[]>([])
const loading = ref(true)

const filters = ref({
  date_from: '',
  date_to: ''
})

const chartLoading = ref(false)
const chartKey = ref(0)

const chartData = ref({
  labels: [] as string[],
  datasets: [{
    data: [] as number[],
    backgroundColor: [] as string[]
  }]
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom' as const
    }
  }
}

const getCurrentMonthDates = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const firstDay = `${year}-${month}-01`
  const lastDay = new Date(year, now.getMonth() + 1, 0).getDate()
  const lastDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}`
  return { firstDay, lastDate }
}

const fetchChartData = async () => {
  try {
    chartLoading.value = true
    const params: any = {}
    if (filters.value.date_from) params.start_date = `${filters.value.date_from}T00:00:00`
    if (filters.value.date_to) params.end_date = `${filters.value.date_to}T23:59:59`

    const response = await apiService.instance.get('/expenses/filter', { params })
    const expenses: ExpenseResponse[] = response.data

    const categoryTotals: Record<string, { total: number, color: string }> = {}
    
    expenses.forEach(expense => {
      const catName = expense.category?.name || 'Sin categoría'
      const color = expense.category?.color || '#cbd5e1'
      if (!categoryTotals[catName]) {
        categoryTotals[catName] = { total: 0, color }
      }
      categoryTotals[catName].total += Number(expense.amount)
    })

    const labels = Object.keys(categoryTotals)
    const data = labels.map(label => categoryTotals[label].total)
    const colors = labels.map(label => categoryTotals[label].color)

    chartData.value = {
      labels,
      datasets: [{
        data,
        backgroundColor: colors
      }]
    }
    chartKey.value++
  } catch (error) {
    console.error('Error fetching chart data:', error)
  } finally {
    chartLoading.value = false
  }
}

const fetchDashboardData = async () => {
  try {
    loading.value = true

    // Fetch dashboard summary from the new efficient endpoint
    const response = await apiService.instance.get('/dashboard/summary')
    const data = response.data

    totalExpenses.value = data.total_expenses
    totalIncomes.value = data.total_incomes
    balance.value = data.balance
    activeBudgets.value = data.active_budgets_count
    recentTransactions.value = data.recent_transactions

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
  const dates = getCurrentMonthDates()
  filters.value.date_from = dates.firstDay
  filters.value.date_to = dates.lastDate

  fetchDashboardData()
  fetchChartData()
})
</script>