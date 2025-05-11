import { Outlet } from 'react-router-dom';
import { CookieBanner } from '@/components/CookieBanner';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import { defaultCookiePolicy } from '@/components/admin/settings/PoliciesSettings';

export function RootLayout() {
  const { consent, loading, acceptCookies, rejectCookies } = useCookieConsent();

  if (loading) {
    return null;
  }

  return (
    <>
      <Outlet />
      
      {!consent && (
        <CookieBanner
          position={defaultCookiePolicy.bannerPosition}
          headerText={defaultCookiePolicy.customization.headerText}
          bannerText={defaultCookiePolicy.customization.bannerText}
          acceptAllButtonText={defaultCookiePolicy.customization.acceptAllButtonText}
          acceptSelectedButtonText={defaultCookiePolicy.customization.acceptSelectedButtonText}
          rejectAllButtonText={defaultCookiePolicy.customization.rejectAllButtonText}
          settingsButtonText={defaultCookiePolicy.customization.settingsButtonText}
          cookieTypes={defaultCookiePolicy.cookieTypes}
          onAccept={acceptCookies}
          onReject={rejectCookies}
        />
      )}
    </>
  );
}
