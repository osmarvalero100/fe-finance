import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoriesService } from '@/services/categories'
import type { CategoryResponse, CategoryCreate, CategoryUpdate } from '@/types/api'

export const useCategoriesStore = defineStore('categories', () => {
    const categories = ref<CategoryResponse[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchCategories() {
        loading.value = true
        error.value = null
        try {
            const response = await categoriesService.getAll()
            categories.value = response.data
        } catch (err: any) {
            error.value = err.response?.data?.detail || 'Error al cargar categorías'
        } finally {
            loading.value = false
        }
    }

    async function createCategory(data: CategoryCreate) {
        loading.value = true
        error.value = null
        try {
            const response = await categoriesService.create(data)
            categories.value.push(response.data)
            return response.data
        } catch (err: any) {
            error.value = err.response?.data?.detail || 'Error al crear la categoría'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function updateCategory(id: number, data: CategoryUpdate) {
        loading.value = true
        error.value = null
        try {
            const response = await categoriesService.update(id, data)
            const index = categories.value.findIndex(c => c.id === id)
            if (index !== -1) {
                categories.value[index] = response.data
            }
            return response.data
        } catch (err: any) {
            error.value = err.response?.data?.detail || 'Error al actualizar la categoría'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function deleteCategory(id: number) {
        loading.value = true
        error.value = null
        try {
            await categoriesService.delete(id)
            categories.value = categories.value.filter(c => c.id !== id)
        } catch (err: any) {
            error.value = err.response?.data?.detail || 'Error al eliminar la categoría'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        categories,
        loading,
        error,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory
    }
})
