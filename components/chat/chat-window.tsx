'use client';

import { useChat } from '@/lib/chat-context';
import { useAuth } from '@/lib/auth-context';
import { MessageBubble } from './message-bubble';
import { MessageInput } from './message-input';
import { Users, Phone, Video, MoreVertical } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef } from 'react';

export function ChatWindow() {
  const { currentChat, getMessagesByChat } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messages = currentChat ? getMessagesByChat(currentChat.id) : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-background to-slate-900">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">💬</span>
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-2">Select a chat</h3>
          <p className="text-muted-foreground">Choose a conversation to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-gradient-to-br from-slate-900 via-background to-slate-900">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between glass-effect">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 overflow-hidden flex items-center justify-center flex-shrink-0">
            {currentChat.avatar ? (
              <Image src={currentChat.avatar} alt={currentChat.name} width={40} height={40} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-bold text-xs">{currentChat.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-foreground">{currentChat.name}</h2>
            <p className="text-xs text-muted-foreground">
              {currentChat.type === 'group' ? `${currentChat.members.length} members` : 'Active now'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-card rounded-lg transition-colors text-muted-foreground hover:text-foreground" title="Call">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-card rounded-lg transition-colors text-muted-foreground hover:text-foreground" title="Video">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-card rounded-lg transition-colors text-muted-foreground hover:text-foreground" title="Info">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 flex flex-col scroll-smooth">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl">👋</span>
              </div>
              <p className="text-muted-foreground text-sm">No messages yet</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={message.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in">
              <MessageBubble
                message={message}
                isOwn={message.senderId === user?.id}
              />
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {user && <MessageInput chatId={currentChat.id} user={user} />}
    </div>
  );
}
