# Frontend-Backend Communication Setup

## ✅ Configuration Complete

### Backend (Django on Render)
- **URL:** `https://tars-bkv7.onrender.com`
- **CORS Enabled** for: 
  - `https://tars-sage.vercel.app` (Production)
  - `http://localhost:5173` (Local development)
  - `http://127.0.0.1:5173` (Local development)

### Frontend (React on Vercel)
- **URL:** `https://tars-sage.vercel.app`
- **API URL:** Uses environment variable `VITE_API_URL`

## Environment Variables Setup

### On Vercel (Frontend)
Add this environment variable in your Vercel project settings:

```
VITE_API_URL=https://tars-bkv7.onrender.com
```

**Steps:**
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://tars-bkv7.onrender.com`
   - **Environment:** Production, Preview, Development
4. Click **Save**
5. Redeploy your project

### On Render (Backend)
Add this environment variable in your Render service settings:

```
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,https://tars-sage.vercel.app
```

**Steps:**
1. Go to your Render dashboard
2. Select your backend service
3. Navigate to **Environment**
4. Add/Update variable:
   - **Key:** `CORS_ALLOWED_ORIGINS`
   - **Value:** `http://localhost:5173,http://127.0.0.1:5173,https://tars-sage.vercel.app`
5. Click **Save Changes**
6. Service will auto-redeploy

## Local Development

### Frontend
```bash
cd frontend/app
npm install
npm run dev
```

The frontend will use `http://localhost:8000` for API calls (from `.env` file).

### Backend
```bash
cd backend
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
python manage.py runserver
```

## Testing the Connection

### Test Backend Health
```bash
curl https://tars-bkv7.onrender.com/api/health/
```

### Test from Frontend
Open browser console on `https://tars-sage.vercel.app` and run:
```javascript
fetch('https://tars-bkv7.onrender.com/api/health/')
  .then(res => res.json())
  .then(data => console.log(data))
```

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:
1. Check that `CORS_ALLOWED_ORIGINS` is set correctly on Render
2. Ensure your Vercel URL is exact (no trailing slashes)
3. Verify the backend service has redeployed after changes

### API Not Found (404)
1. Check that `VITE_API_URL` is set in Vercel environment variables
2. Clear build cache and redeploy on Vercel
3. Check browser DevTools → Network tab to see the actual API URL being called

### Authentication Issues
1. Ensure `CORS_ALLOW_CREDENTIALS = True` is in backend settings
2. Check that cookies are being sent with requests (frontend should use `credentials: 'include'`)

## File Structure

```
TARS/
├── backend/
│   ├── .env                    # Local environment variables
│   ├── .env.example           # Template for environment variables
│   └── tars/settings.py       # Django settings (CORS configured)
└── frontend/
    └── app/
        ├── .env               # Local: API_URL=http://localhost:8000
        ├── .env.production    # Production: API_URL=https://tars-bkv7.onrender.com
        ├── .env.example       # Template
        └── src/services/api.ts # API service (uses VITE_API_URL)
```

## Next Steps

1. ✅ Update CORS_ALLOWED_ORIGINS on Render
2. ✅ Add VITE_API_URL to Vercel environment variables
3. ✅ Redeploy both services
4. ✅ Test the connection

Your frontend and backend should now communicate successfully! 🚀
