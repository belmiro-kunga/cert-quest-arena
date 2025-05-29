
import { useEffect, useState } from 'react';
import { settingsService, PolicySettings, CookiePolicySettings } from '@/services/settingsService';

interface PoliciesState {
  privacyPolicy: PolicySettings;
  termsOfUse: PolicySettings;
  cookiePolicy: CookiePolicySettings;
  loading: boolean;
  error: string | null;
}

export function usePolicies() {
  const [state, setState] = useState<PoliciesState>({
    privacyPolicy: {
      enabled: true,
      content: 'Privacy policy content',
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      requiresAcceptance: true,
      customization: {
        headerText: 'Privacy Policy',
        acceptButtonText: 'Accept',
        rejectButtonText: 'Reject',
        popupMessage: 'Please review our privacy policy.',
      },
    },
    termsOfUse: {
      enabled: true,
      content: 'Terms of use content',
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      requiresAcceptance: true,
      customization: {
        headerText: 'Terms of Use',
        acceptButtonText: 'Accept',
        rejectButtonText: 'Reject',
        popupMessage: 'Please review our terms of use.',
      },
    },
    cookiePolicy: {
      enabled: true,
      content: 'Cookie policy content',
      version: '1.0',
      lastUpdated: new Date().toISOString(),
      requiresAcceptance: true,
      showBanner: true,
      bannerPosition: 'bottom',
      customization: {
        headerText: 'Cookie Notice',
        bannerText: 'We use cookies to improve your experience.',
        acceptAllButtonText: 'Accept All',
        acceptSelectedButtonText: 'Accept Selected',
        rejectAllButtonText: 'Reject All',
        settingsButtonText: 'Settings',
      },
      cookieTypes: [],
    },
    loading: true,
    error: null,
  });

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      setState(prev => ({
        ...prev,
        loading: false,
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao carregar as políticas',
        loading: false,
      }));
    }
  };

  const updatePrivacyPolicy = async (policy: Partial<PolicySettings>) => {
    try {
      setState(prev => ({
        ...prev,
        privacyPolicy: {
          ...prev.privacyPolicy,
          ...policy,
        },
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao atualizar a política de privacidade',
      }));
    }
  };

  const updateTermsOfUse = async (terms: Partial<PolicySettings>) => {
    try {
      setState(prev => ({
        ...prev,
        termsOfUse: {
          ...prev.termsOfUse,
          ...terms,
        },
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao atualizar os termos de uso',
      }));
    }
  };

  const updateCookiePolicy = async (policy: Partial<CookiePolicySettings>) => {
    try {
      setState(prev => ({
        ...prev,
        cookiePolicy: {
          ...prev.cookiePolicy,
          ...policy,
        },
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Erro ao atualizar a política de cookies',
      }));
    }
  };

  return {
    ...state,
    updatePrivacyPolicy,
    updateTermsOfUse,
    updateCookiePolicy,
  };
}
