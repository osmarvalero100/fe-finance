import { apiService } from './api'
import type { AxiosResponse } from 'axios'
import type { DebtResponse, DebtCreate, DebtUpdate } from '@/types/api'

class DebtsService {
    getAll(params?: any): Promise<AxiosResponse<DebtResponse[]>> {
        return apiService.instance.get('/debts/', { params })
    }

    getById(id: number): Promise<AxiosResponse<DebtResponse>> {
        return apiService.instance.get(`/debts/${id}`)
    }

    create(data: DebtCreate): Promise<AxiosResponse<DebtResponse>> {
        return apiService.instance.post('/debts/', data)
    }

    update(id: number, data: DebtUpdate): Promise<AxiosResponse<DebtResponse>> {
        return apiService.instance.put(`/debts/${id}`, data)
    }

    delete(id: number): Promise<AxiosResponse<void>> {
        return apiService.instance.delete(`/debts/${id}`)
    }
}

export const debtsService = new DebtsService()
export default debtsService
