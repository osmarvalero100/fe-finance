import { apiService } from './api'
import type { AxiosResponse } from 'axios'
import type { BudgetResponse, BudgetCreate, BudgetUpdate } from '@/types/api'

class BudgetsService {
    getAll(params?: any): Promise<AxiosResponse<BudgetResponse[]>> {
        return apiService.instance.get('/budgets/', { params })
    }

    getById(id: number): Promise<AxiosResponse<BudgetResponse>> {
        return apiService.instance.get(`/budgets/${id}`)
    }

    create(data: BudgetCreate): Promise<AxiosResponse<BudgetResponse>> {
        return apiService.instance.post('/budgets/', data)
    }

    update(id: number, data: BudgetUpdate): Promise<AxiosResponse<BudgetResponse>> {
        return apiService.instance.put(`/budgets/${id}`, data)
    }

    delete(id: number): Promise<AxiosResponse<void>> {
        return apiService.instance.delete(`/budgets/${id}`)
    }
}

export const budgetsService = new BudgetsService()
export default budgetsService
