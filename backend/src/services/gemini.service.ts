import { GoogleGenerativeAI } from "@google/generative-ai";
import { configService } from "../config/config.service";
import {
  QuizQuestionsSchema,
  QuizQuestions,
  QuizQuestionsJsonSchema,
} from "../schemas/quiz.schema";

/**
 * Service for interacting with Google Gemini AI
 */
export class GeminiService {
  private readonly genAI: GoogleGenerativeAI;
  private readonly modelName = "gemini-1.3";

constructor() {
  this.genAI = new GoogleGenerativeAI(configService.getGeminiApiKey());
  this.modelName = "gemini-1.3";
}


  /**
   * Generate a quiz from a URL
   */
  public async generateQuizFromUrl(url: string): Promise<QuizQuestions> {
    this.validateUrl(url);
    try {
      const contextSummary = await this.fetchContextSummary(url);
      const quizPrompt = this.createQuizFromContextPrompt(contextSummary, url);

      // Cast to 'any' to bypass missing TypeScript typings
      const response: any = await (this.genAI as any).generateContent({
        model: this.modelName,
        contents: [quizPrompt],
        responseSchema: QuizQuestionsJsonSchema as any,
      });

      const generatedQuiz = response.output_text;
      if (!generatedQuiz) throw new Error("No response text generated");

      return this.parseAndValidateResponse(generatedQuiz);
    } catch (error) {
      throw this.handleGenerationError(error);
    }
  }

  private validateUrl(url: string): void {
    try {
      new URL(url);
    } catch {
      throw new Error(`Invalid URL: ${url}`);
    }
  }

  private createQuizFromContextPrompt(
    contextSummary: string,
    url: string
  ): string {
    return `
You are an expert quiz creator. Use ONLY the provided context summary to create an educational multiple-choice quiz.

Source URL: ${url}

Context summary:
"""
${contextSummary}
"""

Instructions:
- 5-7 multiple-choice questions
- Each question has 4 options
- Include explanations
- Use JSON format only
    `.trim();
  }

  private async fetchContextSummary(url: string): Promise<string> {
    const prompt = `Summarize the content at the following URL concisely: ${url}`;

    const result: any = await (this.genAI as any).generateContent({
      model: this.modelName,
      contents: [prompt],
    });

    const text = result.output_text;
    if (!text) throw new Error("Failed to fetch summary from URL");

    return text;
  }

  private parseAndValidateResponse(responseText: string): QuizQuestions {
    const parsed = JSON.parse(responseText);
    return QuizQuestionsSchema.parse(parsed);
  }

  private handleGenerationError(error: unknown): Error {
    if (error instanceof Error) return error;
    return new Error("Unknown error in quiz generation");
  }
}

export const geminiService = new GeminiService();
