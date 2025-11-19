import { useState } from 'react'
import { useRouter } from 'next/router'
import { authRequest } from '../lib/api'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authRequest('/users/auth/register', { username, password })
      alert('Registered. Please login.')
      router.push('/login')
    } catch (err) {
      console.error('register', err)
      alert('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1>Register</h1>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
        <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button disabled={loading} type="submit">Register</button>
      </form>
    </div>
  )
}
