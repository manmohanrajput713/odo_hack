export interface User {
  id: string;
  name: string;
  location?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  isPublic: boolean;
  rating: number;
  totalRatings: number;
  avatar?: string;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  skillOffered: string;
  skillWanted: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: Date;
  completedAt?: Date;
}

export interface Rating {
  id: string;
  swapRequestId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export type ViewType = 'dashboard' | 'profile' | 'browse' | 'requests';