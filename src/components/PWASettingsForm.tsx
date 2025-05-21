import { useState } from 'react';
import { usePWA } from '../hooks/usePWA';
import { PWAManifest } from '../types/pwa';
import FileUploader from './FileUploader';

export default function PWASettingsForm() {
  const { manifest, loading, updateManifest, updateIcon } = usePWA();
  const [iconFile, setIconFile] = useState<File | null>(null);

  const handleIconSelected = (file: File) => {
    setIconFile(file);
  };

  const saveSettings = async () => {
    if (!manifest || loading) return;

    try {
      // Se houver um novo ícone, atualizar primeiro
      if (iconFile) {
        await updateIcon(iconFile);
      }

      // Atualizar as outras configurações
      const newManifest: PWAManifest = {
        ...manifest,
        name: manifest.name,
        short_name: manifest.short_name,
        description: manifest.description,
        theme_color: manifest.theme_color,
        background_color: manifest.background_color,
        display: manifest.display,
        orientation: manifest.orientation,
        start_url: manifest.start_url
      };

      await updateManifest(newManifest);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
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
      <h2 className="text-xl font-semibold">Configurações PWA</h2>

      {/* Seção do Ícone */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Ícone do App</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ícone atual
            </label>
            <FileUploader
              onFileSelected={handleIconSelected}
              accept="image/svg+xml,image/png"
              disabled={loading}
              preview={{
                preview: manifest.icons?.[0]?.src || '',
                file: null,
                platform: 'web',
                orientation: 'any'
              }}
            />
          </div>
        </div>
      </div>

      {/* Seção de Informações */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Informações do App</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome do App
            </label>
            <input
              type="text"
              value={manifest.name}
              onChange={(e) => updateManifest({ ...manifest, name: e.target.value })}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Curto
            </label>
            <input
              type="text"
              value={manifest.short_name}
              onChange={(e) => updateManifest({ ...manifest, short_name: e.target.value })}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={manifest.description}
              onChange={(e) => updateManifest({ ...manifest, description: e.target.value })}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cor do Tema
            </label>
            <input
              type="color"
              value={manifest.theme_color}
              onChange={(e) => updateManifest({ ...manifest, theme_color: e.target.value })}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Botão de Salvar */}
      <button
        onClick={saveSettings}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Salvando...' : 'Salvar Configurações'}
      </button>
    </div>
  );
}
