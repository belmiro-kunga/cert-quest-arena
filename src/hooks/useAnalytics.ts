import { useEffect } from 'react';
import AnalyticsService from '../services/analyticsService';

export const useAnalytics = () => {
  const trackPageView = (path: string, title: string) => {
    AnalyticsService.getInstance().trackPageView(path, title);
  };

  const trackEvent = (
    category: string,
    action: string,
    label?: string,
    value?: number
  ) => {
    AnalyticsService.getInstance().trackEventAction(category, action, label, value);
  };

  const getAnalyticsData = async () => {
    return AnalyticsService.getInstance().getAnalyticsData();
  };

  const clearAnalyticsData = async () => {
    return AnalyticsService.getInstance().clearAnalyticsData();
  };

  // Inicializar analytics quando o componente é montado
  useEffect(() => {
    const analytics = AnalyticsService.getInstance();
    analytics.trackPageView(window.location.pathname, document.title);
  }, []);

  return {
    trackPageView,
    trackEvent,
    getAnalyticsData,
    clearAnalyticsData
  };
};
