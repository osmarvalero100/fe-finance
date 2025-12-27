import { defineStore } from 'pinia'
import { ref } from 'vue'
import { debtsService } from '@/services/debts'
import type { DebtResponse, DebtCreate, DebtUpdate } from '@/types/api'

export const useDebtsStore = defineStore('debts', () => {
    const debts = ref<DebtResponse[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchDebts(params?: any) {
        loading.value = true
        error.value = null
        try {
            const response = await debtsService.getAll(params)
            debts.value = response.data
        } catch (err: any) {
            console.error('Error fetching debts:', err)
            error.value = 'Error al cargar las deudas'
        } finally {
            loading.value = false
        }
    }

    async function createDebt(data: DebtCreate) {
        loading.value = true
        error.value = null
        try {
            const response = await debtsService.create(data)
            debts.value.push(response.data)
            return response.data
        } catch (err: any) {
            console.error('Error creating debt:', err)
            error.value = 'Error al crear la deuda'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function updateDebt(id: number, data: DebtUpdate) {
        loading.value = true
        error.value = null
        try {
            const response = await debtsService.update(id, data)
            const index = debts.value.findIndex(d => d.id === id)
            if (index !== -1) {
                debts.value[index] = response.data
            }
            return response.data
        } catch (err: any) {
            console.error('Error updating debt:', err)
            error.value = 'Error al actualizar la deuda'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function deleteDebt(id: number) {
        loading.value = true
        error.value = null
        try {
            await debtsService.delete(id)
            debts.value = debts.value.filter(d => d.id !== id)
        } catch (err: any) {
            console.error('Error deleting debt:', err)
            error.value = 'Error al eliminar la deuda'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        debts,
        loading,
        error,
        fetchDebts,
        createDebt,
        updateDebt,
        deleteDebt
    }
})
