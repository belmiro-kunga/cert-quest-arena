
export interface User {
  id: string;
  email: string;
  name?: string;
  photo_url?: string;
  role: 'admin' | 'user';
}

export interface Profile {
  id: string;
  user_id: string;
  name: string;
  photo_url?: string;
  phone?: string;
  plan_type: 'free' | 'premium' | 'enterprise';
  attempts_left: number;
  created_at: string;
  updated_at: string;
  role: 'admin' | 'user';
}
