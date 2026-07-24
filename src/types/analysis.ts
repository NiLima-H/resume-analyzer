export interface ScoreBreakdown {
  keywords: number;
  skills: number;
  experience: number;
  education: number;
  structure: number;
}

export interface Analysis {
  id: string;
  resumeName: string;
  jobTitle: string;
  companyName: string;
  overallScore: number;
  scores: ScoreBreakdown;
  matchedKeywords: string[];
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  improvedSummary: string;
  improvedBullets: string[];
  createdAt: string;
  aiProvider?:
  | "openrouter"
  | "huggingface"
  | "deterministic";
  parserUsed?:
  | "standard"
  | "ocr-space";
}

export interface AnalysisResponse {
  success: boolean;
  analysis: Analysis;
}