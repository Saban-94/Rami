/**
 * Automation Service
 * Business logic for automation rules execution and management
 */

import type { AutomationRule, AutomationCondition } from '@/domain/types';
import { AutomationRuleSchema, CreateAutomationRuleSchema } from '@/domain/schemas';
import { supabase } from '@/lib/supabase';

export class AutomationService {
  /**
   * Create automation rule
   */
  static async createRule(
    data: Omit<AutomationRule, 'id' | 'executionCount' | 'createdAt' | 'updatedAt'>
  ): Promise<AutomationRule> {
    const validated = CreateAutomationRuleSchema.parse(data);

    const rule: AutomationRule = {
      ...validated,
      id: crypto.randomUUID(),
      executionCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { data: created, error } = await supabase
      .from('automation_rules')
      .insert(rule)
      .select()
      .single();

    if (error) throw new Error(`Failed to create automation rule: ${error.message}`);
    return created;
  }

  /**
   * Get all rules for a business
   */
  static async getRulesByBusinessId(businessId: string): Promise<AutomationRule[]> {
    const { data, error } = await supabase
      .from('automation_rules')
      .select('*')
      .eq('businessId', businessId)
      .order('priority', { ascending: false });

    if (error) throw new Error(`Failed to fetch automation rules: ${error.message}`);
    return data || [];
  }

  /**
   * Get active rules only
   */
  static async getActiveRules(businessId: string): Promise<AutomationRule[]> {
    const { data, error } = await supabase
      .from('automation_rules')
      .select('*')
      .eq('businessId', businessId)
      .eq('isActive', true)
      .order('priority', { ascending: false });

    if (error) throw new Error(`Failed to fetch active rules: ${error.message}`);
    return data || [];
  }

  /**
   * Update rule
   */
  static async updateRule(id: string, updates: Partial<AutomationRule>): Promise<AutomationRule> {
    const { data, error } = await supabase
      .from('automation_rules')
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update automation rule: ${error.message}`);
    return data;
  }

  /**
   * Delete rule
   */
  static async deleteRule(id: string): Promise<void> {
    const { error } = await supabase.from('automation_rules').delete().eq('id', id);

    if (error) throw new Error(`Failed to delete automation rule: ${error.message}`);
  }

  /**
   * Toggle rule active state
   */
  static async toggleRule(id: string): Promise<AutomationRule> {
    const { data: rule, error: fetchError } = await supabase
      .from('automation_rules')
      .select('isActive')
      .eq('id', id)
      .single();

    if (fetchError) throw new Error(`Failed to fetch rule: ${fetchError.message}`);

    return this.updateRule(id, { isActive: !rule.isActive });
  }

  /**
   * Execute automation rule
   */
  static async executeRule(
    ruleId: string,
    context: Record<string, any>
  ): Promise<{ success: boolean; results: any[] }> {
    const { data: rule, error } = await supabase
      .from('automation_rules')
      .select('*')
      .eq('id', ruleId)
      .single();

    if (error) throw new Error(`Failed to fetch rule: ${error.message}`);
    if (!rule.isActive) throw new Error('Rule is not active');

    // Check conditions
    const conditionsMet = this.evaluateConditions(rule.conditions, context);
    if (!conditionsMet) {
      return { success: false, results: [] };
    }

    // Execute actions
    const results = [];
    for (const action of rule.actions) {
      try {
        if (action.delay && action.delay > 0) {
          await this.delay(action.delay * 1000);
        }

        const result = await this.executeAction(action, context);
        results.push({ action: action.type, success: true, result });
      } catch (error: any) {
        if (action.retryOnFailure) {
          let retries = 0;
          while (retries < action.maxRetries) {
            try {
              const result = await this.executeAction(action, context);
              results.push({ action: action.type, success: true, result, retriedAt: retries + 1 });
              break;
            } catch (retryError) {
              retries++;
              if (retries >= action.maxRetries) {
                results.push({ action: action.type, success: false, error: retryError });
              }
            }
          }
        } else {
          results.push({ action: action.type, success: false, error: error.message });
        }
      }
    }

    // Update execution count
    await this.updateRule(ruleId, {
      executionCount: rule.executionCount + 1,
      lastExecutedAt: new Date().toISOString(),
    });

    return { success: true, results };
  }

  /**
   * Evaluate conditions
   */
  private static evaluateConditions(
    conditions: AutomationCondition[],
    context: Record<string, any>
  ): boolean {
    if (conditions.length === 0) return true;

    let result = true;
    let currentOperator: 'AND' | 'OR' = 'AND';

    for (const condition of conditions) {
      const conditionResult = this.evaluateCondition(condition, context);

      if (currentOperator === 'AND') {
        result = result && conditionResult;
      } else {
        result = result || conditionResult;
      }

      currentOperator = condition.logicalOperator || 'AND';
    }

    return result;
  }

  /**
   * Evaluate single condition
   */
  private static evaluateCondition(
    condition: AutomationCondition,
    context: Record<string, any>
  ): boolean {
    const fieldValue = this.getNestedValue(context, condition.field);

    switch (condition.operator) {
      case 'equals':
        return fieldValue === condition.value;
      case 'contains':
        return String(fieldValue).includes(String(condition.value));
      case 'starts_with':
        return String(fieldValue).startsWith(String(condition.value));
      case 'greater_than':
        return Number(fieldValue) > Number(condition.value);
      case 'less_than':
        return Number(fieldValue) < Number(condition.value);
      case 'regex':
        return new RegExp(condition.value).test(String(fieldValue));
      default:
        return false;
    }
  }

  /**
   * Execute action
   */
  private static async executeAction(
    action: any,
    context: Record<string, any>
  ): Promise<any> {
    switch (action.type) {
      case 'send_message':
        return this.sendMessage(action.config, context);
      case 'create_booking':
        return this.createBooking(action.config, context);
      case 'send_email':
        return this.sendEmail(action.config, context);
      case 'update_crm':
        return this.updateCRM(action.config, context);
      case 'trigger_webhook':
        return this.triggerWebhook(action.config, context);
      case 'assign_tag':
        return this.assignTag(action.config, context);
      default:
        throw new Error(`Unknown action type: ${action.type}`);
    }
  }

  /**
   * Action implementations
   */
  private static async sendMessage(config: any, context: any): Promise<any> {
    // Implementation for sending messages
    console.log('Sending message:', config, context);
    return { sent: true };
  }

  private static async createBooking(config: any, context: any): Promise<any> {
    // Implementation for creating bookings
    console.log('Creating booking:', config, context);
    return { bookingId: crypto.randomUUID() };
  }

  private static async sendEmail(config: any, context: any): Promise<any> {
    // Implementation for sending emails
    console.log('Sending email:', config, context);
    return { sent: true };
  }

  private static async updateCRM(config: any, context: any): Promise<any> {
    // Implementation for updating CRM
    console.log('Updating CRM:', config, context);
    return { updated: true };
  }

  private static async triggerWebhook(config: any, context: any): Promise<any> {
    // Implementation for triggering webhooks
    const response = await fetch(config.url, {
      method: config.method || 'POST',
      headers: config.headers || { 'Content-Type': 'application/json' },
      body: JSON.stringify(context),
    });
    return response.json();
  }

  private static async assignTag(config: any, context: any): Promise<any> {
    // Implementation for assigning tags
    console.log('Assigning tag:', config, context);
    return { tagged: true };
  }

  /**
   * Utility functions
   */
  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  private static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
