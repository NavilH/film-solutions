# Film Solutions

A full-stack movie tracking and recommendation app. Browse trending movies, like them, get personalized recommendations, and view stats/charts.

**Live site:** https://www.film-solutions.org

---

## Tech Stack

- **Frontend:** React, React Router v6, Recharts, react-hot-toast
- **Backend:** Node.js, Express
- **Database:** SQLite
- **Auth:** bcryptjs + JWT
- **Hosting:** AWS S3 + CloudFront (frontend), AWS EC2 + nginx (backend)
- **CI/CD:** GitHub Actions

---

## Features

- Browse trending movies (powered by TMDB)
- Create an account and log in
- Like movies and view your liked list
- Get personalized recommendations based on your liked movies
- View genre distribution and weekly trending stats

---

## Project Structure

```
film-solutions/
├── server.js                  # Express entry point (port 5001)
├── routes/
│   ├── auth.js                # Register + login
│   ├── movies.js              # Trending movies
│   ├── users.js               # Liked movies + recommendations
│   └── stats.js               # Genre + weekly stats
├── middleware/
│   └── auth.js                # JWT verification
├── db/
│   └── db.js                  # SQLite setup + migrations
└── client/                    # React frontend
    └── src/
        ├── api.js             # Axios instance with JWT interceptor
        ├── context/
        │   └── AuthContext.js # Global auth state
        └── pages/
            ├── Home.js
            ├── Movies.js
            ├── Liked.js
            ├── Recommendations.js
            └── Stats.js
```

---

## Local Setup

### Prerequisites
- Node.js 18+
- A [TMDB API key](https://www.themoviedb.org/settings/api)

### Backend

```bash
npm install
```

Create a `.env` file in the project root:

```
TMDB_API_KEY=your_tmdb_api_key
JWT_SECRET=your_jwt_secret
PORT=5001
CORS_ORIGIN=http://localhost:3000
```

```bash
node server.js
```

### Frontend

```bash
cd client
npm install
```

Create `client/.env`:

```
REACT_APP_API_URL=http://localhost:5001
```

```bash
npm start
```

---

## Running Tests

```bash
npm test
```

Tests cover auth routes (register, login) and liked routes using Jest + Supertest.

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/movies/trending | No | Fetch trending from TMDB |
| GET | /api/movies/trending/saved | No | Latest saved trending list |
| POST | /api/users/:user_id/liked | Yes | Like a movie |
| GET | /api/users/:user_id/liked | Yes | Get liked movies |
| GET | /api/users/:user_id/recommendations | No | Get recommendations |
| GET | /api/stats/genre-distribution | No | Genre breakdown |
| GET | /api/stats/weekly-trending | No | Weekly movie counts |
