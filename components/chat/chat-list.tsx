'use client';

import { useChat } from '@/lib/chat-context';
import { Search, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import Image from 'next/image';

export function ChatList() {
  const { chats, currentChat, setCurrentChat, deleteChat } = useChat();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = useMemo(() => {
    return chats.filter(chat =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chats, searchQuery]);

  return (
    <div className="w-80 bg-background border-r border-border flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground mb-4">Messages</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border text-foreground placeholder-muted-foreground"
          />
        </div>
      </div>

      {/* Chat items */}
      <div className="flex-1 overflow-y-auto space-y-1 p-3">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8 animate-fade-in">
            <MessageSquareOff className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm">No chats found</p>
          </div>
        ) : (
          filteredChats.map((chat, index) => (
            <div
              key={chat.id}
              style={{ animationDelay: `${index * 30}ms` }}
              className={`group p-3 rounded-lg cursor-pointer transition-all duration-200 animate-fade-in ${
                currentChat?.id === chat.id
                  ? 'bg-indigo-600/20 border border-indigo-500/30'
                  : 'hover:bg-card border border-transparent hover:scale-105'
              }`}
            >
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0 overflow-hidden flex items-center justify-center">
                  {chat.avatar ? (
                    <Image src={chat.avatar} alt={chat.name} width={48} height={48} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-sm">{chat.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0" onClick={() => setCurrentChat(chat)}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground truncate">{chat.name}</h3>
                    {chat.unreadCount > 0 && (
                      <span className="text-xs font-bold bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {chat.lastMessage || 'No messages yet'}
                  </p>
                  {chat.lastMessageTime && (
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {formatTime(chat.lastMessageTime)}
                    </p>
                  )}
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1.5 text-red-400 hover:bg-red-500/10 rounded-md transition-all duration-200"
                  title="Delete chat"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function MessageSquareOff() {
  return (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12H4m16 0h-4M3 7h18M3 12h18m-7 5h4m-11 0H3" />
    </svg>
  );
}

function formatTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString();
}
