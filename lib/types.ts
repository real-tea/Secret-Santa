export interface Friend {
  id: string;
  name: string;
  code: string;
  wishlist: string[];
  assignedFriendId: string | null;
}

export interface FriendGroup {
  id: string;
  name: string;
  createdBy: string;
  createdAt: Date;
  friends: Friend[];
  isAssigned: boolean;
}

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  groups: string[];
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}