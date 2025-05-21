import { useState, useEffect } from 'react';

interface SplashScreen {
  src: string;
  sizes: string;
  platform: string;
  orientation: string;
}

export default function PWASplashScreen() {
  const [splashScreens, setSplashScreens] = useState<SplashScreen[]>([]);
  const [newSplash, setNewSplash] = useState<SplashScreen | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Carregar splash screens existentes
    fetch('/manifest.json')
      .then(response => response.json())
      .then(data => {
        if (data.splash_screens) {
          setSplashScreens(data.splash_screens);
        }
      })
      .catch(error => console.error('Erro ao carregar manifest:', error));
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewSplash({
          src: reader.result as string,
          sizes: file.name.split('.')[0],
          platform: 'ios',
          orientation: 'portrait'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const addSplashScreen = async () => {
    if (!newSplash) return;

    setUploading(true);
    try {
      // Aqui você pode adicionar a lógica para salvar o splash screen
      // Isso geralmente envolve:
      // 1. Salvar o arquivo de imagem
      // 2. Atualizar o manifest.json
      // 3. Atualizar o cache do service worker

      setSplashScreens(prev => [...prev, newSplash]);
      setNewSplash(null);
      alert('Splash screen adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao adicionar splash screen:', error);
      alert('Erro ao adicionar splash screen');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Splash Screens</h2>

      {/* Lista de Splash Screens */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Splash Screens Atuais</h3>
        <div className="space-y-4">
          {splashScreens.map((splash, index) => (
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
          ))}
        </div>
      </div>

      {/* Adicionar Novo Splash */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-2">Adicionar Novo Splash</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Selecione uma imagem
            </label>
            <input
              type="file"
              accept="image/png,image/jpeg"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {newSplash && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preview
              </label>
              <img
                src={newSplash.src}
                alt="Preview"
                className="w-full h-64 object-cover"
              />
            </div>
          )}
        </div>
        <button
          onClick={addSplashScreen}
          disabled={uploading || !newSplash}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Adicionando...' : 'Adicionar Splash'}
        </button>
      </div>
    </div>
  );
}
