import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Token } from '@/types/api'
import apiService from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('access_token'))
  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await apiService.login(credentials)
      const tokenData: Token = response.data
      token.value = tokenData.access_token
      apiService.setAuthToken(tokenData.access_token)
      return response
    } catch (error) {
      throw error
    }
  }

  const register = async (userData: any) => {
    try {
      const response = await apiService.register(userData)
      const tokenData: Token = response.data
      token.value = tokenData.access_token
      apiService.setAuthToken(tokenData.access_token)
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    token.value = null
    apiService.logout()
  }

  return {
    token,
    isAuthenticated,
    login,
    register,
    logout,
  }
})