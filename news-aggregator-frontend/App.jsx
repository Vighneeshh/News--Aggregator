import { useState, useEffect } from 'react'

function App() {
  const [message, setMessage] = useState('Loading...')
  
  useEffect(() => {
    setMessage('React hooks are working!')
  }, [])

  return (
    <div style={{padding: '20px', backgroundColor: '#1e40af', color: 'white', minHeight: '100vh'}}>
      <h1> News Aggregator</h1>
      <p>{message}</p>
      <div style={{marginTop: '20px', padding: '15px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px'}}>
        <h2>Status: All systems working!</h2>
        <p> React is running</p>
        <p> Vite dev server is active</p>
        <p> Ready for full implementation</p>
      </div>
    </div>
  )
}

export default App