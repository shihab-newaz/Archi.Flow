# Local Development & Database Setup Guide

**Objective:** Isolate development data from production data.

- **Local:** Use a local Docker container (Postgres) for coding and testing
- **Production:** Use Supabase for the live application

---

## 1. Prerequisites

- Docker Desktop installed and running
- Node.js & npm installed

---

## 2. Setting up Local Postgres (Docker)

Instead of installing Postgres directly on your machine, we use `docker-compose`. Create a file named `docker-compose.yml` in your project root.

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    container_name: archfirm_local_db
    restart: always
    environment:
      POSTGRES_USER: myuser
      POSTGRES_PASSWORD: mypassword
      POSTGRES_DB: archfirm_dev
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Start the Local DB

Run this terminal command in your project root:

```bash
docker-compose up -d
```

This starts a database running at `localhost:5432`.

---

## 3. Environment Variables Strategy

We use separate `.env` files to switch between environments automatically.

### A. Local Development (`.env`)

Create/Edit your `.env` file for local development.

```bash
# .env (DO NOT COMMIT SENSITIVE VALUES IF REAL)
NODE_ENV="development"

# Connection string for Docker container
# Format: postgres://user:password@host:port/db_name
DATABASE_URL="postgresql://myuser:mypassword@localhost:5432/archfirm_dev?schema=public"

# NextAuth (Generate one via `openssl rand -base64 32`)
AUTH_SECRET="local-dev-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### B. Production (`.env.production` or Vercel Dashboard)

These variables should be set in your Vercel Project Settings, NOT in a local file (or use `.env.production` if deploying manually).

```bash
# .env.production
NODE_ENV="production"

# SUPABASE Connection strings (See Database_Design_Supabase.md)
# Use the Transaction Pooler URL (Port 6543)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Use Direct URL (Port 5432) for Migrations only (optional in CI/CD)
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

NEXTAUTH_URL="https://your-app.vercel.app"
```

---

## 4. Migration Workflow (The "Golden Rule")

### Step A: Developing Locally (Daily Work)

When you change `schema.prisma` and want to test locally:

1. Ensure `.env` points to Localhost
2. Run:

```bash
npx prisma migrate dev --name feature_name
```

**What it does:**
- Updates your local Docker DB
- Creates a new SQL migration file in `prisma/migrations`
- Regenerates the Prisma Client

### Step B: Deploying to Production (Supabase)

When you push your code to GitHub/Vercel, the production database needs to receive the changes.

#### Option 1: Manual Apply (Safest for now)

1. Temporarily swap your `.env` `DATABASE_URL` to the Supabase Connection String
2. Run:

```bash
npx prisma migrate deploy
```

(Note: `deploy` applies pending migrations but DOES NOT reset the DB like `dev` might)

#### Option 2: Vercel Build Command (Automated)

Update your "Build Command" in Vercel settings to:

```bash
npx prisma migrate deploy && next build
```

---

## 5. Seeding Dummy Data (Optional)

To make testing easier, create a seed script to populate the local DB.

### Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'admin@archfirm.com' },
    update: {},
    create: {
      email: 'admin@archfirm.com',
      name: 'Admin User',
      passwordHash: 'hashed_password_here',
      role: 'ADMIN',
    },
  })
  console.log({ user })
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
```

### Add to `package.json`:

```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

### Run:

```bash
npx prisma db seed
```

---

## Summary Checklist

1. Start Docker: `docker-compose up -d`
2. Check `.env` is pointing to `localhost:5432`
3. Run migrations: `npx prisma migrate dev`
4. Start coding: `npm run dev`