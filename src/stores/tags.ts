import { defineStore } from 'pinia'
import { ref } from 'vue'
import { tagsService } from '@/services/tags'
import type { TagResponse, TagCreate, TagUpdate } from '@/types/api'

export const useTagsStore = defineStore('tags', () => {
    const tags = ref<TagResponse[]>([])
    const loading = ref(false)
    const error = ref<string | null>(null)

    async function fetchTags() {
        loading.value = true
        error.value = null
        try {
            const response = await tagsService.getAll()
            tags.value = response.data
        } catch (err: any) {
            error.value = err.response?.data?.detail || 'Error al cargar etiquetas'
        } finally {
            loading.value = false
        }
    }

    async function createTag(data: TagCreate) {
        loading.value = true
        error.value = null
        try {
            const response = await tagsService.create(data)
            tags.value.push(response.data)
            return response.data
        } catch (err: any) {
            error.value = err.response?.data?.detail || 'Error al crear la etiqueta'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function updateTag(id: number, data: TagUpdate) {
        loading.value = true
        error.value = null
        try {
            const response = await tagsService.update(id, data)
            const index = tags.value.findIndex(t => t.id === id)
            if (index !== -1) {
                tags.value[index] = response.data
            }
            return response.data
        } catch (err: any) {
            error.value = err.response?.data?.detail || 'Error al actualizar la etiqueta'
            throw err
        } finally {
            loading.value = false
        }
    }

    async function deleteTag(id: number) {
        loading.value = true
        error.value = null
        try {
            await tagsService.delete(id)
            tags.value = tags.value.filter(t => t.id !== id)
        } catch (err: any) {
            error.value = err.response?.data?.detail || 'Error al eliminar la etiqueta'
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        tags,
        loading,
        error,
        fetchTags,
        createTag,
        updateTag,
        deleteTag
    }
})
