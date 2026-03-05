// API Configuration for Aicee-Tech Backend
// Change this to your PHP backend URL
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
    REFRESH: '/api/auth/refresh'
  },
  
  // Medical Records
  MEDICAL_RECORDS: {
    LIST: '/api/medical-records',
    CREATE: '/api/medical-records',
    GET: (id: string) => `/api/medical-records/${id}`,
    UPDATE: (id: string) => `/api/medical-records/${id}`,
    DELETE: (id: string) => `/api/medical-records/${id}`,
    EXPORT: (id: string) => `/api/medical-records/${id}/export`
  },
  
  // User Management
  USERS: {
    GET_PROFILE: '/api/users/profile',
    UPDATE_PROFILE: '/api/users/profile',
    CHANGE_PASSWORD: '/api/users/change-password',
    GET_ALL: '/api/users',
    APPROVE: (id: string) => `/api/users/${id}/approve`,
    REJECT: (id: string) => `/api/users/${id}/reject`
  },
  
  // Admin
  ADMIN: {
    DASHBOARD: '/api/admin/dashboard',
    PENDING_USERS: '/api/admin/pending-users',
    AUDIT_LOG: '/api/admin/audit-log'
  }
}

export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('aicee-token') : null
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers
  }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  })
  
  if (!response.ok) {
    if (response.status === 401) {
      // Token expired, redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('aicee-token')
        window.location.href = '/login'
      }
    }
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || 'API request failed')
  }
  
  return response.json()
}
