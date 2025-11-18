<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Gastos</h3>
      <button
        @click="showAddModal = true"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Agregar Gasto
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm border">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            v-model="filters.category_id"
            @change="fetchExpenses"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Todas las categorías</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha desde</label>
          <input
            v-model="filters.date_from"
            @change="fetchExpenses"
            type="date"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Fecha hasta</label>
          <input
            v-model="filters.date_to"
            @change="fetchExpenses"
            type="date"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
      </div>
    </div>

    <!-- Expenses List -->
    <div class="bg-white rounded-lg shadow-sm border">
      <div v-if="loading" class="p-6 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
      <div v-else-if="expenses.length === 0" class="p-6 text-center text-gray-500">
        No hay gastos registrados
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoría
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método de Pago
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="expense in expenses" :key="expense.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ expense.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ expense.category?.name || 'Sin categoría' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${{ expense.amount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(expense.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ expense.payment_method?.name || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editExpense(expense)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Editar
                </button>
                <button
                  @click="deleteExpense(expense.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showAddModal || showEditModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? 'Editar Gasto' : 'Agregar Gasto' }}
          </h3>
          <form @submit.prevent="saveExpense" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Descripción</label>
              <input
                v-model="expenseForm.description"
                type="text"
                required
                class="mt-1 block w-full px-4 py-3 shadow-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-md"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Monto</label>
              <input
                v-model.number="expenseForm.amount"
                type="number"
                step="0.01"
                required
                class="mt-1 block w-full px-4 py-3 shadow-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-md"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Categoría</label>
              <select
                v-model="expenseForm.category_id"
                required
                class="mt-1 block w-full px-4 py-3 shadow-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-md"
              >
                <option value="">Seleccionar categoría</option>
                <option v-for="category in expenseCategories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha</label>
              <input
                v-model="expenseForm.date"
                type="datetime-local"
                required
                class="mt-1 block w-full px-4 py-3 shadow-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-md"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Método de Pago</label>
              <select
                v-model="expenseForm.payment_method_id"
                class="mt-1 block w-full px-4 py-3 shadow-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-md"
              >
                <option value="">Seleccionar método</option>
                <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
                  {{ method.name }}
                </option>
              </select>
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                <span v-if="saving">Guardando...</span>
                <span v-else>{{ showEditModal ? 'Actualizar' : 'Guardar' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import apiService from '@/services/api'
import type { ExpenseResponse, ExpenseCreate, ExpenseUpdate, CategoryResponse, PaymentMethodResponse } from '@/types/api'

const expenses = ref<ExpenseResponse[]>([])
const categories = ref<CategoryResponse[]>([])
const expenseCategories = ref<CategoryResponse[]>([])
const paymentMethods = ref<PaymentMethodResponse[]>([])
const loading = ref(true)
const saving = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingExpense = ref<ExpenseResponse | null>(null)

const filters = ref({
  category_id: '',
  date_from: '',
  date_to: ''
})

const expenseForm = ref<ExpenseCreate & { id?: number }>({
  description: '',
  amount: 0,
  category_id: 0,
  date: new Date().toISOString().slice(0, 16),
  payment_method_id: undefined,
  is_recurring: false,
  recurring_frequency: undefined,
  tag_ids: [],
  notes: undefined
})

const fetchExpenses = async () => {
  try {
    loading.value = true
    const params: any = {}
    if (filters.value.category_id) params.category_id = filters.value.category_id
    if (filters.value.date_from) params.date_from = filters.value.date_from
    if (filters.value.date_to) params.date_to = filters.value.date_to

    const response = await apiService.instance.get('/expenses/', { params })
    expenses.value = response.data
  } catch (error) {
    console.error('Error fetching expenses:', error)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  try {
    const response = await apiService.instance.get('/categories/')
    categories.value = response.data
    expenseCategories.value = response.data.filter(cat => cat.category_type === 'expense')
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

const fetchPaymentMethods = async () => {
  try {
    const response = await apiService.instance.get('/payment-methods/')
    paymentMethods.value = response.data
  } catch (error) {
    console.error('Error fetching payment methods:', error)
  }
}

const saveExpense = async () => {
  try {
    saving.value = true
    const formData = { ...expenseForm.value }
    delete formData.id

    if (showEditModal.value && editingExpense.value) {
      await apiService.instance.put(`/expenses/${editingExpense.value.id}`, formData)
    } else {
      await apiService.instance.post('/expenses/', formData)
    }

    closeModal()
    fetchExpenses()
  } catch (error) {
    console.error('Error saving expense:', error)
  } finally {
    saving.value = false
  }
}

const editExpense = (expense: ExpenseResponse) => {
  editingExpense.value = expense
  expenseForm.value = {
    id: expense.id,
    description: expense.description,
    amount: expense.amount,
    category_id: expense.category_id,
    date: new Date(expense.date).toISOString().slice(0, 16),
    payment_method_id: expense.payment_method_id || undefined,
    is_recurring: expense.is_recurring || false,
    recurring_frequency: expense.recurring_frequency || undefined,
    tag_ids: expense.tag_ids || [],
    notes: expense.notes || undefined
  }
  showEditModal.value = true
}

const deleteExpense = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
    try {
      await apiService.instance.delete(`/expenses/${id}`)
      fetchExpenses()
    } catch (error) {
      console.error('Error deleting expense:', error)
    }
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingExpense.value = null
  expenseForm.value = {
    description: '',
    amount: 0,
    category_id: 0,
    date: new Date().toISOString().slice(0, 16),
    payment_method_id: undefined,
    is_recurring: false,
    recurring_frequency: undefined,
    tag_ids: [],
    notes: undefined
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES')
}

onMounted(() => {
  fetchExpenses()
  fetchCategories()
  fetchPaymentMethods()
})
</script>