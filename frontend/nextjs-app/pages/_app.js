import '../styles/globals.css'
import Nav from '../components/Nav'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Nav />
      <main style={{ padding: 16 }}>
        <Component {...pageProps} />
      </main>
    </>
  )
}
