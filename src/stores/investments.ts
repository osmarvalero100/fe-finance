import { defineStore } from 'pinia'
import { ref } from 'vue'
import { investmentsService } from '@/services/investments'
import type { InvestmentResponse, InvestmentCreate, InvestmentUpdate } from '@/types/api'

export const useInvestmentsStore = defineStore('investments', () => {
    const investments = ref<InvestmentResponse[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchInvestments(params?: any) {
        loading.value = true
        error.value = null
        try {
            const response = await investmentsService.getAll(params)
            investments.value = response.data
        } catch (err: any) {
            console.error('Error fetching investments:', err)
            error.value = 'Error al cargar las inversiones'
        } finally {
            loading.value = false
        }
    }

    async function createInvestment(data: InvestmentCreate) {
        loading.value = true
        error.value = null
        try {
            const response = await investmentsService.create(data)
            investments.value.push(response.data)
            return response.data
        } catch (err: any) {
            console.error('Error creating investment:', err)
            error.value = 'Error al crear la inversión'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function updateInvestment(id: number, data: InvestmentUpdate) {
        loading.value = true
        error.value = null
        try {
            const response = await investmentsService.update(id, data)
            const index = investments.value.findIndex(i => i.id === id)
            if (index !== -1) {
                investments.value[index] = response.data
            }
            return response.data
        } catch (err: any) {
            console.error('Error updating investment:', err)
            error.value = 'Error al actualizar la inversión'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function deleteInvestment(id: number) {
        loading.value = true
        error.value = null
        try {
            await investmentsService.delete(id)
            investments.value = investments.value.filter(i => i.id !== id)
        } catch (err: any) {
            console.error('Error deleting investment:', err)
            error.value = 'Error al eliminar la inversión'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        investments,
        loading,
        error,
        fetchInvestments,
        createInvestment,
        updateInvestment,
        deleteInvestment
    }
})
