const normalizeWhitespace = (text: string) =>
  text
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[\t\f\v]+/g, " ")
    .trim();

const getExtension = (filename: string) =>
  filename.toLowerCase().split(".").pop() ?? "";

export type ParsedFile = {
  filename: string;
  text: string;
  fileType: string;
};

export const extractTextFromFile = async (file: File): Promise<ParsedFile> => {
  const extension = getExtension(file.name);
  const buffer = Buffer.from(await file.arrayBuffer());

  let text = "";
  let fileType = extension;

  if (extension === "pdf") {
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    text = data.text ?? "";
  } else if (extension === "docx") {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    text = result.value ?? "";
  } else {
    const decoder = new TextDecoder();
    text = decoder.decode(buffer);
    if (!fileType) {
      fileType = "txt";
    }
  }

  return {
    filename: file.name,
    text: normalizeWhitespace(text),
    fileType
  };
};
