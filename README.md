# Arcadia

Arcadia is a full-stack gaming platform for discovering, tracking, organizing, and reviewing games.

It combines game discovery with personal library management and social features, allowing users to build their gaming profile, track their progress, rate games, write reviews, and organize games into collections.

---

## Features

### Game Discovery

- Search for games using real IGDB data
- View detailed game information
- Game descriptions, genres, ratings, release dates, and cover artwork
- High-quality game cover images
- Debounced search with request cancellation
- Search result caching

### Personal Library

Users can maintain a personal library and track their progress through different statuses:

- Backlog
- Playing
- Completed
- On Hold
- Dropped

Library entries can also include:

- Personal rating
- Playtime
- Start date
- Completion date

### Authentication

- User registration
- User login
- JWT-based authentication
- Password hashing using Argon2
- Protected API endpoints
- Persistent authentication sessions

### Reviews

Arcadia supports game reviews with:

- Review title
- Review body
- Rating
- Spoiler indication
- Review editing

### Collections

Users can organize games into custom collections with:

- Collection names
- Descriptions
- Public/private visibility
- Adding games
- Removing games

### Social Features

The platform is designed around a social gaming experience, including:

- User profiles
- Following other users
- Gaming activity
- Community reviews
- Public collections

### Analytics

Arcadia includes a gaming statistics layer for information such as:

- Games played
- Games completed
- Backlog
- Current games
- Ratings
- Playtime
- Genre distribution
- Gaming activity

---

## Technology Stack

### Frontend

- React
- Vite
- React Router
- JavaScript
- CSS

### Backend

- Python
- FastAPI
- SQLAlchemy 2.0
- Pydantic
- Pydantic Settings
- JWT
- Argon2
- Alembic

### Database

- PostgreSQL
- Docker

### External Services

- IGDB API
- Twitch OAuth

---

## Architecture

```text
┌─────────────────────────────┐
│        React Frontend       │
│                             │
│  Pages • Components • Hooks │
│  Context • API Client       │
└──────────────┬──────────────┘
               │
               │ HTTP / JSON
               ▼
┌─────────────────────────────┐
│        FastAPI Backend      │
│                             │
│  API • Services • Security  │
│  Schemas • Dependencies     │
└──────────────┬──────────────┘
               │
        ┌──────┴───────┐
        │              │
        ▼              ▼
┌──────────────┐ ┌──────────────┐
│  PostgreSQL  │ │     IGDB     │
│   Database   │ │  Game Data   │
└──────────────┘ └──────────────┘
```

The frontend communicates with the FastAPI backend through a REST API.

The backend handles authentication, database operations, library management, reviews, collections, social functionality, and integration with IGDB.

PostgreSQL stores application data while IGDB provides external game information.

---

## Project Structure

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

## Core Application Flow

The primary user flow is:

```text
Register / Login
       ↓
    Discover
       ↓
  Search Games
       ↓
 Game Details
       ↓
 Add to Library
       ↓
Track Status & Rating
       ↓
    Library
```

The core authentication, game discovery, game details, library management, status updates, ratings, and data persistence flows have been implemented and manually verified.

---

## API

The backend API is served under:

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

Interactive API documentation is available through FastAPI at:

```text
http://localhost:8000/docs
```

---

## IGDB Integration

Arcadia uses IGDB as its external game data provider.

The integration provides:

- Game search
- Game details
- Game titles
- Descriptions
- Release dates
- Ratings
- Genres
- Cover artwork

The backend communicates with IGDB through Twitch's OAuth client credentials flow.

The integration also uses:

- HTTP connection reuse
- Access-token caching
- Search-result caching
- Request timing
- High-resolution cover artwork

---

## Database

Arcadia uses PostgreSQL with SQLAlchemy.

The primary database entities are:

```text
User
Game
UserGame
Review
Collection
Follow
```

Database schema changes are managed using Alembic migrations.

---

## Getting Started

### Requirements

Install:

- Git
- Python 3.9+
- Node.js
- npm
- Docker Desktop

A modern Python version such as Python 3.11 or 3.12 is recommended for development.

---

### 1. Clone the Repository

```bash
git clone https://github.com/NightFuryX0/Arcadia.git
cd Arcadia
```

---

