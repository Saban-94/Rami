/**
 * Core Domain Types for Multi-tenant SaaS Business Studio
 * Strict TypeScript interfaces for type safety across the application
 */

// === TENANT & BUSINESS ===

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  plan: 'trial' | 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'suspended' | 'cancelled';
  createdAt: string;
  expiresAt?: string;
  metadata: Record<string, any>;
}

export interface Business {
  id: string;
  tenantId: string;
  name: string;
  industry: string;
  subIndustry?: string;
  logo?: string;
  primaryColor: string;
  locale: 'he' | 'en' | 'ar';
  timezone: string;
  contactEmail: string;
  contactPhone: string;
  address?: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// === AI PERSONALITY ===

export interface AIPersonality {
  id: string;
  businessId: string;
  name: string;
  tone: 'professional' | 'friendly' | 'casual' | 'formal' | 'energetic';
  language: 'he' | 'en' | 'ar' | 'multi';
  systemPrompt: string;
  customInstructions: string[];
  greetingMessage: string;
  fallbackResponses: string[];
  knowledgeBase: KnowledgeBaseItem[];
  contextWindow: number;
  temperature: number;
  maxTokens: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeBaseItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  keywords: string[];
  priority: number;
  metadata?: Record<string, any>;
}

// === SERVICE CATALOG ===

export interface ServiceCategory {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export interface Service {
  id: string;
  businessId: string;
  categoryId: string;
  sku: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  currency: string;
  duration?: number; // in minutes
  isBookable: boolean;
  isActive: boolean;
  images?: string[];
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceAvailability {
  id: string;
  serviceId: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  startTime: string; // HH:mm format
  endTime: string;
  maxBookings: number;
  isActive: boolean;
}

// === AUTOMATION RULES ===

export type TriggerType =
  | 'message_received'
  | 'keyword_detected'
  | 'booking_created'
  | 'booking_cancelled'
  | 'customer_registered'
  | 'time_based'
  | 'webhook';

export type ActionType =
  | 'send_message'
  | 'create_booking'
  | 'send_email'
  | 'update_crm'
  | 'trigger_webhook'
  | 'assign_tag'
  | 'run_custom_script';

export interface AutomationRule {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  isActive: boolean;
  trigger: AutomationTrigger;
  conditions: AutomationCondition[];
  actions: AutomationAction[];
  priority: number;
  executionCount: number;
  lastExecutedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AutomationTrigger {
  type: TriggerType;
  config: Record<string, any>;
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'contains' | 'starts_with' | 'greater_than' | 'less_than' | 'regex';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface AutomationAction {
  type: ActionType;
  config: Record<string, any>;
  delay?: number; // delay in seconds before execution
  retryOnFailure: boolean;
  maxRetries: number;
}

// === CRM & CUSTOMERS ===

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  phone: string;
  email?: string;
  tags: string[];
  source: 'magic_link' | 'manual' | 'whatsapp' | 'chat' | 'import';
  totalBookings: number;
  totalSpent: number;
  lastContactAt?: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  businessId: string;
  customerId: string;
  serviceId: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  scheduledAt: string;
  duration: number;
  notes?: string;
  price: number;
  reminderSent: boolean;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// === ONBOARDING ===

export interface OnboardingState {
  tenantId: string;
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
  data: Partial<{
    businessInfo: Partial<Business>;
    aiPersonality: Partial<AIPersonality>;
    services: Partial<Service>[];
    integrations: string[];
  }>;
  isComplete: boolean;
  startedAt: string;
  completedAt?: string;
}

// === INTEGRATIONS ===

export interface Integration {
  id: string;
  businessId: string;
  type: 'whatsapp' | 'google_calendar' | 'google_drive' | 'stripe' | 'email' | 'webhook';
  name: string;
  isConnected: boolean;
  config: Record<string, any>;
  credentials?: Record<string, any>;
  lastSyncAt?: string;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// === ANALYTICS ===

export interface BusinessMetrics {
  businessId: string;
  period: 'day' | 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
  totalCustomers: number;
  newCustomers: number;
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  automationExecutions: number;
  aiInteractions: number;
  metadata: Record<string, any>;
}
