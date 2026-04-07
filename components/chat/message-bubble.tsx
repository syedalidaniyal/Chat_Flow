'use client';

import { Message } from '@/lib/chat-context';
import Image from 'next/image';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div className={`flex gap-2 animate-fade-in ${isOwn ? 'justify-end' : 'justify-start'}`}>
      {!isOwn && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex-shrink-0 overflow-hidden flex items-center justify-center">
          {message.senderAvatar ? (
            <Image
              src={message.senderAvatar}
              alt={message.senderName}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white font-bold text-xs">
              {message.senderName.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      )}

      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {!isOwn && (
          <p className="text-xs text-muted-foreground px-2">{message.senderName}</p>
        )}
        <div className={`rounded-2xl px-4 py-2 text-sm break-words ${
          isOwn
            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none'
            : 'bg-card text-foreground rounded-bl-none'
        }`}>
          {message.content}
        </div>
        <p className="text-xs text-muted-foreground/60 px-2">
          {formatMessageTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
}

function formatMessageTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
