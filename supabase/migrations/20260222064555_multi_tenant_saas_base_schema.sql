/*
  # Multi-tenant SaaS Business Studio - Base Schema

  ## Overview
  Creates the foundational multi-tenant SaaS database schema with proper table order.

  ## New Tables
    1. `tenants` - Workspace/tenant management
    2. `tenant_users` - User-tenant relationships
    3. `businesses` - Business configurations
    4. `ai_personalities` - AI personality configs
    5. `service_categories` - Service grouping
    6. `services` - Service catalog
    7. `automation_rules` - Automation workflows
    8. `customers` - Customer CRM
    9. `bookings` - Booking management
    10. `integrations` - Third-party integrations

  ## Security
    - RLS enabled on all tables
    - Tenant isolation via policies
    - Role-based access control
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- TENANTS TABLE
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('trial', 'starter', 'professional', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'suspended', 'cancelled')) DEFAULT 'active',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ
);

-- TENANT USERS (must be created before tenant policies)
CREATE TABLE IF NOT EXISTS tenant_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member', 'viewer')) DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, user_id)
);

-- Enable RLS on tenants after tenant_users exists
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenants can view own tenant"
  ON tenants FOR SELECT
  TO authenticated
  USING (auth.uid()::text IN (
    SELECT user_id::text FROM tenant_users WHERE tenant_id = tenants.id
  ));

CREATE POLICY "Service role manages all tenants"
  ON tenants FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Tenant users RLS
ALTER TABLE tenant_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own memberships"
  ON tenant_users FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Owners manage memberships"
  ON tenant_users FOR ALL
  TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() AND role = 'owner'
  ))
  WITH CHECK (tenant_id IN (
    SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() AND role = 'owner'
  ));

-- BUSINESSES TABLE
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  industry TEXT NOT NULL,
  sub_industry TEXT,
  logo TEXT,
  primary_color TEXT NOT NULL DEFAULT '#3b82f6',
  locale TEXT NOT NULL CHECK (locale IN ('he', 'en', 'ar')) DEFAULT 'he',
  timezone TEXT NOT NULL DEFAULT 'Asia/Jerusalem',
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  address TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own tenant businesses"
  ON businesses FOR SELECT
  TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
  ));

CREATE POLICY "Manage own tenant businesses"
  ON businesses FOR ALL
  TO authenticated
  USING (tenant_id IN (
    SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ))
  WITH CHECK (tenant_id IN (
    SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
  ));

-- AI PERSONALITIES
CREATE TABLE IF NOT EXISTS ai_personalities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  tone TEXT NOT NULL CHECK (tone IN ('professional', 'friendly', 'casual', 'formal', 'energetic')),
  language TEXT NOT NULL CHECK (language IN ('he', 'en', 'ar', 'multi')) DEFAULT 'he',
  system_prompt TEXT NOT NULL,
  custom_instructions TEXT[] DEFAULT ARRAY[]::TEXT[],
  greeting_message TEXT NOT NULL,
  fallback_responses TEXT[] DEFAULT ARRAY[]::TEXT[],
  knowledge_base JSONB DEFAULT '[]'::jsonb,
  context_window INTEGER NOT NULL DEFAULT 8000,
  temperature NUMERIC(3,2) NOT NULL DEFAULT 0.7,
  max_tokens INTEGER NOT NULL DEFAULT 1000,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE ai_personalities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own AI personalities"
  ON ai_personalities FOR SELECT
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Manage own AI personalities"
  ON ai_personalities FOR ALL
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  ))
  WITH CHECK (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  ));

-- SERVICE CATEGORIES
CREATE TABLE IF NOT EXISTS service_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own categories"
  ON service_categories FOR SELECT
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Manage own categories"
  ON service_categories FOR ALL
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  ))
  WITH CHECK (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  ));

-- SERVICES
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  sale_price NUMERIC(10,2) CHECK (sale_price >= 0),
  currency TEXT NOT NULL DEFAULT 'ILS',
  duration INTEGER CHECK (duration > 0),
  is_bookable BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(business_id, sku)
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own services"
  ON services FOR SELECT
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Manage own services"
  ON services FOR ALL
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  ))
  WITH CHECK (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  ));

-- AUTOMATION RULES
CREATE TABLE IF NOT EXISTS automation_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  trigger JSONB NOT NULL,
  conditions JSONB DEFAULT '[]'::jsonb,
  actions JSONB NOT NULL,
  priority INTEGER NOT NULL DEFAULT 50,
  execution_count INTEGER NOT NULL DEFAULT 0,
  last_executed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own automation rules"
  ON automation_rules FOR SELECT
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Manage own automation rules"
  ON automation_rules FOR ALL
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  ))
  WITH CHECK (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  ));

-- CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  source TEXT NOT NULL CHECK (source IN ('magic_link', 'manual', 'whatsapp', 'chat', 'import')) DEFAULT 'manual',
  total_bookings INTEGER NOT NULL DEFAULT 0,
  total_spent NUMERIC(10,2) NOT NULL DEFAULT 0,
  last_contact_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(business_id, phone)
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own customers"
  ON customers FOR SELECT
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Manage own customers"
  ON customers FOR ALL
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'member')
    )
  ))
  WITH CHECK (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'member')
    )
  ));

-- BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')) DEFAULT 'pending',
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL,
  notes TEXT,
  price NUMERIC(10,2) NOT NULL,
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Manage own bookings"
  ON bookings FOR ALL
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'member')
    )
  ))
  WITH CHECK (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'member')
    )
  ));

-- INTEGRATIONS
CREATE TABLE IF NOT EXISTS integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('whatsapp', 'google_calendar', 'google_drive', 'stripe', 'email', 'webhook')),
  name TEXT NOT NULL,
  is_connected BOOLEAN NOT NULL DEFAULT false,
  config JSONB DEFAULT '{}'::jsonb,
  credentials JSONB DEFAULT '{}'::jsonb,
  last_sync_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "View own integrations"
  ON integrations FOR SELECT
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid()
    )
  ));

CREATE POLICY "Manage own integrations"
  ON integrations FOR ALL
  TO authenticated
  USING (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  ))
  WITH CHECK (business_id IN (
    SELECT id FROM businesses WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  ));

-- PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_tenant_users_tenant ON tenant_users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_users_user ON tenant_users(user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_tenant ON businesses(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ai_business ON ai_personalities(business_id);
CREATE INDEX IF NOT EXISTS idx_services_business ON services(business_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_automation_business ON automation_rules(business_id);
CREATE INDEX IF NOT EXISTS idx_customers_business ON customers(business_id);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_bookings_business ON bookings(business_id);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service ON bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_scheduled ON bookings(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_integrations_business ON integrations(business_id);

-- AUTO UPDATE TRIGGERS
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_businesses_updated BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_ai_updated BEFORE UPDATE ON ai_personalities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_services_updated BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_automation_updated BEFORE UPDATE ON automation_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_customers_updated BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_bookings_updated BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_integrations_updated BEFORE UPDATE ON integrations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
