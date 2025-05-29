
import { Outlet } from 'react-router-dom';
import { CookieBanner } from '@/components/CookieBanner';
import { useCookieConsent } from '@/hooks/useCookieConsent';

export function RootLayout() {
  const { consent, loading, acceptCookies, rejectCookies } = useCookieConsent();

  // Simple default cookie policy
  const defaultCookiePolicy = {
    enabled: true,
    customization: {
      headerText: 'Utilizamos cookies',
      bannerText: 'Este site utiliza cookies para melhorar sua experiência.',
      acceptButtonText: 'Aceitar todos',
      rejectButtonText: 'Rejeitar todos'
    },
    cookieTypes: [
      {
        id: 'necessary',
        name: 'Necessários',
        description: 'Cookies necessários para o funcionamento básico do site',
        required: true,
        enabled: true
      }
    ]
  };

  if (loading) {
    return null;
  }

  return (
    <>
      <Outlet />
      
      {!consent && (
        <CookieBanner
          position="bottom"
          headerText={defaultCookiePolicy.customization.headerText}
          bannerText={defaultCookiePolicy.customization.bannerText}
          acceptAllButtonText={defaultCookiePolicy.customization.acceptButtonText}
          acceptSelectedButtonText={defaultCookiePolicy.customization.acceptButtonText}
          rejectAllButtonText={defaultCookiePolicy.customization.rejectButtonText}
          settingsButtonText="Configurações"
          cookieTypes={defaultCookiePolicy.cookieTypes}
          onAccept={acceptCookies}
          onReject={rejectCookies}
        />
      )}
    </>
  );
}
