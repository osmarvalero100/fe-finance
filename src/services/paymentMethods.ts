import { apiService } from './api'
import type { AxiosResponse } from 'axios'
import type { PaymentMethodResponse, PaymentMethodCreate, PaymentMethodUpdate } from '@/types/api'

class PaymentMethodsService {
    getAll(): Promise<AxiosResponse<PaymentMethodResponse[]>> {
        return apiService.instance.get('/payment-methods/')
    }

    getById(id: number): Promise<AxiosResponse<PaymentMethodResponse>> {
        return apiService.instance.get(`/payment-methods/${id}`)
    }

    create(data: PaymentMethodCreate): Promise<AxiosResponse<PaymentMethodResponse>> {
        return apiService.instance.post('/payment-methods/', data)
    }

    update(id: number, data: PaymentMethodUpdate): Promise<AxiosResponse<PaymentMethodResponse>> {
        return apiService.instance.put(`/payment-methods/${id}`, data)
    }

    delete(id: number): Promise<AxiosResponse<void>> {
        return apiService.instance.delete(`/payment-methods/${id}`)
    }
}

export const paymentMethodsService = new PaymentMethodsService()
export default paymentMethodsService
