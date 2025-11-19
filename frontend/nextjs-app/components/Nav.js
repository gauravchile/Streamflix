import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getToken, logout } from '../lib/api'

export default function Nav() {
  const [logged, setLogged] = useState(false)
  useEffect(() => {
    setLogged(!!getToken())
  }, [])

  return (
    <nav style={navStyle}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <Link href="/"><a style={logoStyle}>Streamflix</a></Link>
        <Link href="/movies"><a style={linkStyle}>Movies</a></Link>
        <Link href="/recommendations"><a style={linkStyle}>Recommendations</a></Link>
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {logged ? (
          <>
            <Link href="/"><a style={linkStyle} onClick={() => { logout(); setLogged(false) }}>Logout</a></Link>
          </>
        ) : (
          <>
            <Link href="/login"><a style={linkStyle}>Login</a></Link>
            <Link href="/register"><a style={linkStyle}>Register</a></Link>
          </>
        )}
      </div>
    </nav>
  )
}

const navStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '12px 16px',
  borderBottom: '1px solid #eee',
  background: '#fff',
  position: 'sticky',
  top: 0,
  zIndex: 40
}
const logoStyle = {
  fontWeight: 700,
  fontSize: 18,
  textDecoration: 'none',
  color: '#111'
}
const linkStyle = {
  color: '#111',
  textDecoration: 'none',
  padding: '6px 8px',
  borderRadius: 6
}
