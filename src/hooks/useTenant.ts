/**
 * Tenant Hook
 * React hook for managing multi-tenant state
 */

import { useEffect } from 'react';
import { useTenantStore } from '@/store/tenantStore';
import { supabase } from '@/lib/supabase';
import type { Tenant } from '@/domain/types';

export function useTenant() {
  const store = useTenantStore();

  useEffect(() => {
    const fetchTenants = async () => {
      store.setLoading(true);

      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          store.setLoading(false);
          return;
        }

        // Fetch user's tenants
        const { data: tenantUsers, error: tenantUsersError } = await supabase
          .from('tenant_users')
          .select('tenant_id')
          .eq('user_id', user.id);

        if (tenantUsersError) throw tenantUsersError;

        if (tenantUsers && tenantUsers.length > 0) {
          const tenantIds = tenantUsers.map((tu) => tu.tenant_id);

          const { data: tenants, error: tenantsError } = await supabase
            .from('tenants')
            .select('*')
            .in('id', tenantIds);

          if (tenantsError) throw tenantsError;

          store.setTenants(tenants as Tenant[]);

          // Set current tenant if not set
          if (!store.currentTenant && tenants && tenants.length > 0) {
            store.setCurrentTenant(tenants[0] as Tenant);
          }
        }

        store.setLoading(false);
      } catch (error: any) {
        store.setError(error.message);
        store.setLoading(false);
      }
    };

    fetchTenants();

    // Real-time subscription for tenant updates
    const channel = supabase
      .channel('tenant-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tenants' },
        (payload) => {
          if (payload.eventType === 'UPDATE' && store.currentTenant?.id === payload.new.id) {
            store.setCurrentTenant(payload.new as Tenant);
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return store;
}
