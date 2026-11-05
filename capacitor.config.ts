import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kkcorg.app',
  appName: 'KKC',
  webDir: 'dist-android',
  backgroundColor: '#100c06',
  android: { backgroundColor: '#100c06', allowMixedContent: false },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      launchAutoHide: true,
      backgroundColor: '#100c06',
      showSpinner: false,
      androidScaleType: 'CENTER_INSIDE',
    },
  },
};
export default config;
