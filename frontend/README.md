# ARCADIA Frontend

Premium React/Vite frontend prototype for the ARCADIA gaming platform.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173/

## Connect to the Arcadia backend

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

The frontend already contains API calls for the existing ARCADIA endpoints:
- auth login/register
- current user
- game search
- game details
- add external game to library
- update library item

If the backend is not running, the UI falls back to demo data so the visual prototype remains usable.

## Git workflow

Work on:

```bash
git checkout -b feature/prototype-frontend
```

Then:

```bash
git add frontend
git commit -m "feat: build Arcadia frontend prototype"
git push -u origin feature/prototype-frontend
```

Ask the project lead to review and merge the branch into `main`.