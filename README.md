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


4. Prisma Command
# 1. Format schema
npx prisma format

# 2. Validate schema
npx prisma validate

# 3. Create and apply migration
npx prisma migrate dev --name add_user_phone

# 4. Generate Prisma Client
npx prisma generate




<!-- Cokie -->
> npm install cookie-parser
> npm install --save-dev @types/cookie-parser

## Freelancer profile API

Both endpoints require an authenticated freelancer. Send the access token in the
`accessToken` cookie or as a Bearer token.

- `GET /api/freelancer-profile` — fetch the signed-in freelancer's profile.
- `POST /api/freelancer-profile` — create the signed-in freelancer's profile.
- `PUT /api/freelancer-profile` — create or update the signed-in freelancer's profile.

The request body can include `title`, `overview`, `hourlyRate`,
`experienceLevel` (`ENTRY`, `INTERMEDIATE`, or `EXPERT`), `location`,
`portfolioUrl`, and `availability` (`AVAILABLE`, `BUSY`, or `UNAVAILABLE`).
Profile fields may be omitted to leave them unchanged; nullable fields may be
set to `null` to clear them.