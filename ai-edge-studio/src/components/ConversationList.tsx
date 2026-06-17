'use client';

import { useState, useEffect, useCallback } from 'react';

interface Conversation {
  id: string;
  title: string;
  model: string;
  updated_at: string;
  created_at: string;
}

interface Props {
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export default function ConversationList({ activeId, onSelect, onNew }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/conversations');
      const data = await res.json();
      setConversations(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load conversations', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await fetch(`/api/conversations?id=${id}`, { method: 'DELETE' });
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeId === id) onNew();
    } catch (e) {
      console.error('Failed to delete', e);
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-gray-500 text-sm">Loading...</div>
    );
  }

  return (
    <div className="overflow-y-auto h-full">
      <div className="p-3">
        <button
          onClick={onNew}
          className="w-full btn-primary mb-3 text-sm"
        >
          + New Chat
        </button>

        {conversations.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">
            No conversations yet
          </p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={`group flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer mb-1 transition-colors ${
                activeId === conv.id
                  ? 'bg-studio-900 text-white'
                  : 'text-gray-400 hover:bg-studio-900/60 hover:text-gray-200'
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{conv.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {new Date(conv.updated_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={(e) => handleDelete(e, conv.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 p-1 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
