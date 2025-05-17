import React, { useState, useEffect } from 'react';
import { usePolicies } from '@/hooks/usePolicies';
import { Card, CardContent, CardHeader, Tabs, Tab, Box, Typography, TextField, Button, Switch, FormControlLabel, Divider, Alert, Snackbar } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PreviewIcon from '@mui/icons-material/Preview';
import { PolicySettings, CookiePolicySettings } from '@/services/settingsService';
import ReactMarkdown from 'react-markdown';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`policy-tabpanel-${index}`}
      aria-labelledby={`policy-tab-${index}`}
      {...other}
      style={{ padding: '20px 0' }}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `policy-tab-${index}`,
    'aria-controls': `policy-tabpanel-${index}`,
  };
}

const LegalPoliciesEditor: React.FC = () => {
  const { 
    privacyPolicy, 
    termsOfUse, 
    cookiePolicy, 
    loading, 
    error,
    updatePrivacyPolicy,
    updateTermsOfUse,
    updateCookiePolicy
  } = usePolicies();

  const [tabValue, setTabValue] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Estados para cada política
  const [privacyPolicyState, setPrivacyPolicyState] = useState<PolicySettings>({} as PolicySettings);
  const [termsOfUseState, setTermsOfUseState] = useState<PolicySettings>({} as PolicySettings);
  const [cookiePolicyState, setCookiePolicyState] = useState<CookiePolicySettings>({} as CookiePolicySettings);

  // Atualizar estados quando os dados forem carregados
  useEffect(() => {
    if (!loading) {
      setPrivacyPolicyState(privacyPolicy);
      setTermsOfUseState(termsOfUse);
      setCookiePolicyState(cookiePolicy);
    }
  }, [loading, privacyPolicy, termsOfUse, cookiePolicy]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleTogglePreview = () => {
    setPreviewMode(!previewMode);
  };

  const handlePrivacyPolicyChange = (field: keyof PolicySettings, value: any) => {
    setPrivacyPolicyState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTermsOfUseChange = (field: keyof PolicySettings, value: any) => {
    setTermsOfUseState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCookiePolicyChange = (field: keyof CookiePolicySettings, value: any) => {
    setCookiePolicyState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrivacyPolicyCustomizationChange = (field: keyof PolicySettings['customization'], value: string) => {
    setPrivacyPolicyState(prev => ({
      ...prev,
      customization: {
        ...prev.customization,
        [field]: value
      }
    }));
  };

  const handleTermsOfUseCustomizationChange = (field: keyof PolicySettings['customization'], value: string) => {
    setTermsOfUseState(prev => ({
      ...prev,
      customization: {
        ...prev.customization,
        [field]: value
      }
    }));
  };

  const handleSavePrivacyPolicy = async () => {
    try {
      await updatePrivacyPolicy(privacyPolicyState);
      setSnackbarMessage('Política de Privacidade atualizada com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Erro ao atualizar a Política de Privacidade.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSaveTermsOfUse = async () => {
    try {
      await updateTermsOfUse(termsOfUseState);
      setSnackbarMessage('Termos de Uso atualizados com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Erro ao atualizar os Termos de Uso.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSaveCookiePolicy = async () => {
    try {
      await updateCookiePolicy(cookiePolicyState);
      setSnackbarMessage('Política de Cookies atualizada com sucesso!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Erro ao atualizar a Política de Cookies.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return <Typography>Carregando políticas...</Typography>;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Card>
      <CardHeader 
        title="Gerenciamento de Políticas Legais" 
        subheader="Edite os termos de uso, política de privacidade e política de cookies"
      />
      <CardContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="policy tabs">
            <Tab label="Política de Privacidade" {...a11yProps(0)} />
            <Tab label="Termos de Uso" {...a11yProps(1)} />
            <Tab label="Política de Cookies" {...a11yProps(2)} />
          </Tabs>
        </Box>

        {/* Política de Privacidade */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Política de Privacidade</Typography>
            <Box>
              <Button 
                variant="outlined" 
                startIcon={<PreviewIcon />} 
                onClick={handleTogglePreview}
                sx={{ mr: 1 }}
              >
                {previewMode ? 'Editar' : 'Visualizar'}
              </Button>
              <Button 
                variant="contained" 
                startIcon={<SaveIcon />} 
                onClick={handleSavePrivacyPolicy}
              >
                Salvar
              </Button>
            </Box>
          </Box>

          {previewMode ? (
            <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1, bgcolor: '#f9f9f9' }}>
              <ReactMarkdown>{privacyPolicyState.content || ''}</ReactMarkdown>
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={privacyPolicyState.enabled || false} 
                      onChange={(e) => handlePrivacyPolicyChange('enabled', e.target.checked)}
                    />
                  }
                  label="Ativar Política de Privacidade"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Versão"
                  value={privacyPolicyState.version || ''}
                  onChange={(e) => handlePrivacyPolicyChange('version', e.target.value)}
                  fullWidth
                  margin="normal"
                />
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={privacyPolicyState.requiresAcceptance || false} 
                      onChange={(e) => handlePrivacyPolicyChange('requiresAcceptance', e.target.checked)}
                    />
                  }
                  label="Requer aceitação do usuário"
                />
              </Box>

              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>Conteúdo da Política de Privacidade</Typography>
              <Typography variant="caption" display="block" gutterBottom>
                Use formatação Markdown para estilizar o texto. Suporta cabeçalhos, listas, links, etc.
              </Typography>
              
              <TextField
                label="Conteúdo"
                value={privacyPolicyState.content || ''}
                onChange={(e) => handlePrivacyPolicyChange('content', e.target.value)}
                fullWidth
                multiline
                rows={15}
                margin="normal"
              />

              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>Personalização</Typography>
              
              <TextField
                label="Texto do Cabeçalho"
                value={privacyPolicyState.customization?.headerText || ''}
                onChange={(e) => handlePrivacyPolicyCustomizationChange('headerText', e.target.value)}
                fullWidth
                margin="normal"
              />
              
              <TextField
                label="Texto do Botão de Aceitação"
                value={privacyPolicyState.customization?.acceptButtonText || ''}
                onChange={(e) => handlePrivacyPolicyCustomizationChange('acceptButtonText', e.target.value)}
                fullWidth
                margin="normal"
              />
              
              <TextField
                label="Texto do Botão de Rejeição"
                value={privacyPolicyState.customization?.rejectButtonText || ''}
                onChange={(e) => handlePrivacyPolicyCustomizationChange('rejectButtonText', e.target.value)}
                fullWidth
                margin="normal"
              />
              
              <TextField
                label="Mensagem do Popup"
                value={privacyPolicyState.customization?.popupMessage || ''}
                onChange={(e) => handlePrivacyPolicyCustomizationChange('popupMessage', e.target.value)}
                fullWidth
                multiline
                rows={3}
                margin="normal"
              />
            </>
          )}
        </TabPanel>

        {/* Termos de Uso */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Termos de Uso</Typography>
            <Box>
              <Button 
                variant="outlined" 
                startIcon={<PreviewIcon />} 
                onClick={handleTogglePreview}
                sx={{ mr: 1 }}
              >
                {previewMode ? 'Editar' : 'Visualizar'}
              </Button>
              <Button 
                variant="contained" 
                startIcon={<SaveIcon />} 
                onClick={handleSaveTermsOfUse}
              >
                Salvar
              </Button>
            </Box>
          </Box>

          {previewMode ? (
            <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1, bgcolor: '#f9f9f9' }}>
              <ReactMarkdown>{termsOfUseState.content || ''}</ReactMarkdown>
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={termsOfUseState.enabled || false} 
                      onChange={(e) => handleTermsOfUseChange('enabled', e.target.checked)}
                    />
                  }
                  label="Ativar Termos de Uso"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Versão"
                  value={termsOfUseState.version || ''}
                  onChange={(e) => handleTermsOfUseChange('version', e.target.value)}
                  fullWidth
                  margin="normal"
                />
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={termsOfUseState.requiresAcceptance || false} 
                      onChange={(e) => handleTermsOfUseChange('requiresAcceptance', e.target.checked)}
                    />
                  }
                  label="Requer aceitação do usuário"
                />
              </Box>

              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>Conteúdo dos Termos de Uso</Typography>
              <Typography variant="caption" display="block" gutterBottom>
                Use formatação Markdown para estilizar o texto. Suporta cabeçalhos, listas, links, etc.
              </Typography>
              
              <TextField
                label="Conteúdo"
                value={termsOfUseState.content || ''}
                onChange={(e) => handleTermsOfUseChange('content', e.target.value)}
                fullWidth
                multiline
                rows={15}
                margin="normal"
              />

              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>Personalização</Typography>
              
              <TextField
                label="Texto do Cabeçalho"
                value={termsOfUseState.customization?.headerText || ''}
                onChange={(e) => handleTermsOfUseCustomizationChange('headerText', e.target.value)}
                fullWidth
                margin="normal"
              />
              
              <TextField
                label="Texto do Botão de Aceitação"
                value={termsOfUseState.customization?.acceptButtonText || ''}
                onChange={(e) => handleTermsOfUseCustomizationChange('acceptButtonText', e.target.value)}
                fullWidth
                margin="normal"
              />
              
              <TextField
                label="Texto do Botão de Rejeição"
                value={termsOfUseState.customization?.rejectButtonText || ''}
                onChange={(e) => handleTermsOfUseCustomizationChange('rejectButtonText', e.target.value)}
                fullWidth
                margin="normal"
              />
              
              <TextField
                label="Mensagem do Popup"
                value={termsOfUseState.customization?.popupMessage || ''}
                onChange={(e) => handleTermsOfUseCustomizationChange('popupMessage', e.target.value)}
                fullWidth
                multiline
                rows={3}
                margin="normal"
              />
            </>
          )}
        </TabPanel>

        {/* Política de Cookies */}
        <TabPanel value={tabValue} index={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Política de Cookies</Typography>
            <Box>
              <Button 
                variant="outlined" 
                startIcon={<PreviewIcon />} 
                onClick={handleTogglePreview}
                sx={{ mr: 1 }}
              >
                {previewMode ? 'Editar' : 'Visualizar'}
              </Button>
              <Button 
                variant="contained" 
                startIcon={<SaveIcon />} 
                onClick={handleSaveCookiePolicy}
              >
                Salvar
              </Button>
            </Box>
          </Box>

          {previewMode ? (
            <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1, bgcolor: '#f9f9f9' }}>
              <ReactMarkdown>{cookiePolicyState.content || ''}</ReactMarkdown>
            </Box>
          ) : (
            <>
              <Box sx={{ mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={cookiePolicyState.enabled || false} 
                      onChange={(e) => handleCookiePolicyChange('enabled', e.target.checked)}
                    />
                  }
                  label="Ativar Política de Cookies"
                />
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={cookiePolicyState.showBanner || false} 
                      onChange={(e) => handleCookiePolicyChange('showBanner', e.target.checked)}
                    />
                  }
                  label="Mostrar banner de cookies"
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Versão"
                  value={cookiePolicyState.version || ''}
                  onChange={(e) => handleCookiePolicyChange('version', e.target.value)}
                  fullWidth
                  margin="normal"
                />
              </Box>

              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>Conteúdo da Política de Cookies</Typography>
              <Typography variant="caption" display="block" gutterBottom>
                Use formatação Markdown para estilizar o texto. Suporta cabeçalhos, listas, links, etc.
              </Typography>
              
              <TextField
                label="Conteúdo"
                value={cookiePolicyState.content || ''}
                onChange={(e) => handleCookiePolicyChange('content', e.target.value)}
                fullWidth
                multiline
                rows={15}
                margin="normal"
              />
            </>
          )}
        </TabPanel>
      </CardContent>

      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default LegalPoliciesEditor;
