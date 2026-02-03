import { NextResponse } from "next/server";
import { computeMatches, JDInput, ResumeInput } from "@/lib/matching/scoring";

const normalizeEntries = (items: Array<{ text: string; title?: string; name?: string }>, prefix: string) =>
  items
    .map((item, index) => ({
      id: `${prefix}-${index + 1}`,
      title: item.title ?? item.name ?? `${prefix.toUpperCase()} ${index + 1}`,
      name: item.name ?? item.title ?? `${prefix.toUpperCase()} ${index + 1}`,
      text: item.text
    }))
    .filter((item) => item.text && item.text.trim().length > 0);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      jds?: Array<{ text: string; title?: string }>;
      resumes?: Array<{ text: string; name?: string }>;
    };

    const jds = normalizeEntries(body.jds ?? [], "jd") as JDInput[];
    const resumes = normalizeEntries(body.resumes ?? [], "resume") as ResumeInput[];

    if (jds.length === 0 || resumes.length === 0) {
      return NextResponse.json(
        { error: "Please provide at least one JD and one resume." },
        { status: 400 }
      );
    }

    const result = computeMatches(jds, resumes);

    return NextResponse.json({
      ...result,
      meta: {
        jdCount: jds.length,
        resumeCount: resumes.length
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Unable to process match request." },
      { status: 500 }
    );
  }
}
