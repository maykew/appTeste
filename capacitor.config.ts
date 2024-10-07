import type { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'appTeste',
  webDir: 'www',
  plugins: {
    BackgroundRunner: {
      label: "com.example.background.task",
      src: "src/app/runners/background.js",
      event: "myCustomEvent",
      repeat: true,
      interval: 15,
      autoStart: true,
    },
  },
};

export default config;
