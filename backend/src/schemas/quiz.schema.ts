import { z } from "zod";
import {
  MIN_QUESTION_AMOUNT,
  MAX_QUESTION_AMOUNT,
} from "../constants/quiz.constants";

export const QuizQuestionSchema = z.object({
  id: z.string().describe("Unique identifier for the question"),
  question: z.string().min(10).describe("The quiz question text"),
  options: z.array(z.string()).length(4).describe("Four answer options"),
  correctAnswer: z
    .number()
    .int()
    .min(0)
    .max(3)
    .describe("Index of the correct answer (0-3)"),
  explanation: z.string().min(10).describe("Explanation of the correct answer"),
});

export const QuizQuestionsSchema = z.object({
  questions: z
    .array(QuizQuestionSchema)
    .min(MIN_QUESTION_AMOUNT)
    .max(MAX_QUESTION_AMOUNT)
    .describe("Array of quiz questions"),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type QuizQuestions = z.infer<typeof QuizQuestionsSchema>;
