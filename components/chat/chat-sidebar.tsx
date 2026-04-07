'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, MessageSquare, Settings, Plus } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { CreateChatModal } from './create-chat-modal';

export function ChatSidebar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <>
      <div className="w-20 bg-card border-r border-border flex flex-col items-center py-4 space-y-4">
        {/* Logo */}
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg mb-4">
          CF
        </div>

        {/* Nav buttons */}
        <button className="w-12 h-12 rounded-xl flex items-center justify-center text-indigo-400 hover:bg-card-foreground/10 transition-all duration-200 group hover:shadow-lg hover:shadow-indigo-500/20" title="Messages">
          <MessageSquare className="w-6 h-6 group-hover:scale-125 transition-transform" />
        </button>

        {/* Create button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-green-400 hover:bg-green-500/10 transition-all duration-200 group hover:shadow-lg hover:shadow-green-500/20"
          title="New Chat"
        >
          <Plus className="w-6 h-6 group-hover:scale-125 transition-transform" />
        </button>

        <div className="flex-1"></div>

        {/* User avatar */}
        {user && (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden cursor-pointer group hover:ring-2 ring-indigo-400 transition-all duration-200" title={user.username}>
            {user.avatar ? (
              <Image src={user.avatar} alt={user.username} width={48} height={48} className="w-full h-full object-cover" />
            ) : (
              <span>{user.username.charAt(0).toUpperCase()}</span>
            )}
          </div>
        )}

        {/* Settings button */}
        <button className="w-12 h-12 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-card-foreground/10 transition-all duration-200 group hover:shadow-lg hover:shadow-blue-500/20" title="Settings">
          <Settings className="w-6 h-6 group-hover:scale-125 transition-transform" />
        </button>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="w-12 h-12 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-all duration-200 group hover:shadow-lg hover:shadow-red-500/20"
          title="Logout"
        >
          <LogOut className="w-6 h-6 group-hover:scale-125 transition-transform" />
        </button>
      </div>

      <CreateChatModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </>
  );
}
