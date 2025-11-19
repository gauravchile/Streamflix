import { useEffect, useState } from 'react'
import { apiClient } from '../lib/api'

export default function Recommendations() {
  const [recs, setRecs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const c = apiClient()
    c.get('/recommend/1')
      .then(r => {
        // backend returns array of { movie_id, score } or similar
        setRecs(r.data || [])
      })
      .catch(e => {
        console.error('recommendations', e)
        setRecs([])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth: 980, margin: '0 auto' }}>
      <h1>Recommendations</h1>
      {loading && <p>Loading…</p>}
      {!loading && recs.length === 0 && <p>No recommendations yet.</p>}
      <ul>
        {recs.map((r, i) => (
          <li key={i}>
            <strong>{r.movie_id}</strong> — score: {r.score?.toFixed(2) ?? r.score}
          </li>
        ))}
      </ul>
    </div>
  )
}
