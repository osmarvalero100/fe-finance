<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Ingresos</h3>
      <button
        @click="showAddModal = true"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Agregar Ingreso
      </button>
    </div>

    <!-- Incomes List -->
    <div class="bg-white rounded-lg shadow-sm border">
      <div v-if="loading" class="p-6 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
      <div v-else-if="incomes.length === 0" class="p-6 text-center text-gray-500">
        No hay ingresos registrados
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fuente
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="income in incomes" :key="income.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ income.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ income.source }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${{ income.amount }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(income.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editIncome(income)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Editar
                </button>
                <button
                  @click="deleteIncome(income.id)"
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
            {{ showEditModal ? 'Editar Ingreso' : 'Agregar Ingreso' }}
          </h3>
          <form @submit.prevent="saveIncome" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Descripción</label>
              <input
                v-model="incomeForm.description"
                type="text"
                required
                class="mt-1 block w-full px-4 py-3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fuente</label>
              <input
                v-model="incomeForm.source"
                type="text"
                required
                class="mt-1 block w-full px-4 py-3 shadow-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-md"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Monto</label>
              <input
                v-model.number="incomeForm.amount"
                type="number"
                step="0.01"
                required
                class="mt-1 block w-full px-4 py-3 shadow-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-md"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Fecha</label>
              <input
                v-model="incomeForm.date"
                type="datetime-local"
                required
                class="mt-1 block w-full px-4 py-3 shadow-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-md"
              />
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
import type { IncomeResponse, IncomeCreate } from '@/types/api'

const incomes = ref<IncomeResponse[]>([])
const loading = ref(true)
const saving = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingIncome = ref<IncomeResponse | null>(null)

const incomeForm = ref<IncomeCreate & { id?: number }>({
  description: '',
  source: '',
  amount: 0,
  date: new Date().toISOString().slice(0, 16),
  is_recurring: false,
  recurring_frequency: undefined,
  category_id: undefined,
  tag_ids: [],
  notes: undefined
})

const fetchIncomes = async () => {
  try {
    loading.value = true
    const response = await apiService.instance.get('/incomes/')
    incomes.value = response.data
  } catch (error) {
    console.error('Error fetching incomes:', error)
  } finally {
    loading.value = false
  }
}

const saveIncome = async () => {
  try {
    saving.value = true
    const formData = { ...incomeForm.value }
    delete formData.id

    if (showEditModal.value && editingIncome.value) {
      await apiService.instance.put(`/incomes/${editingIncome.value.id}`, formData)
    } else {
      await apiService.instance.post('/incomes/', formData)
    }

    closeModal()
    fetchIncomes()
  } catch (error) {
    console.error('Error saving income:', error)
  } finally {
    saving.value = false
  }
}

const editIncome = (income: IncomeResponse) => {
  editingIncome.value = income
  incomeForm.value = {
    id: income.id,
    description: income.description,
    source: income.source,
    amount: income.amount,
    date: new Date(income.date).toISOString().slice(0, 16),
    is_recurring: income.is_recurring || false,
    recurring_frequency: income.recurring_frequency || undefined,
    category_id: income.category_id || undefined,
    tag_ids: income.tag_ids || [],
    notes: income.notes || undefined
  }
  showEditModal.value = true
}

const deleteIncome = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este ingreso?')) {
    try {
      await apiService.instance.delete(`/incomes/${id}`)
      fetchIncomes()
    } catch (error) {
      console.error('Error deleting income:', error)
    }
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingIncome.value = null
  incomeForm.value = {
    description: '',
    source: '',
    amount: 0,
    date: new Date().toISOString().slice(0, 16),
    is_recurring: false,
    recurring_frequency: undefined,
    category_id: undefined,
    tag_ids: [],
    notes: undefined
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES')
}

onMounted(() => {
  fetchIncomes()
})
</script>