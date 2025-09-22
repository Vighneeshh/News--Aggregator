# 📰 News Aggregator

A modern, AI-powered news aggregation application that fetches the latest news articles and provides intelligent summaries using OpenAI's GPT technology.

## ✨ Features

- **Real-time News Fetching**: Pulls latest headlines and articles from NewsAPI
- **AI-Powered Summaries**: Generate intelligent summaries using OpenAI GPT
- **Advanced Search**: Search articles by title, description, source, or content
- **Category Filtering**: Filter news by different categories (All, News, Headlines)
- **Modern UI**: Clean, responsive design with gradient backgrounds and glassmorphism effects
- **Cross-Platform**: Works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling and responsive design
- **JavaScript ES6+** - Modern JavaScript features

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Axios** - HTTP client for API requests
- **OpenAI API** - AI-powered content summarization
- **NewsAPI** - News data source
- **CORS** - Cross-origin resource sharing

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- NewsAPI key (get from [newsapi.org](https://newsapi.org))
- OpenAI API key (get from [openai.com](https://openai.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vighneeshh/News--Aggregator.git
   cd News--Aggregator
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Create environment file**
   ```bash
   # Create .env file in backend directory
   NEWS_API_KEY=your_newsapi_key_here
   OPENAI_API_KEY=your_openai_key_here
   PORT=5001
   ```

4. **Frontend Setup**
   ```bash
   cd ../news-aggregator-frontend
   npm install
   ```

5. **Configure Frontend Environment**
   ```bash
   # Create .env file in frontend directory
   VITE_API_BASE_URL=http://localhost:5001
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   # or
   node index.js
   ```

2. **Start Frontend Development Server**
   ```bash
   cd news-aggregator-frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

## 📱 API Endpoints

### Health Check
```
GET /health
```

### News Articles
```
GET /news
Query Parameters:
- q: search query
- language: language code (default: en)
- sortBy: sort order (default: publishedAt)
- pageSize: number of articles (default: 20)
- page: page number (default: 1)
```

### Headlines
```
GET /headlines
Query Parameters:
- country: country code (default: us)
- category: news category
- pageSize: number of articles (default: 20)
```

### AI Summary
```
POST /summarize
Body: {
  "title": "Article title",
  "description": "Article description",
  "content": "Article content",
  "url": "Article URL",
  "source": "News source",
  "publishedAt": "Publication date"
}
```

## 🎨 User Interface

- **Clean Design**: Modern glassmorphism effects with gradient backgrounds
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Search Functionality**: Real-time search with clear results
- **Category Tabs**: Easy filtering between All Articles, News, and Headlines
- **AI Summary Modal**: Beautiful overlay displaying AI-generated summaries
- **Loading States**: Smooth loading animations and states

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
NEWS_API_KEY=your_newsapi_key
OPENAI_API_KEY=your_openai_key
PORT=5001
```

**Frontend (.env)**
```env
VITE_API_BASE_URL=http://localhost:5001
```

### Production Deployment

The application is configured for deployment on:
- **Frontend**: Vercel (includes vercel.json configuration)
- **Backend**: Render (includes proper Node.js setup)

## 📦 Project Structure

```
News--Aggregator/
├── backend/
│   ├── node_modules/
│   ├── .env
│   ├── index.js              # Main server file
│   ├── package.json
│   └── package-lock.json
├── news-aggregator-frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx           # Main React component
│   │   ├── config.js         # Environment configuration
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json           # Vercel deployment config
└── README.md
```

## 🌟 Key Features Explained

### AI-Powered Summarization
- Utilizes OpenAI's GPT model to generate intelligent article summaries
- Extracts key points and provides contextual analysis
- Fallback to enhanced content analysis when OpenAI is unavailable

### Advanced News Fetching
- Real-time data from NewsAPI
- Cloudflare bypass techniques for reliable data access
- Error handling with graceful fallbacks

### Modern Frontend Experience
- React-based single-page application
- Real-time search and filtering
- Responsive design with Tailwind CSS
- Smooth animations and transitions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [NewsAPI](https://newsapi.org) for providing news data
- [OpenAI](https://openai.com) for AI summarization capabilities
- [Vercel](https://vercel.com) for frontend hosting
- [Render](https://render.com) for backend hosting

## 📞 Contact

**Developer**: Vighneeshh  
**Repository**: [News--Aggregator](https://github.com/Vighneeshh/News--Aggregator)

---

⭐ **Star this repository if you found it helpful!**