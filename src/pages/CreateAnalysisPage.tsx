import {
  type FormEvent,
  useRef,
  useState,
} from "react";
import { useMutation } from "@tanstack/react-query";
import {
  FileText,
  UploadCloud,
  X,
} from "lucide-react";

import { analyzeResume } from "../services/analysisApi";
import { saveAnalysis } from "../services/analysisStorage";
import type { Analysis } from "../types/analysis";
import { useLanguage } from "../contexts/LanguageContext";

export default function CreateAnalysisPage() {
  const { language } = useLanguage();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [resume, setResume] =
    useState<File | null>(null);

  const [jobDescription, setJobDescription] =
    useState("");

  const [jobTitle, setJobTitle] =
    useState("");

  const [companyName, setCompanyName] =
    useState("");

  const [analysis, setAnalysis] =
    useState<Analysis | null>(null);

  const [saveMessage, setSaveMessage] =
    useState("");

  const [saveError, setSaveError] =
    useState("");

  const mutation = useMutation({
    mutationFn: analyzeResume,

    onMutate: () => {
      setAnalysis(null);
      setSaveMessage("");
      setSaveError("");
    },

    onSuccess: async (result) => {
      setAnalysis(result.analysis);

      localStorage.setItem(
        "latest-resume-analysis",
        JSON.stringify(result.analysis),
      );

      if (!resume) {
        return;
      }

      try {
        await saveAnalysis({
          resumeName: resume.name,
          resumeText: "",
          jobDescription,
          analysis: result.analysis,
        });

        setSaveMessage(
          language === "bn"
            ? "বিশ্লেষণ সম্পন্ন হয়েছে এবং সফলভাবে সংরক্ষিত হয়েছে।"
            : "Analysis completed and saved successfully.",
        );

        setResume(null);

        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        setSaveError(
          error instanceof Error
            ? error.message
            : language === "bn"
              ? "বিশ্লেষণ সম্পন্ন হয়েছে, কিন্তু সংরক্ষণ ব্যর্থ হয়েছে।"
              : "Analysis completed, but saving failed.",
        );
      }
    },
  });

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaveMessage("");
    setSaveError("");

    if (!resume) {
      setSaveError(
        language === "bn"
          ? "অনুগ্রহ করে একটি রিজিউম নির্বাচন করুন।"
          : "Please select a resume.",
      );

      return;
    }

    mutation.mutate({
      resume,
      jobDescription,
      jobTitle,
      companyName,
      language,
    });
  }

  function removeSelectedFile() {
    setResume(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <main className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
      <section className="rounded-[2rem] border border-neutral-300 bg-neutral-50 p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
            {language === "bn"
              ? "এআই রিজিউম অ্যানালাইজার"
              : "AI Resume Analyzer"}
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 sm:text-4xl">
            {language === "bn"
              ? "রিজিউম বিশ্লেষণ তৈরি করুন"
              : "Create a resume analysis"}
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-7 text-neutral-600">
            {language === "bn"
              ? "আপনার রিজিউম আপলোড করুন এবং যে চাকরির জন্য আবেদন করছেন তার বিবরণ লিখুন।"
              : "Upload your resume and add the job description you are applying for."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div>
            <label className="mb-2 block text-sm font-bold text-neutral-900">
              {language === "bn"
                ? "রিজিউম"
                : "Resume"}
            </label>

            <input
              ref={fileInputRef}
              id="resume-upload"
              type="file"
              accept=".pdf,.docx,.txt, .png,.jpg,.jpeg"
              className="hidden"
              onChange={(event) =>
                setResume(
                  event.target.files?.[0] ??
                    null,
                )
              }
            />

            {!resume ? (
              <label
                htmlFor="resume-upload"
                className="group flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-300 bg-neutral-100/70 px-6 py-10 text-center transition hover:border-neutral-900 hover:bg-neutral-100"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-900 text-neutral-50 shadow-sm transition group-hover:-translate-y-1">
                  <UploadCloud size={25} />
                </div>

                <p className="mt-5 text-base font-bold text-neutral-950">
                  {language === "bn"
                    ? "আপনার রিজিউম আপলোড করুন"
                    : "Upload your resume"}
                </p>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  {language === "bn"
                    ? "ফাইল নির্বাচন করতে এখানে ক্লিক করুন"
                    : "Click here to choose a file"}
                </p>

                <p className="mt-3 text-xs text-neutral-400">
                  PDF, DOCX, TXT, PNG, JPG or JPEG
                </p>
              </label>
            ) : (
              <div className="flex items-center justify-between gap-4 rounded-2xl border border-neutral-300 bg-neutral-100 p-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-neutral-50">
                    <FileText size={21} />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-neutral-950">
                      {resume.name}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {(
                        resume.size /
                        1024 /
                        1024
                      ).toFixed(2)}{" "}
                      MB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={removeSelectedFile}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-neutral-300 bg-neutral-50 text-neutral-600 transition hover:border-neutral-900 hover:bg-neutral-900 hover:text-neutral-50"
                  aria-label="Remove selected resume"
                >
                  <X size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-neutral-900">
                {language === "bn"
                  ? "চাকরির পদ"
                  : "Job title"}
              </span>

              <input
                value={jobTitle}
                onChange={(event) =>
                  setJobTitle(
                    event.target.value,
                  )
                }
                placeholder={
                  language === "bn"
                    ? "ফ্রন্টএন্ড ডেভেলপার"
                    : "Frontend Developer"
                }
                className="min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-neutral-900">
                {language === "bn"
                  ? "কোম্পানির নাম"
                  : "Company name"}
              </span>

              <input
                value={companyName}
                onChange={(event) =>
                  setCompanyName(
                    event.target.value,
                  )
                }
                placeholder={
                  language === "bn"
                    ? "উদাহরণ কোম্পানি"
                    : "Example Company"
                }
                className="min-h-12 w-full rounded-xl border border-neutral-300 bg-white px-4 text-sm text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-neutral-900">
              {language === "bn"
                ? "চাকরির বিবরণ"
                : "Job description"}
            </span>

            <textarea
              value={jobDescription}
              onChange={(event) =>
                setJobDescription(
                  event.target.value,
                )
              }
              rows={12}
              minLength={50}
              required
              placeholder={
                language === "bn"
                  ? "সম্পূর্ণ চাকরির বিবরণ এখানে লিখুন..."
                  : "Paste the complete job description here..."
              }
              className="w-full resize-y rounded-xl border border-neutral-300 bg-white p-4 text-sm leading-7 text-neutral-950 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10"
            />
          </label>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="flex min-h-13 w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-bold text-neutral-50 transition hover:-translate-y-0.5 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending
              ? language === "bn"
                ? "বিশ্লেষণ করা হচ্ছে..."
                : "Analyzing..."
              : language === "bn"
                ? "রিজিউম বিশ্লেষণ করুন"
                : "Analyze resume"}
          </button>

          {mutation.isError && (
            <p className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              {mutation.error instanceof Error
                ? mutation.error.message
                : language === "bn"
                  ? "বিশ্লেষণ ব্যর্থ হয়েছে।"
                  : "Analysis failed."}
            </p>
          )}

          {saveMessage && (
            <p className="rounded-xl border border-green-300 bg-green-50 p-4 text-sm text-green-800">
              {saveMessage}
            </p>
          )}

          {saveError && (
            <p className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
              {saveError}
            </p>
          )}
        </form>
      </section>

      <section className="min-w-0">
        {analysis ? (
          <div className="rounded-[2rem] border border-neutral-300 bg-neutral-50 p-6 shadow-sm sm:p-8">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
              {language === "bn"
                ? "বিশ্লেষণ সম্পন্ন"
                : "Analysis complete"}
            </p>

            <h2 className="mt-3 text-3xl font-bold text-neutral-950">
              {analysis.overallScore}/100{" "}
              {language === "bn"
                ? "ATS স্কোর"
                : "ATS score"}
            </h2>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Object.entries(
                analysis.scores,
              ).map(([name, score]) => (
                <article
                  key={name}
                  className="rounded-2xl border border-neutral-300 bg-neutral-100 p-4"
                >
                  <span className="text-xs capitalize text-neutral-500">
                    {name}
                  </span>

                  <strong className="mt-2 block text-2xl text-neutral-950">
                    {score}
                  </strong>
                </article>
              ))}
            </div>

            <ResultSection
              title={
                language === "bn"
                  ? "মিলে যাওয়া কীওয়ার্ড"
                  : "Matched keywords"
              }
              items={
                analysis.matchedKeywords
              }
              tags
            />

            <ResultSection
              title={
                language === "bn"
                  ? "অনুপস্থিত কীওয়ার্ড"
                  : "Missing keywords"
              }
              items={
                analysis.missingKeywords
              }
              tags
            />

            <ResultSection
              title={
                language === "bn"
                  ? "পরামর্শ"
                  : "Recommendations"
              }
              items={
                analysis.recommendations
              }
            />
          </div>
        ) : (
          <div className="flex min-h-96 flex-col items-center justify-center rounded-[2rem] border border-dashed border-neutral-300 bg-neutral-100/60 p-8 text-center">
            <FileText
              size={30}
              className="text-neutral-400"
            />

            <h2 className="mt-5 text-lg font-bold text-neutral-800">
              {language === "bn"
                ? "আপনার বিশ্লেষণ এখানে দেখা যাবে"
                : "Your analysis will appear here"}
            </h2>

            <p className="mt-2 max-w-sm text-sm leading-6 text-neutral-500">
              {language === "bn"
                ? "রিজিউম ও চাকরির বিবরণ জমা দেওয়ার পর ATS স্কোর এবং পরামর্শ এখানে দেখানো হবে।"
                : "After submitting your resume and job description, the ATS score and recommendations will appear here."}
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

function ResultSection({
  title,
  items,
  tags = false,
}: {
  title: string;
  items: string[];
  tags?: boolean;
}) {
  return (
    <section className="mt-8">
      <h3 className="text-base font-bold text-neutral-950">
        {title}
      </h3>

      {items.length === 0 ? (
        <p className="mt-3 text-sm text-neutral-500">
          No items available.
        </p>
      ) : tags ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <span
              key={item}
              className="rounded-full border border-neutral-300 bg-neutral-100 px-3 py-1.5 text-xs text-neutral-700"
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <ul className="mt-3 space-y-3">
          {items.map((item) => (
            <li
              key={item}
              className="rounded-xl border border-neutral-300 bg-neutral-100 p-4 text-sm leading-6 text-neutral-700"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}