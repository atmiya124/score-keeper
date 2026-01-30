# ScoreBoard.live

## Overview

A real-time sports scoreboard application for tracking live match scores. The system provides a public-facing live score display and an admin interface for managing matches, updating scores, and controlling game timers. Built as a full-stack TypeScript application with React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (React Query) for server state with automatic polling for live updates
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Build Tool**: Vite with path aliases (`@/` for client src, `@shared/` for shared code)

### Backend Architecture
- **Framework**: Express 5 on Node.js with TypeScript
- **API Design**: RESTful JSON API with Zod validation
- **Route Structure**: Centralized route definitions in `shared/routes.ts` with typed inputs/outputs

### Data Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with Zod schema generation via `drizzle-zod`
- **Schema Location**: `shared/schema.ts` (shared between frontend and backend)
- **Migrations**: Drizzle Kit (`drizzle-kit push` for schema sync)

### Key Design Patterns
- **Shared Schema**: Database types and validation schemas are defined once in `shared/` and used by both frontend and backend
- **Storage Abstraction**: `IStorage` interface in `server/storage.ts` abstracts database operations
- **API Contract**: Route definitions in `shared/routes.ts` define method, path, input schema, and response types
- **Real-time Updates**: Frontend polls API endpoints at 2-5 second intervals for live score updates

### Build System
- **Development**: Vite dev server with HMR, proxied through Express
- **Production**: esbuild bundles server code, Vite builds client to `dist/public`
- **Custom Build Script**: `script/build.ts` handles bundling with selective dependency bundling for cold start optimization

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **connect-pg-simple**: Session store support (available but not actively used)

### UI Components
- **Radix UI**: Headless component primitives (dialog, dropdown, tabs, etc.)
- **shadcn/ui**: Pre-styled component library built on Radix
- **Lucide React**: Icon library
- **Framer Motion**: Animation library for score card effects

### Development Tools
- **Replit Plugins**: Runtime error overlay, cartographer, dev banner for Replit environment
- **TypeScript**: Strict mode enabled with bundler module resolution