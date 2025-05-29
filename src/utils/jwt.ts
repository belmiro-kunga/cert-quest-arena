
// Mock JWT utilities
export const generateToken = (payload: any) => {
  return 'mock-jwt-token';
};

export const verifyToken = (token: string) => {
  return { id: 'mock-user-id', email: 'mock@example.com' };
};
