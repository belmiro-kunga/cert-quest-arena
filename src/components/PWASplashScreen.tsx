import { useState } from 'react';
import { usePWA } from '../hooks/usePWA';
import { PWAManifest, PWASplashScreenState } from '../types/pwa';
import FileUploader from './FileUploader';

export default function PWASplashScreen() {
  const { manifest, loading, addSplashScreen: addSplashScreenService } = usePWA();
  const [newSplash, setNewSplash] = useState<PWASplashScreenState | null>(null);

  const handleFileSelected = (file: File) => {
    setNewSplash({
      file,
      preview: '',
      platform: 'ios',
      orientation: 'portrait'
    });
  };

  const addSplashScreen = async () => {
    if (!newSplash || loading) return;

    try {
      await addSplashScreenService(newSplash.file, newSplash.platform, newSplash.orientation);
    } catch (error) {
      console.error('Erro ao adicionar splash screen:', error);
    }
  };

  if (!manifest) {
    return (
      <div className="p-4">
        <p className="text-gray-500">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Splash Screens</h2>

      {/* Formulário de Nova Splash Screen */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Adicionar Nova Splash Screen</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Imagem
            </label>
            <FileUploader
              onFileSelected={handleFileSelected}
              accept="image/*"
              disabled={loading}
              preview={newSplash}
            />
          </div>
          <div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plataforma
                </label>
                <select
                  value={newSplash?.platform || 'ios'}
                  onChange={(e) => {
                    if (newSplash) {
                      setNewSplash({
                        ...newSplash,
                        platform: e.target.value
                      });
                    }
                  }}
                  disabled={loading}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="ios">iOS</option>
                  <option value="android">Android</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orientação
                </label>
                <select
                  value={newSplash?.orientation || 'portrait'}
                  onChange={(e) => {
                    if (newSplash) {
                      setNewSplash({
                        ...newSplash,
                        orientation: e.target.value
                      });
                    }
                  }}
                  disabled={loading}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="portrait">Vertical</option>
                  <option value="landscape">Horizontal</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={addSplashScreen}
          disabled={loading || !newSplash}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adicionando...' : 'Adicionar Splash Screen'}
        </button>
      </div>

      {/* Lista de Splash Screens Atuais */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Splash Screens Atuais</h3>
        <div className="space-y-4">
          {manifest.splash_screens?.map((splash, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <img
                    src={splash.src}
                    alt={`Splash ${index + 1}`}
                    className="w-full h-64 object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Tamanho: {splash.sizes}
                  </p>
                  <p className="text-sm text-gray-600">
                    Plataforma: {splash.platform}
                  </p>
                  <p className="text-sm text-gray-600">
                    Orientação: {splash.orientation}
                  </p>
                </div>
              </div>
            </div>
          )) || (
            <p className="text-gray-500">Nenhum splash screen encontrado</p>
          )}
        </div>
      </div>
    </div>
  );
}
