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

## Environment variables

Create a `.env.local` with the following:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

## Supabase setup

1. Create a Supabase project.
2. Run the schema in `supabase/schema.sql` (SQL editor).
3. Create a Storage bucket named `resumes` for file uploads.
4. Add your project URL and anon key to `.env.local`.

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

## Product docs

- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
