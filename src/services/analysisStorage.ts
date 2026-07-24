import { supabase } from "../lib/supabase";
import type { Analysis } from "../types/analysis";

export interface SaveAnalysisInput {
  resumeName: string;
  resumeText?: string;
  jobDescription: string;
  analysis: Analysis;
}

export async function saveAnalysis({
  resumeName,
  resumeText = "",
  jobDescription,
  analysis,
}: SaveAnalysisInput) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("You must be logged in to save an analysis.");
  }

  const { data: savedJob, error: jobError } = await supabase
    .from("job_descriptions")
    .insert({
      user_id: user.id,
      job_title: analysis.jobTitle.trim() || null,
      company_name: analysis.companyName.trim() || null,
      description: jobDescription.trim(),
    })
    .select("id")
    .single();

  if (jobError) {
    throw new Error(
      `Could not save job description: ${jobError.message}`,
    );
  }

  const { data: savedAnalysis, error: analysisError } =
    await supabase
      .from("analyses")
      .insert({
        user_id: user.id,
        job_description_id: savedJob.id,

        resume_name: resumeName,
        resume_text: resumeText,
        job_description: jobDescription.trim(),

        ats_score: analysis.overallScore,
        keyword_score: analysis.scores.keywords,
        section_score: analysis.scores.structure,

        matched_keywords: analysis.matchedKeywords,
        missing_keywords: analysis.missingKeywords,

        section_feedback: {
          keywords: analysis.scores.keywords,
          skills: analysis.scores.skills,
          experience: analysis.scores.experience,
          education: analysis.scores.education,
          structure: analysis.scores.structure,
          strengths: analysis.strengths,
          weaknesses: analysis.weaknesses,
        },

        ai_feedback: {
        provider:
         analysis.aiProvider ?? "deterministic",

         strengths: analysis.strengths,
         weaknesses: analysis.weaknesses,
         recommendations: analysis.recommendations,
         improvedSummary: analysis.improvedSummary,
         improvedBullets: analysis.improvedBullets,
         },

        status: "completed",
      })
      .select("*")
      .single();

  if (analysisError) {
    await supabase
      .from("job_descriptions")
      .delete()
      .eq("id", savedJob.id);

    throw new Error(
      `Could not save analysis: ${analysisError.message}`,
    );
  }

  return savedAnalysis;
}