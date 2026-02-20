# Dirt Card Game Scorekeeper

A full-stack Docker application for tracking Dirt card game scores.

## Services

| Service     | Port | Description              |
|-------------|------|--------------------------|
| Frontend    | 7001 | React app (Vite + Nginx) |
| phpMyAdmin  | 7002 | MySQL admin UI           |
| Backend     | —    | Express API (internal)   |
| MySQL       | —    | Database (internal)      |

## Quick Start

```bash
# Build and start all services
docker compose up --build

# Run in background
docker compose up --build -d
```

Then open:
- **App**: http://localhost:7001
- **phpMyAdmin**: http://localhost:7002
  - Server: `mysql`
  - Username: `root`
  - Password: `dirtroot`

## Stop / Reset

```bash
# Stop services
docker compose down

# Stop and wipe database volume
docker compose down -v
```

## Database Credentials

| Field    | Value        |
|----------|--------------|
| Host     | mysql        |
| Database | dirt_scores  |
| User     | dirt         |
| Password | dirtpass     |
| Root PW  | dirtroot     |

## API Endpoints

| Method | Path                               | Description            |
|--------|------------------------------------|------------------------|
| GET    | /api/health                        | Health check           |
| GET    | /api/games                         | List all games         |
| POST   | /api/games                         | Create game            |
| GET    | /api/games/:id                     | Get game + rounds      |
| PATCH  | /api/games/:id                     | Update game status     |
| DELETE | /api/games/:id                     | Delete game            |
| PUT    | /api/games/:id/rounds/:roundIndex  | Upsert round scores    |
| GET    | /api/games/:id/rounds              | List rounds for game   |

## Project Structure

```
dirt/
├── docker-compose.yml
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       └── App.jsx
└── backend/
    ├── Dockerfile
    ├── package.json
    ├── server.js
    └── init.sql
```
