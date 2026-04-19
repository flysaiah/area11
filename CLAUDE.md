# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install all dependencies
npm install && npm run install-client

# Run full dev environment (Express on :5001, React on :3000)
npm run develop

# Server only (nodemon)
npm run server

# Production build
npm run build

# Client only (Vite dev server, port 3000)
cd client && npm start

# Client production build (outputs to client/build/, served by Express)
cd client && npm run build
```

No test suite is currently configured on either side.

## Environment Variables

Root `.env`:
```
MONGODB_CONNECTION_STRING=mongodb://localhost:27017/area11
```

`client/.env` (Vite exposes vars prefixed with `VITE_` via `import.meta.env`):
```
VITE_BACKEND_URI=http://localhost:5001
```

## Architecture

**Area11** is an anime cataloging app. Users manage a personal anime list (scraping data from MyAnimeList via Puppeteer), build timelines with eras, and share through groups.

### Backend (`server.js` + `server/`)

Express REST API on port 5001 (locally; Heroku injects its own `PORT`) with MongoDB/Mongoose.

- `server/routes/authentication.js` — JWT login + middleware for protecting routes (504-hour tokens)
- `server/routes/animeAPI.js` — Anime CRUD; scrapes MyAnimeList using Puppeteer + stealth plugin
- `server/routes/timelineAPI.js` — Timeline save/fetch (validates group membership)
- `server/utils/processAnime.js` — Parses raw HTML from MAL into structured anime data (string-based, not DOM)
- `server/models/` — Mongoose schemas: `user`, `anime`, `group`, `timeline`

### Frontend (`client/src/`)

React 18 + TypeScript + Material-UI v5, built with Vite (`vite.config.ts`). Vite is configured to output to `client/build/` so Express's static file server at `server.js:48` keeps working unchanged.

- `App.tsx` — Router; unauthenticated users redirect to `/login`
- `Store/AuthContext.tsx` — Global JWT token + username via Context API, persisted in localStorage
- `Themes/theme.ts` — Custom MUI theme (burgundy/red primary)
- `Models/` — TypeScript interfaces for `Anime`, `User`, `Era`, etc.

**Home page** (`Components/Home/Home.tsx`) is the core UI: a 3-column grid with:
- Left: `CatalogPane` — filterable anime list (WantToWatch / Considering / Completed / All)
- Center: `CurrentlySelectedPane` — anime detail editor
- Right: `FinalistsPane` — finalist selections

State flows down via props; child updates bubble up through callbacks (`setCurrentlySelected`, `updateAnime`).

### API Communication

All authenticated requests send `Authorization: Bearer <token>` from AuthContext. The backend JWT middleware validates this on every protected route before the handler runs.
