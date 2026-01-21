# Backend Environment Variables

Create a `.env` file in the `backend/` directory with these variables:

```env
# Server Port
# Default: 3001
PORT=3001

# Database Path
# Path to JSON database file
# Default: backend/db.json (relative to backend directory)
# DB_PATH=/path/to/custom/db.json

# Node Environment
# Options: development, production, test
NODE_ENV=development

# CORS Allowed Origins (comma-separated)
# Example: http://localhost:5173,http://localhost:4173
# In development, all origins are allowed by default
# In production, only listed origins are allowed
# CORS_ORIGIN=http://localhost:5173
```

## Example Setup

```bash
# Development
PORT=3001
NODE_ENV=development

# Production
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
DB_PATH=/var/data/moometer/db.json
```

