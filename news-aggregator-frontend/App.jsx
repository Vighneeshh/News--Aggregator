import { useState, useEffect } from 'react'

const API_BASE = 'https://news-aggregator-pppy.onrender.com'

function App() {
  const [news, setNews] = useState([])
  const [headlines, setHeadlines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [summary, setSummary] = useState('')
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [activeTab, setActiveTab] = useState('headlines')

  const fetchNews = async () => {
    try {
      const response = await fetch(`${API_BASE}/news`)
      if (!response.ok) throw new Error('Failed to fetch news')
      const data = await response.json()
      setNews(data.articles || [])
    } catch (err) {
      console.error('Error fetching news:', err)
      setError(err.message)
    }
  }

  const fetchHeadlines = async () => {
    try {
      const response = await fetch(`${API_BASE}/headlines`)
      if (!response.ok) throw new Error('Failed to fetch headlines')
      const data = await response.json()
      setHeadlines(data.articles || [])
    } catch (err) {
      console.error('Error fetching headlines:', err)
      setError(err.message)
    }
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchNews(), fetchHeadlines()])
      setLoading(false)
    }
    loadData()
  }, [])

  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    
    setIsSearching(true)
    try {
      const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(searchTerm)}`)
      if (!response.ok) throw new Error('Search failed')
      const data = await response.json()
      setSearchResults(data.articles || [])
      setActiveTab('search')
    } catch (err) {
      console.error('Error searching:', err)
      setError(err.message)
    } finally {
      setIsSearching(false)
    }
  }

  const generateSummary = async (article) => {
    setSelectedArticle(article)
    setIsGeneratingSummary(true)
    setSummary('')
    
    try {
      const response = await fetch(`${API_BASE}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          description: article.description,
          content: article.content
        })
      })
      
      if (!response.ok) throw new Error('Failed to generate summary')
      const data = await response.json()
      setSummary(data.summary)
    } catch (err) {
      console.error('Error generating summary:', err)
      setSummary('Failed to generate summary. Please try again.')
    } finally {
      setIsGeneratingSummary(false)
    }
  }

  const currentArticles = activeTab === 'headlines' ? headlines : 
                         activeTab === 'news' ? news : searchResults

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading news...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">🗞️ AI News Aggregator</h1>
        
        {error && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6">
            Error: {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="flex gap-2 mb-6 max-w-2xl mx-auto">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for news..."
            className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6">
          <div className="flex bg-white/10 rounded-lg p-1">
            {['headlines', 'news', 'search'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {tab} {tab === 'search' && searchResults.length > 0 && `(${searchResults.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentArticles.map((article, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-colors">
              {article.urlToImage && (
                <img
                  src={article.urlToImage}
                  alt={article.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              )}
              <h2 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h2>
              <p className="text-gray-300 mb-4 line-clamp-3">{article.description}</p>
              <div className="flex justify-between items-center text-sm text-gray-400 mb-4">
                <span>{article.source?.name || 'Unknown Source'}</span>
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium"
                >
                  Read Full Article
                </a>
                <button
                  onClick={() => generateSummary(article)}
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium"
                >
                  AI Summary
                </button>
              </div>
            </div>
          ))}
        </div>

        {currentArticles.length === 0 && (
          <div className="text-center text-gray-400 py-12">
            {activeTab === 'search' ? 'No search results found.' : 'No articles available.'}
          </div>
        )}
      </div>

      {/* AI Summary Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold pr-4">{selectedArticle.title}</h3>
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-purple-400">🤖 AI Summary:</h4>
                {isGeneratingSummary ? (
                  <div className="text-gray-400">Generating summary...</div>
                ) : (
                  <p className="text-gray-300 leading-relaxed">{summary}</p>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-700">
                <a
                  href={selectedArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium"
                >
                  Read Full Article →
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App