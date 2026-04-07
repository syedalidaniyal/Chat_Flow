'use client';

import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatList } from '@/components/chat/chat-list';
import { ChatWindow } from '@/components/chat/chat-window';

export default function DashboardPage() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <ChatSidebar />
      <ChatList />
      <ChatWindow />
    </div>
  );
}
