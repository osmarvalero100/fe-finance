<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Productos Financieros</h3>
      <button
        @click="showAddModal = true"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Agregar Producto
      </button>
    </div>

    <!-- Products List -->
    <div class="bg-white rounded-lg shadow-sm border">
      <div v-if="loading" class="p-6 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
      <div v-else-if="products.length === 0" class="p-6 text-center text-gray-500">
        No hay productos financieros registrados
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
                Institución
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cuenta
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance / Límite
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="product in products" :key="product.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div class="font-medium">{{ product.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ product.product_type }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ product.institution }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ product.account_number ? `****${product.account_number.slice(-4)}` : '-' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>${{ (product.balance || 0).toLocaleString() }}</div>
                <div v-if="product.credit_limit" class="text-xs text-gray-500">
                  Límite: ${{ product.credit_limit.toLocaleString() }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  @click="editProduct(product)"
                  class="text-indigo-600 hover:text-indigo-900 mr-3"
                >
                  Editar
                </button>
                <button
                  @click="deleteProduct(product.id)"
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
            {{ showEditModal ? 'Editar Producto' : 'Agregar Producto' }}
          </h3>
          <form @submit.prevent="saveProduct" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Name -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Nombre *</label>
                <input
                  v-model="productForm.name"
                  type="text"
                  required
                  placeholder="e.g., Chase Savings"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Institution -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Institución *</label>
                <input
                  v-model="productForm.institution"
                  type="text"
                  required
                  placeholder="e.g., Chase Bank"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Type -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Tipo de Producto *</label>
                <select
                  v-model="productForm.product_type"
                  required
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="Ahorros">Cuenta de Ahorros</option>
                  <option value="Corriente">Cuenta Corriente</option>
                  <option value="Tarjeta de Crédito">Tarjeta de Crédito</option>
                  <option value="Préstamo">Préstamo</option>
                  <option value="CDT">CDT / Depósito a Plazo</option>
                  <option value="Inversión">Cuenta de Inversión</option>
                  <option value="Seguro">Seguro</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>

              <!-- Account Number -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Número de Cuenta</label>
                <input
                  v-model="productForm.account_number"
                  type="text"
                  placeholder="Últimos 4 dígitos"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Balance -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Balance Actual</label>
                <input
                  v-model.number="productForm.balance"
                  type="number"
                  step="0.01"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Credit Limit -->
              <div v-if="productForm.product_type === 'Tarjeta de Crédito'">
                <label class="block text-sm font-medium text-gray-700">Límite de Crédito</label>
                <input
                  v-model.number="productForm.credit_limit"
                  type="number"
                  step="0.01"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Interest Rate -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Tasa de Interés (%)</label>
                <input
                  v-model.number="productForm.interest_rate"
                  type="number"
                  step="0.01"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Monthly Fee -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Cuota de Manejo</label>
                <input
                  v-model.number="productForm.monthly_fee"
                  type="number"
                  step="0.01"
                  class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <!-- Opening Date -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Fecha de Apertura</label>
                <input
                  v-model="productForm.opening_date"
                  type="datetime-local"
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
import { useFinancialProductsStore } from '@/stores/financialProducts'
import type { FinancialProductResponse, FinancialProductCreate } from '@/types/api'

const store = useFinancialProductsStore()
const { products, loading } = storeToRefs(store)
const { fetchProducts, deleteProduct: removeProduct, createProduct, updateProduct } = store

const saving = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingProduct = ref<FinancialProductResponse | null>(null)

const productForm = ref<FinancialProductCreate & { id?: number }>({
  name: '',
  product_type: 'Ahorros', // Default to Savings
  institution: '',
  account_number: undefined,
  balance: 0,
  interest_rate: undefined,
  minimum_balance: 0,
  monthly_fee: 0,
  credit_limit: undefined,
  available_credit: undefined,
  payment_due_date: undefined,
  minimum_payment: undefined,
  is_active: true,
  opening_date: undefined,
  maturity_date: undefined,
  currency: 'COP',
  notes: undefined
})

const saveProduct = async () => {
  try {
    saving.value = true
    const formData = { ...productForm.value }
    delete formData.id

    // Cleanup empty optional fields
    if (!formData.account_number) delete formData.account_number
    if (!formData.credit_limit) delete formData.credit_limit
    if (!formData.interest_rate) delete formData.interest_rate
    if (!formData.opening_date) delete formData.opening_date

    if (showEditModal.value && editingProduct.value) {
      await updateProduct(editingProduct.value.id, formData)
    } else {
      await createProduct(formData)
    }

    closeModal()
    fetchProducts()
  } catch (error) {
    console.error('Error saving financial product:', error)
  } finally {
    saving.value = false
  }
}

const editProduct = (product: FinancialProductResponse) => {
  editingProduct.value = product
  productForm.value = {
    id: product.id,
    name: product.name,
    product_type: product.product_type,
    institution: product.institution,
    account_number: product.account_number || undefined,
    balance: product.balance || 0,
    interest_rate: product.interest_rate || undefined,
    minimum_balance: product.minimum_balance || 0,
    monthly_fee: product.monthly_fee || 0,
    credit_limit: product.credit_limit || undefined,
    available_credit: product.available_credit || undefined,
    payment_due_date: product.payment_due_date || undefined,
    minimum_payment: product.minimum_payment || undefined,
    is_active: product.is_active ?? true,
    opening_date: product.opening_date ? new Date(product.opening_date).toISOString().slice(0, 16) : undefined,
    maturity_date: product.maturity_date ? new Date(product.maturity_date).toISOString().slice(0, 16) : undefined,
    currency: product.currency || 'COP',
    notes: product.notes || undefined
  }
  showEditModal.value = true
}

const deleteProduct = async (id: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este producto financiero?')) {
    try {
      await removeProduct(id)
    } catch (error) {
      console.error('Error deleting financial product:', error)
    }
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingProduct.value = null
  productForm.value = {
    name: '',
    product_type: 'Ahorros',
    institution: '',
    account_number: undefined,
    balance: 0,
    interest_rate: undefined,
    minimum_balance: 0,
    monthly_fee: 0,
    credit_limit: undefined,
    available_credit: undefined,
    payment_due_date: undefined,
    minimum_payment: undefined,
    is_active: true,
    opening_date: undefined,
    maturity_date: undefined,
    currency: 'COP',
    notes: undefined
  }
}

onMounted(() => {
  fetchProducts()
})
</script>