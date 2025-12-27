<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Inversiones</h3>
      <button
        @click="showAddModal = true"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Agregar Inversión
      </button>
    </div>

    <!-- Investments List -->
    <div class="bg-white rounded-lg shadow-sm border">
      <div v-if="loading" class="p-6 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
      <div v-else-if="investments.length === 0" class="p-6 text-center text-gray-500">
        No hay inversiones registradas
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plataforma
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Monto Invertido
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor Actual
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="investment in investments" :key="investment.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="font-medium">{{ investment.name }}</div>
                <div v-if="investment.symbol" class="text-xs text-gray-500">{{ investment.symbol }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ investment.investment_type }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ investment.broker_platform || '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${{ investment.amount_invested.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span :class="getValueColor(investment)">
                  ${{ (investment.current_value || investment.amount_invested).toLocaleString() }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editInvestment(investment)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Editar
                </button>
                <button
                  @click="deleteInvestment(investment.id)"
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
      <div class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? 'Editar Inversión' : 'Agregar Inversión' }}
          </h3>
          <form @submit.prevent="saveInvestment" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Nombre *</label>
                <input
                  v-model="investmentForm.name"
                  type="text"
                  required
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Tipo *</label>
                <select
                  v-model="investmentForm.investment_type"
                  required
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="Acciones">Acciones</option>
                  <option value="Bonos">Bonos</option>
                  <option value="Criptomonedas">Criptomonedas</option>
                  <option value="Bienes Raíces">Bienes Raíces</option>
                  <option value="Fondos Mutuos">Fondos Mutuos</option>
                  <option value="ETF">ETF</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <!-- Amount Invested -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Monto Invertido *</label>
                <input
                  v-model.number="investmentForm.amount_invested"
                  type="number"
                  step="0.01"
                  required
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Purchase Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Fecha de Compra *</label>
                <input
                  v-model="investmentForm.purchase_date"
                  type="datetime-local"
                  required
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Symbol -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Símbolo (Ticker)</label>
                <input
                  v-model="investmentForm.symbol"
                  type="text"
                  placeholder="e.g., AAPL, BTC"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Broker -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Plataforma / Broker</label>
                <input
                  v-model="investmentForm.broker_platform"
                  type="text"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Quantity -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Cantidad</label>
                <input
                  v-model.number="investmentForm.quantity"
                  type="number"
                  step="0.00000001"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Purchase Price -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Precio de Compra (Unitario)</label>
                <input
                  v-model.number="investmentForm.purchase_price"
                  type="number"
                  step="0.01"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Current Value -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Valor Actual Total</label>
                <input
                  v-model.number="investmentForm.current_value"
                  type="number"
                  step="0.01"
                  placeholder="Dejar vacío si es igual al invertido"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
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
import { storeToRefs } from 'pinia'
import { useInvestmentsStore } from '@/stores/investments'
import type { InvestmentResponse, InvestmentCreate } from '@/types/api'

const store = useInvestmentsStore()
const { investments, loading } = storeToRefs(store)
const { fetchInvestments, deleteInvestment: removeInvestment, createInvestment, updateInvestment } = store

const saving = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingInvestment = ref<InvestmentResponse | null>(null)

const investmentForm = ref<InvestmentCreate & { id?: number }>({
  name: '',
  investment_type: 'Acciones',
  amount_invested: 0,
  purchase_date: new Date().toISOString().slice(0, 16),
  symbol: undefined,
  current_value: undefined,
  quantity: undefined,
  purchase_price: undefined,
  broker_platform: undefined,
  fees: 0,
  taxes: 0,
  dividends_earned: 0,
  is_active: true,
  notes: undefined
})

const saveInvestment = async () => {
  try {
    saving.value = true
    const formData = { ...investmentForm.value }
    delete formData.id

    // Ensure numeric values are processed correctly
    if (!formData.current_value) delete formData.current_value
    if (!formData.quantity) delete formData.quantity
    if (!formData.purchase_price) delete formData.purchase_price
    if (!formData.symbol) delete formData.symbol
    if (!formData.broker_platform) delete formData.broker_platform

    if (showEditModal.value && editingInvestment.value) {
      await updateInvestment(editingInvestment.value.id, formData)
    } else {
      await createInvestment(formData)
    }

    closeModal()
    fetchInvestments()
  } catch (error) {
    console.error('Error saving investment:', error)
  } finally {
    saving.value = false
  }
}

const editInvestment = (investment: InvestmentResponse) => {
  editingInvestment.value = investment
  investmentForm.value = {
    id: investment.id,
    name: investment.name,
    investment_type: investment.investment_type,
    amount_invested: investment.amount_invested,
    purchase_date: new Date(investment.purchase_date).toISOString().slice(0, 16),
    symbol: investment.symbol || undefined,
    current_value: investment.current_value || undefined,
    quantity: investment.quantity || undefined,
    purchase_price: investment.purchase_price || undefined,
    broker_platform: investment.broker_platform || undefined,
    fees: investment.fees || 0,
    taxes: investment.taxes || 0,
    dividends_earned: investment.dividends_earned || 0,
    is_active: investment.is_active ?? true,
    notes: investment.notes || undefined
  }
  showEditModal.value = true
}

const deleteInvestment = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta inversión?')) {
    try {
      await removeInvestment(id)
    } catch (error) {
      console.error('Error deleting investment:', error)
    }
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingInvestment.value = null
  investmentForm.value = {
    name: '',
    investment_type: 'Acciones',
    amount_invested: 0,
    purchase_date: new Date().toISOString().slice(0, 16),
    symbol: undefined,
    current_value: undefined,
    quantity: undefined,
    purchase_price: undefined,
    broker_platform: undefined,
    fees: 0,
    taxes: 0,
    dividends_earned: 0,
    is_active: true,
    notes: undefined
  }
}

const getValueColor = (investment: InvestmentResponse) => {
  if (!investment.current_value) return 'text-gray-900'
  const diff = investment.current_value - investment.amount_invested
  if (diff > 0) return 'text-green-600 font-medium'
  if (diff < 0) return 'text-red-600 font-medium'
  return 'text-gray-900'
}

onMounted(() => {
  fetchInvestments()
})
</script>