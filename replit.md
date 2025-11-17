# Manito-Manita Church Gift Exchange App

## Overview

This is a Secret Santa-style gift exchange application designed for church communities. The app allows participants to register for a Manito-Manita gift exchange event, receive unique PIN codes for authentication, and draw their secret gift recipient once approved by an administrator. Built with React, Express, and PostgreSQL (via Neon), the application provides both participant and admin interfaces for managing the entire gift exchange workflow.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter for client-side routing, providing a lightweight alternative to React Router.

**State Management**: TanStack Query (React Query) for server state management and caching. Local state is managed with React hooks.

**UI Component Library**: Shadcn/ui components built on Radix UI primitives, providing accessible and customizable components. The design follows Material Design principles with festive Christmas theming.

**Styling**: Tailwind CSS with custom design tokens defined in CSS variables for theming. The app uses a mobile-first approach with responsive breakpoints.

**Form Handling**: React Hook Form with Zod validation for type-safe form management and schema validation.

**Key Pages**:
- `/register` - Participant registration with form validation
- `/login` - PIN-based authentication for both participants and admin
- `/dashboard` - Participant view showing their assigned manito/manita and profile management
- `/admin` - Admin dashboard for approving participants, managing the draw, and viewing all participants

### Backend Architecture

**Framework**: Express.js with TypeScript running on Node.js.

**API Design**: RESTful API endpoints under `/api/*` prefix. All endpoints return JSON responses with consistent `success` and `message` fields.

**Database ORM**: Drizzle ORM for type-safe database queries and schema management. Provides automatic TypeScript types from database schema.

**Session Management**: The app uses PIN-based authentication stored in localStorage on the client side. No traditional session middleware is currently implemented.

**Key API Endpoints**:
- `POST /api/register` - Register new participant with auto-generated PIN
- `POST /api/login` - Authenticate with PIN
- `GET /api/admin/participants` - Get all participants (admin only)
- `POST /api/admin/approve/:pin` - Approve pending participant
- `POST /api/draw` - Draw a secret manito/manita match

**Validation**: Zod schemas shared between client and server for consistent validation. Input validation happens on both client and server sides.

### Data Storage

**Database**: PostgreSQL accessed through Neon's serverless driver with WebSocket support.

**Connection**: Uses connection pooling via `@neondatabase/serverless` with the Pool API.

**Schema Design**:

1. **participants table**: Stores participant information
   - `id` (UUID, primary key)
   - `pin` (unique 10-char string in MM-#### format)
   - `fullName`, `codename`, `gender`, `wishlist` (participant details)
   - `approved` (boolean, default false)
   - `hasDrawn` (boolean, tracks if participant has drawn)
   - `assignedToPin` (foreign key to another participant)

2. **adminSettings table**: Single-row configuration table
   - `id` (singleton primary key)
   - `drawEnabled` (boolean, controls if drawing is allowed)
   - `adminPin` (default: 'ADMIN-2025')

**Database Migrations**: Managed through Drizzle Kit with migrations stored in `/migrations` directory. Schema defined in `shared/schema.ts`.

**Design Decisions**:
- Single-table design for participants keeps the schema simple while supporting all required functionality
- PIN-based authentication removes need for password hashing and complex user management
- `assignedToPin` allows tracking of gift exchange matches while maintaining anonymity until reveal
- Singleton admin settings table provides global configuration without environmental complexity

### Authentication & Authorization

**Authentication Method**: PIN-based system where participants receive a unique PIN upon registration (format: MM-####).

**Admin Access**: Hardcoded admin PIN stored in database settings (default: 'ADMIN-2025').

**Client-side Storage**: PINs and admin status stored in localStorage for session persistence.

**Security Considerations**: 
- PINs are generated server-side to ensure uniqueness
- Admin approval required before participants can draw
- PIN format provides 10,000 possible combinations for small church groups

**Trade-offs**: This simple authentication approach prioritizes ease of use for church members over enterprise-level security. For the intended use case (trusted community, temporary event), this is appropriate.

### External Dependencies

**UI Component Libraries**:
- Radix UI primitives (@radix-ui/*) for accessible, unstyled component foundations
- shadcn/ui component patterns for consistent UI implementation
- Lucide React for icons

**Form & Validation**:
- React Hook Form for form state management
- Zod for runtime schema validation
- @hookform/resolvers for React Hook Form + Zod integration

**Database & ORM**:
- @neondatabase/serverless for PostgreSQL connection
- Drizzle ORM for type-safe queries and migrations
- ws (WebSocket library) required by Neon's serverless driver

**Development Tools**:
- Vite for fast development and optimized production builds
- TypeScript for type safety across the stack
- ESBuild for server-side bundling

**Styling & Animation**:
- Tailwind CSS for utility-first styling
- Class Variance Authority for component variant management
- date-fns for date formatting (if needed for event scheduling)

**Deployment Targets**:
- Render for backend hosting (free tier)
- Neon for PostgreSQL database (free tier)
- Static frontend served by Express in production