1. Overall Prisma connection flow
- Node.js – Runs your backend.
- Express.js – Handles HTTP requests and API routes.
- Prisma ORM – Communicates with your database.
- MySQL – Stores your application data.
- Docker – Runs MySQL in a container.

2. Command line
> docker compose up -d (connect docker-compose.yml to docker desktop)
> npx prisma generate (Prisma reads the schema and generates TypeScript client code inside)
> npx prisma migrate dev --name init (create first migration like in laravel)
> npx prisma migrate dev --name add_user_phone

3. Package
- @prisma/client (write the prisma insteat of write raw SQL)
- prisma CLI (allow to manage database schema and migration)
- @prisma/adapter-mariadb (connect prisma client to MySQL using MariaDB driver)