import { apiClient } from './api-client';

export interface TemplateVariable {
  name: string;
  type: string;
  description: string;
}

export interface TemplateData {
  bot_name: string;
  project_name: string;
  agent_name: string;
  greeting_message: string;
  handover_enabled: boolean;
  multi_language: boolean;
  internet_access: boolean;
  use_knowledge_base: boolean;
  unit_conversion: boolean;
  collect_user_info: boolean;
  priority_detection: boolean;
  auto_tagging: boolean;
  use_emojis: boolean;
  tone: string;
  tone_description: string;
  humor_level: number;
  formality_level: number;
  personality_description: string;
  max_response_length: number;
  max_response_words: number;
  max_tool_calls: number;
  context_window: number;
  instructions: string;
  blocked_topics: string;
  collect_user_info_fields: string;
}

export interface GetTemplateResponse {
  template: string;
  is_custom?: boolean;
  available_variables: TemplateVariable[];
}

export interface PreviewTemplateRequest {
  agent_id: number;
  template?: string;
}

export interface PreviewTemplateResponse {
  prompt: string;
  tool_docs: string;
  template_data: TemplateData;
}

export interface ValidateTemplateResponse {
  valid: boolean;
  error?: string;
}

class BotTemplateService {
  /**
   * Get the default bot prompt template
   */
  async getDefaultTemplate(): Promise<{ template: string; available_variables: TemplateVariable[] }> {
    const response = await apiClient.get<GetTemplateResponse>('/api/admin/ai/template/default');
    return {
      template: response.data.template,
      available_variables: response.data.available_variables || [],
    };
  }

  /**
   * Get the current bot prompt template (custom or default)
   */
  async getCurrentTemplate(): Promise<{ template: string; is_custom: boolean; available_variables: TemplateVariable[] }> {
    const response = await apiClient.get<GetTemplateResponse>('/api/admin/ai/template');
    return {
      template: response.data.template,
      is_custom: response.data.is_custom || false,
      available_variables: response.data.available_variables || [],
    };
  }

  /**
   * Preview a template with AI agent data
   */
  async previewTemplate(agentId: number, template?: string): Promise<{ prompt: string; tool_docs: string; template_data: TemplateData }> {
    const response = await apiClient.post<PreviewTemplateResponse>('/api/admin/ai/template/preview', {
      agent_id: agentId,
      template,
    });
    return {
      prompt: response.data.prompt,
      tool_docs: response.data.tool_docs,
      template_data: response.data.template_data,
    };
  }

  /**
   * Validate template syntax
   */
  async validateTemplate(template: string): Promise<{ valid: boolean; error?: string }> {
    const response = await apiClient.post<ValidateTemplateResponse>('/api/admin/ai/template/validate', {
      template,
    });
    return {
      valid: response.data.valid,
      error: response.data.error,
    };
  }
}

export const botTemplateService = new BotTemplateService();
