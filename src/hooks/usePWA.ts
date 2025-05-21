import { usePWAState } from './usePWAState';
import { usePWAUpdate } from './usePWAUpdate';

export const usePWA = () => {
  const { isSupported, isInstalled, manifest, loading, setLoading } = usePWAState();
  const { updateManifest, updateIcon, addSplashScreen } = usePWAUpdate();

  const updateIconWithState = async (file: File) => {
    if (!manifest) return;

    try {
      const newIcons = await updateIcon(file);
      await updateManifest({
        ...manifest,
        icons: newIcons
      });
    } catch (error) {
      throw error;
    }
  };

  const addSplashScreenWithState = async (file: File, platform: string, orientation: string) => {
    if (!manifest) return;

    try {
      const newSplash = await addSplashScreen(file, platform, orientation);
      const splashScreens = manifest.splash_screens || [];
      const newManifest = {
        ...manifest,
        splash_screens: [...splashScreens, newSplash]
      };
      await updateManifest(newManifest);
    } catch (error) {
      throw error;
    }
  };

  return {
    isSupported,
    isInstalled,
    manifest,
    loading,
    updateManifest,
    updateIcon: updateIconWithState,
    addSplashScreen: addSplashScreenWithState
  };
};
