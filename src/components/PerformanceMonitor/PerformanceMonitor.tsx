import React from 'react';
import { usePerformance } from '../../hooks/usePerformance';
import { Box, Typography, CircularProgress, Stack } from '@mui/material';

const PerformanceMonitor: React.FC = () => {
  const { performanceMetrics } = usePerformance();

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Métricas de Performance
      </Typography>
      <Stack spacing={2}>
        {Object.entries(performanceMetrics.lighthouseScore).map(([metric, score]) => (
          <Stack direction="row" alignItems="center" spacing={2} key={metric}>
            <CircularProgress
              variant="determinate"
              value={score}
              color={getScoreColor(score)}
              size={30}
            />
            <Typography>
              {metric}: {score}%
            </Typography>
          </Stack>
        ))}
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography>Tempo de Carregamento:</Typography>
          <Typography>
            {performanceMetrics.loadingTime.toFixed(2)}ms
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography>First Contentful Paint:</Typography>
          <Typography>
            {performanceMetrics.firstContentfulPaint.toFixed(2)}ms
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography>Largest Contentful Paint:</Typography>
          <Typography>
            {performanceMetrics.largestContentfulPaint.toFixed(2)}ms
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography>Time to Interactive:</Typography>
          <Typography>
            {performanceMetrics.timeToInteractive.toFixed(2)}ms
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography>Cumulative Layout Shift:</Typography>
          <Typography>
            {performanceMetrics.cumulativeLayoutShift.toFixed(3)}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
};

export default PerformanceMonitor;
