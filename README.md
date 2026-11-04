# Expense Tracker (MERN)

A full-stack expense tracker built with MongoDB, Express, React and Node.js. Record incomes and expenses, and see totals, your balance, recent history and a chart of both over time.

## Tech stack

- **Frontend:** React 18 (Create React App), styled-components, Chart.js, react-datepicker, axios
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
| DELETE | `/delete-income/:id`  | Delete an income              |
| GET    | `/get-expenses`       | List expenses, newest first   |
| POST   | `/add-expense`        | Add an expense                |
| DELETE | `/delete-expense/:id` | Delete an expense             |

Request body for both `add-*` endpoints:

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

- All fields are required.
- `amount` must be a positive number.
- `title` can be up to 50 characters.
- `description` can be up to 20 characters.

Invalid input returns `400` with a `message`. Deleting an unknown id returns `404`.

## Troubleshooting

- **`DB Connection Error` on startup:** MongoDB isn't running, or `MONGO_URL` is wrong. Check that the database is reachable.
- **`MONGO_URL is not set`:** `backend/.env` is missing. Repeat step 3.
- **Blank page at http://localhost:5000:** the frontend hasn't been built. Run `npm run build` in `frontend/`.
