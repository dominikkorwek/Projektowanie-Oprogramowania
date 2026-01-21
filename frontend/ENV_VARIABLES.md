# Frontend Environment Variables

Create a `.env` file in the `frontend/` directory with these variables:

```env
# API Base URL
# Default: /api (uses Vite proxy in development)
# For production build, set to full backend URL
# VITE_API_URL=http://localhost:3001/api

# Development Settings
# VITE_DEV_SERVER_PORT=5173
```

## Usage

### Development
The frontend uses Vite's proxy by default, so you don't need to set `VITE_API_URL`:
```env
# No VITE_API_URL needed - uses proxy
```

### Production
Set the full backend URL:
```env
VITE_API_URL=https://api.yourdomain.com/api
```

## How It Works

In `frontend/src/services/apiClient.js`:
```javascript
const API_BASE = import.meta.env.VITE_API_URL || '/api';
```

- Development: `/api` → Vite proxy → `http://localhost:3001/api`
- Production: Full URL → `https://api.yourdomain.com/api`

