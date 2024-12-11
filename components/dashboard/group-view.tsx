'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Gift, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function GroupView() {
  const { currentGroup, addFriendToGroup, assignSecretSanta } = useStore();
  const [name, setName] = useState('');
  const [wishlist, setWishlist] = useState('');
  const { toast } = useToast();

  if (!currentGroup) return null;

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !wishlist.trim()) return;

    if (currentGroup.friends.length >= 10) {
      toast({
        title: "Error",
        description: "Maximum 10 friends allowed per group",
        variant: "destructive"
      });
      return;
    }

    await addFriendToGroup(currentGroup.id, {
      name,
      wishlist: wishlist.split(',').map(item => item.trim())
    });

    setName('');
    setWishlist('');
  };

  const handleAssignment = async () => {
    if (currentGroup.friends.length < 3) {
      toast({
        title: "Error",
        description: "Need at least 3 friends to make assignments",
        variant: "destructive"
      });
      return;
    }

    await assignSecretSanta(currentGroup.id);
    toast({
      title: "Success",
      description: "Secret Santa assignments have been made!"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold text-red-700">{currentGroup.name}</h3>
        {!currentGroup.isAssigned && (
          <Button
            onClick={handleAssignment}
            className="bg-red-600 hover:bg-red-700"
            disabled={currentGroup.friends.length < 3}
          >
            <Gift className="h-4 w-4 mr-2" />
            Make Assignments
          </Button>
        )}
      </div>

      {!currentGroup.isAssigned && (
        <form onSubmit={handleAddFriend} className="space-y-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Friend's name"
          />
          <Input
            value={wishlist}
            onChange={(e) => setWishlist(e.target.value)}
            placeholder="Wishlist (comma-separated)"
          />
          <Button type="submit" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Friend
          </Button>
        </form>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {currentGroup.friends.map((friend) => (
          <Card key={friend.id} className="p-4">
            <h4 className="font-semibold mb-2">{friend.name}</h4>
            <p className="text-sm text-gray-600 mb-2">Code: {friend.code}</p>
            <div className="space-y-1">
              {friend.wishlist.map((item, index) => (
                <p key={index} className="text-sm">• {item}</p>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}