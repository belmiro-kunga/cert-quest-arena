
import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { Upload, Close } from '@mui/icons-material';
import { useToast } from '@/hooks/useToast';
import { useFileUpload } from '@/hooks/useFileUpload';

export const SettingsPWAIcons = () => {
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { error, success } = useToast();
  const { uploadFile } = useFileUpload();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    try {
      for (const file of selectedFiles) {
        // Verificar se o arquivo é uma imagem
        if (!file.type.startsWith('image/')) {
          error('Por favor, selecione apenas arquivos de imagem');
          return;
        }

        // Verificar se o arquivo tem o tamanho correto
        const requiredSizes: Record<string, { width: number; height: number }> = {
          'icon-192x192.png': { width: 192, height: 192 },
          'icon-512x512.png': { width: 512, height: 512 },
        };

        const fileName = file.name.toLowerCase();
        const requiredSize = requiredSizes[fileName];

        if (requiredSize) {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          
          img.onload = () => {
            if (img.width !== requiredSize.width || img.height !== requiredSize.height) {
              error(`O arquivo ${fileName} deve ter ${requiredSize.width}x${requiredSize.height}px`);
              return;
            }
          };
        }

        // Fazer upload do arquivo
        await uploadFile(file, `public/assets/icons/${file.name}`);
      }

      success('Ícones atualizados com sucesso!');
      setOpen(false);
      setSelectedFiles([]);
    } catch (err) {
      console.error('Erro ao fazer upload:', err);
      error('Erro ao fazer upload dos ícones');
    }
  };

  return (
    <Box>
      <Button
        variant="outlined"
        startIcon={<Upload />}
        onClick={() => setOpen(true)}
      >
        Gerenciar Ícones PWA
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Gerenciar Ícones PWA</DialogTitle>
        <DialogContent>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Ícones necessários:
            </Typography>
            <ul>
              <li>icon-192x192.png (192x192 pixels)</li>
              <li>icon-512x512.png (512x512 pixels)</li>
            </ul>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Por favor, faça upload dos arquivos com os nomes e tamanhos exatos especificados.
            </Typography>
          </Paper>

          <Box sx={{ mt: 2 }}>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/png"
              style={{ display: 'none' }}
              id="icon-upload"
            />
            <label htmlFor="icon-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<Upload />}
              >
                Selecionar Arquivos
              </Button>
            </label>
          </Box>

          {selectedFiles.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {selectedFiles.map((file, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 1,
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  <Typography variant="body2">{file.name}</Typography>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
                    }}
                    size="small"
                  >
                    <Close />
                  </IconButton>
                </Paper>
              ))}
            </Box>
          )}

          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              onClick={handleUpload}
              disabled={selectedFiles.length === 0}
            >
              Fazer Upload
            </Button>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
