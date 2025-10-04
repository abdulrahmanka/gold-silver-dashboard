const { chromium } = require('playwright');
const db = require('../database/db');

class MCXScraper {
    constructor() {
        this.browser = null;
        this.context = null;
        this.page = null;
    }

    async init() {
        try {
            this.browser = await chromium.launch({
                headless: true,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            this.context = await this.browser.newContext({
                userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            });
            
            this.page = await this.context.newPage();
            console.log('✅ Browser initialized for scraping');
        } catch (error) {
            console.error('❌ Failed to initialize browser:', error);
            throw error;
        }
    }

    async scrapeData() {
        try {
            if (!this.page) {
                await this.init();
            }

            console.log('🔍 Starting MCX data scraping...');
            
            // Navigate to MCX website first to get cookies
            await this.page.goto('https://www.mcxindia.com/', { 
                waitUntil: 'networkidle',
                timeout: 30000 
            });

            // Wait a bit for any initial setup
            await this.page.waitForTimeout(2000);

            // Now make the API call
            const response = await this.page.evaluate(async () => {
                try {
                    const response = await fetch('https://www.mcxindia.com/backpage.aspx/GetMarketWatch', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'Accept': 'application/json, text/javascript, */*; q=0.01',
                            'X-Requested-With': 'XMLHttpRequest'
                        },
                        body: JSON.stringify({})
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }

                    const data = await response.json();
                    return data;
                } catch (error) {
                    console.error('Fetch error:', error);
                    throw error;
                }
            });

            console.log('✅ Data fetched successfully');
            return await this.processData(response);

        } catch (error) {
            console.error('❌ Scraping failed:', error);
            throw error;
        }
    }

    async processData(response) {
        try {
            const marketData = response.d;
            
            if (!marketData || !marketData.Data) {
                throw new Error('Invalid data structure received');
            }

            const goldData = [];
            const silverData = [];

            // Filter GOLD and SILVERMIC FUTCOM instruments
            marketData.Data.forEach(item => {
                if (item.InstrumentName === 'FUTCOM') {
                    if (item.Symbol === 'GOLD') {
                        goldData.push(item);
                    } else if (item.Symbol === 'SILVERMIC') {
                        silverData.push(item);
                    }
                }
            });

            console.log(`📊 Found ${goldData.length} GOLD and ${silverData.length} SILVERMIC instruments`);

            // Get the nearest expiry contracts
            const activeGold = this.getNearestExpiryContract(goldData);
            const activeSilver = this.getNearestExpiryContract(silverData);

            if (!activeGold || !activeSilver) {
                throw new Error('Could not find active GOLD or SILVER contracts');
            }

            // Store in database
            await db.insertPrice(activeGold);
            await db.insertPrice(activeSilver);

            // Calculate and store GSR (convert Gold from 10g to 1kg for proper comparison)
            const goldPricePerKg = activeGold.LTP * 100; // Convert Gold from 10g to 1kg
            const gsrRatio = goldPricePerKg / activeSilver.LTP; // Gold ₹/kg ÷ Silver ₹/kg
            await db.insertGSR(activeGold.LTP, activeSilver.LTP, gsrRatio);

            console.log(`💰 GOLD: ₹${activeGold.LTP}/10g | SILVER: ₹${activeSilver.LTP}/${activeSilver.Unit} | GSR: ${gsrRatio.toFixed(2)}`);

            return {
                gold: activeGold,
                silver: activeSilver,
                gsr: gsrRatio,
                timestamp: new Date().toISOString()
            };

        } catch (error) {
            console.error('❌ Data processing failed:', error);
            throw error;
        }
    }

    getNearestExpiryContract(contracts) {
        if (!contracts || contracts.length === 0) return null;

        // Parse date from MCX format (e.g., "03OCT2025") and find nearest expiry
        const parseExpiryDate = (dateStr) => {
            try {
                const months = {
                    'JAN': 0, 'FEB': 1, 'MAR': 2, 'APR': 3, 'MAY': 4, 'JUN': 5,
                    'JUL': 6, 'AUG': 7, 'SEP': 8, 'OCT': 9, 'NOV': 10, 'DEC': 11
                };
                
                const day = parseInt(dateStr.substring(0, 2));
                const month = months[dateStr.substring(2, 5)];
                const year = parseInt(dateStr.substring(5));
                
                return new Date(year, month, day);
            } catch (e) {
                return new Date(2099, 11, 31); // Far future date for invalid dates
            }
        };

        // Filter out contracts with zero LTP (not actively traded)
        const activeContracts = contracts.filter(contract => contract.LTP > 0);
        
        if (activeContracts.length === 0) {
            // If no active contracts, return the one with highest volume/open interest
            return this.getMostActiveContract(contracts);
        }

        // Find nearest expiry among active contracts
        return activeContracts.reduce((nearest, current) => {
            const nearestDate = parseExpiryDate(nearest.ExpiryDate);
            const currentDate = parseExpiryDate(current.ExpiryDate);
            return currentDate < nearestDate ? current : nearest;
        });
    }

    getMostActiveContract(contracts) {
        if (!contracts || contracts.length === 0) return null;

        // Sort by volume and open interest (most active)
        return contracts.reduce((prev, current) => {
            const prevScore = (prev.Volume || 0) + (prev.OpenInterest || 0);
            const currentScore = (current.Volume || 0) + (current.OpenInterest || 0);
            return currentScore > prevScore ? current : prev;
        });
    }

    async close() {
        try {
            if (this.page) await this.page.close();
            if (this.context) await this.context.close();
            if (this.browser) await this.browser.close();
            console.log('✅ Browser closed');
        } catch (error) {
            console.error('❌ Error closing browser:', error);
        }
    }

    async cleanup() {
        await this.close();
    }
}

module.exports = MCXScraper;