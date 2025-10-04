# Deployment Guide

This guide covers deploying the Gold & Silver Dashboard to production.

## Architecture

- **Frontend**: React app deployed on Netlify
- **Backend**: Node.js API deployed on Heroku/Railway/Render

## Option 1: Netlify (Frontend) + Heroku (Backend)

### Backend Deployment (Heroku)

1. **Install Heroku CLI**
   ```bash
   # Install Heroku CLI from https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   heroku create your-gold-silver-api
   heroku addons:create heroku-postgresql:mini  # If you want PostgreSQL instead of SQLite
   git subtree push --prefix backend heroku main
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set PORT=3001
   ```

### Frontend Deployment (Netlify)

1. **Connect to GitHub**
   - Go to [Netlify](https://app.netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `frontend/build`
   - Base directory: `frontend`

3. **Environment Variables**
   - Add `REACT_APP_API_BASE_URL` with your Heroku backend URL

4. **Update netlify.toml**
   ```toml
   [[redirects]]
     from = "/api/*"
     to = "https://your-gold-silver-api.herokuapp.com/api/:splat"
     status = 200
   ```

## Option 2: Vercel (Frontend) + Railway (Backend)

### Backend Deployment (Railway)

1. **Deploy to Railway**
   ```bash
   # Go to https://railway.app
   # Connect GitHub repository
   # Deploy the backend folder
   ```

2. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   ```

### Frontend Deployment (Vercel)

1. **Deploy to Vercel**
   ```bash
   npm i -g vercel
   cd frontend
   vercel
   ```

2. **Update API endpoint**
   - Set `REACT_APP_API_BASE_URL` to your Railway backend URL

## Option 3: All-in-One (Render)

1. **Deploy Full-Stack on Render**
   - Frontend: Static site from `frontend/build`
   - Backend: Web service from `backend/`

## Environment Variables

### Frontend (.env)
```
REACT_APP_API_BASE_URL=https://your-backend-url.com
DANGEROUSLY_DISABLE_HOST_CHECK=true
```

### Backend (.env)
```
NODE_ENV=production
PORT=3001
DATABASE_URL=your-database-url  # If using external database
```

## Database Considerations

### SQLite (Current)
- Works for development and small-scale production
- Files are stored locally on the server

### PostgreSQL (Recommended for Production)
- More robust for production use
- Available on Heroku, Railway, Render
- Update `backend/src/database/db.js` to use PostgreSQL

### Migration to PostgreSQL
```javascript
// Update backend/src/database/db.js
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
});
```

## Performance Optimizations

1. **Enable Gzip Compression**
2. **Set up CDN for static assets**
3. **Configure caching headers**
4. **Monitor with error tracking (Sentry)**

## Post-Deployment

1. **Test all endpoints**
2. **Verify MCX scraping works**
3. **Check GSR calculations**
4. **Monitor performance**
5. **Set up monitoring alerts**

## Troubleshooting

### Common Issues

1. **CORS errors**: Configure CORS in backend for your frontend domain
2. **Environment variables**: Ensure all required vars are set
3. **Build failures**: Check Node.js version compatibility
4. **API timeouts**: Increase timeout limits for scraping operations

### Logs

- **Netlify**: Check function logs and build logs
- **Heroku**: `heroku logs --tail`
- **Railway**: Check deployment logs in dashboard
- **Vercel**: Check function logs in dashboard

## Scaling

- **Horizontal**: Deploy multiple backend instances
- **Vertical**: Increase server resources
- **Caching**: Implement Redis for price data caching
- **CDN**: Use CloudFlare for global distribution