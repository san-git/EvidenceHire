import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = createSupabaseServer();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = (await request.json()) as { name?: string; description?: string };
    const name = body.name?.trim();

    if (!name) {
      return NextResponse.json({ error: "Project name is required." }, { status: 400 });
    }

    const { data: project, error } = await supabase
      .from("projects")
      .insert({
        name,
        description: body.description ?? null,
        created_by: user.id
      })
      .select()
      .single();

    if (error || !project) {
      return NextResponse.json({ error: error?.message ?? "Unable to create project." }, { status: 500 });
    }

    await supabase.from("project_members").insert({
      project_id: project.id,
      user_id: user.id,
      role: "owner"
    });

    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json({ error: "Unable to create project." }, { status: 500 });
  }
}
