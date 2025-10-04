const express = require('express');
const db = require('../database/db');
const { getCurrentDemo, getDashboardDemo } = require('./demoData');
const router = express.Router();

// Get current prices and GSR
router.get('/current', async (req, res) => {
    try {
        const prices = await db.getLatestPrices();
        const gsr = await db.getLatestGSR();

        const goldPrice = prices.find(p => p.symbol === 'GOLD');
        const silverPrice = prices.find(p => p.symbol === 'SILVERMIC' || p.symbol === 'SILVER');

        // If no real data, use demo data
        if (!goldPrice || !silverPrice || !gsr) {
            console.log('📊 Using demo data - real MCX data not available');
            const demoData = getCurrentDemo();
            return res.json({
                success: true,
                data: demoData
            });
        }

        res.json({
            success: true,
            data: {
                gold: goldPrice,
                silver: silverPrice,
                gsr: gsr,
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error fetching current prices:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch current prices'
        });
    }
});

// Get price history for charts
router.get('/history/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const { hours = 24 } = req.query;

        if (!['GOLD', 'SILVER'].includes(symbol.toUpperCase())) {
            return res.status(400).json({
                success: false,
                error: 'Invalid symbol. Use GOLD or SILVER'
            });
        }

        const history = await db.getPriceHistory(symbol.toUpperCase(), parseInt(hours));

        res.json({
            success: true,
            data: {
                symbol: symbol.toUpperCase(),
                history,
                count: history.length
            }
        });
    } catch (error) {
        console.error('Error fetching price history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch price history'
        });
    }
});

// Get GSR history for charts
router.get('/gsr/history', async (req, res) => {
    try {
        const { hours = 24 } = req.query;
        const history = await db.getGSRHistory(parseInt(hours));

        res.json({
            success: true,
            data: {
                history,
                count: history.length
            }
        });
    } catch (error) {
        console.error('Error fetching GSR history:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch GSR history'
        });
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString()
    });
});

// Get dashboard data (combined endpoint)
router.get('/dashboard', async (req, res) => {
    try {
        const [prices, gsr, goldHistory, silverHistory, gsrHistory] = await Promise.all([
            db.getLatestPrices(),
            db.getLatestGSR(),
            db.getPriceHistory('GOLD', 6), // Last 6 hours for mini chart
            db.getPriceHistory('SILVER', 6),
            db.getGSRHistory(6)
        ]);

        const goldPrice = prices.find(p => p.symbol === 'GOLD');
        const silverPrice = prices.find(p => p.symbol === 'SILVERMIC' || p.symbol === 'SILVER');

        // If no real data, use demo data
        if (!goldPrice || !silverPrice || !gsr) {
            console.log('📊 Using demo dashboard data - real MCX data not available');
            const demoData = getDashboardDemo();
            return res.json({
                success: true,
                data: demoData
            });
        }

        res.json({
            success: true,
            data: {
                current: {
                    gold: goldPrice,
                    silver: silverPrice,
                    gsr: gsr
                },
                charts: {
                    gold: goldHistory,
                    silver: silverHistory,
                    gsr: gsrHistory
                },
                timestamp: new Date().toISOString()
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch dashboard data'
        });
    }
});

module.exports = router;