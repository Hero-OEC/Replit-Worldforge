# WorldForge - Creative Writing Management System

## Overview

WorldForge is a comprehensive creative writing management system built as a full-stack web application. It provides writers with tools to organize and manage their creative projects, including character development, world-building, timeline management, and lore documentation. The application is designed to help writers maintain consistency and organization across complex creative works.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **UI Components**: Radix UI primitives with custom styling
- **Styling**: Tailwind CSS with custom design system
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Style**: RESTful API endpoints
- **Development Server**: Custom Vite integration for hot reloading

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for database schema management
- **Schema Location**: Shared between client and server for type consistency

## Key Components

### Database Schema
The application manages several core entities:
- **Projects**: Main creative writing projects with metadata
- **Characters**: Character profiles with appearance, personality, and backstory
- **Locations**: World locations with geographical and cultural information
- **Timeline Events**: Chronological story events with categorization
- **Magic Systems**: Magical rule systems (referenced but not fully implemented)
- **Lore Entries**: Historical and cultural documentation (referenced but not fully implemented)

### API Endpoints
- `GET/POST /api/projects` - Project management
- `GET/POST/PUT/DELETE /api/projects/:id` - Individual project operations
- Character, location, timeline, magic system, and lore endpoints (partially implemented)

### UI Components
- **Layout Components**: Sidebar navigation, header with search functionality
- **Page Components**: Dashboard, timeline, characters, locations, magic systems, lore
- **Shared Components**: Project cards, stats cards, dialogs, forms
- **UI Kit**: Comprehensive set of reusable components based on Radix UI

## Data Flow

1. **Client Requests**: React components use React Query to fetch data from API endpoints
2. **API Processing**: Express.js routes handle requests and interact with the database
3. **Database Operations**: Drizzle ORM performs type-safe database queries
4. **Response Handling**: Data is returned to the client and cached by React Query
5. **UI Updates**: Components re-render with updated data automatically

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon Database connectivity
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **react-hook-form**: Form handling and validation
- **zod**: Runtime type validation
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript bundler for production
- **vite**: Build tool and development server
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20, Web, and PostgreSQL 16 modules
- **Command**: `npm run dev` starts both frontend and backend in development mode
- **Port**: Application runs on port 5000 with auto-reload capabilities

### Production Build
- **Build Process**: Vite builds the frontend, esbuild bundles the backend
- **Deployment Target**: Autoscale deployment on Replit
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`

### Database Configuration
- **Connection**: Uses DATABASE_URL environment variable
- **Migration**: `npm run db:push` applies schema changes
- **Provider**: Neon Database for serverless PostgreSQL

## Changelog

```
Changelog:
- January 23, 2025. Added character-specific timeline feature:
  * Created reusable SerpentineTimeline component for displaying timeline events
  * Added timeline tab to character detail page showing events where character appears
  * Implemented serpentine timeline layout with proper event filtering
  * Timeline shows character appearances chronologically with event details
  * Added event importance indicators and category icons
- June 24, 2025. Implemented comprehensive Cairo font system:
  * Created custom typography system with semantic font classes
  * Applied Cairo font across all components and pages
  * Added proper font loading with fallbacks and performance optimization
  * Updated all headings, body text, buttons, and UI components
  * Ensured consistent typography hierarchy throughout the application
- June 23, 2025. Initial setup
- June 23, 2025. Implemented unified navbar system:
  * Replaced multiple header/navbar components with single Navbar component
  * Added conditional project navigation (shows only on project pages)
  * Updated all routes to follow /project/:projectId/[page-name] pattern
  * Removed deprecated Header component
  * All pages now use unified navigation with proper props
- January 23, 2025. Successfully migrated to Replit environment:
  * Fixed runtime error in project-layout.tsx with null safety checks
  * Verified all dependencies are properly installed and working
  * Application running correctly on port 5000 with Vite hot reloading
  * Memory storage layer functioning with sample data for testing
  * Fixed background color consistency across all pages (locations, lore, notes now match characters/timeline)
  * Removed redundant search inputs from page headers (search functionality moved to navbar)
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```