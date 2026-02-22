/**
 * Service Catalog Service
 * Business logic for managing services and categories
 */

import type { Service, ServiceCategory } from '@/domain/types';
import { ServiceSchema, ServiceCategorySchema, CreateServiceSchema } from '@/domain/schemas';
import { supabase } from '@/lib/supabase';

export class ServiceCatalogService {
  /**
   * Create a new service
   */
  static async createService(data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> {
    const validated = CreateServiceSchema.parse(data);

    const service: Service = {
      ...validated,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { data: created, error } = await supabase
      .from('services')
      .insert(service)
      .select()
      .single();

    if (error) throw new Error(`Failed to create service: ${error.message}`);
    return created;
  }

  /**
   * Get all services for a business
   */
  static async getServicesByBusinessId(businessId: string): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('businessId', businessId)
      .order('createdAt', { ascending: false });

    if (error) throw new Error(`Failed to fetch services: ${error.message}`);
    return data || [];
  }

  /**
   * Get active services only
   */
  static async getActiveServices(businessId: string): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('businessId', businessId)
      .eq('isActive', true)
      .order('name', { ascending: true });

    if (error) throw new Error(`Failed to fetch active services: ${error.message}`);
    return data || [];
  }

  /**
   * Get services by category
   */
  static async getServicesByCategory(categoryId: string): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('categoryId', categoryId)
      .eq('isActive', true)
      .order('name', { ascending: true });

    if (error) throw new Error(`Failed to fetch services by category: ${error.message}`);
    return data || [];
  }

  /**
   * Update service
   */
  static async updateService(id: string, updates: Partial<Service>): Promise<Service> {
    const { data, error } = await supabase
      .from('services')
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update service: ${error.message}`);
    return data;
  }

  /**
   * Delete service
   */
  static async deleteService(id: string): Promise<void> {
    const { error } = await supabase.from('services').delete().eq('id', id);

    if (error) throw new Error(`Failed to delete service: ${error.message}`);
  }

  /**
   * Create service category
   */
  static async createCategory(
    data: Omit<ServiceCategory, 'id'>
  ): Promise<ServiceCategory> {
    const category: ServiceCategory = {
      ...data,
      id: crypto.randomUUID(),
    };

    const { data: created, error } = await supabase
      .from('service_categories')
      .insert(category)
      .select()
      .single();

    if (error) throw new Error(`Failed to create category: ${error.message}`);
    return created;
  }

  /**
   * Get all categories for a business
   */
  static async getCategoriesByBusinessId(businessId: string): Promise<ServiceCategory[]> {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('businessId', businessId)
      .order('order', { ascending: true });

    if (error) throw new Error(`Failed to fetch categories: ${error.message}`);
    return data || [];
  }

  /**
   * Update category
   */
  static async updateCategory(
    id: string,
    updates: Partial<ServiceCategory>
  ): Promise<ServiceCategory> {
    const { data, error } = await supabase
      .from('service_categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update category: ${error.message}`);
    return data;
  }

  /**
   * Delete category
   */
  static async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase.from('service_categories').delete().eq('id', id);

    if (error) throw new Error(`Failed to delete category: ${error.message}`);
  }

  /**
   * Reorder categories
   */
  static async reorderCategories(categoryIds: string[]): Promise<void> {
    const updates = categoryIds.map((id, index) => ({
      id,
      order: index,
    }));

    for (const update of updates) {
      await this.updateCategory(update.id, { order: update.order });
    }
  }

  /**
   * Calculate service metrics
   */
  static async getServiceMetrics(serviceId: string): Promise<{
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
  }> {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('price, status')
      .eq('serviceId', serviceId)
      .eq('status', 'completed');

    if (error) throw new Error(`Failed to fetch service metrics: ${error.message}`);

    const totalBookings = bookings?.length || 0;
    const totalRevenue = bookings?.reduce((sum, b) => sum + b.price, 0) || 0;

    return {
      totalBookings,
      totalRevenue,
      averageRating: 0, // Placeholder for future rating system
    };
  }

  /**
   * Search services
   */
  static async searchServices(businessId: string, query: string): Promise<Service[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('businessId', businessId)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%,sku.ilike.%${query}%`)
      .eq('isActive', true);

    if (error) throw new Error(`Failed to search services: ${error.message}`);
    return data || [];
  }
}
