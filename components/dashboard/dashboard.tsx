'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { GroupList } from './group-list';
import { NewGroupForm } from './new-group-form';
import { GroupView } from './group-view';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

export function Dashboard() {
  const { loadGroups, currentGroup, user, reset } = useStore();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadGroups().catch((error) => {
        toast({
          title: "Error",
          description: "Failed to load groups",
          variant: "destructive"
        });
      });
    }
  }, [user, loadGroups, toast]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      reset(); // Clear the store state
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-red-700">
          Welcome, {user?.email}
        </h2>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="border-red-200 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      <div className="grid md:grid-cols-[300px,1fr] gap-8">
        <div className="space-y-6">
          <NewGroupForm />
          <GroupList />
        </div>

        <div className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-lg border-2 border-red-200">
          {currentGroup ? (
            <GroupView />
          ) : (
            <p className="text-gray-500 text-center">
              Select a group or create a new one to get started
            </p>
          )}
        </div>
      </div>
    </div>
  );
}