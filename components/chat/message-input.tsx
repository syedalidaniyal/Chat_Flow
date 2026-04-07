'use client';

import { useState } from 'react';
import { useChat } from '@/lib/chat-context';
import { User } from '@/lib/auth-context';
import { Send, Paperclip, Smile } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MessageInputProps {
  chatId: string;
  user: User;
}

export function MessageInput({ chatId, user }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const { sendMessage } = useChat();

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(chatId, message, user.id, user.username, user.avatar);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-border glass-effect">
      <div className="flex gap-2 items-end">
        {/* Attachment button */}
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-card rounded-lg transition-all duration-200" title="Attach file">
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Input */}
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pr-10 bg-card border-border text-foreground placeholder-muted-foreground rounded-2xl"
          />
        </div>

        {/* Emoji button */}
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-card rounded-lg transition-all duration-200" title="Emoji">
          <Smile className="w-5 h-5" />
        </button>

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim()}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white disabled:opacity-50 p-2 rounded-lg transition-all duration-200"
          size="icon"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
