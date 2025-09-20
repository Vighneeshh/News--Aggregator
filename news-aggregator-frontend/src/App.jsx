import { useState, useEffect } from 'react'

function App() {
  const [news, setNews] = useState([])
  const [headlines, setHeadlines] = useState([])
  const [loading, setLoading] = useState(false)
  const [summaryLoading, setSummaryLoading] = useState({})
  const [currentSummary, setCurrentSummary] = useState(null)
  const [showSummaryModal, setShowSummaryModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeSection, setActiveSection] = useState('all')

  const fetchNews = async () => {
    setLoading(true)
    try {
      console.log('Fetching news from http://news-aggregator-pppy.onrender.com/news')
      const response = await fetch('http://news-aggregator-pppy.onrender.com/news')
      const data = await response.json()
      setNews(data.articles || [])
      console.log('Fetched news:', data.articles?.length, 'articles')
    } catch (error) {
      console.error('Error fetching news:', error)
      alert('Error fetching news. Make sure backend is running on port 5001.')
    }
    setLoading(false)
  }

  const fetchHeadlines = async () => {
    setLoading(true)
    try {
      console.log('Fetching headlines from http://news-aggregator-pppy.onrender.com/headlines')
      const response = await fetch('http://news-aggregator-pppy.onrender.com/headlines')
      const data = await response.json()
      setHeadlines(data.articles || [])
      console.log('Fetched headlines:', data.articles?.length, 'articles')
    } catch (error) {
      console.error('Error fetching headlines:', error)
      alert('Error fetching headlines. Make sure backend is running on port 5001.')
    }
    setLoading(false)
  }

  // Load data when component mounts
  useEffect(() => {
    console.log('App component mounted, loading initial data...')
    fetchNews()
    fetchHeadlines()
  }, [])

  const getAISummary = async (article) => {
    const articleKey = article.url || article.title
    setSummaryLoading(prev => ({ ...prev, [articleKey]: true }))
    
    try {
      console.log('Getting AI summary for:', article.title)
      const response = await fetch('http://news-aggregator-pppy.onrender.com/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: article.title,
          description: article.description,
          content: article.content,
          url: article.url,
          source: article.source,
          publishedAt: article.publishedAt
        })
      })
      
      const summary = await response.json()
      setCurrentSummary(summary)
      setShowSummaryModal(true)
      console.log('AI summary received:', summary)
    } catch (error) {
      console.error('Error getting AI summary:', error)
      alert('Error getting AI summary. Please try again.')
    } finally {
      setSummaryLoading(prev => ({ ...prev, [articleKey]: false }))
    }
  }

  const closeSummaryModal = () => {
    setShowSummaryModal(false)
    setCurrentSummary(null)
  }

  const getFilteredArticles = () => {
    let articles = []
    
    // Combine articles based on active section
    if (activeSection === 'all') {
      articles = [...news, ...headlines]
    } else if (activeSection === 'news') {
      articles = news
    } else if (activeSection === 'headlines') {
      articles = headlines
    }
    
    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase()
      articles = articles.filter(article => 
        article.title?.toLowerCase().includes(searchLower) ||
        article.description?.toLowerCase().includes(searchLower) ||
        article.source?.name?.toLowerCase().includes(searchLower) ||
        article.content?.toLowerCase().includes(searchLower)
      )
    }
    
    return articles
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e293b, #1e40af, #4338ca)', color: 'white', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px' }}>📰 News Aggregator</h1>
          <p style={{ fontSize: '20px', color: '#cbd5e1' }}>Get the latest news with AI summaries and search!</p>
        </header>

        {/* Search Bar */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ 
            maxWidth: '600px', 
            margin: '0 auto 20px auto',
            position: 'relative'
          }}>
            <input
              type="text"
              placeholder="🔍 Search articles by title, description, source, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '16px 50px 16px 20px',
                fontSize: '16px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '25px',
                color: 'white',
                outline: 'none',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(59, 130, 246, 0.6)'
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
                title="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '8px',
            marginBottom: '20px'
          }}>
            {[
              { key: 'all', label: 'All Articles', count: news.length + headlines.length },
              { key: 'news', label: 'News', count: news.length },
              { key: 'headlines', label: 'Headlines', count: headlines.length }
            ].map(section => (
              <button
                key={section.key}
                onClick={() => setActiveSection(section.key)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: activeSection === section.key 
                    ? 'rgba(59, 130, 246, 0.8)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  border: activeSection === section.key 
                    ? '2px solid rgba(59, 130, 246, 1)'
                    : '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeSection === section.key ? 'bold' : 'normal',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {section.label} ({section.count})
              </button>
            ))}
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <div style={{ 
              textAlign: 'center', 
              marginBottom: '20px',
              color: '#cbd5e1',
              fontSize: '16px'
            }}>
              Found {getFilteredArticles().length} articles matching "{searchTerm}"
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '40px' }}>
          <button
            onClick={fetchNews}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: loading ? '#065f46' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              fontSize: '16px'
            }}
          >
            {loading ? 'Loading...' : ' Fetch Latest News'}
          </button>
          
          <button
            onClick={fetchHeadlines}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: loading ? '#581c87' : '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '500',
              fontSize: '16px'
            }}
          >
            {loading ? 'Loading...' : ' Get Top Headlines'}
          </button>
        </div>

        {/* Section Header */}
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: 'white',
            marginBottom: '8px'
          }}>
            {searchTerm 
              ? `Search Results: "${searchTerm}"` 
              : activeSection === 'all' 
                ? 'All Articles'
                : activeSection === 'news'
                  ? 'Latest News'
                  : 'Top Headlines'
            }
          </h2>
          <p style={{ 
            color: '#cbd5e1', 
            fontSize: '16px',
            margin: 0
          }}>
            {getFilteredArticles().length} articles found
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              border: '4px solid transparent', 
              borderTop: '4px solid white', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ color: 'white', fontSize: '18px' }}>Loading articles...</p>
          </div>
        ) : getFilteredArticles().length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '24px' 
          }}>
            {getFilteredArticles().map((article, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              >
                {article.urlToImage && (
                  <div style={{ height: '192px', overflow: 'hidden' }}>
                    <img
                      src={article.urlToImage}
                      alt={article.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}

                <div style={{ padding: '24px' }}>
                  <h3 style={{ 
                    fontWeight: 'bold', 
                    color: 'white', 
                    fontSize: '18px', 
                    marginBottom: '12px'
                  }}>
                    {article.title}
                  </h3>
                  
                  {article.description && (
                    <p style={{ 
                      color: '#cbd5e1', 
                      fontSize: '14px', 
                      marginBottom: '16px'
                    }}>
                      {article.description.slice(0, 150)}...
                    </p>
                  )}

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    fontSize: '12px', 
                    color: '#9ca3af', 
                    marginBottom: '16px' 
                  }}>
                    <span>{article.source?.name}</span>
                    {article.publishedAt && (
                      <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        flex: '1',
                        padding: '8px 12px',
                        backgroundColor: '#2563eb',
                        color: 'white',
                        textDecoration: 'none',
                        fontSize: '14px',
                        borderRadius: '6px',
                        textAlign: 'center'
                      }}
                    >
                      Read Full Article
                    </a>
                    
                    <button
                      onClick={() => getAISummary(article)}
                      disabled={summaryLoading[article.url || article.title]}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: summaryLoading[article.url || article.title] ? '#059669' : '#10b981',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: summaryLoading[article.url || article.title] ? 'not-allowed' : 'pointer',
                        fontSize: '14px',
                        minWidth: '80px'
                      }}
                      title="Get AI Summary"
                    >
                      {summaryLoading[article.url || article.title] ? '...' : '🤖 AI'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '72px', marginBottom: '16px' }}>
              {searchTerm ? '🔍' : '📰'}
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '8px' }}>
              {searchTerm 
                ? 'No articles found' 
                : news.length === 0 && headlines.length === 0
                  ? 'Ready to fetch news!'
                  : 'No articles in this section'
              }
            </h3>
            <p style={{ color: '#9ca3af' }}>
              {searchTerm 
                ? `No articles match "${searchTerm}". Try different keywords or clear the search to see all articles.`
                : news.length === 0 && headlines.length === 0
                  ? 'Click "Fetch Latest News" or "Get Top Headlines" to load articles.'
                  : `Switch to "All Articles" to see more content.`
              }
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{
                  marginTop: '16px',
                  padding: '8px 16px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* AI Summary Modal */}
      {showSummaryModal && currentSummary && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              padding: '20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
                🤖 AI Summary
              </h3>
              <button
                onClick={closeSummaryModal}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '6px',
                  color: 'white',
                  fontSize: '18px',
                  width: '30px',
                  height: '30px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ padding: '20px', overflowY: 'auto', maxHeight: '60vh' }}>
              <div style={{
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px'
              }}>
                <h4 style={{ color: '#10b981', fontSize: '16px', marginBottom: '8px' }}>
                  ✨ Summary
                </h4>
                <p style={{ color: 'white', lineHeight: '1.6', margin: 0 }}>
                  {currentSummary.summary}
                </p>
              </div>

              {currentSummary.keyPoints && currentSummary.keyPoints.length > 0 && (
                <div style={{
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <h4 style={{ color: '#3b82f6', fontSize: '16px', marginBottom: '12px' }}>
                    🔍 Key Points
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {currentSummary.keyPoints.map((point, index) => (
                      <li key={index} style={{ color: '#cbd5e1', marginBottom: '8px' }}>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{
                backgroundColor: 'rgba(107, 114, 128, 0.2)',
                border: '1px solid rgba(107, 114, 128, 0.3)',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <h4 style={{ color: '#9ca3af', fontSize: '16px', marginBottom: '8px' }}>
                  📄 Article Info
                </h4>
                <p style={{ color: 'white', fontWeight: 'bold', marginBottom: '4px' }}>
                  {currentSummary.title}
                </p>
                {currentSummary.source && (
                  <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
                    Source: {currentSummary.source}
                  </p>
                )}
              </div>
            </div>

            <div style={{
              padding: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px'
            }}>
              <button
                onClick={closeSummaryModal}
                style={{
                  padding: '8px 16px',
                  backgroundColor: 'rgba(107, 114, 128, 0.7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              {currentSummary.url && (
                <a
                  href={currentSummary.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '6px'
                  }}
                >
                  Read Full Article
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default App
