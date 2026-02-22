/**
 * AI Personality Service
 * Business logic for managing AI personality configuration
 */

import type { AIPersonality, KnowledgeBaseItem } from '@/domain/types';
import { AIPersonalitySchema, CreateAIPersonalitySchema } from '@/domain/schemas';
import { supabase } from '@/lib/supabase';

export class AIPersonalityService {
  /**
   * Create a new AI personality for a business
   */
  static async create(data: Omit<AIPersonality, 'id' | 'createdAt' | 'updatedAt'>): Promise<AIPersonality> {
    const validated = CreateAIPersonalitySchema.parse(data);

    const personality: AIPersonality = {
      ...validated,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const { data: created, error } = await supabase
      .from('ai_personalities')
      .insert(personality)
      .select()
      .single();

    if (error) throw new Error(`Failed to create AI personality: ${error.message}`);
    return created;
  }

  /**
   * Get AI personality by business ID
   */
  static async getByBusinessId(businessId: string): Promise<AIPersonality | null> {
    const { data, error } = await supabase
      .from('ai_personalities')
      .select('*')
      .eq('businessId', businessId)
      .eq('isActive', true)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch AI personality: ${error.message}`);
    return data;
  }

  /**
   * Update AI personality
   */
  static async update(id: string, updates: Partial<AIPersonality>): Promise<AIPersonality> {
    const { data, error } = await supabase
      .from('ai_personalities')
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update AI personality: ${error.message}`);
    return data;
  }

  /**
   * Add knowledge base item
   */
  static async addKnowledgeItem(
    personalityId: string,
    item: Omit<KnowledgeBaseItem, 'id'>
  ): Promise<KnowledgeBaseItem> {
    const personality = await this.getById(personalityId);
    if (!personality) throw new Error('AI personality not found');

    const newItem: KnowledgeBaseItem = {
      ...item,
      id: crypto.randomUUID(),
    };

    const updatedKnowledgeBase = [...personality.knowledgeBase, newItem];

    await this.update(personalityId, { knowledgeBase: updatedKnowledgeBase });
    return newItem;
  }

  /**
   * Remove knowledge base item
   */
  static async removeKnowledgeItem(personalityId: string, itemId: string): Promise<void> {
    const personality = await this.getById(personalityId);
    if (!personality) throw new Error('AI personality not found');

    const updatedKnowledgeBase = personality.knowledgeBase.filter((item) => item.id !== itemId);
    await this.update(personalityId, { knowledgeBase: updatedKnowledgeBase });
  }

  /**
   * Generate system prompt from personality settings
   */
  static generateSystemPrompt(personality: AIPersonality, businessContext: any): string {
    const basePrompt = personality.systemPrompt;
    const instructions = personality.customInstructions.join('\n');

    return `
${basePrompt}

Business Context:
- Name: ${businessContext.name}
- Industry: ${businessContext.industry}
- Tone: ${personality.tone}
- Language: ${personality.language}

Custom Instructions:
${instructions}

Knowledge Base:
${personality.knowledgeBase.map((item) => `Q: ${item.question}\nA: ${item.answer}`).join('\n\n')}

Important Rules:
1. Always respond in ${personality.language === 'multi' ? 'the customer\'s language' : personality.language}
2. Maintain a ${personality.tone} tone
3. Use the knowledge base to answer questions accurately
4. If you don't know something, use one of the fallback responses
5. Never make up information not in the knowledge base

Greeting Message: ${personality.greetingMessage}

Fallback Responses:
${personality.fallbackResponses.join('\n')}
    `.trim();
  }

  /**
   * Search knowledge base
   */
  static async searchKnowledgeBase(
    personalityId: string,
    query: string
  ): Promise<KnowledgeBaseItem[]> {
    const personality = await this.getById(personalityId);
    if (!personality) return [];

    const lowerQuery = query.toLowerCase();
    return personality.knowledgeBase
      .filter(
        (item) =>
          item.question.toLowerCase().includes(lowerQuery) ||
          item.answer.toLowerCase().includes(lowerQuery) ||
          item.keywords.some((kw) => kw.toLowerCase().includes(lowerQuery))
      )
      .sort((a, b) => b.priority - a.priority);
  }

  /**
   * Get by ID
   */
  private static async getById(id: string): Promise<AIPersonality | null> {
    const { data, error } = await supabase
      .from('ai_personalities')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch AI personality: ${error.message}`);
    return data;
  }
}
