import dotenv from "dotenv";

// Load environment variables FIRST before any other imports that might use them
dotenv.config();

import express, { Request, Response, Application } from "express";
import cors from "cors";
import apiRoutes from "./routes";
import { configService } from "./config/config.service";

const app: Application = express();
const PORT = configService.getPort();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Backend HTTP Server is running",
    status: "success",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api", apiRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
    path: req.path,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});

export default app;
