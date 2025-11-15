import { Request, Response } from "express";
import { geminiService } from "../services/gemini.service";
import {
  MIN_QUESTION_AMOUNT,
  MAX_QUESTION_AMOUNT,
} from "../constants/quiz.constants";

export class QuizController {
  public async generateQuiz(req: Request, res: Response): Promise<void> {
    try {
      const { url, questionAmount } = req.body as {
        url?: unknown;
        questionAmount?: unknown;
      };

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

      let qa: number | undefined = undefined;
      if (questionAmount !== undefined) {
        if (
          typeof questionAmount !== "number" ||
          !Number.isInteger(questionAmount)
        ) {
          res.status(400).json({
            error: "Bad Request",
            message: "questionAmount must be an integer",
          });
          return;
        }
        if (
          questionAmount < MIN_QUESTION_AMOUNT ||
          questionAmount > MAX_QUESTION_AMOUNT
        ) {
          res.status(400).json({
            error: "Bad Request",
            message: `questionAmount must be between ${MIN_QUESTION_AMOUNT} and ${MAX_QUESTION_AMOUNT}`,
          });
          return;
        }
        qa = questionAmount;
      }

      const quiz = await geminiService.generateQuizFromUrl(url, qa);
      const questionCount = quiz.questions.length;

      res.status(200).json({
        success: true,
        data: quiz,
        questionCount,
      });
    } catch (error) {
      this.handleError(error, res);
    }
  }

  private handleError(error: unknown, res: Response): void {
    console.error("Quiz generation error:", error);

    if (error instanceof Error) {
      if (error.message.includes("Invalid questionAmount")) {
        res.status(400).json({
          error: "Bad Request",
          message: error.message,
        });
        return;
      }
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
