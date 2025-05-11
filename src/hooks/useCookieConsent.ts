import { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'cookie-consent';

interface CookieConsent {
  accepted: boolean;
  acceptedTypes: string[];
  lastUpdated: string;
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (storedConsent) {
      setConsent(JSON.parse(storedConsent));
    }
    setLoading(false);
  }, []);

  const acceptCookies = (acceptedTypes: string[]) => {
    const newConsent: CookieConsent = {
      accepted: true,
      acceptedTypes,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent));
    setConsent(newConsent);
  };

  const rejectCookies = () => {
    const newConsent: CookieConsent = {
      accepted: false,
      acceptedTypes: ['essential'],
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(newConsent));
    setConsent(newConsent);
  };

  const resetConsent = () => {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
    setConsent(null);
  };

  return {
    consent,
    loading,
    acceptCookies,
    rejectCookies,
    resetConsent,
  };
}
