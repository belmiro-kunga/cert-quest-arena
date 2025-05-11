import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface CookieType {
  id: string;
  name: string;
  description: string;
  required: boolean;
  enabled: boolean;
}

interface CookieBannerProps {
  position?: 'top' | 'bottom';
  headerText?: string;
  bannerText?: string;
  acceptAllButtonText?: string;
  acceptSelectedButtonText?: string;
  rejectAllButtonText?: string;
  settingsButtonText?: string;
  cookieTypes: CookieType[];
  onAccept: (selectedTypes: string[]) => void;
  onReject: () => void;
}

export function CookieBanner({
  position = 'bottom',
  headerText = 'Política de Cookies',
  bannerText = 'Utilizamos cookies para melhorar sua experiência. Escolha quais tipos de cookies aceitar.',
  acceptAllButtonText = 'Aceitar Todos',
  acceptSelectedButtonText = 'Aceitar Selecionados',
  rejectAllButtonText = 'Rejeitar Todos',
  settingsButtonText = 'Configurações',
  cookieTypes,
  onAccept,
  onReject,
}: CookieBannerProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<CookieType[]>(
    cookieTypes.map(type => ({ ...type }))
  );

  const handleAcceptAll = () => {
    onAccept(cookieTypes.map(type => type.id));
  };

  const handleAcceptSelected = () => {
    onAccept(selectedTypes.filter(type => type.enabled).map(type => type.id));
  };

  const handleToggleType = (typeId: string, enabled: boolean) => {
    setSelectedTypes(prev =>
      prev.map(type =>
        type.id === typeId ? { ...type, enabled } : type
      )
    );
  };

  return (
    <div
      className={cn(
        'fixed left-0 right-0 z-50 mx-auto max-w-2xl p-4',
        position === 'top' ? 'top-0' : 'bottom-0'
      )}
    >
      <Card>
        <CardHeader>
          <CardTitle>{headerText}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            {bannerText}
          </p>

          {showSettings ? (
            <div className="space-y-4">
              {selectedTypes.map((type) => (
                <div
                  key={type.id}
                  className="flex items-center justify-between space-x-2 rounded-lg border p-4"
                >
                  <div className="space-y-0.5">
                    <div className="text-sm font-medium">{type.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {type.description}
                    </div>
                    {type.required && (
                      <div className="text-sm text-muted-foreground">
                        (Obrigatório)
                      </div>
                    )}
                  </div>
                  <Switch
                    checked={type.enabled}
                    onCheckedChange={(checked) => handleToggleType(type.id, checked)}
                    disabled={type.required}
                  />
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2">
          {showSettings ? (
            <>
              <Button
                variant="default"
                onClick={handleAcceptSelected}
              >
                {acceptSelectedButtonText}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
              >
                Voltar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="default"
                onClick={handleAcceptAll}
              >
                {acceptAllButtonText}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowSettings(true)}
              >
                {settingsButtonText}
              </Button>
              <Button
                variant="outline"
                onClick={onReject}
              >
                {rejectAllButtonText}
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
