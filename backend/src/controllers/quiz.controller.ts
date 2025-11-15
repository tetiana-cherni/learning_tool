import { Request, Response } from "express";
import { geminiService } from "../services/gemini.service";

export class QuizController {
  /**
   * Generate quiz from URL endpoint handler
   * POST /api/quiz/generate
   * Body: { url: string }
   */
  public async generateQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { url } = req.body;

      if (!url) {
        res.status(400).json({
          error: "Bad Request",
          message: "URL is required in request body",
        });
        return;
      }

      if (typeof url !== "string") {
        res.status(400).json({
          error: "Bad Request",
          message: "URL must be a string",
        });
        return;
      }

      const quiz = await geminiService.generateQuizFromUrl(url);

      res.status(200).json({
        success: true,
        data: quiz,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: unknown, res: Response): void {
    console.error("Quiz generation error:", error);

    if (error instanceof Error) {
      if (error.message.includes("Invalid URL")) {
        res.status(400).json({
          error: "Bad Request",
          message: error.message,
        });
        return;
      }

      if (error.message.includes("API key")) {
        res.status(500).json({
          error: "Configuration Error",
          message: "Server configuration error. Please contact support.",
        });
        return;
      }

      if (error.message.includes("quota")) {
        res.status(503).json({
          error: "Service Unavailable",
          message: "Service temporarily unavailable. Please try again later.",
        });
        return;
      }

      if (error.message.includes("Validation failed")) {
        res.status(500).json({
          error: "Internal Server Error",
          message: "Failed to generate valid quiz. Please try again.",
        });
        return;
      }

      res.status(500).json({
        error: "Internal Server Error",
        message: "An unexpected error occurred while generating the quiz.",
      });
      return;
    }

    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

export const quizController = new QuizController();
