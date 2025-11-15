import { Router } from "express";
import { quizController } from "../controllers/quiz.controller";

const router = Router();

/**
 * POST /api/quiz/generate
 * Generate quiz questions from a URL
 * Body: { url: string }
 */
router.post("/generate", (req, res) => quizController.generateQuiz(req, res));

export default router;
