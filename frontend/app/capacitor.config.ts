import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tars.app',
  appName: 'TARS',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    // Allow HTTP connections (needed for local testing)
    cleartext: true
  }
};

export default config;
