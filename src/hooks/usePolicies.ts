import { useEffect, useState } from 'react';
import { settingsService } from '@/services/settingsService';
import { PolicySettings, CookiePolicySettings } from '@/services/settingsService';

interface PoliciesState {
  privacyPolicy: PolicySettings;
  termsOfUse: PolicySettings;
  cookiePolicy: CookiePolicySettings;
  loading: boolean;
  error: string | null;
}

export function usePolicies() {
  const [state, setState] = useState<PoliciesState>({
    privacyPolicy: {} as PolicySettings,
    termsOfUse: {} as PolicySettings,
    cookiePolicy: {} as CookiePolicySettings,
    loading: true,
    error: null,
  });

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    try {
      const settings = await settingsService.getSettings();
      setState(prev => ({
        ...prev,
        privacyPolicy: settings.privacyPolicy,
        termsOfUse: settings.termsOfUse,
        cookiePolicy: settings.cookiePolicy,
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
      const settings = await settingsService.updateSettings({
        privacyPolicy: {
          ...state.privacyPolicy,
          ...policy,
        },
      });
      setState(prev => ({
        ...prev,
        privacyPolicy: settings.privacyPolicy,
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
      const settings = await settingsService.updateSettings({
        termsOfUse: {
          ...state.termsOfUse,
          ...terms,
        },
      });
      setState(prev => ({
        ...prev,
        termsOfUse: settings.termsOfUse,
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
      const settings = await settingsService.updateSettings({
        cookiePolicy: {
          ...state.cookiePolicy,
          ...policy,
        },
      });
      setState(prev => ({
        ...prev,
        cookiePolicy: settings.cookiePolicy,
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
