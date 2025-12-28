# TARS Android App

This is the Android application for TARS built using Ionic Capacitor with React and Vite.

## Prerequisites

- Node.js (v18 or higher)
- Android Studio
- JDK 17 or higher

## Setup Instructions

1. Install dependencies:
```bash
cd frontend/app
npm install
```

2. Build the web assets:
```bash
npm run build
```

3. Sync Capacitor:
```bash
npx cap sync android
```

## Building the APK

### Option 1: Using Android Studio (Recommended)

1. Open Android Studio
2. Open the project: `frontend/app/android`
3. Wait for Gradle to sync
4. Build > Build Bundle(s) / APK(s) > Build APK(s)
5. The APK will be generated in: `frontend/app/android/app/build/outputs/apk/debug/app-debug.apk`

### Option 2: Using Command Line

1. Make sure you have Android SDK and build tools installed
2. Run:
```bash
cd frontend/app/android
./gradlew assembleDebug
```

The APK will be generated at: `frontend/app/android/app/build/outputs/apk/debug/app-debug.apk`

## Running on Device/Emulator

```bash
npx cap run android
```

## Development Workflow

1. Make changes to the web app in `frontend/app/src`
2. Build the web assets: `npm run build`
3. Sync with Capacitor: `npx cap sync android`
4. Open in Android Studio: `npx cap open android`

## Configuration

The app configuration is in `capacitor.config.ts`:
- App ID: `com.tars.app`
- App Name: `TARS`
- Web Directory: `dist`

## Environment Variables

Create a `.env` file in `frontend/app/` directory:
```
VITE_API_URL=your_backend_url_here
```

## Project Structure

```
frontend/app/
├── android/              # Android native project
├── dist/                 # Built web assets
├── src/                  # React source code
├── capacitor.config.ts   # Capacitor configuration
├── package.json
└── vite.config.ts
```

## Troubleshooting

- If you encounter build errors, try cleaning the project:
  ```bash
  cd android
  ./gradlew clean
  ```

- To update web assets after making changes:
  ```bash
  npm run build && npx cap sync android
  ```

- For live reload during development:
  ```bash
  npm run dev
  ```
  Then update the server URL in `capacitor.config.ts` to point to your local dev server.
