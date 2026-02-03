import { NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/parsers/extractText";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("files").filter((item) => item instanceof File) as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    const parsed = await Promise.all(
      files.map(async (file) => {
        try {
          const result = await extractTextFromFile(file);
          return {
            filename: result.filename,
            text: result.text,
            fileType: result.fileType
          };
        } catch (error) {
          return {
            filename: file.name,
            text: "",
            fileType: "unknown",
            error: "Unable to parse file"
          };
        }
      })
    );

    return NextResponse.json({ files: parsed });
  } catch (error) {
    return NextResponse.json({ error: "Unable to parse files." }, { status: 500 });
  }
}
