import { useState, useEffect } from 'react';
import { usePWA } from '../hooks/usePWA';

interface PWASettings {
  name: string;
  short_name: string;
  description: string;
  theme_color: string;
  background_color: string;
  display: string;
  orientation: string;
  start_url: string;
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: string;
  }>;
}

export default function PWASettingsForm() {
  const { isSupported } = usePWA();
  const [settings, setSettings] = useState<PWASettings | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [previewIcon, setPreviewIcon] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Carregar configurações atuais do manifest
    fetch('/manifest.json')
      .then(response => response.json())
      .then(data => setSettings(data))
      .catch(error => console.error('Erro ao carregar manifest:', error));
  }, []);

  const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIconFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewIcon(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveSettings = async () => {
    if (!settings || !isSupported) return;

    setIsSaving(true);
    try {
      // Se houver um novo ícone, gerar ícones em diferentes tamanhos
      if (iconFile) {
        const iconSizes = [
          { size: '32x32' },
          { size: '48x48' },
          { size: '96x96' },
          { size: '128x128' },
          { size: '192x192' },
          { size: '256x256' },
          { size: '384x384' },
          { size: '512x512' }
        ];

        // Aqui você pode adicionar a lógica para gerar os ícones em diferentes tamanhos
        // Isso geralmente envolve uma biblioteca de processamento de imagens
      }

      // Atualizar o manifest
      await fetch('/manifest.json', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });

      // Atualizar o cache do service worker
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
          registration.update();
        });
      }

      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4">
        <p className="text-red-600">Seu navegador não suporta PWA</p>
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
            <div className="flex items-center justify-center w-full">
              <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {previewIcon ? (
                    <img
                      src={previewIcon}
                      alt="Preview"
                      className="w-24 h-24 object-contain"
                    />
                  ) : (
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <p className="mb-2 text-sm text-gray-500 text-center">
                  {previewIcon ? 'Clique para alterar' : 'Arraste e solte um arquivo SVG ou PNG'}
                </p>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Novo Ícone
            </label>
            <input
              type="file"
              accept="image/svg+xml,image/png"
              onChange={handleIconChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
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
              value={settings?.name || ''}
              onChange={(e) => setSettings(prev => ({ ...prev!, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nome Curto
            </label>
            <input
              type="text"
              value={settings?.short_name || ''}
              onChange={(e) => setSettings(prev => ({ ...prev!, short_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descrição
            </label>
            <textarea
              value={settings?.description || ''}
              onChange={(e) => setSettings(prev => ({ ...prev!, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cor do Tema
            </label>
            <input
              type="color"
              value={settings?.theme_color || '#0f172a'}
              onChange={(e) => setSettings(prev => ({ ...prev!, theme_color: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* Botão de Salvar */}
      <button
        onClick={saveSettings}
        disabled={isSaving}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? 'Salvando...' : 'Salvar Configurações'}
      </button>
    </div>
  );
}
