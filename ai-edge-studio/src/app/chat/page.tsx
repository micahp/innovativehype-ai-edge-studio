'use client';

import { useState, useCallback } from 'react';
import ChatInterface from '@/components/ChatInterface';
import ConversationList from '@/components/ConversationList';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default function ChatPage() {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [streamContent, setStreamContent] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);

  const loadConversation = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/conversations?id=${id}`);
      const data = await res.json();
      setConversationId(data.id);
      setMessages(data.messages || []);
      setShowSidebar(false);
    } catch (e) {
      console.error('Failed to load conversation', e);
    }
  }, []);

  const handleSend = useCallback(
    async (message: string) => {
      // Add user message optimistically
      const userMsg: Message = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: message,
      };
      setMessages((prev) => [...prev, userMsg]);
      setStreaming(true);
      setStreamContent('');

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conversationId,
            message,
            config: {
              endpoint: 'http://localhost:8080',
              model: 'gemma-2-2b-it',
              temperature: 0.7,
              max_tokens: 2048,
            },
          }),
        });

        const reader = response.body?.getReader();
        if (!reader) throw new Error('No reader');

        const decoder = new TextDecoder();
        let buffer = '';
        let newConvId = conversationId;
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            const data = trimmed.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.conversationId) {
                newConvId = parsed.conversationId;
                setConversationId(newConvId);
              }
              if (parsed.token) {
                fullContent += parsed.token;
                setStreamContent(fullContent);
              }
              if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (e: any) {
              if (e.message && !e.message.includes('JSON')) throw e;
            }
          }
        }

        // Add assistant message
        if (fullContent) {
          const assistantMsg: Message = {
            id: `temp-${Date.now()}-assistant`,
            role: 'assistant',
            content: fullContent,
          };
          setMessages((prev) => [...prev, assistantMsg]);
        }

        // Reload from server to get proper IDs
        if (newConvId) {
          try {
            const res = await fetch(`/api/conversations?id=${newConvId}`);
            const data = await res.json();
            setMessages(data.messages || []);
          } catch {}
        }
      } catch (e: any) {
        console.error('Chat error:', e);
        const errorMsg: Message = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `Error: ${e.message}. Make sure llama.cpp server is running with:\n\n\`\`\`bash\nllama-server -m models/gemma-2-2b-it.gguf --port 8080\n\`\`\``,
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setStreaming(false);
        setStreamContent('');
      }
    },
    [conversationId]
  );

  const handleNewChat = () => {
    setConversationId(null);
    setMessages([]);
    setShowSidebar(false);
  };

  return (
    <div className="flex h-full">
      {/* Conversation selector overlay on mobile */}
      {showSidebar && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-80 bg-studio-950 border-r border-studio-800 h-full">
            <div className="p-4 border-b border-studio-800 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-300">Conversations</h3>
              <button onClick={() => setShowSidebar(false)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>
            <ConversationList
              activeId={conversationId}
              onSelect={loadConversation}
              onNew={handleNewChat}
            />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setShowSidebar(false)} />
        </div>
      )}

      {/* Top bar */}
      <div className="flex-1 flex flex-col h-full">
        <div className="h-14 border-b border-studio-800 flex items-center justify-between px-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(true)}
              className="text-gray-400 hover:text-white p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-sm text-gray-400">
              {conversationId ? 'Chat' : 'New Chat'}
            </span>
          </div>
          <button onClick={handleNewChat} className="text-sm text-studio-400 hover:text-studio-300">
            + New Chat
          </button>
        </div>

        {/* Chat Interface */}
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            conversationId={conversationId}
            messages={messages}
            onSend={handleSend}
            streaming={streaming}
            streamContent={streamContent}
          />
        </div>
      </div>
    </div>
  );
}
