# Expense Tracker API

## Base Routes

- `GET /` - Server status
- `GET /start` - Welcome message

## Authentication

Base path: `/api/auth`

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user
- `POST /api/auth/logout` - Logout user

## Users

Base path: `/api/users`

- `GET /api/users/me` - Get current user profile (protected)
- `PATCH /api/users/me` - Update current user profile (protected)

## Categories

Base path: `/api/categories`

- `POST /api/categories/` - Create a new category (protected)
- `GET /api/categories/` - Get all categories (protected)
- `PATCH /api/categories/:id` - Update category by ID (protected)
- `DELETE /api/categories/:id` - Delete category by ID (protected)

## Expenses

Base path: `/api/expenses`

- `POST /api/expenses/` - Create a new expense (protected)
- `GET /api/expenses/` - Get expenses by filter (protected)
- `PATCH /api/expenses/:id` - Update expense by ID (protected)
- `DELETE /api/expenses/:id` - Delete expense by ID (protected)

## Income

Base path: `/api/income`

- `POST /api/income/` - Create a new income record (protected)
- `GET /api/income/` - Get income records (protected)
- `PATCH /api/income/:id` - Update income record by ID (protected)
- `DELETE /api/income/:id` - Delete income record by ID (protected)

## Analytics

Base path: `/api/analytics`

- `GET /api/analytics/summary` - Get monthly analytics summary (protected)
