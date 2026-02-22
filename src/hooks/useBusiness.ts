/**
 * Business Hook
 * React hook for managing business state with Supabase real-time sync
 */

import { useEffect } from 'react';
import { useBusinessStore } from '@/store/businessStore';
import { supabase } from '@/lib/supabase';
import type { Business, AIPersonality, Service, AutomationRule } from '@/domain/types';

export function useBusiness(businessId: string) {
  const store = useBusinessStore();

  useEffect(() => {
    if (!businessId) return;

    store.setLoading(true);

    // Fetch initial business data
    const fetchBusiness = async () => {
      try {
        const { data: business, error: businessError } = await supabase
          .from('businesses')
          .select('*')
          .eq('id', businessId)
          .single();

        if (businessError) throw businessError;
        store.setCurrentBusiness(business as Business);

        // Fetch AI personality
        const { data: aiPersonality } = await supabase
          .from('ai_personalities')
          .select('*')
          .eq('business_id', businessId)
          .eq('is_active', true)
          .maybeSingle();

        if (aiPersonality) store.setAIPersonality(aiPersonality as AIPersonality);

        // Fetch services
        const { data: services } = await supabase
          .from('services')
          .select('*')
          .eq('business_id', businessId)
          .order('created_at', { ascending: false });

        if (services) store.setServices(services as Service[]);

        // Fetch service categories
        const { data: categories } = await supabase
          .from('service_categories')
          .select('*')
          .eq('business_id', businessId)
          .order('order', { ascending: true });

        if (categories) store.setServiceCategories(categories);

        // Fetch automation rules
        const { data: rules } = await supabase
          .from('automation_rules')
          .select('*')
          .eq('business_id', businessId)
          .order('priority', { ascending: false });

        if (rules) store.setAutomationRules(rules as AutomationRule[]);

        // Fetch integrations
        const { data: integrations } = await supabase
          .from('integrations')
          .select('*')
          .eq('business_id', businessId);

        if (integrations) store.setIntegrations(integrations);

        store.setLoading(false);
      } catch (error: any) {
        store.setError(error.message);
        store.setLoading(false);
      }
    };

    fetchBusiness();

    // Real-time subscriptions
    const businessChannel = supabase
      .channel(`business:${businessId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'businesses', filter: `id=eq.${businessId}` },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            store.setCurrentBusiness(payload.new as Business);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'services', filter: `business_id=eq.${businessId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            store.addService(payload.new as Service);
          } else if (payload.eventType === 'UPDATE') {
            store.updateService(payload.new.id, payload.new as Partial<Service>);
          } else if (payload.eventType === 'DELETE') {
            store.removeService(payload.old.id);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'automation_rules', filter: `business_id=eq.${businessId}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            store.addAutomationRule(payload.new as AutomationRule);
          } else if (payload.eventType === 'UPDATE') {
            store.updateAutomationRule(payload.new.id, payload.new as Partial<AutomationRule>);
          } else if (payload.eventType === 'DELETE') {
            store.removeAutomationRule(payload.old.id);
          }
        }
      )
      .subscribe();

    return () => {
      businessChannel.unsubscribe();
    };
  }, [businessId]);

  return store;
}
