'use client';

import ConversationList from '@/components/ConversationList';
import { useRouter } from 'next/navigation';

export default function ConversationsPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      <div className="h-14 border-b border-studio-800 flex items-center px-4 flex-shrink-0">
        <h2 className="text-lg font-semibold text-white">Conversation History</h2>
      </div>
      <div className="flex-1 overflow-hidden">
        <ConversationList
          activeId={null}
          onSelect={(id) => router.push(`/chat?conv=${id}`)}
          onNew={() => router.push('/chat')}
        />
      </div>
    </div>
  );
}
