/**
 * Zod Validation Schemas for Runtime Type Safety
 * Used for API validation, form validation, and data sanitization
 */

import { z } from 'zod';

// === TENANT & BUSINESS SCHEMAS ===

export const TenantSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
  name: z.string().min(2).max(100),
  plan: z.enum(['trial', 'starter', 'professional', 'enterprise']),
  status: z.enum(['active', 'suspended', 'cancelled']),
  createdAt: z.string().datetime(),
  expiresAt: z.string().datetime().optional(),
  metadata: z.record(z.any()),
});

export const BusinessSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string().uuid(),
  name: z.string().min(2).max(100),
  industry: z.string().min(2).max(50),
  subIndustry: z.string().min(2).max(50).optional(),
  logo: z.string().url().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  locale: z.enum(['he', 'en', 'ar']),
  timezone: z.string(),
  contactEmail: z.string().email(),
  contactPhone: z.string().min(10).max(15),
  address: z.string().optional(),
  metadata: z.record(z.any()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateBusinessSchema = BusinessSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true
}).partial({ metadata: true });

// === AI PERSONALITY SCHEMAS ===

export const KnowledgeBaseItemSchema = z.object({
  id: z.string().uuid(),
  category: z.string().min(2).max(50),
  question: z.string().min(5).max(500),
  answer: z.string().min(10).max(2000),
  keywords: z.array(z.string().min(2).max(50)),
  priority: z.number().int().min(0).max(100),
  metadata: z.record(z.any()).optional(),
});

export const AIPersonalitySchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  name: z.string().min(2).max(100),
  tone: z.enum(['professional', 'friendly', 'casual', 'formal', 'energetic']),
  language: z.enum(['he', 'en', 'ar', 'multi']),
  systemPrompt: z.string().min(50).max(5000),
  customInstructions: z.array(z.string().min(5).max(500)),
  greetingMessage: z.string().min(5).max(500),
  fallbackResponses: z.array(z.string().min(5).max(500)),
  knowledgeBase: z.array(KnowledgeBaseItemSchema),
  contextWindow: z.number().int().min(1000).max(128000),
  temperature: z.number().min(0).max(2),
  maxTokens: z.number().int().min(100).max(4000),
  isActive: z.boolean(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateAIPersonalitySchema = AIPersonalitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial({
  customInstructions: true,
  fallbackResponses: true,
  knowledgeBase: true,
});

// === SERVICE CATALOG SCHEMAS ===

export const ServiceCategorySchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  icon: z.string().optional(),
  order: z.number().int().min(0),
  isActive: z.boolean(),
});

export const ServiceSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  categoryId: z.string().uuid(),
  sku: z.string().min(2).max(50),
  name: z.string().min(2).max(200),
  description: z.string().min(10).max(2000),
  price: z.number().positive(),
  salePrice: z.number().positive().optional(),
  currency: z.string().length(3),
  duration: z.number().int().positive().optional(),
  isBookable: z.boolean(),
  isActive: z.boolean(),
  images: z.array(z.string().url()).optional(),
  metadata: z.record(z.any()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateServiceSchema = ServiceSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).partial({ metadata: true, images: true });

// === AUTOMATION SCHEMAS ===

export const AutomationTriggerSchema = z.object({
  type: z.enum([
    'message_received',
    'keyword_detected',
    'booking_created',
    'booking_cancelled',
    'customer_registered',
    'time_based',
    'webhook',
  ]),
  config: z.record(z.any()),
});

export const AutomationConditionSchema = z.object({
  field: z.string().min(1),
  operator: z.enum(['equals', 'contains', 'starts_with', 'greater_than', 'less_than', 'regex']),
  value: z.any(),
  logicalOperator: z.enum(['AND', 'OR']).optional(),
});

export const AutomationActionSchema = z.object({
  type: z.enum([
    'send_message',
    'create_booking',
    'send_email',
    'update_crm',
    'trigger_webhook',
    'assign_tag',
    'run_custom_script',
  ]),
  config: z.record(z.any()),
  delay: z.number().int().min(0).optional(),
  retryOnFailure: z.boolean(),
  maxRetries: z.number().int().min(0).max(5),
});

export const AutomationRuleSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  name: z.string().min(2).max(200),
  description: z.string().max(1000).optional(),
  isActive: z.boolean(),
  trigger: AutomationTriggerSchema,
  conditions: z.array(AutomationConditionSchema),
  actions: z.array(AutomationActionSchema).min(1),
  priority: z.number().int().min(0).max(100),
  executionCount: z.number().int().min(0),
  lastExecutedAt: z.string().datetime().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateAutomationRuleSchema = AutomationRuleSchema.omit({
  id: true,
  executionCount: true,
  lastExecutedAt: true,
  createdAt: true,
  updatedAt: true,
}).partial({ description: true, conditions: true, priority: true });

// === CRM SCHEMAS ===

export const CustomerSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  name: z.string().min(2).max(200),
  phone: z.string().min(10).max(15),
  email: z.string().email().optional(),
  tags: z.array(z.string().min(2).max(50)),
  source: z.enum(['magic_link', 'manual', 'whatsapp', 'chat', 'import']),
  totalBookings: z.number().int().min(0),
  totalSpent: z.number().min(0),
  lastContactAt: z.string().datetime().optional(),
  metadata: z.record(z.any()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateCustomerSchema = CustomerSchema.omit({
  id: true,
  totalBookings: true,
  totalSpent: true,
  createdAt: true,
  updatedAt: true,
}).partial({ email: true, tags: true, metadata: true });

export const BookingSchema = z.object({
  id: z.string().uuid(),
  businessId: z.string().uuid(),
  customerId: z.string().uuid(),
  serviceId: z.string().uuid(),
  status: z.enum(['pending', 'confirmed', 'completed', 'cancelled', 'no_show']),
  scheduledAt: z.string().datetime(),
  duration: z.number().int().positive(),
  notes: z.string().max(1000).optional(),
  price: z.number().positive(),
  reminderSent: z.boolean(),
  metadata: z.record(z.any()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateBookingSchema = BookingSchema.omit({
  id: true,
  reminderSent: true,
  createdAt: true,
  updatedAt: true,
}).partial({ notes: true, metadata: true });
