const OPENROUTER_URL =
  "https://openrouter.ai/api/v1/chat/completions";

const HUGGING_FACE_URL =
  "https://router.huggingface.co/v1/chat/completions";

function buildSystemPrompt(language = "en") {
  const outputLanguage =
    language === "bn" ? "Bangla" : "English";

  return `
You are an expert ATS resume reviewer and career assistant.

Your task is to improve an existing deterministic resume analysis.

Rules:
1. Use only information found in the resume and job description.
2. Do not invent employers, qualifications, achievements, dates, skills, or metrics.
3. Give practical and specific feedback.
4. Preserve the candidate's real experience.
5. Return only valid JSON.
6. Do not wrap the JSON in markdown code fences.
7. Write every text value in ${outputLanguage}.

Return exactly this JSON structure:
{
  "strengths": ["string"],
  "weaknesses": ["string"],
  "recommendations": ["string"],
  "improvedSummary": "string",
  "improvedBullets": ["string"]
}

Requirements:
- strengths: 3 to 5 concise items
- weaknesses: 3 to 5 concise items
- recommendations: 4 to 7 actionable items
- improvedSummary: one professional resume summary
- improvedBullets: 3 to 6 rewritten bullet points
`.trim();
}

function buildUserPrompt({
  resumeText,
  jobDescription,
  analysis,
}) {
  return `
RESUME:
${resumeText || "Resume text was not available."}

JOB DESCRIPTION:
${jobDescription}

DETERMINISTIC ATS ANALYSIS:
${JSON.stringify(
  {
    overallScore: analysis.overallScore,
    scores: analysis.scores,
    matchedKeywords: analysis.matchedKeywords,
    missingKeywords: analysis.missingKeywords,
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
    recommendations: analysis.recommendations,
  },
  null,
  2,
)}
`.trim();
}

function extractText(responseData) {
  const content =
    responseData?.choices?.[0]?.message?.content;

  if (typeof content !== "string" || !content.trim()) {
    throw new Error("AI provider returned an empty response.");
  }

  return content.trim();
}

function parseJsonResponse(content) {
  const withoutCodeFence = content
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    return JSON.parse(withoutCodeFence);
  } catch {
    const firstBrace = withoutCodeFence.indexOf("{");
    const lastBrace = withoutCodeFence.lastIndexOf("}");

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("AI response did not contain valid JSON.");
    }

    return JSON.parse(
      withoutCodeFence.slice(firstBrace, lastBrace + 1),
    );
  }
}

function normalizeStringArray(value, fallback = []) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function validateFeedback(feedback, analysis) {
  if (!feedback || typeof feedback !== "object") {
    throw new Error("AI feedback has an invalid format.");
  }

  return {
    strengths: normalizeStringArray(
      feedback.strengths,
      analysis.strengths,
    ),

    weaknesses: normalizeStringArray(
      feedback.weaknesses,
      analysis.weaknesses,
    ),

    recommendations: normalizeStringArray(
      feedback.recommendations,
      analysis.recommendations,
    ),

    improvedSummary:
      typeof feedback.improvedSummary === "string"
        ? feedback.improvedSummary.trim()
        : analysis.improvedSummary || "",

    improvedBullets: normalizeStringArray(
      feedback.improvedBullets,
      analysis.improvedBullets,
    ),
  };
}

async function requestChatCompletion({
  url,
  apiKey,
  model,
  systemPrompt,
  userPrompt,
  providerName,
  extraHeaders = {},
}) {
  if (!apiKey) {
    throw new Error(`${providerName} API key is missing.`);
  }

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 45_000);

  try {
    const response = await fetch(url, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...extraHeaders,
      },

      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userPrompt,
          },
        ],
        temperature: 0.2,
        max_tokens: 1400,
        response_format: {
          type: "json_object",
        },
      }),

      signal: controller.signal,
    });

    const responseData = await response.json().catch(() => null);

    if (!response.ok) {
      const providerMessage =
        responseData?.error?.message ||
        responseData?.message ||
        `HTTP ${response.status}`;

      throw new Error(
        `${providerName} request failed: ${providerMessage}`,
      );
    }

    const content = extractText(responseData);

    return parseJsonResponse(content);
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new Error(
        `${providerName} request timed out.`,
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function requestOpenRouter({
  systemPrompt,
  userPrompt,
}) {
  return requestChatCompletion({
    url: OPENROUTER_URL,
    apiKey: process.env.OPENROUTER_API_KEY,
    model:
      process.env.OPENROUTER_MODEL ||
      "~openai/gpt-latest",
    systemPrompt,
    userPrompt,
    providerName: "OpenRouter",

    extraHeaders: {
      "HTTP-Referer":
        process.env.APP_URL || "http://localhost:5173",
      "X-OpenRouter-Title": "Resume Analyzer",
    },
  });
}

async function requestHuggingFace({
  systemPrompt,
  userPrompt,
}) {
  return requestChatCompletion({
    url: HUGGING_FACE_URL,
    apiKey: process.env.HF_TOKEN,
    model:
      process.env.HF_MODEL ||
      "openai/gpt-oss-120b",
    systemPrompt,
    userPrompt,
    providerName: "Hugging Face",
  });
}

export async function generateAiFeedback({
  resumeText,
  jobDescription,
  analysis,
  language = "en",
}) {
  const systemPrompt = buildSystemPrompt(language);

  const userPrompt = buildUserPrompt({
    resumeText,
    jobDescription,
    analysis,
  });

  try {
    console.log("Requesting feedback from OpenRouter...");

    const feedback = await requestOpenRouter({
      systemPrompt,
      userPrompt,
    });

    return {
      ...validateFeedback(feedback, analysis),
      aiProvider: "openrouter",
    };
  } catch (openRouterError) {
    console.error(
      "OpenRouter failed:",
      openRouterError instanceof Error
        ? openRouterError.message
        : openRouterError,
    );
  }

  try {
    console.log(
      "Using Hugging Face as the fallback provider...",
    );

    const feedback = await requestHuggingFace({
      systemPrompt,
      userPrompt,
    });

    return {
      ...validateFeedback(feedback, analysis),
      aiProvider: "huggingface",
    };
  } catch (huggingFaceError) {
    console.error(
      "Hugging Face fallback failed:",
      huggingFaceError instanceof Error
        ? huggingFaceError.message
        : huggingFaceError,
    );
  }

  return {
    strengths: analysis.strengths,
    weaknesses: analysis.weaknesses,
    recommendations: analysis.recommendations,
    improvedSummary: analysis.improvedSummary || "",
    improvedBullets: analysis.improvedBullets || [],
    aiProvider: "deterministic",
  };
}