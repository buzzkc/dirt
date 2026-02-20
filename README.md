# Dirt Card Game Scorekeeper

A full-stack Docker app for tracking Dirt card game scores with persistent MySQL storage.

## Quick Start

```bash
# 1. Copy and configure environment
cp env.dist .env
# Edit .env to set your passwords and passcode

# 2. Build and start
docker compose up --build

# 3. Run in background
docker compose up --build -d
```

Open **http://localhost:7001** — you'll be prompted for the passcode set in `.env`.

| Service    | URL                         | Notes                     |
|------------|-----------------------------|---------------------------|
| App        | http://localhost:7001       | React frontend             |
| phpMyAdmin | http://localhost:7002       | MySQL admin UI             |

## Configuration

Copy `env.dist` to `.env` and edit before first run:

```
APP_PASSCODE=your_secret_here     # Gate access to the app
MYSQL_ROOT_PASSWORD=changeme_root
MYSQL_PASSWORD=changeme_dirt
```

Changing `APP_PASSCODE` will invalidate all existing browser sessions.

## Stop / Reset

```bash
docker compose down          # Stop services
docker compose down -v       # Stop and wipe database
```

## Security Notes

- All database queries use parameterized statements (no SQL injection)
- All user input is sanitized server-side before storage
- Passcode verified server-side with timing-safe comparison
- Passcode hash stored in localStorage (never the actual passcode)

## Project Structure

```
dirt/
├── .env              ← your local config (never commit)
├── env.dist         ← template to copy from
├── docker-compose.yml
├── frontend/src/
│   ├── App.jsx       ← React UI
│   ├── api.js        ← shared helpers
│   └── styles.js     ← CSS-in-JS theming
└── backend/
    ├── server.js     ← Express API
    └── init.sql      ← DB schema
```
