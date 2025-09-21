# News Aggregator Deployment Guide

## 🚀 Deployment Overview

This News Aggregator consists of two parts:
- **Frontend** (React + Vite) → Deploy to **Vercel**
- **Backend** (Node.js + Express) → Deploy to **Render**

## 📋 Prerequisites

1. GitHub account with this repository
2. Vercel account (free)
3. Render account (free)
4. News API key from [newsapi.org](https://newsapi.org/)
5. OpenAI API key (optional, for AI summaries)

## 🔧 Backend Deployment (Render)

### Step 1: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Select the repository and configure:
   - **Name**: `news-aggregator-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 2: Set Environment Variables

In Render dashboard, go to Environment tab and add:

```
NEWS_API_KEY=your_news_api_key_here
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=production
```

### Step 3: Update CORS Configuration

1. Note your Render backend URL (e.g., `https://news-aggregator-pppy.onrender.com`)
2. Later, update the CORS configuration in `backend/index.js` with your Vercel frontend URL

## 🌐 Frontend Deployment (Vercel)

### Step 1: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `news-aggregator-frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 2: Set Environment Variables

In Vercel dashboard, go to Settings → Environment Variables and add:

```
VITE_API_BASE_URL=https://your-render-backend-url.onrender.com
```

### Step 3: Update Backend CORS

1. Note your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
2. In `backend/index.js`, update the CORS configuration:

```javascript
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://your-app.vercel.app',  // Replace with your actual Vercel URL
    /^https:\/\/.*\.vercel\.app$/
  ],
  credentials: true,
  optionsSuccessStatus: 200
};
```

3. Redeploy your backend on Render

## 🔄 Development Workflow

### Local Development

1. **Backend** (Terminal 1):
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend** (Terminal 2):
   ```bash
   cd news-aggregator-frontend
   npm install
   npm run dev
   ```

### Environment Configuration

For local development, update the `.env` files:

**Frontend `.env`:**
```
VITE_API_BASE_URL=http://localhost:5001
```

**Backend `.env`:**
```
NEWS_API_KEY=your_news_api_key
OPENAI_API_KEY=your_openai_api_key
PORT=5001
```

## 🛠️ Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure backend CORS is configured with your Vercel URL
2. **API Key Issues**: Verify environment variables are set correctly in both platforms
3. **Build Failures**: Check that all dependencies are listed in `package.json`
4. **Route Issues**: Ensure `vercel.json` has proper SPA routing configuration

### Checking Deployment Status

- **Render**: Check logs in Render dashboard
- **Vercel**: Check deployment logs in Vercel dashboard
- **API Health**: Visit `https://your-backend.onrender.com/health`

## 📁 Project Structure

```
News--Aggregator/
├── backend/                 # Node.js + Express API
│   ├── index.js            # Main server file
│   ├── package.json        # Backend dependencies
│   └── .env                # Backend environment variables
├── news-aggregator-frontend/  # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   └── config.js       # Environment configuration
│   ├── vercel.json         # Vercel deployment config
│   ├── package.json        # Frontend dependencies
│   └── .env                # Frontend environment variables
└── README.md               # This file
```

## 🚀 Quick Deploy Commands

After setting up both platforms:

```bash
# Push changes to trigger auto-deployment
git add .
git commit -m "Update deployment configuration"
git push origin main
```

Both Vercel and Render will automatically redeploy when you push to the main branch.

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Render Documentation](https://render.com/docs)
- [News API Documentation](https://newsapi.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)