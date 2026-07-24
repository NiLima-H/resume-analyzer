import { randomUUID } from "node:crypto";

import { Router } from "express";
import multer from "multer";
import { z } from "zod";

import { calculateAtsScore } from "../ats/calculateAtsScore.mjs";
import { generateAiFeedback } from "../ai/aiFeedback.mjs";
import { parseResumeFile } from "../parsers/resumeParser.mjs";
import { extractTextWithOcrSpace } from "../ocr/ocrSpace.mjs";

const router = Router();

const allowedMimeTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/png",
  "image/jpeg",
  "image/jpg",
];

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (_request, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(
        new Error(
          "Only PDF, DOCX, TXT, PNG, JPG and JPEG files are supported.",
        ),
      );

      return;
    }

    callback(null, true);
  },
});

const analysisInputSchema = z.object({
  jobDescription: z.string().min(50, "Job description is too short"),
  jobTitle: z
    .string()
    .max(100)
    .optional()
    .default("Untitled role"),
  companyName: z
    .string()
    .max(100)
    .optional()
    .default("Unknown company"),
  language: z
    .enum(["en", "bn"])
    .optional()
    .default("en"),
});

router.post(
  "/analyze",
  upload.single("resume"),
  async (request, response) => {
    try {
      // 1. Check whether a resume was uploaded
      if (!request.file) {
        return response.status(400).json({
          success: false,
          message: "Please upload a resume",
        });
      }

      // 2. Validate job title, company, language and job description
      const input = analysisInputSchema.parse(
        request.body,
      );

      // 3. Extract text from the uploaded resume
     // 3. Extract text from the uploaded resume
let resumeText = await parseResumeFile(
  request.file,
);

let parserUsed = "standard";

if (resumeText.trim().length < 50) {
  console.log(
    "Standard parser found little text. Trying OCR.Space...",
  );

  resumeText =
    await extractTextWithOcrSpace(
      request.file,
      input.language,
    );

  parserUsed = "ocr-space";
}

if (resumeText.trim().length < 50) {
  return response.status(422).json({
    success: false,
    message:
      "The uploaded resume did not contain enough readable text.",
  });
}

      // 4. Calculate the normal ATS scores
      const atsResult = calculateAtsScore(
        resumeText,
        input.jobDescription,
      );

      // 5. Create the normal deterministic analysis
      const analysis = {
        id: randomUUID(),
        resumeName: request.file.originalname,
        jobTitle: input.jobTitle,
        companyName: input.companyName,
        parserUsed,

        ...atsResult,

        strengths: [
          "The resume contains recognizable professional sections.",
        ],

        weaknesses:
          atsResult.missingKeywords.length > 0
            ? [
                "Several job-description keywords are missing.",
              ]
            : [],

        recommendations:
          atsResult.missingKeywords
            .slice(0, 5)
            .map(
              (keyword) =>
                `Add relevant evidence for "${keyword}".`,
            ),

        improvedSummary: "",
        improvedBullets: [],
        createdAt: new Date().toISOString(),
      };

      // 6. Send the resume and ATS result to OpenRouter.
      // If OpenRouter fails, aiFeedback.mjs will try Hugging Face.
      const aiFeedback =
        await generateAiFeedback({
          resumeText,
          jobDescription:
            input.jobDescription,
          analysis,
          language: input.language,
        });

      // 7. Combine ATS scores with AI feedback
      const finalAnalysis = {
        ...analysis,

        strengths:
          aiFeedback.strengths,

        weaknesses:
          aiFeedback.weaknesses,

        recommendations:
          aiFeedback.recommendations,

        improvedSummary:
          aiFeedback.improvedSummary,

        improvedBullets:
          aiFeedback.improvedBullets,

        aiProvider:
          aiFeedback.aiProvider,
      };

      // 8. Send the completed analysis to React
      return response.status(201).json({
        success: true,
        analysis: finalAnalysis,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return response.status(400).json({
          success: false,
          message:
            error.issues[0]?.message ||
            "Invalid input",
        });
      }

      console.error(
        "Resume analysis failed:",
        error,
      );

      return response.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Resume analysis failed",
      });
    }
  },
);

export default router;