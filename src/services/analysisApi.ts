import type { AnalysisResponse } from "../types/analysis";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

interface AnalyzeResumeInput {
  resume: File;
  jobDescription: string;
  jobTitle?: string;
  companyName?: string;
  language?: "en" | "bn";
}

export async function analyzeResume(
  input: AnalyzeResumeInput,
): Promise<AnalysisResponse> {
  const formData = new FormData();

  formData.append("resume", input.resume);
  formData.append("jobDescription", input.jobDescription);
  formData.append("jobTitle", input.jobTitle || "");
  formData.append("companyName", input.companyName || "");
  formData.append(
  "language",
  input.language ?? "en",
  );

  const response = await fetch(`${API_BASE_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Resume analysis failed");
  }

  return result;
}