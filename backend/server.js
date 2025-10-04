require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./src/api/routes');
const DataScheduler = require('./src/scheduler/dataScheduler');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize scheduler
const scheduler = new DataScheduler();

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? [
            'https://gold-silver-dashboard.netlify.app',
            'https://gold-silver-dashboard.vercel.app',
            /\.netlify\.app$/,
            /\.vercel\.app$/
          ] 
        : [
            'http://localhost:3000', 
            'http://127.0.0.1:3000',
            /\.ngrok-free\.app$/,
            /\.ngrok\.io$/
          ]
}));
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api', apiRoutes);

// Add scheduler status endpoint
app.get('/api/scheduler/status', (req, res) => {
    res.json({
        success: true,
        data: scheduler.getStatus()
    });
});

// Add manual trigger endpoint for testing
app.post('/api/scheduler/trigger', async (req, res) => {
    try {
        await scheduler.triggerScrape();
        res.json({
            success: true,
            message: 'Manual scrape triggered successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to trigger manual scrape'
        });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Gold & Silver Price Dashboard API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
            current: '/api/current',
            dashboard: '/api/dashboard',
            history: '/api/history/:symbol',
            gsr: '/api/gsr/history',
            health: '/api/health',
            scheduler: '/api/scheduler/status'
        }
    });
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Endpoint not found'
    });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Received SIGINT. Gracefully shutting down...');
    
    try {
        await scheduler.cleanup();
        console.log('✅ Cleanup completed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during cleanup:', error);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Received SIGTERM. Gracefully shutting down...');
    
    try {
        await scheduler.cleanup();
        console.log('✅ Cleanup completed');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during cleanup:', error);
        process.exit(1);
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`\n🚀 Gold & Silver Dashboard API`);
    console.log(`📍 Server running on port ${PORT}`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Base URL: http://localhost:${PORT}`);
    console.log(`📊 Dashboard API: http://localhost:${PORT}/api/dashboard`);
    
    // Start the data scheduler
    setTimeout(() => {
        scheduler.start();
    }, 2000); // Give server time to fully start
});

module.exports = app;