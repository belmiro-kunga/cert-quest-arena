import { PWAManifest } from '../types/pwa';
import { PWAService } from '../services/pwa';
import { useToast } from './useToast';

export const usePWAUpdate = () => {
  const toast = useToast();
  const service = PWAService.getInstance();

  const updateManifest = async (newManifest: PWAManifest) => {
    try {
      await service.updateManifest(newManifest);
      toast.success('Manifest atualizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao atualizar manifest');
    }
  };

  const updateIcon = async (file: File) => {
    try {
      const newIcons = await service.generateIcons(file);
      return newIcons;
    } catch (error) {
      toast.error('Erro ao atualizar ícone');
      throw error;
    }
  };

  const addSplashScreen = async (file: File, platform: string, orientation: string) => {
    try {
      const newSplash = await service.addSplashScreen(file, platform, orientation);
      return newSplash;
    } catch (error) {
      toast.error('Erro ao adicionar splash screen');
      throw error;
    }
  };

  return {
    updateManifest,
    updateIcon,
    addSplashScreen
  };
};
