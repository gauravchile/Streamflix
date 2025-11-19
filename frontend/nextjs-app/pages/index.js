import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ maxWidth: 980, margin: '0 auto' }}>
      <header style={{ padding: '2rem 0' }}>
        <h1>Welcome to Streamflix</h1>
        <p>A demo microservices streaming app — browse movies, rate them, and get recommendations.</p>
        <p>
          <Link href="/movies"><a style={cta}>Browse Movies</a></Link>
        </p>
      </header>

      <section>
        <h2>Quick Actions</h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link href="/movies"><a style={card}>Browse Movies</a></Link>
          <Link href="/recommendations"><a style={card}>Get Recommendations</a></Link>
          <Link href="/login"><a style={card}>Login / Register</a></Link>
        </div>
      </section>
    </div>
  )
}

const cta = {
  display: 'inline-block',
  padding: '10px 16px',
  background: '#111',
  color: '#fff',
  borderRadius: 8,
  textDecoration: 'none'
}
const card = {
  padding: '16px',
  borderRadius: 8,
  background: '#fff',
  border: '1px solid #eee',
  minWidth: 180,
  textDecoration: 'none',
  color: '#111'
}
