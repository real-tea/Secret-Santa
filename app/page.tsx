'use client';

import { useEffect } from 'react';
import { useStore } from '@/lib/store';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthForm } from '@/components/auth/auth-form';
import { Dashboard } from '@/components/dashboard/dashboard';
import { SnowBackground } from '@/components/ui/snow-background';

export default function Home() {
  const { user, setUser } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          displayName: firebaseUser.displayName,
          groups: []
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900/30 to-green-900/20">
      <SnowBackground />
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-red-700 mb-4">Secret Santa</h1>
          <p className="text-lg text-gray-700">Create and manage your gift exchanges!</p>
        </div>

        {user ? <Dashboard /> : <AuthForm />}
      </div>
      
      <footer className="fixed bottom-0 w-full py-4 text-center text-gray-700 bg-white/80 backdrop-blur-sm border-t border-red-100">
        Made with ❤️ by Siddharth and Akash (SOSS)
      </footer>
    </div>
  );
}