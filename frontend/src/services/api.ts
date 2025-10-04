import axios from 'axios';
import { ApiResponse, DashboardData, PriceData, GSRData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Get dashboard data (combined endpoint)
  async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await api.get<ApiResponse<DashboardData>>('/dashboard');
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch dashboard data');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  },

  // Get current prices
  async getCurrentPrices(): Promise<{
    gold: PriceData | null;
    silver: PriceData | null;
    gsr: GSRData | null;
    timestamp: string;
  }> {
    try {
      const response = await api.get<ApiResponse<any>>('/current');
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch current prices');
      }
      return response.data.data;
    } catch (error) {
      console.error('Error fetching current prices:', error);
      throw error;
    }
  },

  // Get price history for a specific symbol
  async getPriceHistory(symbol: 'GOLD' | 'SILVER', hours: number = 24): Promise<PriceData[]> {
    try {
      const response = await api.get<ApiResponse<{ symbol: string; history: PriceData[]; count: number }>>(`/history/${symbol}?hours=${hours}`);
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch price history');
      }
      return response.data.data.history;
    } catch (error) {
      console.error(`Error fetching ${symbol} price history:`, error);
      throw error;
    }
  },

  // Get GSR history
  async getGSRHistory(hours: number = 24): Promise<GSRData[]> {
    try {
      const response = await api.get<ApiResponse<{ history: GSRData[]; count: number }>>(`/gsr/history?hours=${hours}`);
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to fetch GSR history');
      }
      return response.data.data.history;
    } catch (error) {
      console.error('Error fetching GSR history:', error);
      throw error;
    }
  },

  // Trigger manual scrape (for testing)
  async triggerScrape(): Promise<void> {
    try {
      const response = await api.post<ApiResponse<any>>('/scheduler/trigger');
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to trigger scrape');
      }
    } catch (error) {
      console.error('Error triggering scrape:', error);
      throw error;
    }
  },

  // Get API health status
  async getHealth(): Promise<boolean> {
    try {
      const response = await api.get<ApiResponse<any>>('/health');
      return response.data.success;
    } catch (error) {
      console.error('Error checking API health:', error);
      return false;
    }
  }
};

export default apiService;