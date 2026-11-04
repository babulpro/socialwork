export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: 'user' | 'admin';
  createdEvents?: Event[];
  joinedEvents?: Event[];
}

export interface Event {
  _id: string;
  id?: string;
  title: string;
  description: string;
  organizer: {
    _id: string;
    id?: string;
    name: string;
    email?: string;
    avatar?: string;
    bio?: string;
  };
  attendees: Array<{
    _id: string;
    id?: string;
    name: string;
    avatar?: string;
  }> | string[];
  attendeeCount: number;
  location: string;
  date: string;
  endDate?: string;
  maxAttendees: number;
  category: 'social' | 'sports' | 'education' | 'music' | 'food' | 'tech' | 'art' | 'other';
  coverImage?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  isPublic: boolean;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface EventsResponse {
  success: boolean;
  total: number;
  page: number;
  pages: number;
  events: Event[];
}
