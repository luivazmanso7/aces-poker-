import axios from 'axios'
import Cookies from 'js-cookie'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos timeout
})

// Contador para rate limiting básico
let requestCount = 0;
let lastRequestTime = 0;

// Interceptor para adicionar token automaticamente
api.interceptors.request.use((config) => {
  // Rate limiting básico no frontend
  const now = Date.now();
  if (now - lastRequestTime < 100) { // Máximo 10 requests/segundo
    requestCount++;
    if (requestCount > 50) {
      throw new Error('Muitas requisições. Tente novamente em alguns segundos.');
    }
  } else {
    requestCount = 0;
  }
  lastRequestTime = now;

  const token = Cookies.get('auth-token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error);
})

// Interceptor para lidar com respostas de erro
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      Cookies.remove('auth-token', { 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      })
      
      // Só redirecionar se não estiver já na página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
    } else if (error.response?.status === 429) {
      // Rate limit atingido
      error.message = 'Muitas tentativas. Tente novamente em alguns minutos.';
    } else if (error.response?.status >= 500) {
      // Erro do servidor
      error.message = 'Erro interno do servidor. Tente novamente mais tarde.';
    }
    
    return Promise.reject(error)
  }
)

export default api
