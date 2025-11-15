import { GoogleGenAI } from "@google/genai";
import { configService } from "../config/config.service";
import {
  QuizQuestionsSchema,
  QuizQuestions,
  QuizQuestionsJsonSchema,
} from "../schemas/quiz.schema";

/**
 * Service for interacting with Google Gemini AI
 * Implements Single Responsibility Principle - only handles Gemini API interactions
 */
export class GeminiService {
  private readonly genAI: GoogleGenAI;
  private readonly modelName: string;

  constructor() {
    const apiKey = configService.getGeminiApiKey();
    this.genAI = new GoogleGenAI({ apiKey });
    this.modelName = configService.getGeminiModel();
  }

  /**
   * Generate a quiz from a URL using Gemini with structured output
   * Uses URL context tool to directly access and analyze content from the URL
   * and structured schema to ensure consistent output format
   *
   * @param url - The URL to generate quiz questions from
   * @returns Validated quiz questions
   * @throws Error if URL is invalid, API call fails, or validation fails
   */
  public async generateQuizFromUrl(url: string): Promise<QuizQuestions> {
	console.log(`using model ${this.modelName}`)
    this.validateUrl(url);
    try {
      const contextSummary = await this.fetchContextSummary(url);
      const quizPrompt = this.createQuizFromContextPrompt(contextSummary, url);
      const response2 = await this.genAI.models.generateContent({
        model: this.modelName,
        contents: [quizPrompt],
        config: {
          responseMimeType: "application/json",
          responseJsonSchema: QuizQuestionsJsonSchema,
        },
      });

      const generatedQuiz = response2.text;

      if (!generatedQuiz) {
        throw new Error("No response text generated from Gemini API");
      }

      return this.parseAndValidateResponse(generatedQuiz);
    } catch (error) {
      throw this.handleGenerationError(error);
    }
  }

  /**
   * Validate URL format
   */
  private validateUrl(url: string): void {
    try {
      new URL(url);
    } catch {
      throw new Error(`Invalid URL format: ${url}`);
    }
  }

  private createQuizPrompt(url: string): string {
    return `
You are an expert quiz creator. Analyze the content from the following URL and create an educational quiz based on its content.

URL: ${url}

Instructions:
1. Carefully read and analyze the content from the URL provided above
2. Create 5-7 multiple-choice questions that test understanding of the key concepts from the URL content
3. Each question must have exactly 4 options
4. Ensure questions cover different aspects of the content (main ideas, details, analysis, application)
5. Make questions challenging but fair based on the actual content
6. Provide clear explanations for correct answers that reference specific information from the URL
7. Use diverse question types (factual recall, conceptual understanding, application-based)

Requirements:
- Questions should be clear and unambiguous
- All options should be plausible based on the content
- Explanations should be educational and cite the source material
- Difficulty should be appropriate for the content level
- Questions should test comprehension and critical thinking, not just memorization
- Focus on the most important and interesting aspects of the content

Generate the quiz following the specified JSON schema format.
    `.trim();
  }

  /**
   * Create a prompt that asks model to generate a quiz ONLY from a provided context summary
   */
  private createQuizFromContextPrompt(
    contextSummary: string,
    url: string
  ): string {
    return `
You are an expert quiz creator. Use ONLY the provided context summary (derived from the URL below) to create an educational multiple-choice quiz. Do not invent facts not present in the context.

Source URL: ${url}

Context summary (model-generated from the source URL):
"""
${contextSummary}
"""

Instructions:
1. Create 5-7 multiple-choice questions that test understanding of the key concepts from the context summary
2. Each question must have exactly 4 options
3. Ensure questions cover different aspects (main ideas, details, analysis, application)
4. Provide clear explanations for correct answers that reference specific parts of the context summary
5. Difficulty should be challenging but fair

Output requirements:
- Return JSON that strictly complies with the provided schema (the caller enforces it)
- Do not include any text outside of JSON
    `.trim();
  }

  /**
   * Use URL Context tool to fetch and summarize the content from the given URL.
   * Tools cannot be combined with application/json structured outputs, so we first
   * retrieve a concise, information-dense summary here.
   */
  private async fetchContextSummary(url: string): Promise<string> {
    const prompt = `Read and analyze the content at the following URL and produce a concise, information-dense summary capturing key concepts, definitions, data points, and relationships. Avoid fluff and keep it factual. Include section headers if helpful. URL: ${url}`;

    const response = await this.genAI.models.generateContent({
      model: this.modelName,
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

  /**
   * Parse and validate Gemini response using Zod schema
   */
  private parseAndValidateResponse(responseText: string): QuizQuestions {
    try {
      const parsedData = JSON.parse(responseText);
      const validatedData = QuizQuestionsSchema.parse(parsedData);

      // Add unique IDs if not provided by the model
      validatedData.questions = validatedData.questions.map(
        (question, index) => ({
          ...question,
          id: question.id || `q_${Date.now()}_${index}`,
        })
      );

      return validatedData;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new Error("Failed to parse Gemini response as JSON");
      }
      throw new Error(
        `Validation failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }

  /**
   * Handle errors during quiz generation
   */
  private handleGenerationError(error: unknown): Error {
    if (error instanceof Error) {
      // Check for specific Gemini API errors
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
}

export const geminiService = new GeminiService();
