import { z } from "zod";

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
    .min(5)
    .max(10)
    .describe("Array of quiz questions"),
});

export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;
export type QuizQuestions = z.infer<typeof QuizQuestionsSchema>;

// Plain JSON Schema compatible with @google/genai structured outputs
export const QuizQuestionsJsonSchema = {
  type: "object",
  properties: {
    questions: {
      type: "array",
      description: "Array of quiz questions",
      minItems: 5,
      maxItems: 10,
      items: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for the question",
          },
          question: {
            type: "string",
            description: "The quiz question text",
          },
          options: {
            type: "array",
            description: "Four answer options",
            minItems: 4,
            maxItems: 4,
            items: {
              type: "string",
            },
          },
          correctAnswer: {
            type: "integer",
            description: "Index of the correct answer (0-3)",
            minimum: 0,
            maximum: 3,
          },
          explanation: {
            type: "string",
            description: "Explanation of the correct answer",
          },
        },
        required: ["id", "question", "options", "correctAnswer", "explanation"],
        additionalProperties: false,
      },
    },
  },
  required: ["questions"],
  additionalProperties: false,
} as const;
