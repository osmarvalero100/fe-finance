<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Deudas</h3>
      <button
        @click="showAddModal = true"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Agregar Deuda
      </button>
    </div>

    <!-- Debts List -->
    <div class="bg-white rounded-lg shadow-sm border">
      <div v-if="loading" class="p-6 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
      <div v-else-if="debts.length === 0" class="p-6 text-center text-gray-500">
        No hay deudas registradas
      </div>
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre / Prestamista
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progreso
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Saldo Actual
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tasa / Pago Min.
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="debt in debts" :key="debt.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="font-medium">{{ debt.name }}</div>
                <div class="text-xs text-gray-500">{{ debt.lender }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ debt.debt_type }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 w-48">
                <div class="flex flex-col gap-1">
                  <div class="flex justify-between text-xs">
                    <span>${{ (debt.original_amount - debt.current_balance).toLocaleString() }} pagado</span>
                    <span>{{ getProgressPercentage(debt) }}%</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div
                      class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      :style="{ width: `${getProgressPercentage(debt)}%` }"
                    ></div>
                  </div>
                  <div class="text-xs text-gray-400">Total: ${{ debt.original_amount.toLocaleString() }}</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${{ debt.current_balance.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>{{ debt.interest_rate }}% Int.</div>
                <div class="text-xs text-gray-400">Min: ${{ debt.minimum_payment.toLocaleString() }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editDebt(debt)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Editar
                </button>
                <button
                  @click="deleteDebt(debt.id)"
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
            {{ showEditModal ? 'Editar Deuda' : 'Agregar Deuda' }}
          </h3>
          <form @submit.prevent="saveDebt" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Nombre *</label>
                <input
                  v-model="debtForm.name"
                  type="text"
                  required
                  placeholder="e.g., Hipoteca Casa"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Lender -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Prestamista *</label>
                <input
                  v-model="debtForm.lender"
                  type="text"
                  required
                  placeholder="e.g., Banco Davivienda"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Tipo de Deuda *</label>
                <select
                  v-model="debtForm.debt_type"
                  required
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="Hipoteca">Hipoteca</option>
                  <option value="Préstamo Vehicular">Préstamo Vehicular</option>
                  <option value="Préstamo Personal">Préstamo Personal</option>
                  <option value="Préstamo Estudiantil">Préstamo Estudiantil</option>
                  <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <!-- Original Amount -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Monto Original *</label>
                <input
                  v-model.number="debtForm.original_amount"
                  type="number"
                  step="0.01"
                  required
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Current Balance -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Saldo Actual *</label>
                <input
                  v-model.number="debtForm.current_balance"
                  type="number"
                  step="0.01"
                  required
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Interest Rate -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Tasa de Interés (%) *</label>
                <input
                  v-model.number="debtForm.interest_rate"
                  type="number"
                  step="0.01"
                  required
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Minimum Payment -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Pago Mínimo *</label>
                <input
                  v-model.number="debtForm.minimum_payment"
                  type="number"
                  step="0.01"
                  required
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Start Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Fecha de Inicio *</label>
                <input
                  v-model="debtForm.loan_start_date"
                  type="datetime-local"
                  required
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- End Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Fecha Estimada Fin</label>
                <input
                  v-model="debtForm.expected_end_date"
                  type="datetime-local"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Paid Off Status -->
              <div class="flex items-center pt-6">
                <input
                  id="is_paid_off"
                  v-model="debtForm.is_paid_off"
                  type="checkbox"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label for="is_paid_off" class="ml-2 block text-sm text-gray-900">
                  ¿Deuda Saldada?
                </label>
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
import { useDebtsStore } from '@/stores/debts'
import type { DebtResponse, DebtCreate } from '@/types/api'

const store = useDebtsStore()
const { debts, loading } = storeToRefs(store)
const { fetchDebts, deleteDebt: removeDebt, createDebt, updateDebt } = store

const saving = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingDebt = ref<DebtResponse | null>(null)

const debtForm = ref<DebtCreate & { id?: number }>({
  name: '',
  debt_type: 'Préstamo Personal',
  lender: '',
  original_amount: 0,
  current_balance: 0,
  interest_rate: 0,
  minimum_payment: 0,
  payment_due_date: undefined,
  loan_start_date: new Date().toISOString().slice(0, 16),
  expected_end_date: undefined,
  is_paid_off: false,
  paid_off_date: undefined,
  currency: 'COP',
  collateral: undefined,
  notes: undefined
})

const saveDebt = async () => {
  try {
    saving.value = true
    const formData = { ...debtForm.value }
    delete formData.id

    // Cleanup optional fields
    if (!formData.expected_end_date) delete formData.expected_end_date
    if (!formData.notes) delete formData.notes
    
    // Set paid_off_date if is_paid_off is true
    if (formData.is_paid_off && !formData.paid_off_date) {
      formData.paid_off_date = new Date().toISOString()
    }

    if (showEditModal.value && editingDebt.value) {
      await updateDebt(editingDebt.value.id, formData)
    } else {
      await createDebt(formData)
    }

    closeModal()
    fetchDebts()
  } catch (error) {
    console.error('Error saving debt:', error)
  } finally {
    saving.value = false
  }
}

const editDebt = (debt: DebtResponse) => {
  editingDebt.value = debt
  debtForm.value = {
    id: debt.id,
    name: debt.name,
    debt_type: debt.debt_type,
    lender: debt.lender,
    original_amount: debt.original_amount,
    current_balance: debt.current_balance,
    interest_rate: debt.interest_rate,
    minimum_payment: debt.minimum_payment,
    payment_due_date: debt.payment_due_date || undefined,
    loan_start_date: new Date(debt.loan_start_date).toISOString().slice(0, 16),
    expected_end_date: debt.expected_end_date ? new Date(debt.expected_end_date).toISOString().slice(0, 16) : undefined,
    is_paid_off: debt.is_paid_off || false,
    paid_off_date: debt.paid_off_date || undefined,
    currency: debt.currency || 'COP',
    collateral: debt.collateral || undefined,
    notes: debt.notes || undefined
  }
  showEditModal.value = true
}

const deleteDebt = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar esta deuda?')) {
    try {
      await removeDebt(id)
    } catch (error) {
      console.error('Error deleting debt:', error)
    }
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingDebt.value = null
  debtForm.value = {
    name: '',
    debt_type: 'Préstamo Personal',
    lender: '',
    original_amount: 0,
    current_balance: 0,
    interest_rate: 0,
    minimum_payment: 0,
    payment_due_date: undefined,
    loan_start_date: new Date().toISOString().slice(0, 16),
    expected_end_date: undefined,
    is_paid_off: false,
    paid_off_date: undefined,
    currency: 'COP',
    collateral: undefined,
    notes: undefined
  }
}

const getProgressPercentage = (debt: DebtResponse) => {
  if (debt.original_amount <= 0) return 0
  const paid = debt.original_amount - debt.current_balance
  const percentage = (paid / debt.original_amount) * 100
  return Math.min(Math.max(Math.round(percentage), 0), 100)
}

onMounted(() => {
  fetchDebts()
})
</script>