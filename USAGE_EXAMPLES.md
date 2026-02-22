# Usage Examples - Multi-tenant SaaS Business Studio

## Quick Start

### 1. Setup Environment Variables

Create `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Create a Tenant and Business

```typescript
import { supabase } from '@/lib/supabase';
import { useTenantStore } from '@/store/tenantStore';

// Create tenant
const { data: tenant } = await supabase
  .from('tenants')
  .insert({
    slug: 'my-beauty-salon',
    name: 'My Beauty Salon',
    plan: 'professional',
    status: 'active'
  })
  .select()
  .single();

// Create tenant user (owner)
await supabase
  .from('tenant_users')
  .insert({
    tenant_id: tenant.id,
    user_id: user.id,
    role: 'owner'
  });

// Create business
const { data: business } = await supabase
  .from('businesses')
  .insert({
    tenant_id: tenant.id,
    name: 'Salon Chic',
    industry: 'beauty',
    sub_industry: 'hair_salon',
    primary_color: '#ec4899',
    locale: 'he',
    contact_email: 'info@salonchic.com',
    contact_phone: '+972501234567'
  })
  .select()
  .single();
```

### 3. Configure AI Personality

```typescript
import { AIPersonalityService } from '@/domain/services/AIPersonalityService';

const personality = await AIPersonalityService.create({
  businessId: business.id,
  name: 'Salon Chic Assistant',
  tone: 'friendly',
  language: 'he',
  systemPrompt: 'You are a helpful assistant for a beauty salon...',
  customInstructions: [
    'Always greet customers warmly',
    'Mention current promotions',
    'Be knowledgeable about hair treatments'
  ],
  greetingMessage: 'היי! ברוכה הבאה לסלון שיק. איך אוכל לעזור לך היום?',
  fallbackResponses: [
    'תנו לי רגע לבדוק את זה',
    'אני מעביר את השאלה למנהלת הסלון'
  ],
  knowledgeBase: [
    {
      category: 'services',
      question: 'מה השירותים שאתם מציעים?',
      answer: 'אנחנו מציעים תספורות, צביעה, טיפולי קרטין ועוד',
      keywords: ['שירותים', 'טיפולים', 'מה יש'],
      priority: 100
    }
  ],
  contextWindow: 8000,
  temperature: 0.7,
  maxTokens: 1000,
  isActive: true
});
```

### 4. Build Service Catalog

```typescript
import { ServiceCatalogService } from '@/domain/services/ServiceCatalogService';

// Create category
const category = await ServiceCatalogService.createCategory({
  businessId: business.id,
  name: 'תספורות',
  description: 'תספורות לנשים וגברים',
  icon: 'scissors',
  order: 0,
  isActive: true
});

// Create services
const haircut = await ServiceCatalogService.createService({
  businessId: business.id,
  categoryId: category.id,
  sku: 'HAIRCUT-W',
  name: 'תספורת נשים',
  description: 'תספורת מקצועית עם עיצוב',
  price: 150,
  currency: 'ILS',
  duration: 60,
  isBookable: true,
  isActive: true,
  metadata: {}
});

const coloring = await ServiceCatalogService.createService({
  businessId: business.id,
  categoryId: category.id,
  sku: 'COLOR-FULL',
  name: 'צביעה מלאה',
  description: 'צביעת שיער מלאה עם מוצרים איכותיים',
  price: 350,
  salePrice: 299, // Sale price
  currency: 'ILS',
  duration: 120,
  isBookable: true,
  isActive: true,
  metadata: {}
});
```

### 5. Setup Automation Rules

```typescript
import { AutomationService } from '@/domain/services/AutomationService';

// Auto-respond to keywords
const autoResponse = await AutomationService.createRule({
  businessId: business.id,
  name: 'מענה אוטומטי למילת מפתח "מחירים"',
  description: 'שולח מחירון אוטומטי כשלקוח שואל על מחירים',
  isActive: true,
  trigger: {
    type: 'keyword_detected',
    config: { keywords: ['מחיר', 'מחירים', 'עלות', 'כמה זה'] }
  },
  conditions: [],
  actions: [
    {
      type: 'send_message',
      config: {
        template: 'המחירים שלנו:\n• תספורת: ₪150\n• צביעה: ₪350 (מבצע ₪299)\n• קרטין: ₪800'
      },
      retryOnFailure: false,
      maxRetries: 0
    }
  ],
  priority: 80
});

