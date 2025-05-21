import { Box, Tabs, Tab, Typography } from '@mui/material';
import { SettingsPWAIcons } from './SettingsPWAIcons';

export const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleChangeTab = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Configurações
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={handleChangeTab}>
          <Tab label="PWA" />
          {/* Adicione mais abas conforme necessário */}
        </Tabs>
      </Box>

      {activeTab === 0 && <SettingsPWAIcons />}
    </Box>
  );
};
