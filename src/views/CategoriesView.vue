<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">Categorías</h3>
      <button 
        @click="openModal()"
        class="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
      >
        Agregar Categoría
      </button>
    </div>

    <!-- Error Alert -->
    <div v-if="store.error" class="bg-red-50 text-red-700 p-4 rounded-md text-sm border border-red-200">
      {{ store.error }}
    </div>

    <!-- Loading State -->
    <div v-if="store.loading && store.categories.length === 0" class="text-center py-10 text-gray-500">
      Cargando categorías...
    </div>

    <!-- Categories List -->
    <div v-else class="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
      <ul role="list" class="divide-y divide-gray-200">
        <li v-for="category in store.categories" :key="category.id" class="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Icon/Color Placeholder -->
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold uppercase text-sm"
              :style="{ backgroundColor: category.color || '#6366f1' }"
            >
              {{ category.icon || category.name.substring(0, 2) }}
            </div>
            
            <div>
              <p class="text-sm font-medium text-gray-900">{{ category.name }}</p>
              <p class="text-xs text-gray-500">{{ category.description }}</p>
              <span 
                class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium mt-1"
                :class="category.category_type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
              >
                {{ category.category_type === 'income' ? 'Ingreso' : 'Gasto' }}
              </span>
            </div>
          </div>

          <div class="flex space-x-2">
            <button 
              @click="openModal(category)"
              class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              Editar
            </button>
            <button 
              @click="confirmDelete(category)"
              class="text-red-600 hover:text-red-900 text-sm font-medium"
            >
              Eliminar
            </button>
          </div>
        </li>
        <li v-if="store.categories.length === 0" class="px-6 py-8 text-center text-gray-500 text-sm">
          No hay categorías registradas.
        </li>
      </ul>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="fixed inset-0 z-10 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
              {{ isEditing ? 'Editar Categoría' : 'Nueva Categoría' }}
            </h3>
            
            <form @submit.prevent="submitForm" class="space-y-4">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700">Nombre</label>
                <input 
                  v-model="form.name"
                  type="text" 
                  id="name" 
                  required
                  class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                >
              </div>

              <div>
                <label for="description" class="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea 
                  v-model="form.description"
                  id="description" 
                  rows="2"
                  class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                ></textarea>
              </div>

               <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="type" class="block text-sm font-medium text-gray-700">Tipo</label>
                  <select 
                    v-model="form.category_type"
                    id="type"
                    class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="expense">Gasto</option>
                    <option value="income">Ingreso</option>
                  </select>
                </div>
                
                <div>
                  <label for="color" class="block text-sm font-medium text-gray-700">Color</label>
                  <div class="flex items-center mt-1">
                     <input 
                      v-model="form.color"
                      type="color" 
                      id="color" 
                      class="h-9 w-full p-1 border border-gray-300 rounded-md cursor-pointer"
                    >
                  </div>
                </div>
               </div>

               <div>
                 <label for="icon" class="block text-sm font-medium text-gray-700">Icono (Emoji o Texto corto)</label>
                  <input 
                  v-model="form.icon"
                  type="text" 
                  id="icon" 
                  placeholder="🏠"
                  class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2 border"
                >
               </div>
            </form>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="submitForm"
              type="button" 
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="store.loading"
            >
              {{ store.loading ? 'Guardando...' : 'Guardar' }}
            </button>
            <button 
              @click="closeModal"
              type="button" 
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { useCategoriesStore } from '../stores/categories'
import type { CategoryResponse } from '../types/api'

const store = useCategoriesStore()

onMounted(() => {
  store.fetchCategories()
})

// Modal State
const showModal = ref(false)
const isEditing = ref(false)
const editingId = ref<number | null>(null)

// Form State
const form = reactive({
  name: '',
  description: '',
  category_type: 'expense' as 'expense' | 'income',
  color: '#6366f1',
  icon: ''
})

function resetForm() {
  form.name = ''
  form.description = ''
  form.category_type = 'expense'
  form.color = '#6366f1'
  form.icon = ''
  isEditing.value = false
  editingId.value = null
}

function openModal(category?: CategoryResponse) {
  resetForm()
  if (category) {
    isEditing.value = true
    editingId.value = category.id
    form.name = category.name
    form.description = category.description || ''
    form.category_type = category.category_type
    form.color = category.color || '#6366f1'
    form.icon = category.icon || ''
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  resetForm()
}

async function submitForm() {
  if (!form.name) return

  try {
    if (isEditing.value && editingId.value) {
      await store.updateCategory(editingId.value, { ...form })
    } else {
      await store.createCategory({ ...form })
    }
    closeModal()
  } catch (e) {
    // Error is handled in store and displayed in UI
    console.error(e)
  }
}

async function confirmDelete(category: CategoryResponse) {
  if (confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
    try {
      await store.deleteCategory(category.id)
    } catch (e) {
      console.error(e)
    }
  }
}
</script>