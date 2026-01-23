# Instituto Barkley - Learning Management System

## Overview

This is a Learning Management System (LMS) designed specifically for students with ADHD, implementing Russell Barkley's executive function methodology combined with Harvard's visible thinking approach. The platform serves "Instituto Barkley," offering academic programs for both youth (7th grade to 4th year of high school) and adults seeking educational validation in Chile.

The system provides a structured curriculum delivery system with weekly learning objectives, multi-format educational resources (videos, infographics, audio summaries, presentations, flashcards, quizzes), and progress tracking designed to support students with attention and executive function challenges.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS v4 with shadcn/ui component library (New York style)
- **Build Tool**: Vite with custom plugins for Replit integration

**Key Design Decisions**:
- Component library uses Radix UI primitives for accessibility
- Path aliases configured: `@/` for client source, `@shared/` for shared code
- Inter and Libre Baskerville fonts for institutional aesthetic
- CSS variables for theming with dark mode support

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **Authentication**: Replit Auth via OpenID Connect with Passport.js
- **Session Management**: PostgreSQL-backed sessions via connect-pg-simple

**Key Design Decisions**:
- Role-based access control (admin, student, tutor)
- Middleware pattern for authentication and authorization
- RESTful API structure under `/api/` prefix
- Server-side rendering support via Vite middleware in development

### Data Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for validation
- **Schema Location**: `shared/schema.ts` for shared types between client and server

**Core Data Models**:
- Levels (academic grades: 7° Básico through 4° Medio)
- Subjects and LevelSubjects (curriculum mapping)
- Learning Objectives with weekly cadence
- Weekly Resources (videos, infographics, audio, presentations, flashcards, quizzes)
- Student Progress and Weekly Completion tracking
- User Profiles with role assignments

### Authentication Flow
- Replit Auth integration using OIDC
- Session-based authentication stored in PostgreSQL
- User profiles extend auth users with role and level assignments
- Protected routes use `isAuthenticated` and `isAdmin` middleware

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migrations stored in `/migrations`

### Authentication
- **Replit Auth**: OpenID Connect provider for user authentication
- **Session Secret**: Required via `SESSION_SECRET` environment variable

### Third-Party Libraries
- **Radix UI**: Accessible component primitives
- **TanStack Query**: Server state management
- **Chart.js**: Data visualization (progress charts)
- **date-fns**: Date manipulation
- **Zod**: Runtime validation

### Development Tools
- **Vite**: Development server with HMR
- **esbuild**: Production bundling for server
- **TypeScript**: Type checking across the stack

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Secret for session encryption
- `REPL_ID`: Replit environment identifier (auto-set)
- `ISSUER_URL`: OIDC issuer URL (defaults to Replit)

## Google Drive Integration

### Automatic Resource Sync
The platform integrates with Google Drive to automatically detect and import educational resources. Admins can:
1. Connect a Google Drive folder to the platform
2. Organize resources in Drive using the folder structure: `Instituto Barkley/[Level Subject]/Módulo 1-15/[resources]`
3. Sync resources automatically to learning objectives

### Resource Type Detection
Files are automatically classified based on MIME type and filename:
- **video**: Video files (.mp4, .webm, etc.)
- **audio**: Audio files (.mp3, .wav, etc.)
- **image/infografia**: PDF and image files
- **slides/presentacion**: Google Slides, PowerPoint
- **document/resumen**: Google Docs, text files
- **form/cuestionario**: Google Forms

### Admin Routes
- `GET /api/admin/drive/folders` - List all Drive folders
- `GET /api/admin/drive/search?name=...` - Search folders by name
- `GET /api/admin/drive/folders/:id/modules` - List module subfolders
- `GET /api/admin/drive/folders/:id/resources` - Get files from a folder
- `POST /api/admin/drive/sync` - Sync resources to a learning objective

### Admin UI
- `/admin/drive-sync` - Visual interface for Drive synchronization

## Calendar & Module Access Control

### Academic Calendar
- **Program Start**: March 9, 2026
- **Module Duration**: 2 weeks each (15 modules total = 30 weeks)
- **Total Program Duration**: March 9, 2026 - October 4, 2026

### Module Schedule Calculation
The calendar system automatically calculates dates for each module:
- **Module Start**: (moduleNumber - 1) * 14 days from program start
- **Evaluation 1 Release**: First Friday of the module (day 5)
- **Evaluation 2 Release**: Second Friday of the module (day 12)
- **Module End**: 14 days after module start

### Access Control Rules
Students must meet both conditions to access a module:
1. **Date Availability**: The current date must be >= module start date
2. **Prerequisite Completion**: The previous module's Evaluation 2 must be passed

### Module Status
- **locked**: Not yet available (future date or prerequisite not met)
- **available**: Ready to access but not started
- **in_progress**: Currently active module
- **completed**: Both evaluations passed

### API Endpoints
- `GET /api/level-subjects/:id/calendar` - Get full module schedule with availability status
- `GET /api/modules/:moduleNumber/evaluations` - Get evaluation status for a module
- `POST /api/evaluations/:id/complete` - Mark an evaluation as completed

### Key Files
- `server/calendarUtils.ts` - Calendar calculation utilities
- `client/src/components/ModuleCalendar.tsx` - Calendar UI component
- `client/src/components/EvaluationTracker.tsx` - Evaluation progress tracker