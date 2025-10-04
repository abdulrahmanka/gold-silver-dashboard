// Demo data based on actual MCX response for GOLD and SILVERMIC
const demoData = {
  gold: {
    symbol: 'GOLD',
    product_code: 'GOLD',
    expiry_date: '03OCT2025',
    unit: '10 GRMS',
    open: 116437.00,
    high: 117520.00,
    low: 115869.00,
    ltp: 117463.00,
    previous_close: 117367.00,
    absolute_change: 96.00,
    percent_change: 0.08,
    volume: 49,
    open_interest: 103,
    value_in_lacs: 5724.23,
    instrument_name: 'FUTCOM',
    timestamp: new Date().toISOString()
  },
  silver: {
    symbol: 'SILVERMIC',
    product_code: 'SILVERMIC',
    expiry_date: '28NOV2025',
    unit: '1 KGS',
    open: 144526.00,
    high: 146000.00,
    low: 142000.00,
    ltp: 145736.00,
    previous_close: 145500.00,
    absolute_change: 236.00,
    percent_change: 0.16,
    volume: 125,
    open_interest: 850,
    value_in_lacs: 18217.00,
    instrument_name: 'FUTCOM',
    timestamp: new Date().toISOString()
  }
};

// Calculate GSR (Gold per 10g vs Silver per 1kg)
// Convert Gold to same unit: Gold ₹117,463/10g × 100 = ₹11,746,300/kg vs Silver ₹145,736/kg
const goldPricePerKg = demoData.gold.ltp * 100; // Convert 10g to 1kg
const gsrRatio = goldPricePerKg / demoData.silver.ltp; // Gold ₹/kg ÷ Silver ₹/kg

const demoGSR = {
  gold_price: demoData.gold.ltp,
  silver_price: demoData.silver.ltp,
  gsr_ratio: gsrRatio,
  timestamp: new Date().toISOString()
};

module.exports = {
  getCurrentDemo: () => ({
    gold: demoData.gold,
    silver: demoData.silver,
    gsr: demoGSR,
    timestamp: new Date().toISOString()
  }),
  
  getDashboardDemo: () => ({
    current: {
      gold: demoData.gold,
      silver: demoData.silver,
      gsr: demoGSR
    },
    charts: {
      gold: [demoData.gold],
      silver: [demoData.silver],
      gsr: [demoGSR]
    },
    timestamp: new Date().toISOString()
  })
};