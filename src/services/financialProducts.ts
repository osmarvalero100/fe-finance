import { apiService } from './api'
import type { AxiosResponse } from 'axios'
import type { FinancialProductResponse, FinancialProductCreate, FinancialProductUpdate } from '@/types/api'

class FinancialProductsService {
    getAll(params?: any): Promise<AxiosResponse<FinancialProductResponse[]>> {
        return apiService.instance.get('/financial-products/', { params })
    }

    getById(id: number): Promise<AxiosResponse<FinancialProductResponse>> {
        return apiService.instance.get(`/financial-products/${id}`)
    }

    create(data: FinancialProductCreate): Promise<AxiosResponse<FinancialProductResponse>> {
        return apiService.instance.post('/financial-products/', data)
    }

    update(id: number, data: FinancialProductUpdate): Promise<AxiosResponse<FinancialProductResponse>> {
        return apiService.instance.put(`/financial-products/${id}`, data)
    }

    delete(id: number): Promise<AxiosResponse<void>> {
        return apiService.instance.delete(`/financial-products/${id}`)
    }
}

export const financialProductsService = new FinancialProductsService()
export default financialProductsService
