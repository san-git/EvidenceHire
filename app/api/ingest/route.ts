import { NextResponse } from "next/server";
import { extractTextFromFile } from "@/lib/parsers/extractText";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { embedTexts, shouldUseEmbeddings } from "@/lib/matching/embeddings";

export const runtime = "nodejs";

const bucketName = process.env.SUPABASE_UPLOAD_BUCKET ?? "resumes";

const stripExtension = (name: string) => name.replace(/\.[^/.]+$/, "");

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const projectId = formData.get("projectId")?.toString();
    const type = formData.get("type")?.toString();
    const files = formData.getAll("files").filter((item) => item instanceof File) as File[];

    if (!projectId || !type) {
      return NextResponse.json({ error: "Missing projectId or type." }, { status: 400 });
    }

    if (files.length === 0) {
      return NextResponse.json({ error: "No files received." }, { status: 400 });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
      return NextResponse.json(
        { error: "Supabase admin credentials are not configured." },
        { status: 500 }
      );
    }

    const parsed = await Promise.all(files.map((file) => extractTextFromFile(file)));
    const shouldEmbed = shouldUseEmbeddings();
    const embeddingBatch = shouldEmbed
      ? await embedTexts(parsed.map((item) => item.text))
      : null;

    const rows = parsed.map((item, index) => {
      const baseName = stripExtension(item.filename);
      const embedding = embeddingBatch?.vectors?.[index] ?? null;
      if (type === "role") {
        return {
          project_id: projectId,
          title: baseName,
          jd_text: item.text,
          jd_file_path: null,
          jd_embedding: embedding
        };
      }
      return {
        project_id: projectId,
        name: baseName,
        resume_text: item.text,
        resume_file_path: null,
        resume_embedding: embedding
      };
    });

    const uploads = await Promise.all(
      files.map(async (file, index) => {
        const path = `${projectId}/${type}/${Date.now()}-${file.name}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        const result = await supabaseAdmin.storage
          .from(bucketName)
          .upload(path, buffer, { contentType: file.type, upsert: true });

        if (result.error) {
          return { path: null, error: result.error.message };
        }
        return { path, error: null, index };
      })
    );

    uploads.forEach((upload, index) => {
      if (!upload.path) return;
      if (type === "role") {
        (rows[index] as { jd_file_path: string | null }).jd_file_path = upload.path;
      } else {
        (rows[index] as { resume_file_path: string | null }).resume_file_path = upload.path;
      }
    });

    if (type === "role") {
      const { error } = await supabaseAdmin.from("roles").insert(rows);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else if (type === "candidate") {
      const { error } = await supabaseAdmin.from("candidates").insert(rows);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: "Invalid type." }, { status: 400 });
    }

    return NextResponse.json({
      status: "ok",
      parsed: parsed.length,
      uploaded: uploads.filter((item) => item.path).length
    });
  } catch (error) {
    return NextResponse.json({ error: "Unable to ingest files." }, { status: 500 });
  }
}
