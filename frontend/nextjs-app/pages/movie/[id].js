import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { apiClient, getToken, authHeader } from '../../lib/api'

export default function MovieDetails() {
  const router = useRouter()
  const { id } = router.query
  const [movie, setMovie] = useState(null)
  const [rating, setRating] = useState(5)
  const [loading, setLoading] = useState(false)
  const client = apiClient()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    client.get(`/movies/${encodeURIComponent(id)}`)
      .then(r => setMovie(r.data))
      .catch(e => { console.error('movie get', e); setMovie(null) })
      .finally(() => setLoading(false))
  }, [id])

  const submitRating = async (e) => {
    e.preventDefault()
    try {
      const token = getToken()
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      await client.post('/ratings', { user_id: 1, movie_id: id, rating: Number(rating) }, { headers })
      alert('Rating submitted')
    } catch (err) {
      console.error('submit rating', err)
      alert('Failed to submit rating. Make sure you are logged in and services are available.')
    }
  }

  if (loading) return <p>Loading…</p>
  if (!movie) return <p>Movie not found.</p>

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <h1>{movie.title || movie.name}</h1>
      <p style={{ color: '#555' }}>{movie.description || movie.overview}</p>
      <p><strong>Year:</strong> {movie.year || '—'}</p>

      <section style={{ marginTop: 24 }}>
        <h3>Rate this movie</h3>
        <form onSubmit={submitRating}>
          <label>
            Score:
            <select value={rating} onChange={e => setRating(e.target.value)} style={{ marginLeft: 8 }}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <button style={{ marginLeft: 12 }} type="submit">Submit</button>
        </form>
      </section>
    </div>
  )
}
