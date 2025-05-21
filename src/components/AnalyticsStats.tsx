import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';
import { Box, Card, CardContent, Typography, Button, CircularProgress } from '@mui/material';
import { format } from 'date-fns';

const AnalyticsStats: React.FC = () => {
  const [stats, setStats] = useState<{
    pageViews: number;
    events: number;
    last24h: number;
    last7d: number;
  }>({
    pageViews: 0,
    events: 0,
    last24h: 0,
    last7d: 0
  });
  const [loading, setLoading] = useState(true);
  const { getAnalyticsData } = useAnalytics();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const events = await getAnalyticsData();
        const now = new Date();
        const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const stats = events.reduce(
          (acc, event) => {
            const timestamp = new Date(event.timestamp);
            
            if (event.type === 'page_view') {
              acc.pageViews++;
            } else if (event.type === 'event') {
              acc.events++;
            }

            if (timestamp >= last24h) {
              acc.last24h++;
            }
            if (timestamp >= last7d) {
              acc.last7d++;
            }

            return acc;
          },
          {
            pageViews: 0,
            events: 0,
            last24h: 0,
            last7d: 0
          }
        );

        setStats(stats);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [getAnalyticsData]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
      <Card sx={{ flex: 1, minWidth: '200px' }}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Visualizações de Página
          </Typography>
          <Typography variant="h5" component="div">
            {stats.pageViews}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ flex: 1, minWidth: '200px' }}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Eventos
          </Typography>
          <Typography variant="h5" component="div">
            {stats.events}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ flex: 1, minWidth: '200px' }}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Últimas 24h
          </Typography>
          <Typography variant="h5" component="div">
            {stats.last24h}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ flex: 1, minWidth: '200px' }}>
        <CardContent>
          <Typography color="textSecondary" gutterBottom>
            Últimos 7 dias
          </Typography>
          <Typography variant="h5" component="div">
            {stats.last7d}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AnalyticsStats;
