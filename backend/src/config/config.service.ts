import dotenv from "dotenv";

// Ensure environment variables are loaded
dotenv.config();

export class ConfigService {
  private readonly geminiApiKey: string;
  private readonly port: string | number;
  private readonly geminiModel: string;

  constructor() {
    this.geminiApiKey = this.getRequiredEnvVariable("GEMINI_API_KEY");
    this.port = process.env.PORT || 3000;
    // Default to a sensible model if not provided
    this.geminiModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  }

  public getGeminiApiKey(): string {
    return this.geminiApiKey;
  }

  public getPort(): string | number {
    return this.port;
  }

  public getGeminiModel(): string {
    return this.geminiModel;
  }

  private getRequiredEnvVariable(key: string): string {
    const value = process.env[key];

    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }

    return value;
  }
}

export const configService = new ConfigService();
