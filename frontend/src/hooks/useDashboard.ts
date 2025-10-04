import { useState, useEffect, useCallback } from 'react';
import { DashboardData } from '../types';
import { apiService } from '../services/api';

export const useDashboard = (refreshInterval: number = 60000) => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const dashboardData = await apiService.getDashboardData();
      setData(dashboardData);
      setLastUpdated(new Date());
      setIsOnline(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      setIsOnline(false);
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    await fetchData();
  }, [fetchData]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh interval
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(() => {
        fetchData();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [fetchData, refreshInterval]);

  // Check online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (!data) {
        fetchData();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [data, fetchData]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    isOnline,
    refresh
  };
};