// Booking confirmation automation
const bookingConfirm = await AutomationService.createRule({
  businessId: business.id,
  name: 'אישור תור אוטומטי',
  isActive: true,
  trigger: {
    type: 'booking_created',
    config: {}
  },
  conditions: [
    { field: 'status', operator: 'equals', value: 'pending' }
  ],
  actions: [
    {
      type: 'send_message',
      config: {
        template: 'התור שלך נקבע בהצלחה! {{scheduledAt}} - {{serviceName}}'
      },
      retryOnFailure: true,
      maxRetries: 3
    },
    {
      type: 'update_crm',
      config: { field: 'lastContactAt', value: 'now()' },
      delay: 0,
      retryOnFailure: false,
      maxRetries: 0
    }
  ],
  priority: 90
});
```

## Using React Hooks

### Component with Business Data

```typescript
'use client';

import { useBusiness } from '@/hooks/useBusiness';

export default function BusinessDashboard({ businessId }: { businessId: string }) {
  const {
    currentBusiness,
    aiPersonality,
    services,
    automationRules,
    isLoading
  } = useBusiness(businessId);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>{currentBusiness?.name}</h1>

      <section>
        <h2>AI Personality</h2>
        <p>Tone: {aiPersonality?.tone}</p>
        <p>Language: {aiPersonality?.language}</p>
      </section>

      <section>
        <h2>Services ({services.length})</h2>
        {services.map(service => (
          <div key={service.id}>
            <h3>{service.name}</h3>
            <p>{service.price} {service.currency}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>Automation Rules</h2>
        {automationRules.map(rule => (
          <div key={rule.id}>
            <h3>{rule.name}</h3>
            <p>Status: {rule.isActive ? 'Active' : 'Inactive'}</p>
            <p>Executed: {rule.executionCount} times</p>
          </div>
        ))}
      </section>
    </div>
  );
}
```

### Multi-Tenant Workspace Switcher

```typescript
'use client';

import { useTenant } from '@/hooks/useTenant';

export default function TenantSwitcher() {
  const { currentTenant, tenants, switchTenant } = useTenant();

  return (
    <select
      value={currentTenant?.id}
      onChange={(e) => switchTenant(e.target.value)}
    >
      {tenants.map(tenant => (
        <option key={tenant.id} value={tenant.id}>
          {tenant.name} ({tenant.plan})
        </option>
      ))}
    </select>
  );
}
```

### Onboarding Flow

```typescript
'use client';

import { useOnboardingStore } from '@/store/onboardingStore';

export default function OnboardingWizard() {
  const {
    currentStep,
    totalSteps,
    completedSteps,
    nextStep,
    previousStep,
    completeStep,
    updateData,
    markComplete
  } = useOnboardingStore();

  const handleBusinessInfo = (data: any) => {
    updateData({ businessInfo: data });
    completeStep('business-info');
    nextStep();
  };

  return (
    <div>
      <progress value={currentStep} max={totalSteps} />

      {currentStep === 0 && <BusinessInfoStep onComplete={handleBusinessInfo} />}
      {currentStep === 1 && <AIPersonalityStep />}
      {currentStep === 2 && <ServicesStep />}
      {currentStep === 3 && <IntegrationsStep />}
      {currentStep === 4 && <ReviewStep onComplete={markComplete} />}
    </div>
  );
}
```

## Automation Execution

```typescript
// Manually trigger automation
import { AutomationService } from '@/domain/services/AutomationService';

const context = {
  customerName: 'שרה לוי',
  phone: '+972501234567',
  message: 'מה המחירים?',
  timestamp: new Date().toISOString()
};

const result = await AutomationService.executeRule(ruleId, context);

if (result.success) {
  console.log('Automation executed successfully');
  result.results.forEach(r => {
    console.log(`${r.action}: ${r.success ? 'Success' : 'Failed'}`);
  });
}
```

## Best Practices

1. **Always validate data with Zod schemas before database operations**
2. **Use domain services instead of direct Supabase calls**
3. **Leverage real-time subscriptions via hooks**
4. **Store sensitive data in Supabase, not in Zustand**
5. **Test RLS policies thoroughly**
6. **Use transactions for multi-step operations**
7. **Implement proper error handling at all layers**
8. **Cache frequently accessed data in Zustand**
9. **Use TypeScript strict mode**
10. **Follow the principle of least privilege for RLS policies**
