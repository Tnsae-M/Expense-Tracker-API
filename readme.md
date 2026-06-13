# Expense Tracker API 🚀

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Zod](https://img.shields.io/badge/Zod-7C3AED?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-Tested-729B1B?style=for-the-badge&logo=vitest&logoColor=white)]()

A highly scalable, production-ready backend engine designed to power cross-platform financial applications. Built with a focus on data integrity, fast iteration, and bulletproof security—ensuring the business logic never fails when handling user data and money.

## 🌟 Why This Project Stands Out

This project was built **API-First**, serving as a robust headless backend that can simultaneously power Web, iOS, and Android applications without requiring duplicate business logic. 

Whether you're a startup looking to scale or a business needing a reliable financial tool, this API provides the robust foundation you need.

## 🔐 Enterprise-Grade Security

Security isn't an afterthought. This API is built to protect sensitive user financial data:
- **Session Security:** Utilizes HTTP-only cookies for JWT authentication, preventing XSS attacks common with `localStorage` implementations.
- **Attack Prevention:** Secured against brute-force attacks via Rate Limiting and protected from common web vulnerabilities using `Helmet` and strict CORS configurations.
- **Payload Sanitization:** Strict runtime validation powered by **Zod** ensures that malicious or malformed data never touches the database.
- **Data Privacy:** Object destructuring and Prisma select statements guarantee sensitive fields (like hashed passwords) never leak in API responses.

## 🧪 Testing & Reliability

Clients and businesses need code that doesn't break. This API is covered by a robust test suite using **Vitest** and **Supertest**:
- **Unit Testing:** Isolated testing of core service logic (e.g., budget calculations, validations) mocking the database layer.
- **Integration Testing:** End-to-end endpoint verification guaranteeing that routing, middlewares, and database interactions work flawlessly together.

## 🛠 Tech Stack & Architecture

- **Node.js + Express**: Performant server framework for REST endpoints.
- **TypeScript**: Static typing prevents entire categories of runtime bugs, enabling safer backend architecture.
- **Prisma + PostgreSQL**: Type-safe ORM with robust relational database modeling, utilizing indexed queries (`@@index([userId])`) for high-performance data retrieval at scale.
- **Zod**: Runtime validation for request data and schema inference.

## 🚀 Deployment

- **Live API:** [https://expense-tracker-api-ycqe.onrender.com](https://expense-tracker-api-ycqe.onrender.com)
- **Interactive Documentation:** [Live Postman Collection](https://documenter.getpostman.com/view/46046797/2sBXwsKpQx)

Hosted on Render for easy cloud deployment and managed runtime.

## 💼 Core Features

- **Authentication System:** Secure registration, login, logout, and protected routes.
- **Budget & Expense Tracking:** Filterable expense and income records with date ranges, amount constraints, and pagination for high-volume data handling.
- **Monthly Analytics:** Aggregated financial summaries, burn rates, and top spending category calculations generated via efficient Prisma `$transaction` operations.

## 💡 Challenges & Lessons Learned

- **Securing Direct Object References (IDOR):** I initially only queried expenses by their `id` when updating or deleting. I realized this allowed any authenticated user to modify someone else's expense if they guessed the ID. I fixed this by ensuring `userId` is strictly checked alongside the resource `id` in all database mutations.
- **Data Privacy in Updates:** When updating a user profile, Prisma returns the entire updated object by default. I accidentally leaked the hashed password in the JSON response before catching it. I learned to use JavaScript object destructuring (`const { password, ...safeUser } = user`) to ensure sensitive fields never leave the server.
- **Predictable IDs vs Security:** I originally used auto-incrementing integers for User IDs. I realized this made it easy for attackers to guess user IDs and know exactly how many users my app has. I migrated the schema to use `UUIDs` for user identities, learning how to handle relational schema changes in Prisma.
- **Type Safety in Express Middleware:** Wrapping route handlers in a `catchAsync` function is a great pattern, but I initially typed the parameter as `Function`, which bypassed TypeScript's checks. I learned to define an explicit `asyncReqHandler` type, ensuring that I get full IDE intellisense and compile-time safety across all my controllers.
- **Database Scaling Basics:** I learned that foreign keys aren't automatically indexed in PostgreSQL. Since the API constantly filters expenses and incomes by `userId`, I added `@@index([userId])` to the Prisma schema to prevent full-table scans and ensure the queries remain fast as the database grows.

## 💻 Local Setup

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Apply database migrations
npx prisma migrate dev

# Run test suite
npm run test:unit
npm run test:integrated

# Start development server
npm run dev
```
Then visit `http://localhost:<PORT>`.

## 🤝 Let's Work Together!

I specialize in building secure, scalable, and fully tested backend systems for startups and businesses. If you need a reliable engineer to architect your next API or backend service, let's connect!

- **Email:** [Your Email Here]
- **LinkedIn:** [Your LinkedIn Profile Here]
- **Portfolio:** [Your Portfolio Website Here]
