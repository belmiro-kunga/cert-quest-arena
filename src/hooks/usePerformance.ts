import { useEffect, useState } from 'react';
import { PERFORMANCE_CONFIG } from '../config/performance-config';

export const usePerformance = () => {
  const [performanceMetrics, setPerformanceMetrics] = useState({
    lighthouseScore: {
      pwa: 100,
      performance: 100,
      accessibility: 100,
      seo: 100,
      bestPractices: 100
    },
    loadingTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    timeToInteractive: 0,
    cumulativeLayoutShift: 0
  });

  useEffect(() => {
    // Monitorar métricas de performance
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const metrics = entries.reduce((acc, entry) => {
          switch (entry.entryType) {
            case 'largest-contentful-paint':
              acc.largestContentfulPaint = entry.startTime;
              break;
            case 'first-contentful-paint':
              acc.firstContentfulPaint = entry.startTime;
              break;
            case 'layout-shift':
              acc.cumulativeLayoutShift += entry.value;
              break;
          }
          return acc;
        }, {
          firstContentfulPaint: 0,
          largestContentfulPaint: 0,
          cumulativeLayoutShift: 0
        });

        setPerformanceMetrics((prev) => ({
          ...prev,
          ...metrics
        }));
      });

      observer.observe({
        type: 'largest-contentful-paint',
        buffered: true
      });
      observer.observe({
        type: 'first-contentful-paint',
        buffered: true
      });
      observer.observe({
        type: 'layout-shift',
        buffered: true
      });
    }

    // Medir tempo de carregamento
    const start = performance.now();
    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const loadTime = entries[0].duration;
      setPerformanceMetrics((prev) => ({
        ...prev,
        loadingTime: loadTime
      }));
    });

    observer.observe({
      type: 'navigation',
      buffered: true
    });

    // Medir tempo até interativo
    const ttiObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const tti = entries[0].startTime;
      setPerformanceMetrics((prev) => ({
        ...prev,
        timeToInteractive: tti
      }));
    });

    ttiObserver.observe({
      type: 'longtask',
      buffered: true
    });

    return () => {
      observer.disconnect();
      ttiObserver.disconnect();
    };
  }, []);

  return {
    performanceMetrics,
    optimizeImage: (src: string, width: number, height: number) => {
      const quality = PERFORMANCE_CONFIG.imageOptimization.quality;
      const formats = PERFORMANCE_CONFIG.imageOptimization.formats;
      
      // Implementar lógica de otimização de imagens
      return `${src}?w=${width}&h=${height}&q=${quality}`;
    },
    shouldLazyLoad: (component: string) => {
      return PERFORMANCE_CONFIG.lazyLoading.components;
    },
    getCacheStrategy: (resourceType: string) => {
      if (PERFORMANCE_CONFIG.cache.static.include.includes(resourceType)) {
        return {
          maxAge: PERFORMANCE_CONFIG.cache.static.maxAge,
          strategy: 'cache-first'
        };
      }
      return {
        maxAge: PERFORMANCE_CONFIG.cache.dynamic.maxAge,
        strategy: 'network-first'
      };
    }
  };
};
