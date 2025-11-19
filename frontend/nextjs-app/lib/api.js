import axios from 'axios'

const API_PREFIX = '/api' // proxy through api-gateway (docker/k8s)

export function apiClient() {
  return axios.create({
    baseURL: API_PREFIX,
    timeout: 8000,
    headers: { 'Content-Type': 'application/json' }
  })
}

// auth helpers (localStorage)
export function saveToken(token) {
  if (typeof window !== 'undefined') localStorage.setItem('streamflix_token', token)
}
export function getToken() {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('streamflix_token')
}
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('streamflix_token')
    window.location.href = '/'
  }
}
export async function authRequest(path, payload) {
  const client = apiClient()
  const res = await client.post(path, payload)
  return res.data
}
export function authHeader() {
  const token = getToken()
  if (!token) return {}
  return { Authorization: `Bearer ${token}` }
}
