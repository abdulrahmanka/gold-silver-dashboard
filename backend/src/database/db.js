const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
    constructor() {
        this.db = null;
        this.init();
    }

    init() {
        const dbDir = path.dirname(process.env.DB_PATH || './data/prices.db');
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        this.db = new sqlite3.Database(process.env.DB_PATH || './data/prices.db', (err) => {
            if (err) {
                console.error('Error opening database:', err);
            } else {
                console.log('✅ Connected to SQLite database');
                this.createTables();
            }
        });
    }

    createTables() {
        const createPricesTable = `
            CREATE TABLE IF NOT EXISTS prices (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                symbol TEXT NOT NULL,
                product_code TEXT NOT NULL,
                expiry_date TEXT,
                unit TEXT,
                open REAL,
                high REAL,
                low REAL,
                ltp REAL NOT NULL,
                previous_close REAL,
                absolute_change REAL,
                percent_change REAL,
                volume INTEGER,
                open_interest INTEGER,
                value_in_lacs REAL,
                instrument_name TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        const createGsrTable = `
            CREATE TABLE IF NOT EXISTS gsr_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                gold_price REAL NOT NULL,
                silver_price REAL NOT NULL,
                gsr_ratio REAL NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `;

        this.db.serialize(() => {
            this.db.run(createPricesTable);
            this.db.run(createGsrTable);
            console.log('✅ Database tables created/verified');
        });
    }

    insertPrice(priceData) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO prices (
                    symbol, product_code, expiry_date, unit, open, high, low, ltp,
                    previous_close, absolute_change, percent_change, volume,
                    open_interest, value_in_lacs, instrument_name
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                priceData.Symbol,
                priceData.ProductCode,
                priceData.ExpiryDate,
                priceData.Unit,
                priceData.Open,
                priceData.High,
                priceData.Low,
                priceData.LTP,
                priceData.PreviousClose,
                priceData.AbsoluteChange,
                priceData.PercentChange,
                priceData.Volume,
                priceData.OpenInterest,
                priceData.ValueInLacs,
                priceData.InstrumentName
            ];

            this.db.run(sql, values, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID });
                }
            });
        });
    }

    insertGSR(goldPrice, silverPrice, gsrRatio) {
        return new Promise((resolve, reject) => {
            const sql = `
                INSERT INTO gsr_history (gold_price, silver_price, gsr_ratio)
                VALUES (?, ?, ?)
            `;

            this.db.run(sql, [goldPrice, silverPrice, gsrRatio], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ id: this.lastID });
                }
            });
        });
    }

    getLatestPrices() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT * FROM prices 
                WHERE (symbol = 'GOLD' OR symbol = 'SILVER')
                AND instrument_name = 'FUTCOM'
                AND timestamp >= datetime('now', '-2 minutes')
                ORDER BY timestamp DESC
            `;

            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    getLatestGSR() {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT * FROM gsr_history 
                ORDER BY timestamp DESC 
                LIMIT 1
            `;

            this.db.get(sql, [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    getPriceHistory(symbol, hours = 24) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT * FROM prices 
                WHERE symbol = ? 
                AND instrument_name = 'FUTCOM'
                AND timestamp >= datetime('now', '-${hours} hours')
                ORDER BY timestamp ASC
            `;

            this.db.all(sql, [symbol], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    getGSRHistory(hours = 24) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT * FROM gsr_history 
                WHERE timestamp >= datetime('now', '-${hours} hours')
                ORDER BY timestamp ASC
            `;

            this.db.all(sql, [], (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

module.exports = new Database();