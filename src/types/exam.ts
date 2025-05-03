
export interface Question {
  id: number;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
  explanation: string;
}

export interface ExamResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  score: number;
  timeTaken: number;
  answers: {
    questionId: number;
    selectedOptionId: string;
    isCorrect: boolean;
  }[];
}
