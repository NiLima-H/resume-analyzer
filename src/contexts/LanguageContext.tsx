import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Language = "en" | "bn";

interface DashboardTranslations {
  eyebrow: string;
  title: string;
  loggedInAs: string;
  createAnalysis: string;
  logout: string;

  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  analyzeResume: string;

  totalAnalyses: string;
  completedReviews: string;
  averageAts: string;
  savedAnalyses: string;
  highestScore: string;
  strongestResult: string;
  keywordMatches: string;
  relevantTerms: string;

  progress: string;
  scoreHistory: string;
  latestAnalyses: string;
  currentPerformance: string;
  performanceAdvice: string;
  startNewAnalysis: string;

  activity: string;
  recentAnalyses: string;
  noAnalysis: string;
  noAnalysisDescription: string;
  analyzeFirstResume: string;
}

interface NavbarTranslations {
  dashboard: string;
  analyze: string;
  analyzeResume: string;
  signOut: string;
  smartCareerAnalysis: string;
}

interface AnalysisTranslations {
  eyebrow: string;
  title: string;
  description: string;
  resume: string;
  jobTitle: string;
  companyName: string;
  jobDescription: string;
  analyzeButton: string;
  analyzing: string;
  completed: string;
  atsScore: string;
  matchedKeywords: string;
  missingKeywords: string;
  recommendations: string;
}

interface Translations {
  dashboard: DashboardTranslations;
  navbar: NavbarTranslations;
  analysis: AnalysisTranslations;
}

