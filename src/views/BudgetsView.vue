<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Presupuestos</h3>
      <button
        @click="showAddModal = true"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Crear Presupuesto
      </button>
    </div>

    <!-- Budgets List -->
    <div class="bg-white rounded-lg shadow-sm border">
      <div v-if="loading" class="p-6 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
      <div v-else-if="budgets.length === 0" class="p-6 text-center text-gray-500">
        No hay presupuestos registrados
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Periodo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progreso
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Presupuestado
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Gastado
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="budget in budgets" :key="budget.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="font-medium">{{ budget.name }}</div>
                <div class="text-xs text-gray-500" v-if="budget.description">{{ budget.description }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(budget.start_date) }} - {{ formatDate(budget.end_date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-48">
                <div class="flex flex-col gap-1">
                  <div class="flex justify-between text-xs">
                    <span>{{ getPercentage(budget.total_spent, budget.total_budgeted) }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="h-2 rounded-full transition-all duration-300"
                      :class="getProgressColor(budget.total_spent, budget.total_budgeted)"
                      :style="{ width: `${Math.min(getPercentage(budget.total_spent, budget.total_budgeted), 100)}%` }"
                    ></div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${{ parseFloat(budget.total_budgeted).toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${{ parseFloat(budget.total_spent).toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editBudget(budget)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Editar
                </button>
                <button
                  @click="deleteBudget(budget.id)"
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
      <div class="relative top-10 mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? 'Editar Presupuesto' : 'Crear Presupuesto' }}
          </h3>
          <form @submit.prevent="saveBudget" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Name -->
              <div class="col-span-2 md:col-span-1">
                <label class="block text-sm font-medium text-gray-700">Nombre *</label>
                <input
                  v-model="budgetForm.name"
                  type="text"
                  required
                  placeholder="e.g., Presupuesto Enero 2024"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Description -->
              <div class="col-span-2 md:col-span-1">
                <label class="block text-sm font-medium text-gray-700">Descripción</label>
                <input
                  v-model="budgetForm.description"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Start Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Fecha Inicio *</label>
                <input
                  v-model="budgetForm.start_date"
                  type="date"
                  required
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- End Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Fecha Fin *</label>
                <input
                  v-model="budgetForm.end_date"
                  type="date"
                  required
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <!-- Budget Items -->
            <div class="mt-6 border-t pt-4">
              <div class="flex justify-between items-center mb-2">
                <h4 class="text-sm font-medium text-gray-900">Categorías y Montos</h4>
                <button
                  type="button"
                  @click="addBudgetItem"
                  class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                >
                  + Agregar Categoría
                </button>
              </div>
              
              <div v-if="budgetForm.budget_items?.length === 0" class="text-gray-500 text-sm italic mb-4">
                No hay categorías agregadas a este presupuesto.
              </div>

              <div class="space-y-3 max-h-60 overflow-y-auto">
                <div v-for="(item, index) in budgetForm.budget_items" :key="index" class="flex gap-3 items-end">
                  <div class="flex-grow">
                    <label class="block text-xs font-medium text-gray-500 mb-1">Categoría</label>
                    <select
                      v-model="item.category_id"
                      required
                      class="block w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                      <option value="0" disabled>Seleccionar</option>
                      <option v-for="cat in expenseCategories" :key="cat.id" :value="cat.id">
                        {{ cat.name }}
                      </option>
                    </select>
                  </div>
                  <div class="w-32">
                    <label class="block text-xs font-medium text-gray-500 mb-1">Monto</label>
                    <input
                      v-model.number="item.budgeted_amount"
                      type="number"
                      step="0.01"
                      required
                      class="block w-full px-2 py-1.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    />
                  </div>
                  <div class="pb-1">
                    <button
                      type="button"
                      @click="removeBudgetItem(index)"
                      class="text-red-500 hover:text-red-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="mt-4 text-right text-sm font-medium text-gray-900 border-t pt-2">
                Total Presupuestado: ${{ totalBudgeted.toLocaleString() }}
              </div>
            </div>

            <div class="flex justify-end space-x-3 pt-4 border-t mt-4">
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
                <span v-else>{{ showEditModal ? 'Actualizar' : 'Crear' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useBudgetsStore } from '@/stores/budgets'
import { useCategoriesStore } from '@/stores/categories'
import type { BudgetResponse, BudgetCreate, BudgetItemCreate } from '@/types/api'
import apiService from '@/services/api' // Keeping direct dependency minimal if possible, but store handles logic

const store = useBudgetsStore()
const categoriesStore = useCategoriesStore()
const { budgets, loading } = storeToRefs(store)
const { fetchBudgets, deleteBudget: removeBudget, createBudget, updateBudget } = store
const { categories } = storeToRefs(categoriesStore)
const { fetchCategories } = categoriesStore

const saving = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingBudget = ref<BudgetResponse | null>(null)

const expenseCategories = computed(() => {
  return categories.value.filter(c => c.category_type === 'expense')
})

const budgetForm = ref<BudgetCreate & { id?: number }>({
  name: '',
  description: undefined,
  start_date: new Date().toISOString().slice(0, 10),
  end_date: new Date().toISOString().slice(0, 10),
  currency: 'COP',
  is_active: true,
  budget_items: []
})

const totalBudgeted = computed(() => {
  return (budgetForm.value.budget_items || []).reduce((sum, item) => sum + (Number(item.budgeted_amount) || 0), 0)
})

const addBudgetItem = () => {
  if (!budgetForm.value.budget_items) {
    budgetForm.value.budget_items = []
  }
  budgetForm.value.budget_items.push({
    category_id: 0,
    budgeted_amount: 0
  })
}

const removeBudgetItem = (index: number) => {
  if (budgetForm.value.budget_items) {
    budgetForm.value.budget_items.splice(index, 1)
  }
}

const saveBudget = async () => {
  try {
    saving.value = true
    const formData = { ...budgetForm.value }
    delete formData.id
    
    // Filter out invalid items
    if (formData.budget_items) {
      formData.budget_items = formData.budget_items.filter(item => item.category_id !== 0 && item.budgeted_amount > 0)
    }

    if (showEditModal.value && editingBudget.value) {
      await updateBudget(editingBudget.value.id, formData)
    } else {
      await createBudget(formData)
    }

    closeModal()
    fetchBudgets()
  } catch (error) {
    console.error('Error saving budget:', error)
  } finally {
    saving.value = false
  }
}

const editBudget = (budget: BudgetResponse) => {
  editingBudget.value = budget
  
  // Transform items for the form structure
  const items = budget.budget_items?.map(item => ({
    category_id: item.category_id,
    budgeted_amount: parseFloat(item.budgeted_amount)
  })) || []

  budgetForm.value = {
    id: budget.id,
    name: budget.name,
    description: budget.description,
    start_date: budget.start_date.slice(0, 10),
    end_date: budget.end_date.slice(0, 10),
    currency: budget.currency || 'COP',
    is_active: budget.is_active ?? true,
    budget_items: items
  }
  showEditModal.value = true
}

const deleteBudget = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este presupuesto?')) {
    try {
      await removeBudget(id)
    } catch (error) {
      console.error('Error deleting budget:', error)
    }
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingBudget.value = null
  budgetForm.value = {
    name: '',
    description: undefined,
    start_date: new Date().toISOString().slice(0, 10),
    end_date: new Date().toISOString().slice(0, 10),
    currency: 'COP',
    is_active: true,
    budget_items: []
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES')
}

const getPercentage = (spent: string | number, budgeted: string | number) => {
  const s = Number(spent) || 0
  const b = Number(budgeted) || 0
  if (b === 0) return 0
  return Math.round((s / b) * 100)
}

const getProgressColor = (spent: string | number, budgeted: string | number) => {
  const p = getPercentage(spent, budgeted)
  if (p > 100) return 'bg-red-600'
  if (p > 90) return 'bg-yellow-500'
  return 'bg-green-600'
}

onMounted(() => {
  fetchBudgets()
  fetchCategories()
})
</script>