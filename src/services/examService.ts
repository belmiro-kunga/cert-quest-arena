// Mock exam service - replace with actual implementation
export interface ExamServiceType {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  is_free: boolean;
  created_at: string;
  updated_at: string;
}

export const getExams = async (): Promise<ExamServiceType[]> => {
  // Mock implementation - replace with actual API call
  return [
    {
      id: '1',
      title: 'AWS Solutions Architect Associate',
      description: 'Complete AWS SAA practice exam',
      difficulty: 'medium',
      category: 'AWS',
      is_free: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
};
