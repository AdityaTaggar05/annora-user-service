
# 🧑‍💼 Annora User Service

A **production-ready User Service** for the Annora platform, built with **Node.js, TypeScript, Express, Drizzle ORM**, and designed to integrate seamlessly with a centralized **Auth Service**.

This service manages **user profiles only**. Authentication, authorization, and identity are handled externally.

---

## ✨ Features

- 🔐 JWT authentication via **JWKS (RS256)**
- 🧾 User profile management (create, fetch, update, deactivate)
- ⚡ Redis-backed rate limiting
- 🩺 Health & readiness endpoints
- 🐘 PostgreSQL with Drizzle ORM
- 🐳 Docker-friendly infrastructure

---

## 🧠 Responsibilities

This service **does not**:
- Handle passwords or emails
- Issue JWTs
- Perform login / signup auth flows

This service **does**:
- Verify JWTs
- Extract `userId` from token (`sub` claim)
- Manage user profile data

---

## 📁 Project Structure

```
src/
├── app.ts
├── server.ts
├── routes.ts
├── configs/
│   ├── database.ts
│   └── redis.ts
├── middlewares/
│   ├── auth.middleware.ts
│   ├── rate-limit.middleware.ts
│   └── error.middleware.ts
├── modules/
│   ├── user/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.service.impl.ts
│   │   ├── user.repository.ts
│   │   ├── user.repository.drizzle.ts
│   │   ├── user.schema.ts
│   │   ├── user.routes.ts
│   │   └── user.module.ts
│   └── health/
│       ├── health.controller.ts
│       ├── readiness.controller.ts
│       └── health.routes.ts
```

---

## ⚙️ Environment Setup

Create a `.env` file in the project root:

```env
NODE_ENV=production

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/annora_user

# Redis (rate limiting)
REDIS_URL=redis://localhost:6379

# Auth Service JWKS endpoint
AUTH_JWKS_URL=https://auth-service/.well-known/jwks.json
```

For local infra / E2E testing, use `.env.infra`:

```env
NODE_ENV=infra
DATABASE_URL=postgresql://test_user:test_pass@localhost:5432/annora_user_test
REDIS_URL=redis://localhost:6379
AUTH_JWKS_URL=http://localhost:4000/.well-known/jwks.json
```

---

## 🚀 Running the Service

```bash
npm install
npm run build
npm start
```

Development:

```bash
npm run dev
```

---

## 🌐 API Endpoints

---

### Create User

**POST** `/users`

**Headers**
```
Authorization: Bearer <JWT>
```

**Request**
```json
{
  "username": "parth",
  "name": "Parth",
  "age": 22
}
```

**Response – 201 (Created)**
```json
{
  "id": "user-123",
  "username": "parth",
  "name": "Parth",
  "age": 22
}
```

**Error Responses**
| Status | Response |
|------|---------|
| 400 | `{ "message": "Invalid request payload" }` |
| 401 | `{ "message": "Unauthenticated" }` |
| 409 | `{ "message": "Username already exists" }` |
| 429 | `{ "message": "Too many requests" }` |
| 500 | `{ "message": "Internal server error" }` |

---

### Get User

**GET** `/users/:id`

Behavior depends on **who is requesting**.

#### Public User View (requester ≠ target user)

**Response – 200**
```json
{
  "id": "user-123",
  "username": "parth",
  "name": "Parth",
  "age": 22,
  "avatarUrl": "https://cdn.app/avatar.png",
  "bio": "Backend engineer"
}
```

Fields like `createdAt`, `updatedAt`, and internal flags are **not exposed**.

#### Private User View (requester === target user)

**Response – 200**
```json
{
  "id": "user-123",
  "username": "parth",
  "name": "Parth",
  "age": 22,
  "avatarUrl": "https://cdn.app/avatar.png",
  "bio": "Backend engineer",
  "isActive": true,
  "createdAt": "2026-01-02T10:15:00Z",
  "updatedAt": "2026-01-05T18:30:00Z"
}
```

**Error Responses**
| Status | Response |
|------|---------|
| 401 | `{ "message": "Unauthenticated" }` |
| 404 | `{ "message": "User not found" }` |
| 500 | `{ "message": "Internal server error" }` |

---

### Update User

**PUT** `/users/:id`

Only the **owner of the profile** may update it.

**Headers**
```
Authorization: Bearer <JWT>
```

**Request**
```json
{
  "name": "Parth Taggar",
  "bio": "Backend Engineer"
}
```

**Response – 200**
```json
{
  "id": "user-123",
  "username": "parth",
  "name": "Parth Taggar",
  "bio": "Backend Engineer",
  "age": 22
}
```

**Error Responses**
| Status | Response |
|------|---------|
| 400 | `{ "message": "Invalid request payload" }` |
| 401 | `{ "message": "Unauthenticated" }` |
| 403 | `{ "message": "Forbidden" }` |
| 404 | `{ "message": "User not found" }` |
| 500 | `{ "message": "Internal server error" }` |

---

### Deactivate User

**DELETE** `/users/:id`

Soft-deletes (deactivates) a user. Only the owner may perform this action.

**Headers**
```
Authorization: Bearer <JWT>
```

**Response – 204**
```
No Content
```

**Error Responses**
| Status | Response |
|------|---------|
| 401 | `{ "message": "Unauthenticated" }` |
| 403 | `{ "message": "Forbidden" }` |
| 404 | `{ "message": "User not found" }` |
| 500 | `{ "message": "Internal server error" }` |

---

### Health Check

**GET** `/health`

Used for liveness checks.

```json
{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": "2026-01-02T12:00:00Z"
}
```

---

### Readiness Check

**GET** `/ready`

Used for dependency readiness checks.

**Healthy**
```json
{
  "status": "ready"
}
```

**Unhealthy**
```json
{
  "status": "not_ready",
  "reason": "database_unreachable"
}
```

---

## 🔒 Security Notes

- JWT verification only (no token issuance)
- Strict request validation
- Redis-backed rate limiting
- No sensitive data leaked in errors or logs

---

## 🏁 License

MIT
