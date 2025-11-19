import { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import { apiClient } from '../lib/api'

export default function Movies() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const c = apiClient()
    c.get('/movies/')
      .then(r => setMovies(r.data || []))
      .catch(e => {
        console.error('fetch movies', e)
        setMovies([])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth: 980, margin: '0 auto' }}>
      <h1>Movies</h1>
      {loading && <p>Loading…</p>}
      {!loading && movies.length === 0 && <p>No movies found. Add one via API /movies (POST).</p>}
      {movies.map(m => <MovieCard key={m._id || m.insertedId || m.id || m.title} movie={m} />)}
    </div>
  )
}
