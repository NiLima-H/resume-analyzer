const OCR_SPACE_URL =
  "https://api.ocr.space/Parse/Image";

function getOcrLanguage(language) {
  return language === "bn" ? "ben" : "eng";
}

export async function extractTextWithOcrSpace(
  file,
  language = "en",
) {
  const apiKey = process.env.OCR_SPACE_API_KEY;

  if (!apiKey) {
    throw new Error(
      "OCR_SPACE_API_KEY is missing from the backend environment.",
    );
  }

  if (!file?.buffer) {
    throw new Error("No file buffer was provided for OCR.");
  }

  const formData = new FormData();

  const fileBlob = new Blob([file.buffer], {
    type:
      file.mimetype ||
      "application/octet-stream",
  });

  formData.append(
    "file",
    fileBlob,
    file.originalname || "resume.pdf",
  );

  formData.append(
    "language",
    getOcrLanguage(language),
  );

  formData.append(
    "isOverlayRequired",
    "false",
  );

  formData.append(
    "detectOrientation",
    "true",
  );

  formData.append(
    "scale",
    "true",
  );

  formData.append(
    "OCREngine",
    "2",
  );

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 60_000);

  try {
    const response = await fetch(
      OCR_SPACE_URL,
      {
        method: "POST",

        headers: {
          apikey: apiKey,
        },

        body: formData,
        signal: controller.signal,
      },
    );

    const data = await response
      .json()
      .catch(() => null);

    if (!response.ok) {
      throw new Error(
        `OCR.Space failed with status ${response.status}.`,
      );
    }

    if (data?.IsErroredOnProcessing) {
      const message = Array.isArray(
        data.ErrorMessage,
      )
        ? data.ErrorMessage.join(" ")
        : data.ErrorMessage;

      throw new Error(
        message ||
          "OCR.Space could not process the resume.",
      );
    }

    const parsedResults =
      data?.ParsedResults;

    if (!Array.isArray(parsedResults)) {
      throw new Error(
        "OCR.Space returned no parsed results.",
      );
    }

    const extractedText = parsedResults
      .map((result) => result?.ParsedText || "")
      .join("\n")
      .trim();

    if (!extractedText) {
      throw new Error(
        "OCR.Space could not find readable text.",
      );
    }

    return extractedText;
  } catch (error) {
    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new Error(
        "OCR.Space request timed out.",
      );
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}