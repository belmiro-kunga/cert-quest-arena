// Mock user service - replace with actual implementation
export interface UserServiceType {
  id: string;
  email: string;
  subscription_type?: 'free' | 'basic' | 'premium';
  created_at: string;
  updated_at: string;
}

export const getUsers = async (): Promise<UserServiceType[]> => {
  // Mock implementation - replace with actual API call
  return [
    {
      id: '1',
      email: 'user@example.com',
      subscription_type: 'free',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
};
