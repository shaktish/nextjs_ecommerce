# Full Stack E-Commerce Application

Hello there! 👋

This is a full-stack e-commerce application built using modern web technologies and scalable architecture patterns.

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
- Access Token & Refresh Token Strategy
- HTTP-only Cookies
- Role-Based Authorization
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
┌─────────────┐
│   Next.js   │
│  Frontend   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Express   │
│   Backend   │
└──────┬──────┘
       │
 ┌─────┴─────┐
 ▼           ▼
PostgreSQL  Redis
 (Docker)  (Docker)
```

## Key Learnings

- Next.js App Router
- SSR, ISR, and caching strategies
- Express.js API development
- PostgreSQL and Prisma ORM
- Redis caching
- JWT Authentication
- Docker containerization
- Full-stack application architecture
