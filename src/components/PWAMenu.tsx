
import { useState, useEffect } from 'react';

// Extend Window interface to include deferredPrompt
declare global {
  interface Window {
    deferredPrompt: any;
  }
}

interface PWAMenuProps {
  onClose: () => void;
}

export default function PWAMenu({ onClose }: PWAMenuProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verifica se o navegador suporta PWA
    const checkPWA = () => {
      setIsSupported(
        'serviceWorker' in navigator && 
        'PushManager' in window && 
        'Notification' in window
      );
    };

    checkPWA();

    // Evento para detectar quando o usuário instala o PWA
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
    });

    return () => {
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstall = () => {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt();
      window.deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setIsInstalled(true);
        }
        window.deferredPrompt = null;
      });
    }
  };

  if (!isSupported) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">
          Seu navegador não suporta instalação como aplicativo.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Instalar Cert Quest Arena</h2>
      <p className="text-gray-600">
        Instale o Cert Quest Arena como um aplicativo em seu dispositivo para acessar os simulados e estudos offline.
      </p>
      
      {!isInstalled ? (
        <button
          onClick={handleInstall}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Instalar Aplicativo
        </button>
      ) : (
        <div className="p-4 bg-green-50 rounded-md">
          <p className="text-green-700">
            🎉 Parabéns! O Cert Quest Arena foi instalado com sucesso em seu dispositivo.
          </p>
        </div>
      )}

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          Benefícios da instalação:
        </p>
        <ul className="mt-2 space-y-1 text-sm text-gray-600">
          <li>✅ Acesso offline aos simulados e estudos</li>
          <li>✅ Notificações push para novos simulados</li>
          <li>✅ Interface nativa do seu dispositivo</li>
          <li>✅ Acesso rápido através do ícone do aplicativo</li>
        </ul>
      </div>
    </div>
  );
}
