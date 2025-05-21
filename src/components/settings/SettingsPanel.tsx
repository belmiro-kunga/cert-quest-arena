import { Box, Tab, Tabs, Typography, Paper, Grid, TextField, Button, Switch, FormControlLabel } from '@mui/material';
import { useState } from 'react';
import { SettingsPWAIcons } from './SettingsPWAIcons';

export const SettingsPanel: React.FC = () => {
  const [value, setValue] = useState(0);
  const [manifest, setManifest] = useState({
    name: "Cert Quest Arena",
    short_name: "CertQuest",
    description: "Simulados e estudos para certificações.",
    theme_color: "#0f172a",
    background_color: "#ffffff",
    display: "standalone",
    orientation: "portrait"
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleManifestChange = (field: keyof typeof manifest, value: string) => {
    setManifest(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} centered>
          <Tab label="Geral" />
          <Tab label="Notificações" />
          <Tab label="PWA" />
        </Tabs>
      </Box>
      <Box sx={{ pt: 2 }}>
        {value === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Configurações Gerais
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome do Aplicativo"
                value={manifest.name}
                onChange={(e) => handleManifestChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome Curto"
                value={manifest.short_name}
                onChange={(e) => handleManifestChange('short_name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                multiline
                rows={4}
                value={manifest.description}
                onChange={(e) => handleManifestChange('description', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cor do Tema"
                value={manifest.theme_color}
                onChange={(e) => handleManifestChange('theme_color', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cor de Fundo"
                value={manifest.background_color}
                onChange={(e) => handleManifestChange('background_color', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={manifest.display === 'standalone'}
                    onChange={(e) => handleManifestChange('display', e.target.checked ? 'standalone' : 'browser')}
                  />
                }
                label="Modo Standalone"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={manifest.orientation === 'portrait'}
                    onChange={(e) => handleManifestChange('orientation', e.target.checked ? 'portrait' : 'landscape')}
                  />
                }
                label="Orientação Vertical"
              />
            </Grid>
          </Grid>
        )}
        {value === 1 && (
          <Typography variant="body1">
            Configurações de notificações.
          </Typography>
        )}
        {value === 2 && (
          <SettingsPWAIcons />
        )}
      </Box>
    </Paper>
  );
};
