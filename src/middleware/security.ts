
// Mock implementation for security middleware
export const securityMiddleware = {
  helmet: () => {
    return (req: any, res: any, next: any) => {
      // Mock helmet functionality
      next();
    };
  }
};
