'use client';

import { useState } from 'react';
import { useChat } from '@/lib/chat-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';

interface CreateChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AVAILABLE_USERS = [
  { id: '2', name: 'Sam Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sam' },
  { id: '3', name: 'Jordan Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan' },
  { id: '4', name: 'Casey Martinez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey' },
];

export function CreateChatModal({ open, onOpenChange }: CreateChatModalProps) {
  const [tab, setTab] = useState<'direct' | 'group'>('direct');
  const [chatName, setChatName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { createChat } = useChat();

  const handleCreateDirect = (userId: string) => {
    const user = AVAILABLE_USERS.find(u => u.id === userId);
    if (user) {
      createChat(user.name, ['1', userId], 'direct');
      onOpenChange(false);
      resetForm();
    }
  };

  const handleCreateGroup = () => {
    if (chatName.trim() && selectedUsers.length > 0) {
      createChat(chatName, ['1', ...selectedUsers], 'group');
      onOpenChange(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setChatName('');
    setSelectedUsers([]);
    setSearchQuery('');
  };

  const filteredUsers = AVAILABLE_USERS.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Start a new chat</DialogTitle>
          <DialogDescription>Create a direct message or group chat with other users</DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as 'direct' | 'group')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-background/50">
            <TabsTrigger value="direct">Direct Message</TabsTrigger>
            <TabsTrigger value="group">Group Chat</TabsTrigger>
          </TabsList>

          {/* Direct message tab */}
          <TabsContent value="direct" className="space-y-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredUsers.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleCreateDirect(user.id)}
                  className="w-full p-3 rounded-lg bg-background hover:bg-background/80 transition-colors text-left flex items-center gap-3 border border-border/50"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-foreground font-medium">{user.name}</span>
                </button>
              ))}
            </div>
          </TabsContent>

          {/* Group chat tab */}
          <TabsContent value="group" className="space-y-4 mt-4">
            <Input
              placeholder="Group name"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              className="bg-background border-border text-foreground"
            />

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border text-foreground"
              />
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {filteredUsers.map(user => (
                <label
                  key={user.id}
                  className="p-3 rounded-lg bg-background hover:bg-background/80 transition-colors flex items-center gap-3 border border-border/50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user.id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                      }
                    }}
                    className="w-4 h-4 rounded border-border cursor-pointer accent-indigo-600"
                  />
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-foreground font-medium text-sm">{user.name}</span>
                </label>
              ))}
            </div>

            {selectedUsers.length > 0 && (
              <div className="p-2 bg-background/50 rounded-lg text-xs text-muted-foreground">
                {selectedUsers.length} selected
              </div>
            )}

            <Button
              onClick={handleCreateGroup}
              disabled={!chatName.trim() || selectedUsers.length === 0}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white disabled:opacity-50"
            >
              Create Group
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