const translations: Record<Language, Translations> = {
  en: {
    navbar: {
      dashboard: "Dashboard",
      analyze: "Analyze",
      analyzeResume: "Analyze Resume",
      signOut: "Sign out",
      smartCareerAnalysis: "Smart career analysis",
    },

    dashboard: {
      eyebrow: "Resume Analyzer",
      title: "Dashboard",
      loggedInAs: "Logged in as",
      createAnalysis: "Create analysis",
      logout: "Log out",

      heroBadge: "AI-powered resume workspace",
      heroTitle: "Make every application stronger.",
      heroDescription:
        "Compare your resume with job descriptions, discover missing keywords and follow your ATS improvement over time.",
      analyzeResume: "Analyze a resume",

      totalAnalyses: "Total analyses",
      completedReviews: "Completed resume reviews",
      averageAts: "Average ATS",
      savedAnalyses: "Across saved analyses",
      highestScore: "Highest score",
      strongestResult: "Your strongest result",
      keywordMatches: "Keyword matches",
      relevantTerms: "Relevant terms detected",

      progress: "Progress",
      scoreHistory: "ATS score history",
      latestAnalyses: "Your latest eight resume analyses.",
      currentPerformance: "Current performance",
      performanceAdvice:
        "Keep tailoring each resume specifically to its target job description.",
      startNewAnalysis: "Start new analysis",

      activity: "Activity",
      recentAnalyses: "Recent analyses",
      noAnalysis: "No analysis yet",
      noAnalysisDescription:
        "Upload your first resume and compare it against a job description.",
      analyzeFirstResume: "Analyze first resume",
    },

    analysis: {
      eyebrow: "AI Resume Analyzer",
      title: "Create a resume analysis",
      description:
        "Upload your resume and paste the job description.",
      resume: "Resume",
      jobTitle: "Job title",
      companyName: "Company name",
      jobDescription: "Job description",
      analyzeButton: "Analyze resume",
      analyzing: "Analyzing...",
      completed: "Analysis complete",
      atsScore: "ATS score",
      matchedKeywords: "Matched keywords",
      missingKeywords: "Missing keywords",
      recommendations: "Recommendations",
    },
  },

  bn: {
    navbar: {
      dashboard: "ড্যাশবোর্ড",
      analyze: "বিশ্লেষণ",
      analyzeResume: "রিজিউম বিশ্লেষণ",
      signOut: "লগ আউট",
      smartCareerAnalysis: "স্মার্ট ক্যারিয়ার বিশ্লেষণ",
    },

    dashboard: {
      eyebrow: "রিজিউম অ্যানালাইজার",
      title: "ড্যাশবোর্ড",
      loggedInAs: "লগইন করা হয়েছে",
      createAnalysis: "নতুন বিশ্লেষণ তৈরি করুন",
      logout: "লগ আউট",

      heroBadge: "এআই-চালিত রিজিউম কর্মক্ষেত্র",
      heroTitle: "প্রতিটি চাকরির আবেদন আরও শক্তিশালী করুন।",
      heroDescription:
        "চাকরির বিবরণের সঙ্গে আপনার রিজিউম তুলনা করুন, অনুপস্থিত কীওয়ার্ড খুঁজুন এবং সময়ের সঙ্গে ATS স্কোরের উন্নতি দেখুন।",
      analyzeResume: "রিজিউম বিশ্লেষণ করুন",

      totalAnalyses: "মোট বিশ্লেষণ",
      completedReviews: "সম্পন্ন রিজিউম পর্যালোচনা",
      averageAts: "গড় ATS",
      savedAnalyses: "সংরক্ষিত বিশ্লেষণ অনুযায়ী",
      highestScore: "সর্বোচ্চ স্কোর",
      strongestResult: "আপনার সেরা ফলাফল",
      keywordMatches: "মিলে যাওয়া কীওয়ার্ড",
      relevantTerms: "প্রাসঙ্গিক শব্দ শনাক্ত হয়েছে",

      progress: "অগ্রগতি",
      scoreHistory: "ATS স্কোরের ইতিহাস",
      latestAnalyses: "আপনার সর্বশেষ আটটি রিজিউম বিশ্লেষণ।",
      currentPerformance: "বর্তমান পারফরম্যান্স",
      performanceAdvice:
        "প্রতিটি নির্দিষ্ট চাকরির বিবরণ অনুযায়ী রিজিউম সাজিয়ে নিন।",
      startNewAnalysis: "নতুন বিশ্লেষণ শুরু করুন",

      activity: "কার্যক্রম",
      recentAnalyses: "সাম্প্রতিক বিশ্লেষণ",
      noAnalysis: "এখনও কোনো বিশ্লেষণ নেই",
      noAnalysisDescription:
        "আপনার প্রথম রিজিউম আপলোড করে একটি চাকরির বিবরণের সঙ্গে তুলনা করুন।",
      analyzeFirstResume: "প্রথম রিজিউম বিশ্লেষণ করুন",
    },

    analysis: {
      eyebrow: "এআই রিজিউম অ্যানালাইজার",
      title: "রিজিউম বিশ্লেষণ তৈরি করুন",
      description:
        "আপনার রিজিউম আপলোড করুন এবং চাকরির বিবরণ লিখুন।",
      resume: "রিজিউম",
      jobTitle: "চাকরির পদ",
      companyName: "কোম্পানির নাম",
      jobDescription: "চাকরির বিবরণ",
      analyzeButton: "রিজিউম বিশ্লেষণ করুন",
      analyzing: "বিশ্লেষণ করা হচ্ছে...",
      completed: "বিশ্লেষণ সম্পন্ন",
      atsScore: "ATS স্কোর",
      matchedKeywords: "মিলে যাওয়া কীওয়ার্ড",
      missingKeywords: "অনুপস্থিত কীওয়ার্ড",
      recommendations: "পরামর্শ",
    },
  },
};

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: Translations;
}

const LanguageContext =
  createContext<LanguageContextValue | undefined>(
    undefined,
  );

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({
  children,
}: LanguageProviderProps) {
  const [language, setLanguageState] =
    useState<Language>(() => {
      const savedLanguage =
        localStorage.getItem("language");

      return savedLanguage === "bn"
        ? "bn"
        : "en";
    });

  function setLanguage(
    newLanguage: Language,
  ) {
    setLanguageState(newLanguage);
    localStorage.setItem(
      "language",
      newLanguage,
    );
  }

  useEffect(() => {
    document.documentElement.lang =
      language === "bn" ? "bn" : "en";
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language],
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      "useLanguage must be used inside LanguageProvider.",
    );
  }

  return context;
}