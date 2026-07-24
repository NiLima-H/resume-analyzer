import { extractKeywords } from "../utils/extractKeywords.mjs";

function clampScore(score) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function calculateMatchScore(targetKeywords, resumeKeywords) {
  if (targetKeywords.length === 0) {
    return 0;
  }

  const resumeSet = new Set(resumeKeywords);
  const matched = targetKeywords.filter((keyword) => resumeSet.has(keyword));

  return clampScore((matched.length / targetKeywords.length) * 100);
}

export function calculateAtsScore(resumeText, jobDescription) {
  const resumeKeywords = extractKeywords(resumeText);
  const jobKeywords = extractKeywords(jobDescription);

  const resumeSet = new Set(resumeKeywords);

  const matchedKeywords = jobKeywords.filter((keyword) =>
    resumeSet.has(keyword),
  );

  const missingKeywords = jobKeywords.filter(
    (keyword) => !resumeSet.has(keyword),
  );

  const keywordScore = calculateMatchScore(jobKeywords, resumeKeywords);

  const commonSkillTerms = [
    "javascript",
    "typescript",
    "react",
    "node",
    "express",
    "python",
    "java",
    "golang",
    "sql",
    "postgresql",
    "mongodb",
    "docker",
    "aws",
    "git",
    "api",
    "machine",
    "learning",
  ];

  const requiredSkills = jobKeywords.filter((keyword) =>
    commonSkillTerms.includes(keyword),
  );

  const skillsScore =
    requiredSkills.length > 0
      ? calculateMatchScore(requiredSkills, resumeKeywords)
      : keywordScore;

  const experienceTerms = [
    "experience",
    "developed",
    "built",
    "managed",
    "designed",
    "implemented",
    "led",
    "created",
  ];

  const experienceHits = experienceTerms.filter((term) =>
    resumeText.toLowerCase().includes(term),
  ).length;

  const experienceScore = clampScore(
    (experienceHits / experienceTerms.length) * 100,
  );

  const educationTerms = [
    "education",
    "university",
    "college",
    "bachelor",
    "master",
    "degree",
  ];

  const educationHits = educationTerms.filter((term) =>
    resumeText.toLowerCase().includes(term),
  ).length;

  const educationScore = clampScore(
    (educationHits / educationTerms.length) * 100,
  );

  const structureSections = [
    "summary",
    "skills",
    "experience",
    "education",
    "projects",
  ];

  const structureHits = structureSections.filter((section) =>
    resumeText.toLowerCase().includes(section),
  ).length;

  const structureScore = clampScore(
    (structureHits / structureSections.length) * 100,
  );

  const overallScore = clampScore(
    keywordScore * 0.35 +
      skillsScore * 0.25 +
      experienceScore * 0.2 +
      educationScore * 0.1 +
      structureScore * 0.1,
  );

  return {
    overallScore,
    scores: {
      keywords: keywordScore,
      skills: skillsScore,
      experience: experienceScore,
      education: educationScore,
      structure: structureScore,
    },
    matchedKeywords: matchedKeywords.slice(0, 30),
    missingKeywords: missingKeywords.slice(0, 30),
  };
}