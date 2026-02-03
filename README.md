# EvidenceHire

EvidenceHire is an evidence-first recruitment sourcing app. It helps recruiters and hiring teams match multiple job descriptions with multiple resumes, explain every score, and collaborate on a traceable decision trail.

## What makes it different

- Evidence-first scoring with traceable highlights.
- Multi-JD and multi-resume batch matching.
- Bias-aware screening and missing-evidence flags.
- Recruiter workspace for projects, notes, and collaboration.
- Matching API endpoint with explainable evidence output.

## Tech stack (default path)

- Web app: Next.js (App Router)
- Hosting: Vercel
- Database + storage: Supabase (Postgres + Storage)
- Search + matching: pgvector embeddings

## Getting started

1. Install dependencies

```bash
npm install
```

2. Start the dev server

```bash
npm run dev
```

3. Open `http://localhost:3000`

4. Visit `/login` to sign in and create your first project.

## Environment variables

Create a `.env.local` with the following:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_UPLOAD_BUCKET=resumes
OPENAI_API_KEY=
OPENAI_BASE_URL=
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
MATCH_USE_EMBEDDINGS=true
MATCH_EMBEDDING_WEIGHT=0.7
```

## Supabase setup

1. Create a Supabase project.
2. Run the schema in `supabase/schema.sql` (SQL editor).
3. Create a Storage bucket named `resumes` for file uploads (or set `SUPABASE_UPLOAD_BUCKET`).
4. Add your project URL and anon key to `.env.local`.
5. Add your service role key if you plan to ingest files server-side.

## Matching API

POST `/api/match` with:

```
{
  "jds": [{ "title": "Role title", "text": "JD text" }],
  "resumes": [{ "name": "Candidate name", "text": "Resume text" }]
}
```

The current scoring uses evidence-based token overlap for the beta. Replace with embeddings
when you wire the production pipeline.

## File parsing

POST `/api/parse` with multipart form data using `files` fields. Supported formats:

- `.pdf`
- `.docx`
- `.txt`

## Ingestion API

POST `/api/ingest` with multipart form data:

- `projectId`
- `type` = `role` or `candidate`
- `files` (PDF/DOCX/TXT)

This will parse, optionally embed, upload to Supabase Storage, and insert rows into `roles`
or `candidates`.

## Product docs

- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
