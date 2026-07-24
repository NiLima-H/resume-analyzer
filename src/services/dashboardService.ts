import { supabase } from "../lib/supabase";

export interface DashboardAnalysis {
  id: string;
  resume_name: string;
  job_title: string | null;
  company_name: string | null;
  ats_score: number;
  keyword_score: number;
  section_score: number;
  matched_keywords: string[] | null;
  missing_keywords: string[] | null;
  ai_feedback: {
    provider?: string;
    strengths?: string[];
    weaknesses?: string[];
    recommendations?: string[];
    improvedSummary?: string;
    improvedBullets?: string[];
  } | null;
  created_at: string;
}

interface AnalysisRow {
  id: string;
  resume_name: string;
  ats_score: number;
  keyword_score: number;
  section_score: number;
  matched_keywords: string[] | null;
  missing_keywords: string[] | null;
  ai_feedback: DashboardAnalysis["ai_feedback"];
  created_at: string;
}

export async function getDashboardAnalyses(): Promise<
  DashboardAnalysis[]
> {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  const user = session?.user;

  if (!user) {
    throw new Error(
      "You must be logged in to view analyses.",
    );
  }

  const { data, error } = await supabase
    .from("analyses")
    .select(
      `
        id,
        resume_name,
        ats_score,
        keyword_score,
        section_score,
        matched_keywords,
        missing_keywords,
        ai_feedback,
        created_at
      `,
    )
    .eq("user_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "Dashboard Supabase error:",
      error,
    );

    throw new Error(error.message);
  }

  return ((data ?? []) as AnalysisRow[]).map(
    (item) => ({
      ...item,

      // These fields are currently stored
      // in the job_descriptions table.
      job_title: null,
      company_name: null,
    }),
  );
}