'use client';

import { useState } from 'react';
import { Button } from './button';
import { Input } from './input';
import { useStore } from '@/lib/store';

export function LoginForm() {
  const [code, setCode] = useState('');
  const login = useStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!login(code)) {
      alert('Invalid code!');
    }
    setCode('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          placeholder="Enter your secret code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Login</Button>
    </form>
  );
}