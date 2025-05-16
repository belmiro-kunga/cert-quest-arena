import React from 'react';
import { AuthSettings as AuthSettingsComponent } from '@/components/admin/settings/AuthSettings';

export default function AuthSettings() {
  React.useEffect(() => {
    document.title = 'Configurações de Autenticação Social';
  }, []);

  return (
    <div className="container mx-auto py-6">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Configurações de Autenticação Social</h1>
        <p className="text-gray-600">
          Gerencie as configurações de login social do sistema
        </p>
        <AuthSettingsComponent />
      </div>
    </div>
  );
}
