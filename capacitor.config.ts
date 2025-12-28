import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tars.app',
  appName: 'TARS',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
