import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kkcorg.app',
  appName: 'KKC',
  webDir: 'dist-android',
  backgroundColor: '#000000',
  android: { backgroundColor: '#000000', allowMixedContent: false },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      launchAutoHide: true,
      backgroundColor: '#000000',
      showSpinner: false,
      androidScaleType: 'CENTER_INSIDE',
    },
  },
};
export default config;
