import { defineStore } from 'pinia'
import { ref } from 'vue'
import { budgetsService } from '@/services/budgets'
import type { BudgetResponse, BudgetCreate, BudgetUpdate } from '@/types/api'

export const useBudgetsStore = defineStore('budgets', () => {
    const budgets = ref<BudgetResponse[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchBudgets(params?: any) {
        loading.value = true
        error.value = null
        try {
            const response = await budgetsService.getAll(params)
            budgets.value = response.data
        } catch (err: any) {
            console.error('Error fetching budgets:', err)
            error.value = 'Error al cargar los presupuestos'
        } finally {
            loading.value = false
        }
    }

    async function createBudget(data: BudgetCreate) {
        loading.value = true
        error.value = null
        try {
            const response = await budgetsService.create(data)
            budgets.value.push(response.data)
            return response.data
        } catch (err: any) {
            console.error('Error creating budget:', err)
            error.value = 'Error al crear el presupuesto'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function updateBudget(id: number, data: BudgetUpdate) {
        loading.value = true
        error.value = null
        try {
            const response = await budgetsService.update(id, data)
            const index = budgets.value.findIndex(b => b.id === id)
            if (index !== -1) {
                budgets.value[index] = response.data
            }
            return response.data
        } catch (err: any) {
            console.error('Error updating budget:', err)
            error.value = 'Error al actualizar el presupuesto'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function deleteBudget(id: number) {
        loading.value = true
        error.value = null
        try {
            await budgetsService.delete(id)
            budgets.value = budgets.value.filter(b => b.id !== id)
        } catch (err: any) {
            console.error('Error deleting budget:', err)
            error.value = 'Error al eliminar el presupuesto'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        budgets,
        loading,
        error,
        fetchBudgets,
        createBudget,
        updateBudget,
        deleteBudget
    }
})
