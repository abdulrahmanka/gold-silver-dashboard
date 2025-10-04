export interface PriceData {
  id?: number;
  symbol: string;
  product_code: string;
  expiry_date: string;
  unit: string;
  open: number;
  high: number;
  low: number;
  ltp: number;
  previous_close: number;
  absolute_change: number;
  percent_change: number;
  volume: number;
  open_interest: number;
  value_in_lacs: number;
  instrument_name: string;
  timestamp: string;
}

export interface GSRData {
  id?: number;
  gold_price: number;
  silver_price: number;
  gsr_ratio: number;
  timestamp: string;
}

export interface DashboardData {
  current: {
    gold: PriceData | null;
    silver: PriceData | null;
    gsr: GSRData | null;
  };
  charts: {
    gold: PriceData[];
    silver: PriceData[];
    gsr: GSRData[];
  };
  timestamp: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface ChartDataPoint {
  time: string;
  value: number;
  label?: string;
}