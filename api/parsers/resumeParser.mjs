import mammoth from "mammoth";
import pdf from "pdf-parse";

export async function parseResumeFile(file) {
  if (!file) {
    throw new Error("Resume file is required");
  }

  const mimeType = file.mimetype;

  if (mimeType === "text/plain") {
    return file.buffer.toString("utf-8");
  }

  if (mimeType === "application/pdf") {
    const result = await pdf(file.buffer);
    return result.text.trim();
  }

  if (
    mimeType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: file.buffer,
    });

    return result.value.trim();
  }

  throw new Error("Only PDF, DOCX, and TXT files are supported");
}