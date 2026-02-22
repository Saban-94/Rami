# Multi-tenant SaaS Business Studio - Complete Structure

## Overview

A production-ready, enterprise-grade multi-tenant SaaS platform for business management with AI-powered automation. Built with Next.js 14, TypeScript, Zustand, and Supabase.

## Features

### Core Features
- Multi-tenant workspace management with RBAC
- AI personality configuration with knowledge base
- Dynamic service catalog with categories
- Powerful automation engine with triggers, conditions, and actions
- CRM with customer management and booking system
- Real-time sync across all data
- Secure row-level security (RLS) for complete tenant isolation

### Technical Features
- Strict TypeScript with comprehensive type definitions
- Domain-Driven Design (DDD) architecture
- Zod validation for runtime type safety
- Zustand state management with persistence
- Supabase real-time subscriptions
- Automatic database migrations
- Performance optimized with indexes

## Project Structure

```
src/
├── domain/                      # Domain Layer (Business Logic)
│   ├── types/                   # TypeScript interfaces
│   │   └── index.ts            # All domain types
│   ├── schemas/                 # Zod validation schemas
│   │   └── index.ts            # Runtime validation
│   └── services/                # Business logic services
│       ├── AIPersonalityService.ts
│       ├── ServiceCatalogService.ts
│       └── AutomationService.ts
│
├── store/                       # State Management (Zustand)
│   ├── businessStore.ts        # Business config state
│   ├── tenantStore.ts          # Multi-tenant state
│   └── onboardingStore.ts      # Onboarding flow state
│
├── hooks/                       # React Hooks
│   ├── useBusiness.ts          # Business data + real-time sync
│   └── useTenant.ts            # Tenant management
│
└── lib/                         # Infrastructure
    └── supabase.ts             # Supabase client config

Database Schema (Supabase):
├── tenants                      # Workspace level
├── tenant_users                 # User-tenant relationships (RBAC)
├── businesses                   # Business configurations
├── ai_personalities             # AI agent configurations
├── service_categories           # Service grouping
├── services                     # Service catalog
├── automation_rules             # Automation workflows
├── customers                    # CRM data
├── bookings                     # Booking management
└── integrations                 # Third-party integrations
```

## Installation

### 1. Install Dependencies

```bash
npm install zustand @supabase/supabase-js zod
```

### 2. Configure Environment

Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Apply Database Migration

The database schema has already been applied via the Supabase migration tool. You can view the schema in the Supabase dashboard.

## Usage

### Basic Setup

```typescript
// 1. Import hooks
import { useTenant } from '@/hooks/useTenant';
import { useBusiness } from '@/hooks/useBusiness';

// 2. Use in components
export default function Dashboard() {
  const { currentTenant, switchTenant } = useTenant();
  const { currentBusiness, services, automationRules } = useBusiness(businessId);

  return (
    <div>
      <h1>{currentBusiness?.name}</h1>
      <p>Services: {services.length}</p>
      <p>Active Rules: {automationRules.filter(r => r.isActive).length}</p>
    </div>
  );
}
```

### Creating Resources

```typescript
// Import domain services
import { AIPersonalityService } from '@/domain/services/AIPersonalityService';
import { ServiceCatalogService } from '@/domain/services/ServiceCatalogService';
import { AutomationService } from '@/domain/services/AutomationService';

// Create AI personality
const personality = await AIPersonalityService.create({
  businessId: 'uuid',
  name: 'My AI Assistant',
  tone: 'friendly',
  language: 'he',
  systemPrompt: 'You are a helpful assistant...',
  greetingMessage: 'Hello! How can I help?',
  // ... other fields
});

// Create service
const service = await ServiceCatalogService.createService({
  businessId: 'uuid',
  categoryId: 'uuid',
  sku: 'SERVICE-001',
  name: 'My Service',
  price: 100,
  // ... other fields
});

// Create automation
const rule = await AutomationService.createRule({
  businessId: 'uuid',
  name: 'Auto Response',
  trigger: { type: 'keyword_detected', config: { keywords: ['help'] } },
  actions: [{ type: 'send_message', config: { template: 'How can I help?' } }],
  // ... other fields
});
```

## Architecture Highlights

### 1. Domain Layer Separation
Business logic is completely isolated from UI and infrastructure:
- **Types**: Comprehensive TypeScript interfaces
- **Schemas**: Zod validation for runtime safety
- **Services**: Pure business logic with no framework dependencies

