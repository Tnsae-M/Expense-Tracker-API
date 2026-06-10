# Expense Tracker API

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Zod](https://img.shields.io/badge/Zod-7C3AED?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)

## Overview

Expense Tracker API is a backend-only REST API for managing users, categories, expenses, income, and monthly analytics.
It is built for secure, cookie-based JWT authentication with strong request validation and a PostgreSQL database powered by Prisma.

This API supports budget tracking workflows with filtered expense/income queries and a monthly analytics summary for authenticated users.

## Tech Stack

- **Node.js + Express**: performant server framework for REST endpoints.
- **TypeScript**: static typing and safer backend architecture.
- **Prisma + PostgreSQL**: type-safe ORM with robust database modeling.
- **Zod**: runtime validation for request data and schema inference.
- **cookie-parser + jose**: cookie-based JWT authentication for session security.
- **Helmet + express-rate-limit**: protection against common web attacks and request abuse.

### Why this stack?

This backend leverages TypeScript and Prisma because they provide a strong typed contract across the API and database layers.
Express keeps the architecture simple and extensible, while Zod makes request validation explicit and reliable.
PostgreSQL offers a scalable relational foundation for expense and income tracking.

From a product perspective, this stack supports fast iteration and stable API delivery, which is essential for a finance tool where data integrity and reliable authentication matter most.

## Folder structure

```text
expense-tracker-API/
├─ package.json
├─ readme.md
├─ tsconfig.json
├─ prisma/
│  ├─ schema.prisma
│  └─ migrations/
├─ src/
│  ├─ app.ts
│  ├─ server.ts
│  ├─ config/
│  │  └─ lib.ts
│  ├─ controllers/
│  │  ├─ analytics.controller.ts
│  │  ├─ auth.controller.ts
│  │  ├─ category.controller.ts
│  │  ├─ expense.controller.ts
│  │  ├─ income.controller.ts
│  │  └─ user.controller.ts
│  ├─ routes/
│  │  ├─ analytics.routes.ts
│  │  ├─ auth.routes.ts
│  │  ├─ category.routes.ts
│  │  ├─ expense.route.ts
│  │  ├─ income.route.ts
│  │  └─ user.routes.ts
│  ├─ schemas/
│  │  ├─ analytics.schema.ts
│  │  ├─ category.schema.ts
│  │  ├─ expense.schema.ts
│  │  ├─ income.schema.ts
│  │  ├─ profile.schema.ts
│  │  └─ user.schema.ts
│  ├─ services/
│  ├─ utils/
│  ├─ middleware/
│  └─ types/
```

## Deployment

Live API: https://expense-tracker-api-ycqe.onrender.com

Hosted on Render for easy cloud deployment and managed runtime.

## Environment Variables

The API relies on the following environment variables:

- `PORT` - Port where the API listens.
- `DATABASE_URL` - PostgreSQL connection string used by Prisma.
- `JWT_SECRET` - Secret used to sign and verify JWTs.

## API Endpoints

### Server health

- `GET /` - Server status.
- `GET /start` - Welcome message.

### Authentication (`/api/auth`)

- `POST /api/auth/register` - Register a new user.
- `POST /api/auth/login` - Login and receive a cookie-based JWT.
- `POST /api/auth/logout` - Logout and clear the auth cookie.
- `GET /api/auth/dashboard` - Protected dashboard route.

### Users (`/api/users`)

- `GET /api/users/me` - Get authenticated user's profile.
- `PATCH /api/users/me` - Update authenticated user's profile.

### Categories (`/api/categories`)

- `POST /api/categories/` - Create a new category.
- `GET /api/categories/` - Get all categories.
- `PATCH /api/categories/:id` - Update a category.
- `DELETE /api/categories/:id` - Delete a category.

### Expenses (`/api/expenses`)

- `POST /api/expenses/` - Create a new expense.
- `GET /api/expenses/` - Get expenses by filter.
- `PATCH /api/expenses/:id` - Update an expense.
- `DELETE /api/expenses/:id` - Delete an expense.

### Income (`/api/income`)

- `POST /api/income/` - Create a new income record.
- `GET /api/income/` - Get income records.
- `PATCH /api/income/:id` - Update an income record.
- `DELETE /api/income/:id` - Delete an income record.

### Analytics (`/api/analytics`)

- `GET /api/analytics/summary` - Get monthly analytics summary.

## Key Highlights

- Cookie-based JWT authentication for secure protected routes.
- Zod-powered request validation for reliable input handling.
- Monthly analytics summary and filterable expense/income endpoints.

## Lessons Learned

- **Type-safe backend design**: TypeScript and Prisma help keep controller, service, and database contracts aligned.
- **Runtime validation is essential**: Zod reduces bugs by validating external request payloads before business logic runs.
- **Production-ready security**: adding helmet, rate limiting, and cookie handling made the API more deployment-ready.

## Local Setup

```bash
npm install
npm run dev
```

Then visit `http://localhost:<PORT>`.

## Notes

This repository is backend-only and focuses on the API layer for expense tracking rather than a frontend UI.
