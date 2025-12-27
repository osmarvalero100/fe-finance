import { defineStore } from 'pinia'
import { ref } from 'vue'
import { financialProductsService } from '@/services/financialProducts'
import type { FinancialProductResponse, FinancialProductCreate, FinancialProductUpdate } from '@/types/api'

export const useFinancialProductsStore = defineStore('financialProducts', () => {
    const products = ref<FinancialProductResponse[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchProducts(params?: any) {
        loading.value = true
        error.value = null
        try {
            const response = await financialProductsService.getAll(params)
            products.value = response.data
        } catch (err: any) {
            console.error('Error fetching financial products:', err)
            error.value = 'Error al cargar los productos financieros'
        } finally {
            loading.value = false
        }
    }

    async function createProduct(data: FinancialProductCreate) {
        loading.value = true
        error.value = null
        try {
            const response = await financialProductsService.create(data)
            products.value.push(response.data)
            return response.data
        } catch (err: any) {
            console.error('Error creating financial product:', err)
            error.value = 'Error al crear el producto financiero'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function updateProduct(id: number, data: FinancialProductUpdate) {
        loading.value = true
        error.value = null
        try {
            const response = await financialProductsService.update(id, data)
            const index = products.value.findIndex(p => p.id === id)
            if (index !== -1) {
                products.value[index] = response.data
            }
            return response.data
        } catch (err: any) {
            console.error('Error updating financial product:', err)
            error.value = 'Error al actualizar el producto financiero'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function deleteProduct(id: number) {
        loading.value = true
        error.value = null
        try {
            await financialProductsService.delete(id)
            products.value = products.value.filter(p => p.id !== id)
        } catch (err: any) {
            console.error('Error deleting financial product:', err)
            error.value = 'Error al eliminar el producto financiero'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        products,
        loading,
        error,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct
    }
})
