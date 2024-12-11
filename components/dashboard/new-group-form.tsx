'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

export function NewGroupForm() {
  const [name, setName] = useState('');
  const createGroup = useStore((state) => state.createGroup);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    await createGroup(name);
    setName('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New group name"
        className="flex-1"
      />
      <Button type="submit" className="bg-red-600 hover:bg-red-700">
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
}