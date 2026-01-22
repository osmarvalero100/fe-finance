import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { config } from '@/config'
import type { Token } from '@/types/api'

const API_BASE_URL = config.api.baseUrl

class ApiService {
  private unauthorizedCallback: (() => void) | null = null

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = this.getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor to handle token refresh or logout on 401
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          this.logout()
          if (this.unauthorizedCallback) {
            this.unauthorizedCallback()
          }
        }
        return Promise.reject(error)
      }
    )
  }

  onUnauthorized(callback: () => void): void {
    this.unauthorizedCallback = callback
  }

  private getToken(): string | null {
    return localStorage.getItem('access_token')
  }

  private setToken(token: string): void {
    localStorage.setItem('access_token', token)
  }

  private removeToken(): void {
    localStorage.removeItem('access_token')
  }

  login(credentials: { username: string; password: string }): Promise<AxiosResponse<Token>> {
    return this.api.post('/auth/login', credentials, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
  }

  register(userData: any): Promise<AxiosResponse<Token>> {
    return this.api.post('/auth/register', userData)
  }

  logout(): void {
    this.removeToken()
    // Additional logout logic
  }

  setAuthToken(token: string): void {
    this.setToken(token)
  }

  get instance(): AxiosInstance {
    return this.api
  }
}

export const apiService = new ApiService()
export default apiService