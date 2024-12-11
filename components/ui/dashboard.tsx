'use client';

import { useStore } from '@/lib/store';
import { Button } from './button';
import { Card } from './card';

export function Dashboard() {
  const { currentFriend, friends, logout } = useStore();
  
  if (!currentFriend) return null;

  const assignedFriend = friends.find(f => f.id === currentFriend.assignedFriendId);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Welcome, {currentFriend.name}!</h2>
        <Button variant="outline" onClick={logout}>Logout</Button>
      </div>

      {assignedFriend ? (
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Your Secret Santa Assignment</h3>
          <p className="text-lg mb-2">You are Secret Santa for: <span className="font-bold">{assignedFriend.name}</span></p>
          <div className="mt-4">
            <h4 className="font-medium mb-2">Their Wishlist:</h4>
            <ul className="list-disc list-inside space-y-2">
              {assignedFriend.wishlist.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </Card>
      ) : (
        <p className="text-lg text-muted-foreground">Assignments haven't been made yet. Check back later!</p>
      )}
    </div>
  );
}