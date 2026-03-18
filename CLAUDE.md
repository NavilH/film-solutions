# Film Solutions — Project Context for Claude Code

## What This Project Is
A full-stack movie tracking and recommendation app. Users can browse trending movies, like them, get recommendations, and view stats/charts.

- **Live site:** https://www.film-solutions.org
- **API:** https://api.film-solutions.org
- **Repo:** https://github.com/NavilH/film-solutions

## Tech Stack
- **Frontend:** React (Create React App), React Router v6, Recharts, react-hot-toast
- **Backend:** Node.js, Express
- **Database:** SQLite (via sqlite3)
- **Auth:** bcryptjs + JSON Web Tokens (JWT)
- **Hosting:** Frontend on AWS S3 + CloudFront, Backend on AWS EC2 (Ubuntu), nginx reverse proxy with Let's Encrypt SSL
- **CI/CD:** GitHub Actions deploys frontend on push to main

## Project Structure
```
film-solutions/
├── server.js                  # Express entry point (port 5001)
├── routes/
│   ├── auth.js                # POST /api/auth/register, /api/auth/login
│   ├── movies.js              # GET /api/movies/trending, /trending/saved
│   ├── users.js               # Watchlist + liked + recommendations routes
│   └── stats.js               # Trending stats, genre distribution, weekly trends
├── middleware/
│   └── auth.js                # JWT verification middleware
├── db/
│   ├── db.js                  # SQLite connection + table creation/migrations
│   └── database.sqlite        # SQLite database file
└── client/                    # React frontend
    └── src/
        ├── api.js             # Axios instance with JWT interceptor
        ├── config.js          # API_BASE URL config
        ├── context/
        │   └── AuthContext.js # Auth state (user, login, logout) via localStorage
        ├── pages/
        │   ├── Home.js
        │   ├── Movies.js      # Trending movies + like button
        │   ├── Liked.js       # User's liked movies (protected)
        │   ├── Recommendations.js  # Personalized recommendations (protected)
        │   └── Stats.js       # Charts and analytics
        └── components/
            ├── GenrePieChart.js
            └── WeeklyTrendChart.js
```

## Database Schema
- `users` — id, username (UNIQUE), password (bcrypt hashed)
- `liked` — id, user_id, movie_id, title, poster_url, UNIQUE(user_id, movie_id)
- `trending_runs` — id, fetched_at
- `trending_history` — id, run_id, movie_id, title, poster_url, tmdb_rank
- `movie_genres_history` — id, run_id, movie_id, genre

## Auth Flow
- Register/login via `/api/auth/register` and `/api/auth/login`
- JWT stored in localStorage as `{ token, userId, username }`
- `client/src/api.js` attaches the token to every request via an axios interceptor
- `/liked` and `/recommendations` routes are protected — redirect to `/login` if not authenticated
- `middleware/auth.js` verifies JWT on protected backend routes

## API Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | No | Create account |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/movies/trending | No | Fetch & store trending from TMDB |
| GET | /api/movies/trending/saved | No | Latest saved trending list |
| GET | /api/stats/current-trending | No | Current trending movies |
| GET | /api/stats/genre-distribution | No | Genre breakdown |
| GET | /api/stats/weekly-trending | No | Weekly movie counts |
| POST | /api/users/:user_id/liked | Yes | Like a movie |
| GET | /api/users/:user_id/liked | Yes | Get liked movies |
| GET | /api/users/:user_id/recommendations | No | Get recommendations |

## Environment Variables
**Backend (`.env` on EC2):**
```
TMDB_API_KEY=...
JWT_SECRET=...
PORT=5001
CORS_ORIGIN=https://www.film-solutions.org,https://film-solutions.org
```

**Frontend (`client/.env` — local only):**
```
REACT_APP_API_URL=http://13.216.61.5:5001
```

**GitHub Actions variables (for production builds):**
- `REACT_APP_API_URL` = https://api.film-solutions.org

## Known Issues / Dead Code
- `routes/Recommendations.js` — this file exists but is NOT registered in server.js and is never used. The actual recommendations logic lives in `routes/users.js`. This file should be deleted.
- `axios` require in `routes/users.js` is placed mid-file instead of at the top — worth cleaning up.

## Deployment
- **Frontend:** Push to `main` → GitHub Actions builds React app with production env vars → deploys to S3 → invalidates CloudFront cache
- **Backend:** SSH into EC2, `git pull origin main`, `npm install`, `pm2 restart all`
- **nginx config:** `/etc/nginx/sites-available/api.film-solutions.org` — proxies HTTPS to localhost:5001

## What's Been Done
- JWT authentication (register, login, protected routes)
- Fixed duplicate cors config in server.js
- Fixed duplicate axios require in Recommendations.js
- Fixed topGenres/topCast sorting by frequency
- Added watchlist DELETE ownership check
- Added liked routes (POST + GET)
- Fixed frontend API URLs for liked movies
- Set up nginx + SSL for api.film-solutions.org

## What's Next (Todo)
1. **Testing** — Jest + Supertest for backend routes
2. **Frontend error & loading states** — proper UI feedback
3. **README** — setup instructions, tech stack, screenshots, live demo link
4. **Code cleanup** — delete dead `routes/Recommendations.js`, move axios require to top of users.js
