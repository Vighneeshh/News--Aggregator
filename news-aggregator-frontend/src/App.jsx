/*
📰 Full-Stack News Aggregator App – Enhanced Frontend
-----------------------------------------------------
This is the updated React codebase for your news summarizer app with:
1. User Login (localStorage based)
2. Bookmarks functionality
3. Category filters (Tech, Sports, etc.)
4. Full article view with date/time & summarize button
5. Sidebar with Top 10 Headlines
6. Improved plain CSS-based UI
*/

// src/App.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './index.css';

const CATEGORIES = ['Technology', 'Sports', 'Business', 'Entertainment', 'Health', 'Science'];

function App() {
  const [user, setUser] = useState(localStorage.getItem('user') || '');
  const [query, setQuery] = useState('technology');
  const [articles, setArticles] = useState([]);
  const [topHeadlines, setTopHeadlines] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [summary, setSummary] = useState('');
  const [bookmarks, setBookmarks] = useState(
    JSON.parse(localStorage.getItem('bookmarks') || '[]')
  );

  const fetchNews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/news?q=${query}`);
      setArticles(res.data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
      alert('Failed to fetch news. Please check if the backend server is running.');
    }
  };

  const fetchHeadlines = async () => {
    try {
      const res = await axios.get('http://localhost:5000/news?q=top');
      setTopHeadlines(res.data.articles.slice(0, 10));
    } catch (error) {
      console.error('Error fetching headlines:', error);
      // Don't show alert for headlines as it's not critical
    }
  };

  const summarizeArticle = async (article) => {
    try {
      setSelectedArticle(article);
      setSummary('Loading...');
      
      // Check if article has content to summarize
      const textToSummarize = article.content || article.description;
      if (!textToSummarize) {
        setSummary('No content available to summarize.');
        return;
      }
      
      console.log('Sending text for summarization:', textToSummarize.substring(0, 100) + '...');
      
      const res = await axios.post('http://localhost:5000/summarize', {
        text: textToSummarize,
      });
      setSummary(res.data.summary);
    } catch (error) {
      console.error('Error summarizing article:', error);
      console.error('Error response:', error.response?.data);
      console.error('Full error details:', JSON.stringify(error.response?.data, null, 2));
      
      const errorMsg = error.response?.data?.details 
        ? JSON.stringify(error.response.data.details, null, 2)
        : error.message;
      
      setSummary(`Failed to generate summary: ${errorMsg}`);
    }
  };

  const login = () => {
    const name = prompt('Enter your username:');
    if (name) {
      setUser(name);
      localStorage.setItem('user', name);
    }
  };

  const toggleBookmark = (article) => {
    const updated = bookmarks.some(a => a.title === article.title)
      ? bookmarks.filter(a => a.title !== article.title)
      : [...bookmarks, article];
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
  };

  useEffect(() => {
    fetchNews();
    fetchHeadlines();
  }, [query]);

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>Top Headlines</h2>
        <ul>
          {topHeadlines.map((a, i) => (
            <li key={i} onClick={() => setSelectedArticle(a)}>{a.title}</li>
          ))}
        </ul>
        <div className="login">
          {user ? <p>👤 {user}</p> : <button onClick={login}>Login</button>}
        </div>
      </aside>

      <main className="main">
        <h1 className="title">AI News Summarizer</h1>

        <div className="controls">
          <input value={query} onChange={e => setQuery(e.target.value)} />
          <button onClick={fetchNews}>Search</button>
          <select onChange={e => setQuery(e.target.value)} value={query}>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat.toLowerCase()}>{cat}</option>
            ))}
          </select>
        </div>

        <section className="grid">
          {articles.map((a, i) => (
            <div key={i} className="card">
              <h3>{a.title}</h3>
              <p><strong>{a.source.name}</strong> | {new Date(a.publishedAt).toLocaleString()}</p>
              <button onClick={() => setSelectedArticle(a)}>View</button>
              <button onClick={() => summarizeArticle(a)}>Summarize</button>
              <button onClick={() => toggleBookmark(a)}>
                {bookmarks.some(b => b.title === a.title) ? 'Unbookmark' : 'Bookmark'}
              </button>
            </div>
          ))}
        </section>

        <section className="bookmarks">
          <h2>🔖 Bookmarks</h2>
          {bookmarks.map((a, i) => (
            <div key={i} className="card">
              <h3>{a.title}</h3>
              <button onClick={() => setSelectedArticle(a)}>View</button>
            </div>
          ))}
        </section>
      </main>

      {selectedArticle && (
        <div className="modal">
          <div className="modal-content">
            <h2>{selectedArticle.title}</h2>
            <p><strong>{selectedArticle.source.name}</strong></p>
            <p>{new Date(selectedArticle.publishedAt).toLocaleString()}</p>
            <p>{selectedArticle.content || selectedArticle.description}</p>
            <h3>🧠 Summary</h3>
            <p>{summary || 'Click summarize to view.'}</p>
            <button onClick={() => summarizeArticle(selectedArticle)}>Summarize</button>
            <button onClick={() => setSelectedArticle(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;