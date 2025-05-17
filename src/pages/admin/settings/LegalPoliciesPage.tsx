import React from 'react';
import { Helmet } from 'react-helmet';
import LegalPoliciesEditor from '@/components/admin/settings/LegalPoliciesEditor';
import { Card, CardContent, Typography, Box, Alert } from '@mui/material';

const LegalPoliciesPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Políticas Legais | CertQuest Arena</title>
      </Helmet>
      
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Políticas Legais
        </Typography>
        
        <Alert severity="info" sx={{ mb: 3 }}>
          Gerencie os Termos de Uso, Política de Privacidade e Política de Cookies da plataforma.
          As alterações serão refletidas imediatamente nas páginas públicas.
        </Alert>
        
        <LegalPoliciesEditor />
      </Box>
    </>
  );
};

export default LegalPoliciesPage;
