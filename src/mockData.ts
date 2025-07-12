import { User, SwapRequest, Rating } from './types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    location: 'San Francisco, CA',
    skillsOffered: ['JavaScript', 'React', 'Node.js', 'UI/UX Design'],
    skillsWanted: ['Python', 'Data Science', 'Photography'],
    availability: ['Weekends', 'Evenings'],
    isPublic: true,
    rating: 4.8,
    totalRatings: 12,
  },
  {
    id: '2',
    name: 'Sarah Chen',
    location: 'New York, NY',
    skillsOffered: ['Python', 'Machine Learning', 'Data Analysis'],
    skillsWanted: ['Web Development', 'React', 'Digital Marketing'],
    availability: ['Weekends'],
    isPublic: true,
    rating: 4.9,
    totalRatings: 8,
  },
  {
    id: '3',
    name: 'Marcus Williams',
    location: 'Austin, TX',
    skillsOffered: ['Photography', 'Video Editing', 'Photoshop'],
    skillsWanted: ['Web Development', 'SEO', 'Content Writing'],
    availability: ['Evenings', 'Weekends'],
    isPublic: true,
    rating: 4.7,
    totalRatings: 15,
  },
  {
    id: '4',
    name: 'Emily Davis',
    location: 'Seattle, WA',
    skillsOffered: ['Digital Marketing', 'SEO', 'Content Writing'],
    skillsWanted: ['Graphic Design', 'Illustration', 'Photography'],
    availability: ['Evenings'],
    isPublic: true,
    rating: 4.6,
    totalRatings: 10,
  },
];

export const mockSwapRequests: SwapRequest[] = [
  {
    id: '1',
    fromUserId: '1',
    toUserId: '2',
    skillOffered: 'React',
    skillWanted: 'Python',
    message: 'Hi! I\'d love to trade React knowledge for Python basics.',
    status: 'pending',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    fromUserId: '3',
    toUserId: '1',
    skillOffered: 'Photography',
    skillWanted: 'JavaScript',
    message: 'Looking to learn JavaScript fundamentals in exchange for photography tips!',
    status: 'accepted',
    createdAt: new Date('2024-01-10'),
  },
];

export const mockRatings: Rating[] = [
  {
    id: '1',
    swapRequestId: '2',
    fromUserId: '1',
    toUserId: '3',
    rating: 5,
    comment: 'Excellent teacher! Very patient and knowledgeable.',
    createdAt: new Date('2024-01-20'),
  },
];

// Current user simulation
export const currentUser: User = {
  id: '1',
  name: 'Alex Johnson',
  location: 'San Francisco, CA',
  skillsOffered: ['JavaScript', 'React', 'Node.js', 'UI/UX Design'],
  skillsWanted: ['Python', 'Data Science', 'Photography'],
  availability: ['Weekends', 'Evenings'],
  isPublic: true,
  rating: 4.8,
  totalRatings: 12,
};