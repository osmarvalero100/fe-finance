<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-4">
        <h3 class="text-lg font-medium text-gray-900">Gastos</h3>
        <div v-if="!loading" class="bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          <span class="text-sm font-semibold text-indigo-700">Total: {{ formatCurrency(totalExpenses) }}</span>
        </div>
      </div>
      <button
        @click="showAddModal = true"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Agregar Gasto
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-lg shadow-sm border">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium text-gray-700 font-semibold mb-1">Categoría</label>
          <select
            v-model="filters.category_id"
            @change="fetchExpenses"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2"
          >
            <option value="">Todas las categorías</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 font-semibold mb-1">Método de Pago</label>
          <select
            v-model="filters.payment_method_id"
            @change="fetchExpenses"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2"
          >
            <option value="">Todos los métodos</option>
            <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
              {{ method.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 font-semibold mb-1">Etiqueta</label>
          <select
            v-model="filters.tag_id"
            @change="fetchExpenses"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2"
          >
            <option value="">Todas las etiquetas</option>
            <option v-for="tag in tags" :key="tag.id" :value="tag.id">
              {{ tag.icon }} {{ tag.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 font-semibold mb-1">Fecha desde</label>
          <input
            v-model="filters.date_from"
            @change="fetchExpenses"
            type="date"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 font-semibold mb-1">Fecha hasta</label>
          <input
            v-model="filters.date_to"
            @change="fetchExpenses"
            type="date"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 py-2"
          />
        </div>
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors border border-gray-300 text-sm font-medium h-[42px]"
          >
            Limpiar filtros
          </button>
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
                Etiquetas
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div class="flex gap-1">
                  <span
                    v-for="tag in expense.tags"
                    :key="tag.id"
                    class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    :style="{ backgroundColor: tag.color + '20', color: tag.color }"
                  >
                    {{ tag.icon }} {{ tag.name }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatCurrency(expense.amount) }}
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
                @change="watchCategorySelection"
                required
                class="mt-1 block w-full px-4 py-3 shadow-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-md"
              >
                <option value="">Seleccionar categoría</option>
                <option v-for="category in expenseCategories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
                <option value="new" class="font-bold text-indigo-600">+ Crear nueva categoría</option>
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
                @change="watchPaymentMethodSelection"
                class="mt-1 block w-full px-4 py-3 shadow-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:shadow-md"
              >
                <option value="">Seleccionar método</option>
                <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
                  {{ method.name }}
                </option>
                <option value="new" class="font-bold text-indigo-600">+ Crear nuevo método</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Etiquetas</label>
              <div class="mt-2 grid grid-cols-2 gap-2">
                <div v-for="tag in tags" :key="tag.id" class="flex items-center">
                  <input
                    type="checkbox"
                    :value="tag.id"
                    v-model="expenseForm.tag_ids"
                    class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-900" :style="{ color: tag.color }">
                    {{ tag.icon }} {{ tag.name }}
                  </label>
                </div>
              </div>
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

    <!-- Quick Category Modal -->
    <div
      v-if="showCategoryModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[60]"
      @click="closeCategoryModal"
    >
      <div class="relative top-20 mx-auto p-5 border w-80 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Nueva Categoría</h3>
          <form @submit.prevent="saveCategory" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre *</label>
              <input
                v-model="categoryForm.name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 shadow-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Icono / Emoji</label>
              <input
                v-model="categoryForm.icon"
                type="text"
                placeholder="🛒"
                class="mt-1 block w-full px-3 py-2 shadow-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Color</label>
              <input
                v-model="categoryForm.color"
                type="color"
                class="mt-1 block w-full h-10 p-1 rounded-md border border-gray-200"
              />
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closeCategoryModal"
                class="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="savingCategory"
                class="px-3 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {{ savingCategory ? 'Guardando...' : 'Crear' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Quick Payment Method Modal -->
    <div
      v-if="showPaymentMethodModal"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-[60]"
      @click="closePaymentMethodModal"
    >
      <div class="relative top-20 mx-auto p-5 border w-80 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Nuevo Método de Pago</h3>
          <form @submit.prevent="savePaymentMethod" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre *</label>
              <input
                v-model="paymentMethodForm.name"
                type="text"
                required
                class="mt-1 block w-full px-3 py-2 shadow-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Tipo *</label>
                <select 
                  v-model="paymentMethodForm.payment_type"
                  required
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="Cash">Efectivo</option>
                  <option value="Debit Card">Tarjeta de Débito</option>
                  <option value="Credit Card">Tarjeta de Crédito</option>
                  <option value="Bank Account">Cuenta Bancaria</option>
                  <option value="Digital Wallet">Billetera Digital</option>
                  <option value="Other">Otro</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Institución</label>
                <input
                  v-model="paymentMethodForm.institution"
                  type="text"
                  placeholder="Banco..."
                  class="mt-1 block w-full px-3 py-2 shadow-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Número de Cuenta (4 dígs)</label>
              <input
                v-model="paymentMethodForm.account_number"
                type="text"
                maxlength="4"
                placeholder="1234"
                class="mt-1 block w-full px-3 py-2 shadow-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Color</label>
                <input
                  v-model="paymentMethodForm.color"
                  type="color"
                  class="mt-1 block w-full h-10 p-1 rounded-md border border-gray-200"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Icono</label>
                <input
                  v-model="paymentMethodForm.icon"
                  type="text"
                  placeholder="💳"
                  class="mt-1 block w-full px-3 py-2 shadow-sm border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div class="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                @click="closePaymentMethodModal"
                class="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="savingPaymentMethod"
                class="px-3 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {{ savingPaymentMethod ? 'Guardando...' : 'Crear' }}
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
import apiService from '@/services/api'
import type { ExpenseResponse, ExpenseCreate, ExpenseUpdate, CategoryResponse, PaymentMethodResponse, TagResponse } from '@/types/api'

const expenses = ref<ExpenseResponse[]>([])
const categories = ref<CategoryResponse[]>([])
const expenseCategories = ref<CategoryResponse[]>([])
const paymentMethods = ref<PaymentMethodResponse[]>([])
const tags = ref<TagResponse[]>([])
const loading = ref(true)
const saving = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const showCategoryModal = ref(false)
const showPaymentMethodModal = ref(false)
const savingCategory = ref(false)
const savingPaymentMethod = ref(false)
const editingExpense = ref<ExpenseResponse | null>(null)

const categoryForm = ref({
  name: '',
  icon: '',
  color: '#6366f1',
  category_type: 'expense'
})

const paymentMethodForm = ref({
  name: '',
  institution: '',
  account_number: '',
  payment_type: 'Debit Card',
  color: '#3b82f6',
  icon: '💳'
})

const filters = ref({
  category_id: '',
  payment_method_id: '',
  tag_id: '',
  date_from: '',
  date_to: ''
})

const clearFilters = () => {
  filters.value = {
    category_id: '',
    payment_method_id: '',
    tag_id: '',
    date_from: '',
    date_to: ''
  }
  fetchExpenses()
}

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

const totalExpenses = computed(() => {
  return expenses.value.reduce((total, expense) => total + Number(expense.amount), 0)
})

const watchCategorySelection = () => {
  if (expenseForm.value.category_id === 'new' as any) {
    expenseForm.value.category_id = 0
    showCategoryModal.value = true
  }
}

const watchPaymentMethodSelection = () => {
  if (expenseForm.value.payment_method_id === 'new' as any) {
    expenseForm.value.payment_method_id = undefined
    showPaymentMethodModal.value = true
  }
}

const fetchExpenses = async () => {
  try {
    loading.value = true
    const params: any = {}
    if (filters.value.category_id) params.category_id = filters.value.category_id
    if (filters.value.payment_method_id) params.payment_method_id = filters.value.payment_method_id
    if (filters.value.tag_id) params.tag_ids = filters.value.tag_id
    if (filters.value.date_from) params.start_date = `${filters.value.date_from}T00:00:00`
    if (filters.value.date_to) params.end_date = `${filters.value.date_to}T23:59:59`

    const response = await apiService.instance.get('/expenses/filter', { params })
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

const fetchTags = async () => {
  try {
    const response = await apiService.instance.get('/tags/')
    tags.value = response.data
  } catch (error) {
    console.error('Error fetching tags:', error)
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
    tag_ids: expense.tags?.map(t => t.id) || expense.tag_ids || [],
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

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount)
}

const saveCategory = async () => {
  try {
    savingCategory.value = true
    const response = await apiService.instance.post('/categories/', categoryForm.value)
    
    // Refresh categories
    await fetchCategories()
    
    // Select the new category
    expenseForm.value.category_id = response.data.id
    
    closeCategoryModal()
  } catch (error) {
    console.error('Error creating category:', error)
  } finally {
    savingCategory.value = false
  }
}

const closeCategoryModal = () => {
  showCategoryModal.value = false
  categoryForm.value = {
    name: '',
    icon: '',
    color: '#6366f1',
    category_type: 'expense'
  }
}

const savePaymentMethod = async () => {
  try {
    savingPaymentMethod.value = true
    const response = await apiService.instance.post('/payment-methods/', paymentMethodForm.value)
    
    // Refresh methods
    await fetchPaymentMethods()
    
    // Select the new method
    expenseForm.value.payment_method_id = response.data.id
    
    closePaymentMethodModal()
  } catch (error) {
    console.error('Error creating payment method:', error)
  } finally {
    savingPaymentMethod.value = false
  }
}

const closePaymentMethodModal = () => {
  showPaymentMethodModal.value = false
  paymentMethodForm.value = {
    name: '',
    institution: '',
    account_number: '',
    payment_type: 'Debit Card',
    color: '#3b82f6',
    icon: '💳'
  }
}

onMounted(() => {
  fetchExpenses()
  fetchCategories()
  fetchPaymentMethods()
  fetchTags()
})
</script>