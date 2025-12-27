import { apiService } from './api'
import type { AxiosResponse } from 'axios'
import type { CategoryResponse, CategoryCreate, CategoryUpdate } from '@/types/api'

class CategoriesService {
  getAll(): Promise<AxiosResponse<CategoryResponse[]>> {
    return apiService.instance.get('/categories/')
  }

  getById(id: number): Promise<AxiosResponse<CategoryResponse>> {
    return apiService.instance.get(`/categories/${id}`)
  }

  create(data: CategoryCreate): Promise<AxiosResponse<CategoryResponse>> {
    return apiService.instance.post('/categories/', data)
  }

  update(id: number, data: CategoryUpdate): Promise<AxiosResponse<CategoryResponse>> {
    return apiService.instance.put(`/categories/${id}`, data)
  }

  delete(id: number): Promise<AxiosResponse<void>> {
    return apiService.instance.delete(`/categories/${id}`)
  }
}

export const categoriesService = new CategoriesService()
export default categoriesService
