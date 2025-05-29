export interface Exam {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  questionsCount: number;
  difficulty: string;
  passingScore: number;
  active: boolean;
  isFree: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const getExams = async (): Promise<Exam[]> => {
  // Mock implementation - replace with actual API call
  return [];
};

export const createExam = async (exam: Exam): Promise<Exam> => {
  // Mock implementation - replace with actual API call
  return { ...exam, id: Date.now().toString(), createdAt: new Date().toISOString() };
};

export const updateExam = async (id: string, exam: Exam): Promise<Exam> => {
  // Mock implementation - replace with actual API call
  return { ...exam, id, updatedAt: new Date().toISOString() };
};

export const deleteExam = async (id: string): Promise<void> => {
  // Mock implementation - replace with actual API call
  console.log('Deleting exam:', id);
};
