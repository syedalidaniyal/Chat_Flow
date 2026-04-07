'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
}

export interface Chat {
  id: string;
  name: string;
  type: 'direct' | 'group';
  avatar?: string;
  members: string[];
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
}

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  createChat: (name: string, members: string[], type: 'direct' | 'group') => void;
  setCurrentChat: (chat: Chat | null) => void;
  sendMessage: (chatId: string, content: string, senderId: string, senderName: string, senderAvatar: string) => void;
  deleteChat: (chatId: string) => void;
  getMessagesByChat: (chatId: string) => Message[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    name: 'Sam Wilson',
    type: 'direct',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
    members: ['1', '2'],
    lastMessage: 'That sounds great!',
    lastMessageTime: new Date(Date.now() - 5 * 60000),
    unreadCount: 0,
  },
  {
    id: '2',
    name: 'Design Team',
    type: 'group',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DesignTeam',
    members: ['1', '2', '3', '4'],
    lastMessage: 'Check the new mockups in the design channel',
    lastMessageTime: new Date(Date.now() - 15 * 60000),
    unreadCount: 2,
  },
  {
    id: '3',
    name: 'Project Alpha',
    type: 'group',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ProjectAlpha',
    members: ['1', '2', '3'],
    lastMessage: 'Let\'s schedule a meeting for next week',
    lastMessageTime: new Date(Date.now() - 1 * 3600000),
    unreadCount: 0,
  },
];

const MOCK_MESSAGES: Message[] = [
  {
    id: '1',
    chatId: '1',
    senderId: '2',
    senderName: 'Sam Wilson',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
    content: 'Hey! How are you doing?',
    timestamp: new Date(Date.now() - 30 * 60000),
  },
  {
    id: '2',
    chatId: '1',
    senderId: '1',
    senderName: 'Alex Johnson',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    content: 'I\'m good! Just working on the new feature',
    timestamp: new Date(Date.now() - 25 * 60000),
  },
  {
    id: '3',
    chatId: '1',
    senderId: '2',
    senderName: 'Sam Wilson',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam',
    content: 'That sounds great!',
    timestamp: new Date(Date.now() - 5 * 60000),
  },
];

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);

  const createChat = useCallback((name: string, members: string[], type: 'direct' | 'group') => {
    const newChat: Chat = {
      id: (Math.max(...chats.map(c => parseInt(c.id)), 0) + 1).toString(),
      name,
      type,
      members,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      unreadCount: 0,
    };
    setChats([newChat, ...chats]);
    setCurrentChat(newChat);
  }, [chats]);

  const sendMessage = useCallback((chatId: string, content: string, senderId: string, senderName: string, senderAvatar: string) => {
    const newMessage: Message = {
      id: (Math.max(...messages.map(m => parseInt(m.id)), 0) + 1).toString(),
      chatId,
      senderId,
      senderName,
      senderAvatar,
      content,
      timestamp: new Date(),
    };
    setMessages([...messages, newMessage]);

    setChats(prev => prev.map(chat =>
      chat.id === chatId
        ? { ...chat, lastMessage: content, lastMessageTime: new Date() }
        : chat
    ));
  }, [messages]);

  const deleteChat = useCallback((chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    setMessages(prev => prev.filter(msg => msg.chatId !== chatId));
    if (currentChat?.id === chatId) {
      setCurrentChat(null);
    }
  }, [currentChat]);

  const getMessagesByChat = useCallback((chatId: string) => {
    return messages.filter(msg => msg.chatId === chatId);
  }, [messages]);

  const value: ChatContextType = {
    chats,
    currentChat,
    messages,
    createChat,
    setCurrentChat,
    sendMessage,
    deleteChat,
    getMessagesByChat,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
