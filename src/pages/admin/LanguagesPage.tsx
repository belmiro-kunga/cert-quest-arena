
import React, { useEffect } from 'react';
import { LanguageManager } from '@/components/admin/LanguageManager';
import { useLanguage } from '@/hooks/useLanguage';

export default function LanguagesPage() {
  const { initializeLanguage } = useLanguage();
  
  useEffect(() => {
    // Initialize language when component mounts
    initializeLanguage();
  }, [initializeLanguage]);

  return (
    <div className="container mx-auto py-6">
      <LanguageManager />
    </div>
  );
}
