# CarQeemat frontend

React, TypeScript, Vite, and Tailwind CSS frontend for CarQeemat.

## Run locally

Start the FastAPI backend from the project root:

```bash
.venv/bin/uvicorn backend.main:app --reload
```

In another terminal, start the frontend:

```bash
cd frontend
npm install
npm run dev
```

The development server proxies `/api` requests to `http://127.0.0.1:8000`, so
the browser can call the backend without a cross-origin request.

## Backend URL

By default, development requests use the `/api` Vite proxy. To use a different
base URL, set `VITE_API_BASE_URL` in a local environment file. Copy
`.env.example` to `.env.local` to use the proxy setting explicitly. For a
direct cross-origin URL, the backend must allow the frontend origin.

## Checks

```bash
npm run build
npm run lint
```
