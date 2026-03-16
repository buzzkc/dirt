# Dirt Card Game Scorekeeper

Full-stack Docker app for tracking Dirt card game scores with MariaDB persistence.

## Quick Start

```bash
# 1. Copy and configure environment
cp .env.dist .env
# Edit .env — set passwords and passcode

# 2. Build and start
docker compose up --build

# 3. Background mode
docker compose up --build -d
```

Open **http://localhost:7001** — enter the passcode from your `.env`.

| Service    | URL                      |
|------------|--------------------------|
| App        | http://localhost:7001    |
| phpMyAdmin | http://localhost:7002    |

## Stop / Reset

```bash
docker compose down        # stop
docker compose down -v     # stop + wipe DB volume (./mysql folder)
```

## Notes

- The backend retries the DB connection up to 20 times (3s apart) on startup — no healthcheck needed.
- Changing `APP_PASSCODE` invalidates all existing browser sessions.
- All DB queries are parameterized. All user input is sanitized server-side.
