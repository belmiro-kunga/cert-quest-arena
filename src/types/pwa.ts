export interface PWAIcon {
  src: string;
  sizes: string;
  type: string;
  purpose?: string;
}

export interface PWASplashScreen {
  src: string;
  sizes: string;
  platform: string;
  orientation: string;
}

export interface PWASplashScreenState {
  file: File;
  preview: string;
  platform: string;
  orientation: string;
}

export interface PWASettings {
  name: string;
  short_name: string;
  description: string;
  theme_color: string;
  background_color: string;
  display: string;
  orientation: string;
  start_url: string;
  icons: PWAIcon[];
  splash_screens?: PWASplashScreen[];
  shortcuts?: Array<{
    name: string;
    short_name: string;
    description: string;
    url: string;
  }>;
}

export interface PWAManifest extends PWASettings {
  [key: string]: any;
}
