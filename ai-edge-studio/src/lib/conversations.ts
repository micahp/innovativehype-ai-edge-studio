import { v4 as uuid } from 'uuid';
import { getDb } from './db';
import { Conversation, Message } from './types';

export function createConversation(title?: string, model?: string): Conversation {
  const db = getDb();
  const id = uuid();
  const stmt = db.prepare(
    'INSERT INTO conversations (id, title, model) VALUES (?, ?, ?)'
  );
  stmt.run(id, title || 'New Chat', model || 'llama.cpp');
  return getConversation(id)!;
}

export function getConversation(id: string): Conversation | undefined {
  const db = getDb();
  return db.prepare('SELECT * FROM conversations WHERE id = ?').get(id) as Conversation | undefined;
}

export function listConversations(): Conversation[] {
  const db = getDb();
  return db
    .prepare('SELECT * FROM conversations ORDER BY updated_at DESC')
    .all() as Conversation[];
}

export function updateConversationTitle(id: string, title: string) {
  const db = getDb();
  db.prepare(
    "UPDATE conversations SET title = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(title, id);
}

export function deleteConversation(id: string) {
  const db = getDb();
  db.prepare('DELETE FROM conversations WHERE id = ?').run(id);
}

export function addMessage(
  conversationId: string,
  role: 'user' | 'assistant' | 'system',
  content: string
): Message {
  const db = getDb();
  const id = uuid();
  db.prepare(
    'INSERT INTO messages (id, conversation_id, role, content) VALUES (?, ?, ?, ?)'
  ).run(id, conversationId, role, content);
  db.prepare(
    "UPDATE conversations SET updated_at = datetime('now') WHERE id = ?"
  ).run(conversationId);
  return { id, conversation_id: conversationId, role, content, created_at: new Date().toISOString() };
}

export function getMessages(conversationId: string): Message[] {
  const db = getDb();
  return db
    .prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC')
    .all(conversationId) as Message[];
}

export function getLastMessage(conversationId: string): Message | undefined {
  const db = getDb();
  return db
    .prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at DESC LIMIT 1')
    .get(conversationId) as Message | undefined;
}
