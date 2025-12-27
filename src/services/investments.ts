import { apiService } from './api'
import type { AxiosResponse } from 'axios'
import type { InvestmentResponse, InvestmentCreate, InvestmentUpdate } from '@/types/api'

class InvestmentsService {
    getAll(params?: any): Promise<AxiosResponse<InvestmentResponse[]>> {
        return apiService.instance.get('/investments/', { params })
    }

    getById(id: number): Promise<AxiosResponse<InvestmentResponse>> {
        return apiService.instance.get(`/investments/${id}`)
    }

    create(data: InvestmentCreate): Promise<AxiosResponse<InvestmentResponse>> {
        return apiService.instance.post('/investments/', data)
    }

    update(id: number, data: InvestmentUpdate): Promise<AxiosResponse<InvestmentResponse>> {
        return apiService.instance.put(`/investments/${id}`, data)
    }

    delete(id: number): Promise<AxiosResponse<void>> {
        return apiService.instance.delete(`/investments/${id}`)
    }
}

export const investmentsService = new InvestmentsService()
export default investmentsService
