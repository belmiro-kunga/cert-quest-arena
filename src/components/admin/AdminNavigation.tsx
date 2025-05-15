import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AdminNavigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center gap-4">
      <button
        onClick={() => navigate('/admin/dashboard')}
        className="text-gray-600 hover:text-gray-900 font-medium"
      >
        Dashboard
      </button>
      <button
        onClick={() => navigate('/admin/exams')}
        className="text-gray-600 hover:text-gray-900 font-medium"
      >
        Simulados
      </button>
      <button
        onClick={() => navigate('/admin/pacotes')}
        className="text-gray-600 hover:text-gray-900 font-medium"
      >
        Pacotes
      </button>
      <button
        onClick={() => navigate('/admin/users')}
        className="text-gray-600 hover:text-gray-900 font-medium"
      >
        Usuários
      </button>
      <button
        onClick={() => navigate('/admin/affiliate-requests')}
        className="text-gray-600 hover:text-gray-900 font-medium"
      >
        Solicitações de Afiliados
      </button>
      <button
        onClick={() => navigate('/admin/system-settings')}
        className="text-gray-600 hover:text-gray-900 font-medium"
      >
        Configurações
      </button>
    </nav>
  );
};
