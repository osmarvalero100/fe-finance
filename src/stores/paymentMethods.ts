import { defineStore } from 'pinia'
import { ref } from 'vue'
import { paymentMethodsService } from '@/services/paymentMethods'
import type { PaymentMethodResponse, PaymentMethodCreate, PaymentMethodUpdate } from '@/types/api'

export const usePaymentMethodsStore = defineStore('paymentMethods', () => {
    const paymentMethods = ref<PaymentMethodResponse[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchPaymentMethods() {
        loading.value = true
        error.value = null
        try {
            const response = await paymentMethodsService.getAll()
            paymentMethods.value = response.data
        } catch (err: any) {
            error.value = err.response?.data?.detail || 'Error al cargar métodos de pago'
        } finally {
            loading.value = false
        }
    }

    async function createPaymentMethod(data: PaymentMethodCreate) {
        loading.value = true
        error.value = null
        try {
            const response = await paymentMethodsService.create(data)
            paymentMethods.value.push(response.data)
            return response.data
        } catch (err: any) {
            error.value = err.response?.data?.detail || 'Error al crear el método de pago'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function updatePaymentMethod(id: number, data: PaymentMethodUpdate) {
        loading.value = true
        error.value = null
        try {
            const response = await paymentMethodsService.update(id, data)
            const index = paymentMethods.value.findIndex(p => p.id === id)
            if (index !== -1) {
                paymentMethods.value[index] = response.data
            }
            return response.data
        } catch (err: any) {
            error.value = err.response?.data?.detail || 'Error al actualizar el método de pago'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function deletePaymentMethod(id: number) {
        loading.value = true
        error.value = null
        try {
            await paymentMethodsService.delete(id)
            paymentMethods.value = paymentMethods.value.filter(p => p.id !== id)
        } catch (err: any) {
            error.value = err.response?.data?.detail || 'Error al eliminar el método de pago'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        paymentMethods,
        loading,
        error,
        fetchPaymentMethods,
        createPaymentMethod,
        updatePaymentMethod,
        deletePaymentMethod
    }
})
