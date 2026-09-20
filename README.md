# Arcadia

**A social gaming platform for discovering, tracking, reviewing, and organizing games.**

Build your library. Track your progress. Rate what you play. Share your gaming profile.

[![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Python](https://img.shields.io/badge/Python-3.9%2B-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![IGDB](https://img.shields.io/badge/IGDB-Game%20Data-9147FF)](https://www.igdb.com/)

---

## Why Arcadia?

Modern gaming libraries are often scattered across different platforms.

One service might help you discover games. Another might track your backlog. Another might contain reviews. Social interaction is often disconnected from the actual games you're playing.

**Arcadia brings those pieces together.**

The goal is simple:

> **Give players one place to discover games, build their library, track their journey, and share their gaming experience.**

Arcadia combines real game data from IGDB with a personal library, ratings, reviews, collections, profiles, and social features.

The project is designed as a full-stack application with a React frontend, FastAPI backend, PostgreSQL database, and a structured service layer for external integrations.

---

## Quick look

The primary Arcadia flow is:

```text
                 Discover
                    |
                    v
              Search Games
                    |
                    v
              Game Details
                    |
                    v
             Add to Library
                    |
          +---------+---------+
          |                   |
          v                   v
     Track Status          Rate Game
          |                   |
          +---------+---------+
                    |
                    v
                 Library
                    |
                    v
          Profile / Reviews /
          Collections / Social
```

For example, a user can search for a game using real IGDB data:

```text
Hollow Knight
      |
      v
Game details
      |
      +-- Cover
      +-- Description
      +-- Genres
      +-- Release date
      +-- Rating
      |
      v
Add to Library
      |
      +-- Backlog
      +-- Playing
      +-- Completed
      +-- On Hold
      +-- Dropped
```

Arcadia is not intended to be just a game database.

The game itself is the starting point for a user's personal gaming history.

---

## What it does

| Area | Functionality |
| --- | --- |
| Authentication | Registration, login, JWT authentication |
| Discovery | Search real games through IGDB |
| Game Details | Game information, ratings, genres, release dates, artwork |
| Library | Track games and personal progress |
| Status Tracking | Backlog, Playing, Completed, On Hold, Dropped |
| Ratings | Personal game ratings |
| Reviews | Written game reviews with ratings and spoiler support |
| Collections | Organize games into custom collections |
| Profiles | Personal gaming identity and statistics |
| Social | Follow other users and explore community activity |
| Analytics | Gaming statistics and personal insights |
| Administration | Prototype administration and platform statistics |

---

## How it works

```text
                         Arcadia
                            |
          +-----------------+-----------------+
          |                                   |
          v                                   v
   React Frontend                        FastAPI API
          |                                   |
          |                                   |
          |                          +--------+--------+
          |                          |                 |
          |                          v                 v
          |                    Application        PostgreSQL
          |                    Services           Database
          |                          |
          |                          v
          |                         IGDB
          |                     Game Database
          |
          +---------- HTTP / JSON ----------->+
```

The application is divided into several logical layers.

### Frontend

The React application handles:

- User interaction
- Routing
- Game discovery
- Game details
- Library management
- Profiles
- Reviews
- Collections
- Social interfaces
- Loading and error states

The frontend also contains reusable components, hooks, contexts, and utility modules rather than putting application logic into individual pages.

### Backend

The FastAPI backend provides:

- Authentication
- User management
- Game integration
- Library operations
- Reviews
- Collections
- Social operations
- Database access
- External API communication

The backend is organized into API routes, services, models, schemas, and core infrastructure.

### Database

PostgreSQL stores persistent application data.

Major entities include:

```text
User
Game
UserGame
Review
Collection
Follow
```

### External Game Data

IGDB provides the external game catalogue.

Arcadia uses IGDB for information such as:

- Titles
- Descriptions
- Genres
- Ratings
- Release dates
- Cover artwork

---

## Architecture

```text
                         ┌──────────────────────┐
                         │      React UI        │
                         │                      │
                         │ Pages                │
                         │ Components           │
                         │ Context              │
                         │ Hooks                │
                         └──────────┬───────────┘
                                    │
                                    │ REST / JSON
                                    ▼
                         ┌──────────────────────┐
                         │      FastAPI         │
                         │                      │
                         │ API Routes           │
                         │ Schemas              │
                         │ Dependencies         │
                         └──────────┬───────────┘
                                    │
                     ┌──────────────┼──────────────┐
                     │              │              │
                     ▼              ▼              ▼
              ┌────────────┐ ┌────────────┐ ┌────────────┐
              │  Services  │ │ PostgreSQL │ │   IGDB     │
              │            │ │            │ │            │
              │ Auth       │ │ Persistent │ │ External   │
              │ Library    │ │ Data       │ │ Game Data  │
              │ Reviews    │ │            │ │            │
              │ Collections│ │            │ │            │
              │ IGDB       │ │            │ │            │
              └────────────┘ └────────────┘ └────────────┘
```

The architecture keeps external API communication and database operations out of the frontend.

This makes the application easier to extend as new features are introduced.

---

## Frontend experience

The frontend is designed around a dark, gaming-focused interface rather than a conventional business dashboard.

The current interface includes:

- Responsive navigation
- Discover page
- Game search
- Game grids
- Game cards
- Game detail pages
- Library
- Profile foundation
- Authentication modal
- Rating controls
- Status selection
- Toast notifications
- Loading skeletons
- Empty states
- Error states
- Custom 404 page

### Search

Game search uses a debounced request flow:

```text
User types
    |
    v
Debounce
    |
    v
Search API
    |
    v
IGDB
    |
    v
Normalize results
    |
    v
Game Grid
```

The frontend also cancels stale requests using `AbortController`.

This prevents an older search request from unnecessarily updating the interface after a newer query has been entered.

---

## Library

The library is one of the core parts of Arcadia.

Each library entry can contain:

```text
Game
 |
 +-- Status
 |    +-- Backlog
 |    +-- Playing
 |    +-- Completed
 |    +-- On Hold
 |    +-- Dropped
 |
 +-- Rating
 +-- Playtime
 +-- Started At
 +-- Completed At
```

This allows Arcadia to represent more than a simple list of owned games.

It represents a player's **gaming history**.

---

## Reviews

Reviews are tied directly to games and users.

A review can contain:

```text
Title
Body
Rating
Spoiler flag
```

Users can create and edit their reviews through the API.

The review system is designed to eventually become part of the wider social experience, where a game page contains both game information and community opinions.

---

## Collections

Collections allow users to organize games beyond the standard library statuses.

Examples:

```text
My Favorite RPGs

Games I Want To Finish

Indie Games Worth Playing

Games for the Weekend

Best Soundtracks
```

Collections support:

- Custom names
- Descriptions
- Visibility
- Adding games
- Removing games

---

## Social layer

Arcadia is designed to connect personal game tracking with community interaction.

The social layer includes:

- User profiles
- Follow/unfollow
- Reviews
- Public collections
- Gaming activity
- Community-oriented discovery

A user's profile is intended to become a representation of their gaming history rather than simply an account settings page.

---

## IGDB integration

Arcadia uses IGDB as its external game data provider.

The backend authenticates through Twitch's client credentials flow and communicates with the IGDB API.

The integration currently supports:

- Game search
- Game details
- Genres
- Ratings
- Release dates
- Summaries
- Cover artwork

### Request flow

```text
Frontend
   |
   v
FastAPI
   |
   v
IGDB Service
   |
   +---- Twitch OAuth
   |
   v
IGDB API
   |
   v
Normalize game data
   |
   v
Frontend response
```

The IGDB service uses HTTPX with reusable connections.

Access tokens are cached rather than requesting a new Twitch token for every game request.

Search results are also cached to reduce unnecessary repeated requests.

---

## Performance

Arcadia includes several optimizations across the frontend and backend.

### Frontend

- Debounced search
- AbortController request cancellation
- Client-side search caching
- Session caching for featured games
- Lazy-loaded images
- Reusable normalized game data
- Loading skeletons

### Backend

- HTTP connection reuse
- Twitch access-token caching
- Search-result caching
- Bounded in-memory cache
- Request timing
- Reusable HTTP client
- Reduced unnecessary external API requests

The goal is not premature optimization.

The goal is to prevent obvious repeated work from becoming part of the normal application flow.

---

## API

The backend API is exposed under:

```text
/api/v1
```

### Authentication

```http
POST /api/v1/auth/register
POST /api/v1/auth/login
```

### Users

```http
GET    /api/v1/users/me
POST   /api/v1/users/{user_id}/follow
DELETE /api/v1/users/{user_id}/follow
```

### Games

```http
GET /api/v1/games/search?q={query}
GET /api/v1/games/{external_id}
```

### Library

```http
POST  /api/v1/library
POST  /api/v1/library/external/{external_id}
PATCH /api/v1/library/{game_id}
```

### Reviews

```http
POST  /api/v1/reviews
PATCH /api/v1/reviews/{review_id}
```

### Collections

```http
POST   /api/v1/collections
PATCH  /api/v1/collections/{collection_id}

POST   /api/v1/collections/{collection_id}/games
DELETE /api/v1/collections/{collection_id}/games/{game_id}
```

Interactive API documentation is available through FastAPI:

```text
http://localhost:8000/docs
```

---

## Authentication

Arcadia uses JWT-based authentication.

Passwords are hashed using Argon2 before being stored.

The authentication flow is:

```text
Register
   |
   v
Hash password
   |
   v
Store user
   |
   v
Login
   |
   v
Verify password
   |
   v
Generate JWT
   |
   v
Authenticated API requests
```

Protected endpoints use the authenticated user's identity when performing operations such as library updates and social actions.

---

## Database

Arcadia uses PostgreSQL with SQLAlchemy 2.0.

The primary entities are:

```text
User
   |
   +---- UserGame ---- Game
   |
   +---- Review ------ Game
   |
   +---- Collection -- Game
   |
   +---- Follow ------ User
```

Database changes are managed through Alembic.

Current migrations cover:

- Users
- Games
- User libraries
- Reviews
- Collections
- Follows

---

## Project structure

```text
arcadia/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── games/
│   │   │   ├── library/
│   │   │   ├── reviews/
│   │   │   └── collections/
│   │   │
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── dependencies.py
│   │   │   └── security.py
│   │   │
│   │   ├── database/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── migrations/
│   │   └── versions/
│   │
│   ├── alembic.ini
│   ├── .env.example
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   │
│   ├── package.json
│   └── package-lock.json
│
├── docs/
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## Installation

### Requirements

- Python 3.9+
- Node.js
- npm
- Docker Desktop
- Git

---

### Clone

```bash
git clone https://github.com/NightFuryX0/Arcadia.git
cd Arcadia
```

---

### Start PostgreSQL

```bash
docker compose up -d
```

Verify:

```bash
docker compose ps
```

---

### Backend

```bash
cd backend
```

Create a virtual environment:

```bash
python3 -m venv .venv
```

Activate it:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create:

```text
backend/.env
```

using `.env.example` as a template.

Example:

```env
DATABASE_URL=postgresql+psycopg://arcadia:arcadia_dev_password@localhost:5432/arcadia

JWT_SECRET_KEY=your-development-secret

IGDB_CLIENT_ID=your-igdb-client-id
IGDB_CLIENT_SECRET=your-igdb-client-secret
```

Run migrations:

```bash
alembic upgrade head
```

Start the API:

```bash
uvicorn app.main:app --reload
```

---

### Frontend

In a separate terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Start Vite:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Development

### Backend

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm run dev
```

### Database

Start:

```bash
docker compose up -d
```

Stop:

```bash
docker compose down
```

Do not use `docker compose down -v` unless you intentionally want to remove the development database volume.

---

## Database migrations

Create a migration:

```bash
alembic revision --autogenerate -m "describe change"
```

Apply migrations:

```bash
alembic upgrade head
```

Check the current migration:

```bash
alembic current
```

Always review generated migrations before applying them.

---

## Testing

The core application flow has been manually verified:

```text
Register
   ↓
Login
   ↓
Search
   ↓
Game Details
   ↓
Add to Library
   ↓
Change Status
   ↓
Change Rating
   ↓
Refresh
   ↓
Verify Persistence
```

The project is also structured to support automated backend and integration testing as the application continues to grow.

Testing priorities include:

- Authentication
- Game search
- Game details
- Library operations
- Reviews
- Collections
- Social actions
- API error handling
- Responsive layouts
- End-to-end user flows

---

## Security

Arcadia currently uses:

- JWT authentication
- Argon2 password hashing
- Environment-based secrets
- Pydantic request validation
- Database constraints
- Authenticated API dependencies
- CORS configuration

Sensitive credentials should never be committed.

Never commit:

```text
.env
API keys
IGDB credentials
JWT production secrets
Database passwords
```

---

## Error handling

The application handles common failure states across the frontend and backend.

These include:

- Invalid authentication
- Unauthorized requests
- Forbidden operations
- Missing games
- API failures
- Network failures
- Empty search results
- Loading states
- Invalid requests
- Custom 404 pages

The frontend uses centralized error handling to turn API failures into user-facing messages rather than exposing raw server responses.

---

## Current status

The core platform is functional.

### Completed

- Authentication
- PostgreSQL integration
- Database migrations
- IGDB integration
- Game search
- Game details
- Game covers
- Personal library
- Library status tracking
- Ratings
- Persistent library data
- Responsive frontend foundation
- Search optimization
- Loading and error states
- Custom 404 page

### In progress

- User profiles
- Reviews interface
- Collections interface
- Social interactions
- Activity experience
- Gaming analytics
- Administrative interface
- Comprehensive QA

---

## Roadmap

### Platform

- [x] Authentication
- [x] Game discovery
- [x] IGDB integration
- [x] Game details
- [x] Library management
- [x] Status tracking
- [x] Ratings
- [x] PostgreSQL persistence

### Social

- [ ] User profiles
- [ ] Reviews
- [ ] Collections
- [ ] Following
- [ ] Activity feed

### Analytics

- [ ] Personal gaming statistics
- [ ] Genre statistics
- [ ] Rating statistics
- [ ] Playtime analytics
- [ ] Completion history
- [ ] Administrative dashboard

### Future

- [ ] Recommendation system
- [ ] Likes and comments
- [ ] Gamification
- [ ] Notifications
- [ ] Advanced moderation
- [ ] Production infrastructure
- [ ] Advanced analytics

---

## Design principles

### Game-first

Games are the center of the application.

Every major feature should connect naturally back to a user's relationship with games.

### Personal history

Arcadia is not only a catalogue.

A library represents what a player has played, what they are playing, what they want to play, and what they left behind.

### Social by design

Reviews, collections, profiles, and following are designed to connect players around the games they care about.

### Real data

Game information comes from a real external catalogue rather than a hardcoded collection of sample games.

### Simple architecture

The project favors understandable layers and explicit responsibilities over unnecessary infrastructure.

### Prototype before scale

The current goal is a complete and reliable product experience.

Infrastructure complexity should only be introduced when the application actually needs it.

---

## Limitations

Arcadia is currently a prototype and is not intended to represent a production-scale gaming platform.

Some advanced functionality remains outside the current scope, including:

- Real-time social infrastructure
- Large-scale recommendation systems
- Advanced moderation
- Production analytics pipelines
- Distributed caching
- Complex notification infrastructure
- Large-scale deployment architecture

The current implementation prioritizes a complete end-to-end experience over infrastructure complexity.

---

## Future direction

The long-term vision for Arcadia is to become a complete personal and social gaming hub.

The platform can evolve from:

```text
Game Discovery
      ↓
Personal Library
      ↓
Gaming History
      ↓
Reviews & Collections
      ↓
Social Profiles
      ↓
Community
      ↓
Personalized Discovery
```

The goal is not simply to catalogue games.

It is to build a platform around the **relationship between players and the games they play.**

---

## License

This project is currently developed as a project application.

License information will be added when Arcadia is prepared for public distribution.
