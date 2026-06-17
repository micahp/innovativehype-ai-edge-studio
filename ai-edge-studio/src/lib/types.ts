export interface Conversation {
  id: string;
  title: string;
  model: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface MediaGeneration {
  id: string;
  prompt: string;
  model: string;
  type: 'image' | 'video';
  status: 'pending' | 'running' | 'done' | 'error';
  result_url: string | null;
  error: string | null;
  created_at: string;
}

export interface LLMConfig {
  endpoint: string;
  model: string;
  temperature: number;
  max_tokens: number;
}
