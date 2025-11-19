import { useState } from 'react'
import { useRouter } from 'next/router'
import { authRequest, saveToken } from '../lib/api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await authRequest('/users/auth/login', { username, password })
      // When using api-gateway, auth path might be /api/users/auth/login -> see proxy
      // Save token and redirect
      const token = res.token || res.data?.token
      if (token) {
        saveToken(token)
        router.push('/')
      } else {
        alert('Login failed')
      }
    } catch (err) {
      console.error('login', err)
      alert('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1>Login</h1>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button disabled={loading} type="submit">Login</button>
      </form>
    </div>
  )
}
