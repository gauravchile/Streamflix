import Link from 'next/link'

export default function MovieCard({ movie }) {
  return (
    <div style={card}>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0 }}>{movie.title || movie.name}</h3>
        <p style={{ margin: '6px 0', color: '#555' }}>{movie.description || movie.overview || ''}</p>
        <small style={{ color: '#888' }}>{movie.year ? `Year: ${movie.year}` : ''}</small>
      </div>
      <div style={{ marginLeft: 12 }}>
        <Link href={`/movie/${movie._id || movie.insertedId || movie.id || movie.title}`}>
          <a style={button}>View</a>
        </Link>
      </div>
    </div>
  )
}

const card = {
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  border: '1px solid #eee',
  padding: 12,
  borderRadius: 8,
  background: '#fff',
  marginBottom: 12
}
const button = {
  display: 'inline-block',
  padding: '8px 12px',
  background: '#111',
  color: '#fff',
  borderRadius: 6,
  textDecoration: 'none'
}