### 2. Multi-Tenancy
Complete tenant isolation at every level:
- Database: RLS policies enforce tenant boundaries
- State: Tenant context in Zustand stores
- APIs: All queries automatically filtered by tenant

### 3. Security Model
- **Row Level Security**: Database-level isolation
- **RBAC**: owner, admin, member, viewer roles
- **Validation**: Zod schemas at all boundaries
- **Type Safety**: Strict TypeScript compilation

### 4. Real-time Sync
- Supabase real-time subscriptions
- Automatic Zustand store updates
- No manual polling required

### 5. Automation Engine
Powerful workflow automation with:
- Triggers (events that start automation)
- Conditions (rules to evaluate)
- Actions (operations to execute)
- Retry logic for reliability

## Domain Types

### Core Entities
- **Tenant**: Workspace/organization
- **Business**: Individual business under a tenant
- **AIPersonality**: AI agent configuration
- **Service**: Bookable service/product
- **AutomationRule**: Workflow automation
- **Customer**: CRM contact
- **Booking**: Appointment/reservation

### AI Configuration
```typescript
interface AIPersonality {
  tone: 'professional' | 'friendly' | 'casual' | 'formal' | 'energetic';
  language: 'he' | 'en' | 'ar' | 'multi';
  systemPrompt: string;
  knowledgeBase: KnowledgeBaseItem[];
  temperature: number;
  // ... more fields
}
```

### Automation Structure
```typescript
interface AutomationRule {
  trigger: { type: TriggerType; config: any };
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  priority: number;
  // ... more fields
}
```

## State Management

### Business Store
```typescript
const store = useBusinessStore();

// Read state
const business = store.currentBusiness;
const services = store.services;

// Update state
store.updateBusiness({ name: 'New Name' });
store.addService(newService);
store.toggleAutomationRule(ruleId);
```

### Tenant Store
```typescript
const tenantStore = useTenantStore();

// Switch workspaces
tenantStore.switchTenant(tenantId);

// Access current tenant
const currentTenant = tenantStore.currentTenant;
```

## Real-time Updates

Data automatically syncs across all clients:

```typescript
// Changes made by User A
await ServiceCatalogService.createService({...});

// Instantly reflected for User B (same tenant)
// No manual refresh needed - Zustand store auto-updates
```

## Security Best Practices

1. All database operations go through RLS policies
2. Never bypass domain services for direct Supabase calls
3. Always validate with Zod schemas before writes
4. Use service role only for automation execution
5. Test RLS policies with different user roles
6. Store credentials in Supabase, never in state

## Performance Considerations

### Database
- Indexes on all foreign keys
- Composite indexes for common queries
- Efficient RLS policies

### State
- Zustand minimizes re-renders
- Selective persistence (critical data only)
- Real-time updates without polling

### Queries
- Proper select statements (avoid SELECT *)
- Pagination for large lists
- Lazy loading for detail views

## Testing Strategy

### Unit Tests
- Domain services (pure functions)
- Validation schemas
- Business logic

### Integration Tests
- Database operations
- RLS policies
- Real-time subscriptions

### E2E Tests
- User flows
- Multi-tenant isolation
- Automation execution

## Deployment

### Vercel (Recommended)
```bash
npm run build
# Deploy to Vercel
```

### Environment Variables
Ensure these are set in production:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Database
- Supabase handles all database infrastructure
- Automatic backups included
- Built-in monitoring

## Troubleshooting

### Common Issues

**RLS Policy Errors**
- Ensure user is authenticated
- Verify tenant_users relationship exists
- Check user role has proper permissions

**Type Errors**
- Run `npm run build` to catch TypeScript errors
- Ensure Zod schemas match TypeScript types
- Check for null/undefined handling

**Real-time Not Working**
- Verify Supabase connection
- Check table RLS policies allow SELECT
- Ensure proper channel subscription

## Resources

- [Architecture Documentation](./ARCHITECTURE.md)
- [Usage Examples](./USAGE_EXAMPLES.md)
- [Supabase Documentation](https://supabase.com/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Zod Documentation](https://zod.dev)

## Support

For issues or questions:
1. Check documentation first
2. Review example usage patterns
3. Test RLS policies in Supabase dashboard
4. Verify environment variables are set

## License

This is a professional SaaS template. Use according to your project needs.

---

Built with Next.js 14, TypeScript, Zustand, and Supabase
