const cron = require('node-cron');
const MCXScraper = require('../scraper/mcxScraper');

class DataScheduler {
    constructor() {
        this.scraper = new MCXScraper();
        this.isRunning = false;
        this.task = null;
        this.lastSuccessfulScrape = null;
        this.consecutiveFailures = 0;
        this.maxRetries = 3;
    }

    start() {
        if (this.isRunning) {
            console.log('⚠️ Scheduler is already running');
            return;
        }

        const interval = process.env.SCRAPE_INTERVAL_MINUTES || 1;
        console.log(`🕐 Starting data scheduler - scraping every ${interval} minute(s)`);

        // Run immediately on start
        this.scrapeData();

        // Then run every minute
        this.task = cron.schedule(`*/${interval} * * * *`, () => {
            this.scrapeData();
        }, {
            scheduled: true,
            timezone: "Asia/Kolkata" // MCX timezone
        });

        this.isRunning = true;
        console.log('✅ Data scheduler started successfully');
    }

    async scrapeData() {
        try {
            console.log(`\n🔄 [${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}] Starting scheduled scrape...`);
            
            const result = await this.scraper.scrapeData();
            
            this.lastSuccessfulScrape = new Date();
            this.consecutiveFailures = 0;
            
            console.log('✅ Scheduled scrape completed successfully');
            console.log(`📈 Latest data: GOLD ₹${result.gold.LTP} | SILVER ₹${result.silver.LTP} | GSR ${result.gsr.toFixed(2)}`);
            
        } catch (error) {
            this.consecutiveFailures++;
            console.error(`❌ Scheduled scrape failed (attempt ${this.consecutiveFailures}):`, error.message);
            
            if (this.consecutiveFailures >= this.maxRetries) {
                console.error('🚨 Maximum consecutive failures reached. Reinitializing scraper...');
                await this.reinitializeScraper();
            }
        }
    }

    async reinitializeScraper() {
        try {
            await this.scraper.close();
            this.scraper = new MCXScraper();
            await this.scraper.init();
            this.consecutiveFailures = 0;
            console.log('✅ Scraper reinitialized successfully');
        } catch (error) {
            console.error('❌ Failed to reinitialize scraper:', error);
        }
    }

    stop() {
        if (!this.isRunning) {
            console.log('⚠️ Scheduler is not running');
            return;
        }

        if (this.task) {
            this.task.stop();
            this.task = null;
        }

        this.isRunning = false;
        console.log('🛑 Data scheduler stopped');
    }

    async cleanup() {
        this.stop();
        await this.scraper.cleanup();
        console.log('🧹 Scheduler cleanup completed');
    }

    getStatus() {
        return {
            isRunning: this.isRunning,
            lastSuccessfulScrape: this.lastSuccessfulScrape,
            consecutiveFailures: this.consecutiveFailures,
            maxRetries: this.maxRetries
        };
    }

    // Manual trigger for testing
    async triggerScrape() {
        console.log('🔄 Manual scrape triggered...');
        await this.scrapeData();
    }
}

module.exports = DataScheduler;