### 2. Start PostgreSQL

From the project root:

```bash
docker compose up -d
```

Verify the container:

```bash
docker compose ps
```

PostgreSQL will run on:

```text
localhost:5432
```

---

### 3. Configure the Backend

Move into the backend:

```bash
cd backend
```

Create a virtual environment:

```bash
python3 -m venv .venv
```

Activate it:

#### macOS / Linux

```bash
source .venv/bin/activate
```

#### Windows

```powershell
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

---

### 4. Configure Environment Variables

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

Do not commit `.env` or expose API credentials.

---

### 5. Run Database Migrations

From the `backend` directory:

```bash
alembic upgrade head
```

Check the current migration:

```bash
alembic current
```

---

### 6. Start the Backend

```bash
uvicorn app.main:app --reload
```

The backend will be available at:

```text
http://localhost:8000
```

API documentation:

```text
http://localhost:8000/docs
```

---

### 7. Start the Frontend

Open a new terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create:

```text
frontend/.env
```

with:

```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## Database Migrations

Create a migration after changing database models:

```bash
alembic revision --autogenerate -m "describe change"
```

Review the generated migration before applying it.

Apply migrations:

```bash
alembic upgrade head
```

Check migration status:

```bash
alembic current
```

### Warning

Avoid using:

```bash
docker compose down -v
```

unless you intentionally want to delete the local PostgreSQL volume and its development data.

---

## Development

### Backend

Start the development server:

```bash
cd backend
source .venv/bin/activate
uvicorn app.main:app --reload
```

### Frontend

Start the Vite development server:

```bash
cd frontend
npm run dev
```

### PostgreSQL

Start the database:

```bash
docker compose up -d
```

Stop the database without deleting its volume:

```bash
docker compose down
```

---

## Security

Arcadia uses several security measures in the current implementation:

- JWT authentication
- Argon2 password hashing
- Environment-based secrets
- Authenticated API dependencies
- Input validation through Pydantic
- Database constraints
- Protected user operations

Sensitive configuration must remain outside version control.

Never commit:

```text
.env
API keys
IGDB credentials
JWT secrets
Database passwords
```

---

## Error Handling

The application provides dedicated handling for common application states including:

- Authentication errors
- Unauthorized requests
- Forbidden requests
- Missing games
- API failures
- Empty search results
- Loading states
- Network failures
- Invalid requests
- Custom 404 pages

The frontend also provides user-friendly error messages rather than exposing raw backend errors wherever possible.

---

## Performance Considerations

Several performance improvements are already incorporated into the application.

### Frontend

- Debounced search
- AbortController for stale requests
- Client-side search caching
- Session caching for featured games
- Lazy-loaded images
- Reusable game normalization utilities
- Loading skeletons

### Backend

- Reused HTTP connections through HTTPX
- Cached Twitch access tokens
- Cached game searches
- Bounded search cache
- Request timing/logging
- Efficient external API communication

---

## Development Roadmap

### Current

- [x] Authentication
- [x] Game discovery
- [x] IGDB integration
- [x] Game details
- [x] Personal library
- [x] Status tracking
- [x] Game ratings
- [x] PostgreSQL persistence
- [x] Database migrations
- [x] Responsive frontend foundation
- [x] Error and loading states
- [x] Custom 404 page

### In Progress

- [ ] User profiles
- [ ] Review interface
- [ ] Collections interface
- [ ] Social interactions
- [ ] Gaming analytics
- [ ] Administrative interface
- [ ] Comprehensive integration testing

### Future

- [ ] Recommendation system
- [ ] Likes and comments
- [ ] Advanced activity feed
- [ ] Gamification
- [ ] Real-time notifications
- [ ] Advanced moderation
- [ ] Production infrastructure
- [ ] Advanced analytics

---

## Scope

Arcadia is currently focused on delivering a complete, functional prototype rather than a production-scale platform.

The current implementation prioritizes:

- A working end-to-end user experience
- Reliable game discovery
- Personal game tracking
- Social gaming functionality
- Clean API architecture
- Persistent data
- Responsive UI
- Maintainable code

More advanced infrastructure and social systems can be added as the platform evolves.

---

## License

This project is currently developed as a project application.

License information can be added here when the project is prepared for public distribution.
