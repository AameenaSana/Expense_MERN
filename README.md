# Expense Tracker (MERN)

A full-stack expense tracker built with MongoDB, Express, React and Node.js.

## Features

- **Dashboard:** monthly income, expenses and net savings with change vs the previous month, a 6-month income vs expenses chart, spending by category, recent transactions and a budget snapshot. Step back and forward through months.
- **Transactions:** add, edit and delete income and expenses. Search, filter by type, category and month, sort by date or amount, and export the filtered list to CSV.
- **Budgets:** set a monthly limit per expense category and track progress, with warnings near and over the limit.
- **Currency:** choose the display currency (saved in your browser).
- **Reliable by design:** validation on both client and server, clear error messages, loading and empty states, confirmation before deleting, and an API test suite.

## Tech stack

- **Frontend:** React 18 (Create React App), styled-components, Chart.js, axios
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB

## Project structure

```
backend/     Express API (routes, controllers, Mongoose models)
frontend/    React app
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

## API reference

Base URL: `/api/v1`

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

Invalid input returns `400` with a `message`. Deleting an unknown id returns `404`.

## Tests

The backend has an API test suite. With MongoDB running:

```bash
cd backend && npm test
```

Tests use a separate `expense-tracker-test` database (override with `MONGO_TEST_URL`), which is wiped before and after each run. They refuse to run against a database whose name does not contain "test".

## Troubleshooting

- **`DB Connection Error` on startup:** MongoDB isn't running, or `MONGO_URL` is wrong. Check that the database is reachable.
- **`MONGO_URL is not set`:** `backend/.env` is missing. Repeat step 3.
- **`Port 5000 is already in use`:** another server is still running. Stop it, or set a different `PORT`.
- **Blank page at http://localhost:5000:** the frontend hasn't been built. Run `npm run build` in `frontend/`.
