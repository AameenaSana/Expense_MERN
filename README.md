# Expense Tracker (MERN)

A full-stack expense tracker built with MongoDB, Express, React and Node.js.

## Features

- **Accounts:** sign up and log in with email and password. Each user sees only their own transactions and budgets.
- **Dashboard:** monthly income, expenses and net savings with change vs the previous month, a 6-month income vs expenses chart, spending by category, recent transactions and a budget snapshot. Step back and forward through months.
- **Transactions:** add, edit and delete income and expenses. Search, filter by type, category and month, sort by date or amount, and export the filtered list to CSV.
- **Budgets:** set a monthly limit per expense category and track progress, with warnings near and over the limit.
- **Currency:** choose the display currency (saved in your browser).
- **Reliable by design:** validation on both client and server, clear error messages, loading and empty states, confirmation before deleting, and an API test suite.

## Tech stack

- **Frontend:** React 18 (Create React App), styled-components, Chart.js, axios
- **Backend:** Node.js, Express, Mongoose, JWT auth with bcrypt-hashed passwords
- **Database:** MongoDB

## Project structure

```
backend/      Express API (routes, controllers, middleware, Mongoose models)
frontend/     React app
package.json  Root scripts that build and start the whole app (used for deployment)
render.yaml   Render deployment blueprint
```

In production the backend also serves the built React app from `frontend/build`, so the whole app runs on a single port.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer (includes npm)
- [MongoDB](https://www.mongodb.com/try/download/community), installed locally or a hosted cluster such as MongoDB Atlas

## Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/AameenaSana/Expense_MERN.git
   cd Expense_MERN
   ```

2. **Install dependencies**

   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Configure environment variables**

   Copy the example file and edit it if needed:

   ```bash
   cd ../backend
   cp .env.example .env
   ```

   | Variable    | Description                    | Example                                     |
   |-------------|--------------------------------|---------------------------------------------|
   | `MONGO_URL` | MongoDB connection string      | `mongodb://127.0.0.1:27017/expense-tracker` |
   | `PORT`      | Port the API server listens on | `5000`                                      |
   | `JWT_SECRET` | Secret used to sign login tokens (required) | a long random string |
   | `TRUST_PROXY` | Set to `1` only when running behind a reverse proxy | `1` |

   Generate a secret with:

   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```

   `.env` is git-ignored. Never commit real credentials.

4. **Start MongoDB** if it runs locally. On Windows, run this from an administrator terminal:

   ```bash
   net start MongoDB
   ```

## Running the app

### Production mode (single server)

```bash
cd frontend && npm run build
cd ../backend && npm start
```

Open http://localhost:5000.

### Development mode (live reload)

Run each command in its own terminal:

```bash
# Terminal 1: API with auto-restart
cd backend && npm run dev

# Terminal 2: React dev server
cd frontend && npm start
```

Open http://localhost:3000. The React dev server proxies `/api` requests to `http://localhost:5000` (see `"proxy"` in `frontend/package.json`). If you change `PORT`, update the proxy to match.

To point the frontend at a different API URL, set `REACT_APP_API_URL` before building, for example `REACT_APP_API_URL=https://api.example.com/api/v1/`.

## Deploying (Render + MongoDB Atlas)

The repo includes a [Render](https://render.com) blueprint (`render.yaml`) that runs the API and the built React app as one free web service.

1. **Create a database on MongoDB Atlas.**
   - Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
   - Under **Database Access**, add a database user with a password.
   - Under **Network Access**, allow access from anywhere (`0.0.0.0/0`), since Render's IP addresses change.
   - Click **Connect → Drivers** and copy the connection string. Add a database name before the `?`, for example `mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority`.
2. **Deploy on Render.**
   - In the Render dashboard, choose **New → Blueprint** and connect this GitHub repository.
   - When asked for `MONGO_URL`, paste the Atlas connection string. `JWT_SECRET` is generated for you.
   - Click **Apply**. The first build takes a few minutes; then the app is live at `https://<service-name>.onrender.com`.

Every push to `main` redeploys automatically. On the free plan the service sleeps after 15 minutes without traffic, so the first request after that takes up to a minute.

To deploy somewhere else, the same steps apply: run `npm run build` and `npm start` from the repo root, and set `MONGO_URL`, `JWT_SECRET`, `NODE_ENV=production` and, behind a reverse proxy, `TRUST_PROXY=1`. `GET /api/v1/health` returns `200` when the app and database are up.

## API reference

Base URL: `/api/v1`

### Authentication

| Method | Endpoint         | Description                                          |
|--------|------------------|------------------------------------------------------|
| POST   | `/auth/register` | Create an account (`{"name", "email", "password"}`); returns `{token, user}` |
| POST   | `/auth/login`    | Log in (`{"email", "password"}`); returns `{token, user}` |
| GET    | `/auth/me`       | The logged-in user                                   |
| GET    | `/health`        | `200` when the app and database are up (no login needed) |

All other endpoints require an `Authorization: Bearer <token>` header and only see the caller's own data. Tokens last 7 days. Passwords must be 8–72 characters. Login and register are rate-limited to 20 attempts per 15 minutes per IP.

**Existing data:** entries created before accounts were added have no owner. The first account registered adopts them.

### Transactions and budgets

| Method | Endpoint              | Description                   |
|--------|-----------------------|-------------------------------|
| GET    | `/get-incomes`        | List incomes, newest first    |
| POST   | `/add-income`         | Add an income                 |
| PUT    | `/update-income/:id`  | Update an income              |
| DELETE | `/delete-income/:id`  | Delete an income              |
| GET    | `/get-expenses`       | List expenses, newest first   |
| POST   | `/add-expense`        | Add an expense                |
| PUT    | `/update-expense/:id` | Update an expense             |
| DELETE | `/delete-expense/:id` | Delete an expense             |
| GET    | `/budgets`            | List monthly budgets          |
| PUT    | `/budgets/:category`  | Create or replace a budget (`{"amount": 300}`) |
| DELETE | `/budgets/:category`  | Remove a budget               |

Request body for the `add-*` and `update-*` endpoints:

```json
{
  "title": "Salary",
  "amount": 5000,
  "category": "salary",
  "description": "November pay",
  "date": "2026-11-01"
}
```

Validation rules:

- `title`, `amount`, `category` and `date` are required.
- `amount` must be a positive number (rounded to 2 decimal places).
- `title` can be up to 50 characters; `category` up to 30.
- `description` (the note) is optional, up to 200 characters.

Invalid input returns `400` with a `message`. A missing or invalid token returns `401`. Updating or deleting an unknown id, or one belonging to another user, returns `404`.

## Tests

The backend has an API test suite. With MongoDB running:

```bash
cd backend && npm test
```

Tests use a separate `expense-tracker-test` database (override with `MONGO_TEST_URL`), which is wiped before and after each run. They refuse to run against a database whose name does not contain "test".

## Troubleshooting

- **`DB Connection Error` on startup:** MongoDB isn't running, or `MONGO_URL` is wrong. Check that the database is reachable.
- **`MONGO_URL is not set`:** `backend/.env` is missing. Repeat step 3.
- **`JWT_SECRET is not set`:** add `JWT_SECRET` to `backend/.env` (see step 3).
- **`Port 5000 is already in use`:** another server is still running. Stop it, or set a different `PORT`.
- **Blank page at http://localhost:5000:** the frontend hasn't been built. Run `npm run build` in `frontend/`.
