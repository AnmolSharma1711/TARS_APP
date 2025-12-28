# APK Backend Connection Fix

## Problem
The APK cannot connect to the backend because it's using `http://localhost:8000`, which doesn't work on mobile devices.

## Solution: Rebuild APK with Production Backend

### Step 1: Rebuild the Frontend (REQUIRED)

Navigate to the frontend directory and rebuild with production mode:

```powershell
cd d:\akshat\TARS\frontend\app

# Build with production environment (uses https://tars-bkv7.onrender.com)
npm run build -- --mode production

# Sync with Capacitor
npx cap sync android
```

### Step 2: Rebuild the APK

**Option A: Using Android Studio**
1. Open Android Studio
2. Open project: `d:\akshat\TARS\frontend\app\android`
3. Build > Build Bundle(s) / APK(s) > Build APK(s)
4. APK location: `frontend\app\android\app\build\outputs\apk\debug\app-debug.apk`

**Option B: Using Command Line**
```powershell
cd d:\akshat\TARS\frontend\app\android
.\gradlew assembleDebug
```

### Step 3: Install the New APK

Transfer and install the newly built APK on your device.

## Verification

The app should now connect to: `https://tars-bkv7.onrender.com`

You can verify by checking:
- Login functionality works
- Data loads from the backend
- No network errors in the app

## Alternative: Local Network Testing

If you want to test with a local backend on the same WiFi:

1. **Find your computer's local IP:**
   ```powershell
   ipconfig
   # Look for "IPv4 Address" under your WiFi adapter (e.g., 192.168.1.100)
   ```

2. **Update the production environment file:**
   Edit `d:\akshat\TARS\frontend\app\.env.production`:
   ```
   VITE_API_URL=http://192.168.1.100:8000
   ```

3. **Update Django ALLOWED_HOSTS:**
   Add your local IP to backend settings or environment variable

4. **Rebuild following Step 1 and Step 2 above**

## Important Notes

- **localhost/127.0.0.1 will NEVER work** on physical devices
- Always rebuild with `--mode production` for APK builds
- The production backend at `https://tars-bkv7.onrender.com` should work immediately
- For local testing, ensure both device and computer are on the same network

## Backend CORS Configuration

The backend must allow requests from the mobile app. Currently configured origins:
- `http://localhost:5173`
- `http://127.0.0.1:5173`

For mobile apps, Capacitor uses custom schemes (capacitor://localhost), which should work with the current settings. If you encounter CORS issues:

1. Check backend logs for CORS errors
2. Consider adding `CORS_ALLOW_ALL_ORIGINS = True` for testing (not recommended for production)

## Troubleshooting

**Issue: "Network Error" or "Connection Refused"**
- ✓ Ensure you rebuilt with `--mode production`
- ✓ Verify backend is accessible from browser: https://tars-bkv7.onrender.com
- ✓ Check if backend is running

**Issue: "CORS Error"**
- Update Django CORS settings to allow mobile requests
- Add `capacitor://localhost` to CORS_ALLOWED_ORIGINS

**Issue: "Unauthorized" or "401 Error"**
- Backend is working, but authentication may need checking
- Verify JWT token handling in the app
