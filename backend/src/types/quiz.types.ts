/**
 * Type definitions for Quiz API
 * Can be shared with frontend
 */

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResponse {
  success: boolean;
  data: {
    title: string;
    category: string;
    questions: QuizQuestion[];
  };
  questionCount: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface GenerateQuizRequest {
  url: string;
  questionAmount?: number;
}
