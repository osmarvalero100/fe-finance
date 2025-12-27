import { apiService } from './api'
import type { AxiosResponse } from 'axios'
import type { TagResponse, TagCreate, TagUpdate } from '@/types/api'

class TagsService {
    getAll(): Promise<AxiosResponse<TagResponse[]>> {
        return apiService.instance.get('/tags/')
    }

    getById(id: number): Promise<AxiosResponse<TagResponse>> {
        return apiService.instance.get(`/tags/${id}`)
    }

    create(data: TagCreate): Promise<AxiosResponse<TagResponse>> {
        return apiService.instance.post('/tags/', data)
    }

    update(id: number, data: TagUpdate): Promise<AxiosResponse<TagResponse>> {
        return apiService.instance.put(`/tags/${id}`, data)
    }

    delete(id: number): Promise<AxiosResponse<void>> {
        return apiService.instance.delete(`/tags/${id}`)
    }
}

export const tagsService = new TagsService()
export default tagsService
