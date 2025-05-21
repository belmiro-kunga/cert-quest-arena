import { useState, useEffect } from 'react';

interface PWAPromptProps {
  onInstall: () => void;
  onCancel: () => void;
}

export default function PWAPrompt({ onInstall, onCancel }: PWAPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Verifica se o usuário já instalou o PWA
    const checkPWA = () => {
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setShowPrompt(false);
        return;
      }

      // Verifica se o PWA está suportado
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        setShowPrompt(true);
      }
    };

    checkPWA();
  }, []);

  if (!showPrompt) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h3 className="text-xl font-semibold mb-4">Instalar Aplicativo</h3>
        <p className="text-gray-600 mb-6">
          Você gostaria de instalar este aplicativo em seu dispositivo para acesso rápido e offline?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Não, obrigado
          </button>
          <button
            onClick={onInstall}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Instalar
          </button>
        </div>
      </div>
    </div>
  );
}
