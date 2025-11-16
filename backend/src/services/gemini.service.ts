import { GoogleGenAI } from "@google/genai";
import { configService } from "../config/config.service";
import { QuizQuestionsSchema, QuizQuestions } from "../schemas/quiz.schema";
import {
  MIN_QUESTION_AMOUNT,
  MAX_QUESTION_AMOUNT,
  DEFAULT_QUESTION_AMOUNT,
} from "../constants/quiz.constants";

export class GeminiService {
  private readonly genAI: GoogleGenAI;
  private readonly modelName: string;

  constructor() {
    const apiKey = configService.getGeminiApiKey();
    this.genAI = new GoogleGenAI({ apiKey });
    this.modelName = configService.getGeminiModel();
  }

  public async generateQuizFromUrl(
    url: string,
    questionAmount?: number,
    modelOverride?: string
  ): Promise<QuizQuestions> {
    const modelToUse = modelOverride ?? this.modelName;
    console.log(`using model ${modelToUse}`);
    this.validateUrl(url);
    const qa = this.resolveQuestionAmount(questionAmount);
    try {
      const contextSummary = await this.fetchContextSummary(url, modelToUse);
      const quizPrompt = this.createQuizFromContextPrompt(
        contextSummary,
        url,
        qa
      );
      const response2 = await this.genAI.models.generateContent({
        model: modelToUse,
        contents: [quizPrompt],
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: this.buildQuizJsonSchema(qa),
        },
      });

      const generatedQuiz = response2.text;

      if (!generatedQuiz) {
        throw new Error("No response text generated from Gemini API");
      }

      return this.parseAndValidateResponse(generatedQuiz, qa);
    } catch (error) {
      throw this.handleGenerationError(error);
    }
  }

  private validateUrl(url: string): void {
    try {
      new URL(url);
    } catch {
      throw new Error(`Invalid URL format: ${url}`);
    }
  }

  private createQuizFromContextPrompt(
    contextSummary: string,
    url: string,
    questionAmount: number
  ): string {
    return `
You are an expert quiz creator. Use ONLY the provided context summary (derived from the URL below) to create an educational multiple-choice quiz. Do not invent facts not present in the context.

Source URL: ${url}

Context summary (model-generated from the source URL):
"""
${contextSummary}
"""

Instructions:
1. Create a concise and informative quiz "title" that summarizes the topic
2. Choose a high-level "category" the quiz belongs to (e.g., Programming, Biology, History)
3. Create exactly ${questionAmount} multiple-choice questions that test understanding of the key concepts from the context summary
4. Each question must have exactly 4 options
5. Ensure questions cover different aspects (main ideas, details, analysis, application)
6. Provide clear explanations for correct answers that reference specific parts of the context summary
7. Difficulty should be challenging but fair

Output requirements:
- Return JSON object with: { title: string, category: string, questions: Question[] }
- The caller enforces a JSON schema; do not include any text outside of JSON
    `.trim();
  }

  private async fetchContextSummary(
    url: string,
    modelName?: string
  ): Promise<string> {
    const prompt = `Read and analyze the content at the following URL and produce a concise, information-dense summary capturing key concepts, definitions, data points, and relationships. Avoid fluff and keep it factual. Include section headers if helpful. URL: ${url}`;

    const response = await this.genAI.models.generateContent({
      model: modelName ?? this.modelName,
      contents: [prompt],
      config: {
        tools: [{ urlContext: {} }],
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Failed to retrieve context summary from URL");
    }
    return text;
  }

  private handleGenerationError(error: unknown): Error {
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return new Error("Invalid or missing Gemini API key");
      }
      if (error.message.includes("quota")) {
        return new Error("Gemini API quota exceeded");
      }
      if (
        error.message.includes("blocked") ||
        error.message.includes("safety")
      ) {
        return new Error("Content blocked by safety filters");
      }
      if (error.message.includes("URL_RETRIEVAL_STATUS_UNSAFE")) {
        return new Error("URL content failed safety check");
      }
      if (error.message.includes("URL")) {
        return new Error(
          "Failed to retrieve content from URL. Please check if the URL is accessible."
        );
      }

      return new Error(`Quiz generation failed: ${error.message}`);
    }

    return new Error("Quiz generation failed: Unknown error");
  }

  private resolveQuestionAmount(input?: number): number {
    if (input === undefined) return DEFAULT_QUESTION_AMOUNT;
    if (!Number.isInteger(input)) {
      throw new Error(
        `Invalid questionAmount: must be an integer between ${MIN_QUESTION_AMOUNT} and ${MAX_QUESTION_AMOUNT}`
      );
    }
    if (input < MIN_QUESTION_AMOUNT || input > MAX_QUESTION_AMOUNT) {
      throw new Error(
        `Invalid questionAmount: must be an integer between ${MIN_QUESTION_AMOUNT} and ${MAX_QUESTION_AMOUNT}`
      );
    }
    return input;
  }

  private buildQuizJsonSchema(questionAmount: number) {
    return {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "Title of the quiz summarizing the topic",
        },
        category: {
          type: "string",
          description: "General category/domain (e.g., Programming, Biology)",
        },
        questions: {
          type: "array",
          description: "Array of quiz questions",
          minItems: questionAmount,
          maxItems: questionAmount,
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
                items: { type: "string" },
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
            required: [
              "id",
              "question",
              "options",
              "correctAnswer",
              "explanation",
            ],
            additionalProperties: false,
          },
        },
      },
      required: ["title", "category", "questions"],
      additionalProperties: false,
    } as const;
  }

  private parseAndValidateResponse(
    responseText: string,
    expectedCount: number
  ): QuizQuestions {
    const data = this.parseAndValidateResponseBase(responseText);
    if (data.questions.length !== expectedCount) {
      throw new Error(
        `Validation failed: expected ${expectedCount} questions, received ${data.questions.length}`
      );
    }
    return data;
  }

  private parseAndValidateResponseBase(responseText: string): QuizQuestions {
    const parsedData = JSON.parse(responseText);
    const validatedData = QuizQuestionsSchema.parse(parsedData);
    validatedData.questions = validatedData.questions.map(
      (question, index) => ({
        ...question,
        id: question.id || `q_${Date.now()}_${index}`,
      })
    );
    return validatedData;
  }
}

export const geminiService = new GeminiService();
