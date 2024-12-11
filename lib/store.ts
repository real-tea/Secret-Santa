'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, FriendGroup } from './types';
import { auth, db } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where
} from 'firebase/firestore';

interface AppState {
  user: User | null;
  currentGroup: FriendGroup | null;
  groups: FriendGroup[];
  setUser: (user: User | null) => void;
  setCurrentGroup: (group: FriendGroup | null) => void;
  createGroup: (name: string) => Promise<void>;
  loadGroups: () => Promise<void>;
  addFriendToGroup: (groupId: string, friend: { name: string, wishlist: string[] }) => Promise<void>;
  assignSecretSanta: (groupId: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  user: null,
  currentGroup: null,
  groups: []
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setUser: (user) => {
        set({ user });
        if (!user) {
          set({ ...initialState }); // Reset state on logout
        }
      },
      
      setCurrentGroup: (group) => set({ currentGroup: group }),

      createGroup: async (name) => {
        const { user } = get();
        if (!user) return;

        try {
          const newGroup: Omit<FriendGroup, 'id'> = {
            name,
            createdBy: user.id,
            createdAt: new Date(),
            friends: [],
            isAssigned: false
          };

          const docRef = await addDoc(collection(db, 'groups'), newGroup);
          const group = { ...newGroup, id: docRef.id } as FriendGroup;
          
          set((state) => ({
            groups: [...state.groups, group]
          }));
        } catch (error) {
          console.error('Error creating group:', error);
          throw error;
        }
      },

      loadGroups: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const q = query(
            collection(db, 'groups'),
            where('createdBy', '==', user.id)
          );

          const querySnapshot = await getDocs(q);
          const groups = querySnapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
            createdAt: doc.data().createdAt?.toDate() || new Date()
          })) as FriendGroup[];

          set({ groups });
        } catch (error) {
          console.error('Error loading groups:', error);
          throw error;
        }
      },

      addFriendToGroup: async (groupId, friend) => {
        try {
          const groupRef = doc(db, 'groups', groupId);
          const groupSnap = await getDoc(groupRef);
          
          if (!groupSnap.exists()) return;
          
          const group = groupSnap.data() as FriendGroup;
          const newFriend = {
            ...friend,
            id: crypto.randomUUID(),
            code: Math.random().toString(36).substring(2, 8).toUpperCase(),
            assignedFriendId: null
          };

          const updatedFriends = [...group.friends, newFriend];
          await updateDoc(groupRef, { friends: updatedFriends });

          set((state) => ({
            groups: state.groups.map(g => 
              g.id === groupId 
                ? { ...g, friends: updatedFriends }
                : g
            )
          }));
        } catch (error) {
          console.error('Error adding friend:', error);
          throw error;
        }
      },

      assignSecretSanta: async (groupId) => {
        try {
          const group = get().groups.find(g => g.id === groupId);
          if (!group || group.friends.length < 3) return;

          const shuffledFriends = [...group.friends]
            .sort(() => Math.random() - 0.5)
            .map((friend, index, array) => ({
              ...friend,
              assignedFriendId: array[(index + 1) % array.length].id
            }));

          const groupRef = doc(db, 'groups', groupId);
          await updateDoc(groupRef, { 
            friends: shuffledFriends,
            isAssigned: true
          });

          set((state) => ({
            groups: state.groups.map(g =>
              g.id === groupId
                ? { ...g, friends: shuffledFriends, isAssigned: true }
                : g
            )
          }));
        } catch (error) {
          console.error('Error assigning Secret Santa:', error);
          throw error;
        }
      },

      reset: () => {
        set(initialState);
      }
    }),
    {
      name: 'secret-santa-storage',
      storage: createJSONStorage(() => sessionStorage), // Use sessionStorage instead of localStorage
      partialize: (state) => ({
        groups: state.groups,
        currentGroup: state.currentGroup
      })
    }
  )
);