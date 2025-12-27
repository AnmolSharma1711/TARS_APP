## Testing Frontend-Backend Connection

### 1. Test from Browser Console

Open your deployed frontend at `https://tars-sage.vercel.app` and open the browser console (F12). Run:

```javascript
// Test 1: Health Check
fetch('https://tars-bkv7.onrender.com/api/health/', {
  mode: 'cors',
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => console.log('Health Check:', data))
  .catch(err => console.error('Error:', err));

// Test 2: API Info
fetch('https://tars-bkv7.onrender.com/api/info/', {
  mode: 'cors',
  credentials: 'include'
})
  .then(res => res.json())
  .then(data => console.log('API Info:', data))
  .catch(err => console.error('Error:', err));
```

### 2. Check Network Tab

1. Open DevTools → Network tab
2. Try to login on your frontend
3. Look for the request to `/api/auth/login/`
4. Check:
   - **Request URL**: Should be `https://tars-bkv7.onrender.com/api/auth/login/`
   - **Status**: Should be 200 (success) or 4xx (client error)
   - **Response Headers**: Should include `Access-Control-Allow-Origin: https://tars-sage.vercel.app`
   - **Request Headers**: Should include `Origin: https://tars-sage.vercel.app`

### 3. Common Errors and Solutions

#### "Failed to fetch" or "Network Error"
- Backend is down or not accessible
- Check: https://tars-bkv7.onrender.com/api/health/

#### "CORS policy: No 'Access-Control-Allow-Origin' header"
- CORS not configured on backend
- **Solution**: Add `CORS_ALLOWED_ORIGINS` environment variable on Render:
  ```
  CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://tars-sage.vercel.app
  ```

#### "CORS policy: credentials mode is 'include'"
- CORS_ALLOW_CREDENTIALS not enabled
- **Solution**: Already set in settings.py (`CORS_ALLOW_CREDENTIALS = True`)

#### "Invalid credentials" after successful fetch
- User doesn't exist or wrong password
- **Solution**: Use the admin credentials:
  - Username: `admin`
  - Password: `Admin@TARS2025`

### 4. Verify Environment Variables

#### On Vercel:
```bash
# Check if VITE_API_URL is set
# Go to: Project Settings → Environment Variables
# Should see: VITE_API_URL = https://tars-bkv7.onrender.com
```

#### On Render:
```bash
# Check if CORS_ALLOWED_ORIGINS is set
# Go to: Service → Environment
# Should see: CORS_ALLOWED_ORIGINS = http://localhost:5173,http://127.0.0.1:5173,https://tars-sage.vercel.app
```

### 5. Force Redeploy

After adding environment variables:

**Vercel:**
1. Go to Deployments
2. Click the "..." menu on the latest deployment
3. Click "Redeploy"

**Render:**
- Should auto-redeploy after environment variable changes
- Or manually trigger from Dashboard → Manual Deploy

### 6. What Changed

✅ **All fetch requests now include:**
- `mode: 'cors'` - Explicitly enable CORS
- `credentials: 'include'` - Send cookies/credentials with requests

This allows your Vercel frontend to properly communicate with your Render backend across different domains.
