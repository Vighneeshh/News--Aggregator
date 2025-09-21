// Environment configuration
const config = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://news-aggregator-pppy.onrender.com',
  NODE_ENV: import.meta.env.MODE || 'production'
}

export default config