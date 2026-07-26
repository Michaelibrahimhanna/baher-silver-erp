# Environment Variables Specification - Baher Silver ERP

This document details all required environment variables across Development, Testing, and Production environments.

---

## 🔑 Environment Variables Matrix

| Variable | Description | Sample / Default | Environment |
|---|---|---|---|
| `NODE_ENV` | Runtime environment mode | `development` / `production` | All |
| `PORT` | API HTTP listener port | `3001` | All |
| `DATABASE_URL` | PostgreSQL connection URI | `postgresql://user:pass@host:5432/baher_silver_db` | All |
| `JWT_SECRET` | Secret token signing key | `baher_silver_secure_jwt_key_2026` | Production |
| `CORS_ORIGIN` | Allowed web origins | `http://localhost:3000` | All |

---

## 🛠️ PostgreSQL Environments Configuration

### 1. Development (`.env.development`)
```ini
NODE_ENV=development
PORT=3001
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/baher_silver_dev?schema=public"
JWT_SECRET="dev_secret_key"
```

### 2. Testing (`.env.testing`)
```ini
NODE_ENV=testing
PORT=3001
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/baher_silver_test?schema=public"
JWT_SECRET="test_secret_key"
```

### 3. Production (`.env.production`)
```ini
NODE_ENV=production
PORT=3001
DATABASE_URL="postgresql://baher_prod_user:StrongPassword@prod-db-host:5432/baher_silver_prod?schema=public&sslmode=require&connection_limit=20"
JWT_SECRET="prod_super_secure_vault_key_2026_silver"
```
