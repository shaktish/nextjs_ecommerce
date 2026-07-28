## Overview

Hello there! 👋

This project is a production-style full-stack e-commerce application built with Next.js App Router and Express.js.

The application demonstrates modern frontend and backend development practices including:

- Server Components and Server Actions
- JWT authentication with automatic token refresh
- Next.js Backend-for-Frontend (BFF) pattern
- Redis caching
- Prisma ORM with PostgreSQL
- Dockerized local development

## Tech Stack

### Frontend

- Next.js
- TypeScript
- Tailwind CSS
- Zustand

### Backend

- Express.js
- PostgreSQL
- Prisma ORM

### Infrastructure

- Docker
- PostgreSQL (Docker Container)
- Redis (Docker Container)

## User Roles

### Admin

Admins can:

- Manage products
- Manage banners
- Mark products as featured
- Update product information

### User

Users can:

- Browse products
- Search and filter products
- View product details
- Add products to cart

## Features

### Rendering & Performance

- Server-Side Rendering (SSR)
- Incremental Static Regeneration (ISR)
- Cache invalidation using revalidateTag and revalidatePath
- Dynamic SEO metadata generation
- Image optimization
- Code splitting and lazy loading

### Authentication & Security

- JWT Authentication
- Automatic Access Token Refresh
- HTTP-only Cookie Authentication
- Backend-for-Frontend (BFF) Architecture
- Protected Routes

### Backend Features

- RESTful API with Express.js
- PostgreSQL database integration using Prisma
- Redis caching for improved performance
- Input validation and error handling

### Infrastructure

- Dockerized development environment
- PostgreSQL running in Docker containers
- Redis running in Docker containers
- Environment-based configuration

## Architecture

```text
                Browser
                   │
                   ▼
         Next.js App Router
                   │
     ┌─────────────┴─────────────┐
     ▼                           ▼
Server Components          Client Components
     │                           │
     ▼                           ▼
Server Actions              bffFetch()
     │                           │
     └─────────────┬─────────────┘
                   ▼
         BFF Route Handlers
                   │
                   ▼
            Express Backend
             │            │
             ▼            ▼
       PostgreSQL       Redis
```

## Authentication Architecture

The application authenticates requests differently depending on where the code is executed. Each execution context has a dedicated entry point while sharing the same token refresh logic through `backendClient()`.

### 1. Client Components

Used for client-side data fetching.

```text
Client Component
      │
      ▼
bffFetch()
      │
      ▼
BFF Route Handler
      │
      ▼
backendClient()
      │
      ▼
Backend API
```

Responsibilities:

- Routes all browser requests through the Next.js BFF.
- Prevents the browser from calling the backend directly.
- Automatically refreshes expired access tokens.
- Forwards updated HTTP-only cookies back to the browser.
- Redirects users to the login page when the refresh token has expired.

---

### 2. Server Components

Used for server-side data fetching (SSR).

```text
Server Component
      │
      ▼
withServerComponentAuth()
      │
      ▼
backendClient()
      │
      ▼
Backend API
```

Responsibilities:

- Executes authenticated server-side requests.
- Automatically refreshes expired access tokens.
- Redirects users to the login page when the refresh token has expired.

---

### 3. Server Actions

Used for authenticated mutations (POST, PUT, PATCH, DELETE).

```text
Server Action
      │
      ▼
withServerActionAuth()
      │
      ▼
backendClient()
      │
      ▼
Backend API
```

Responsibilities:

- Executes authenticated mutation requests.
- Automatically refreshes expired access tokens.
- Synchronizes any `Set-Cookie` headers returned by the backend with the browser.
- Redirects users to the login page when the refresh token has expired.

---

### Shared Authentication Flow

All authenticated requests eventually flow through `backendClient()`.

```text
                Client Component
                       │
                 bffFetch()
                       │
                       ▼
               BFF Route Handler
                       │
                       ├────────────────────────────┐
                       │                            │
Server Component       │                  Server Action
       │               │                         │
       ▼               │                         ▼
withServerComponentAuth()        withServerActionAuth()
               \                 /
                \               /
                 ▼             ▼
                 backendClient()
                       │
              Access token expired?
                       │
              Yes ─────┴───── No
               │               │
               ▼               ▼
      Refresh access token   Return response
               │
               ▼
      Retry original request
               │
               ▼
         Return response
```

This architecture centralizes token refresh logic inside `backendClient()`, while each execution context handles its own authentication behavior:

- **Client Components** → Uses the BFF and redirects on `AUTH_EXPIRED`.
- **Server Components** → Redirects when `RefreshTokenExpiredError` is thrown.
- **Server Actions** → Applies returned cookies and redirects when `RefreshTokenExpiredError` is thrown.

## Key Learnings

- Next.js App Router architecture
- Backend-for-Frontend (BFF) pattern
- Server Components & Server Actions
- Automatic JWT token refresh
- Cookie-based authentication
- Prisma ORM
- Redis caching
- Dockerized development
