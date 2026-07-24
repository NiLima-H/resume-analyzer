import {
  ArrowRight,
  BriefcaseBusiness,
  FileCheck2,
  FileSearch,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import {
  useMemo,
} from "react";
import {
  Link,
} from "react-router-dom";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  useQuery,
} from "@tanstack/react-query";

import {
  getDashboardAnalyses,
} from "../services/dashboardService";
import { useLanguage } from "../contexts/LanguageContext";

function formatDate(date: string) {
  return new Intl.DateTimeFormat(
    "en",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(new Date(date));
}

function getScoreLabel(score: number) {
  if (score >= 80) return "Excellent";
  if (score >= 65) return "Strong";
  if (score >= 50) return "Developing";
  return "Needs work";
}

function ScoreCircle({
  score,
}: {
  score: number;
}) {
  return (
    <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-[10px] border-neutral-200 bg-neutral-50 shadow-inner">
      <div className="text-center">
        <p className="text-2xl font-bold text-neutral-950">
          {score}
        </p>
        <p className="text-[10px] uppercase tracking-wider text-neutral-500">
          ATS
        </p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { t, language } = useLanguage();
  const {
    data: analyses = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard-analyses"],
    queryFn: getDashboardAnalyses,
  });

  const statistics = useMemo(() => {
    const analysisCount = analyses.length;

    const averageScore =
      analysisCount === 0
        ? 0
        : Math.round(
            analyses.reduce(
              (total, item) =>
                total +
                Number(
                  item.ats_score || 0,
                ),
              0,
            ) / analysisCount,
          );

    const highestScore =
      analysisCount === 0
        ? 0
        : Math.max(
            ...analyses.map((item) =>
              Number(
                item.ats_score || 0,
              ),
            ),
          );

    const totalMatches =
      analyses.reduce(
        (total, item) =>
          total +
          (item.matched_keywords?.length ||
            0),
        0,
      );

    return {
      analysisCount,
      averageScore,
      highestScore,
      totalMatches,
    };
  }, [analyses]);

  const chartData = useMemo(() => {
    return [...analyses]
      .reverse()
      .slice(-8)
      .map((item) => ({
        date: new Intl.DateTimeFormat(
          "en",
          {
            day: "numeric",
            month: "short",
          },
        ).format(
          new Date(item.created_at),
        ),

        score: Number(
          item.ats_score || 0,
        ),
      }));
  }, [analyses]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-44 animate-pulse rounded-[2rem] bg-neutral-200" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl bg-neutral-200"
              />
            ),
          )}
        </div>
      </div>
    );
  }



  return (
    <div className="space-y-8">
      {error && (
  <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
    Saved analyses could not be loaded. The dashboard is showing empty data.
  </div>
)}
      <section className="relative overflow-hidden rounded-[2rem] border border-neutral-300 bg-neutral-950 px-6 py-10 text-neutral-50 shadow-xl sm:px-10">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border border-neutral-700" />
        <div className="absolute -right-4 -top-6 h-40 w-40 rounded-full border border-neutral-700" />

        <div className="relative z-10 max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs text-neutral-300">
            <Sparkles size={13} />
            {t.dashboard.heroBadge}
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            {t.dashboard.heroTitle}
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-300 sm:text-base">
  {t.dashboard.heroDescription}
</p>

          <Link
            to="/analyze"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-neutral-50 px-5 py-3 text-sm font-bold text-neutral-950 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
          >
            {t.dashboard.analyzeResume}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total analyses"
          value={statistics.analysisCount}
          description="Completed resume reviews"
          icon={<FileCheck2 size={20} />}
        />

        <StatCard
          title="Average ATS"
          value={`${statistics.averageScore}%`}
          description="Across saved analyses"
          icon={<TrendingUp size={20} />}
        />

        <StatCard
          title="Highest score"
          value={`${statistics.highestScore}%`}
          description="Your strongest result"
          icon={<Target size={20} />}
        />

        <StatCard
          title="Keyword matches"
          value={statistics.totalMatches}
          description="Relevant terms detected"
          icon={
            <BriefcaseBusiness size={20} />
          }
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <div className="rounded-[1.75rem] border border-neutral-300 bg-neutral-50 p-5 shadow-sm sm:p-7">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
                Progress
              </p>

              <h2 className="mt-2 text-xl font-bold text-neutral-950">
                ATS score history
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Your latest eight resume
                analyses.
              </p>
            </div>

            <div className="rounded-xl bg-neutral-200 p-3 text-neutral-700">
              <TrendingUp size={20} />
            </div>
          </div>

          {chartData.length > 0 ? (
            <div className="h-72 w-full">
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="#d4d4d4"
                  />

                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontFamily:
                        "Courier New",
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontFamily:
                        "Courier New",
                      fontSize: 11,
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border:
                        "1px solid #d4d4d4",
                      fontFamily:
                        "Courier New",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#171717"
                    strokeWidth={3}
                    dot={{
                      fill: "#fafafa",
                      stroke: "#171717",
                      strokeWidth: 2,
                      r: 4,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <EmptyChart />
          )}
        </div>

        <div className="rounded-[1.75rem] border border-neutral-300 bg-neutral-200/70 p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
            Current performance
          </p>

          <div className="mt-7 flex justify-center">
            <ScoreCircle
              score={
                statistics.averageScore
              }
            />
          </div>

          <div className="mt-6 text-center">
            <p className="text-lg font-bold text-neutral-950">
              {getScoreLabel(
                statistics.averageScore,
              )}
            </p>

            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Keep tailoring each resume
              specifically to its target job
              description.
            </p>
          </div>

          <Link
            to="/analyze"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-400 bg-neutral-50 px-4 py-3 text-sm font-bold text-neutral-900 transition hover:bg-neutral-950 hover:text-neutral-50"
          >
            Start new analysis
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-neutral-500">
              Activity
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Recent analyses
            </h2>
          </div>

          <Link
            to="/analyze"
            className="hidden text-sm font-semibold text-neutral-600 underline-offset-4 hover:text-neutral-950 hover:underline sm:block"
          >
            Create analysis
          </Link>
        </div>

        {analyses.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-neutral-400 bg-neutral-50 px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-200 text-neutral-700">
              <FileSearch size={24} />
            </div>

            <h3 className="mt-5 text-lg font-bold">
              No analysis yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-500">
              Upload your first resume and
              compare it against a job
              description.
            </p>

            <Link
              to="/analyze"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-bold text-neutral-50"
            >
              Analyze first resume
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {analyses
              .slice(0, 6)
              .map((analysis) => (
                <article
                  key={analysis.id}
                  className="group grid gap-5 rounded-2xl border border-neutral-300 bg-neutral-50 p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-neutral-500 hover:shadow-md sm:grid-cols-[1fr_auto] sm:items-center"
                >
                  <div className="flex min-w-0 items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-neutral-200 text-neutral-800 transition group-hover:bg-neutral-950 group-hover:text-neutral-50">
                      <FileCheck2
                        size={21}
                      />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-bold text-neutral-950">
                        {analysis.job_title ||
                          "Untitled role"}
                      </h3>

                      <p className="mt-1 truncate text-sm text-neutral-500">
                        {analysis.company_name ||
                          "Unknown company"}
                        {" · "}
                        {analysis.resume_name}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="rounded-full bg-neutral-200 px-3 py-1 text-[11px] text-neutral-700">
                          {
                            analysis
                              .matched_keywords
                              ?.length || 0
                          }{" "}
                          matches
                        </span>

                        <span className="rounded-full bg-neutral-200 px-3 py-1 text-[11px] text-neutral-700">
                          {
                            analysis
                              .missing_keywords
                              ?.length || 0
                          }{" "}
                          missing
                        </span>

                        <span className="rounded-full bg-neutral-200 px-3 py-1 text-[11px] text-neutral-700">
                          {formatDate(
                            analysis.created_at,
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-5 sm:justify-end">
                    <div className="text-right">
                      <p className="text-3xl font-bold text-neutral-950">
                        {
                          analysis.ats_score
                        }
                      </p>

                      <p className="text-[10px] uppercase tracking-wider text-neutral-500">
                        ATS score
                      </p>
                    </div>

                    <div className="h-12 w-px bg-neutral-300" />

                    <ArrowRight
                      size={18}
                      className="text-neutral-400 transition group-hover:translate-x-1 group-hover:text-neutral-950"
                    />
                  </div>
                </article>
              ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="group rounded-2xl border border-neutral-300 bg-neutral-50 p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-neutral-500 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-neutral-200 p-3 text-neutral-800 transition group-hover:bg-neutral-950 group-hover:text-neutral-50">
          {icon}
        </div>

        <span className="text-xs text-neutral-400">
          LIVE
        </span>
      </div>

      <p className="mt-6 text-3xl font-bold tracking-tight text-neutral-950">
        {value}
      </p>

      <h3 className="mt-2 text-sm font-bold text-neutral-800">
        {title}
      </h3>

      <p className="mt-1 text-xs leading-5 text-neutral-500">
        {description}
      </p>
    </article>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-100">
      <TrendingUp
        size={28}
        className="text-neutral-400"
      />

      <p className="mt-4 text-sm font-bold text-neutral-700">
        Your score chart will appear here
      </p>

      <p className="mt-2 text-xs text-neutral-500">
        Complete at least one analysis.
      </p>
    </div>
  );
}