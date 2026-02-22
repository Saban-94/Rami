# Multi-tenant SaaS Business Studio - Architecture

## Overview
This is a robust, enterprise-grade multi-tenant SaaS platform built with Next.js 14, TypeScript, Zustand, and Supabase. The architecture follows Domain-Driven Design principles with strict separation of concerns.

## Core Architecture

### 1. Domain Layer (`src/domain/`)
Business logic completely separated from UI and infrastructure.

#### Types (`src/domain/types/`)
- Comprehensive TypeScript interfaces for all business entities
- Strong typing for tenant isolation
- Full type coverage for AI, services, automation, and CRM

#### Schemas (`src/domain/schemas/`)
- Zod validation schemas for runtime type safety
- Used for API validation, form validation, and data sanitization
- Ensures data integrity at all boundaries

#### Services (`src/domain/services/`)
- **AIPersonalityService**: AI personality configuration and knowledge base management
- **ServiceCatalogService**: Service and category CRUD operations
- **AutomationService**: Automation rule execution engine with condition evaluation

### 2. State Management (`src/store/`)
Zustand stores with persistence and real-time sync capabilities.

#### Business Store (`businessStore.ts`)
Manages:
- Current business configuration
- AI personality settings
- Service catalog
- Automation rules
- Integrations

#### Tenant Store (`tenantStore.ts`)
Manages:
- Multi-tenant workspace switching
- Tenant-level permissions
- Plan and billing status

#### Onboarding Store (`onboardingStore.ts`)
Manages:
- Multi-step onboarding flow
- Step completion tracking
- Onboarding data collection

### 3. Database Layer (Supabase)

#### Schema Design
```
tenants (workspace level)
  └── tenant_users (RBAC)
       └── businesses (business configurations)
            ├── ai_personalities (AI agent config)
            ├── service_categories
            │    └── services (catalog)
            ├── automation_rules
            ├── customers (CRM)
            │    └── bookings
            └── integrations
```

#### Security Model
- **Row Level Security (RLS)** enabled on all tables
- **Tenant Isolation**: Policies prevent cross-tenant data access
- **Role-Based Access Control**: owner, admin, member, viewer roles
- **Service Role**: Special privileges for automation execution

### 4. React Hooks (`src/hooks/`)

#### `useBusiness(businessId)`
- Fetches business data with real-time sync
- Subscribes to Supabase real-time changes
- Automatically updates Zustand store

#### `useTenant()`
- Manages tenant context
- Handles workspace switching
- Syncs tenant-level settings

## Data Flow

### Read Operations
```
Component → Hook → Zustand Store → Supabase (with RLS)
                                    ↓
                              Real-time Sync
```

### Write Operations
```
Component → Service Layer → Validation (Zod) → Supabase → Store Update
```

### Automation Execution
```
Trigger → AutomationService → Condition Evaluation → Action Execution → Logging
```

## Multi-Tenancy Implementation

### Tenant Isolation
1. All data queries filtered by `tenant_id`
2. RLS policies enforce isolation at database level
3. User-tenant relationships via `tenant_users` table

### Workspace Switching
1. User selects tenant from dropdown
2. `useTenant()` hook updates `currentTenant` in store
3. All subsequent queries automatically scoped to new tenant
4. Real-time subscriptions re-established

## Security Features

### Authentication
- Supabase Auth with JWT tokens
- Automatic token refresh
- Session persistence

### Authorization
- Row-level security policies
- Role-based access control
- Tenant isolation enforcement

### Data Protection
- Input validation with Zod schemas
- SQL injection prevention via parameterized queries
- XSS protection via sanitization

## Performance Optimizations

### Database
- Strategic indexes on foreign keys
- Composite indexes for common queries
- Query optimization via proper table relationships

### State Management
- Zustand for minimal re-renders
- Selective persistence (only critical data)
- Real-time updates without full page refresh

### Caching
- LocalStorage persistence for Zustand
- Supabase client-side caching
- Optimistic UI updates

## Scalability

### Horizontal Scaling
- Stateless architecture (no server-side sessions)
- Supabase handles database scaling
- Edge functions for compute scaling

### Vertical Scaling
- Efficient queries with proper indexing
- Lazy loading for large datasets
- Pagination for lists

## Development Workflow

### Adding a New Feature
1. Define types in `src/domain/types/`
2. Create Zod schema in `src/domain/schemas/`
3. Implement service in `src/domain/services/`
4. Create database migration with `mcp__supabase__apply_migration`
5. Update Zustand store if needed
6. Create React hook for component integration
7. Build UI components

### Testing Strategy
- Unit tests for service layer
- Integration tests for database operations
- E2E tests for critical user flows
- RLS policy testing

## Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Key Design Decisions

1. **Domain Layer Separation**: Business logic isolated from framework
2. **Zustand over Redux**: Simpler API, better TypeScript support
3. **Supabase over Custom Backend**: Built-in auth, real-time, RLS
4. **Zod Validation**: Runtime type safety at boundaries
5. **Strict TypeScript**: Compile-time safety, better DX

## Future Enhancements

- [ ] Event sourcing for audit trails
- [ ] CQRS pattern for complex queries
- [ ] GraphQL layer for flexible queries
- [ ] Microservices for heavy computation
- [ ] Redis caching layer
- [ ] Message queue for async operations

## Maintenance

### Database Migrations
Always use the Supabase migration tool:
```typescript
mcp__supabase__apply_migration({ filename, content })
```

### Backup Strategy
- Supabase automatic daily backups
- Export critical data via scheduled jobs
- Version control for schema migrations

### Monitoring
- Supabase dashboard for database metrics
- Real-time error tracking
- Performance monitoring via APM tools
