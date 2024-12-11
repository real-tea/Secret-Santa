'use client';

import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Users } from 'lucide-react';

export function GroupList() {
  const { groups, setCurrentGroup, currentGroup } = useStore();

  return (
    <div className="bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg border-2 border-red-200">
      <h3 className="text-lg font-semibold mb-4 text-red-700">Your Groups</h3>
      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {groups.map((group) => (
            <Button
              key={group.id}
              variant={currentGroup?.id === group.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setCurrentGroup(group)}
            >
              <Users className="h-4 w-4 mr-2" />
              {group.name}
              <span className="ml-auto text-xs text-gray-500">
                {group.friends.length}/10
              </span>
            </Button>
          ))}
          {groups.length === 0 && (
            <p className="text-sm text-gray-500 text-center">
              No groups created yet
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}