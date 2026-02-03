# EvidenceHire

EvidenceHire is an evidence-first recruitment sourcing app. It helps recruiters and hiring teams match multiple job descriptions with multiple resumes, explain every score, and collaborate on a traceable decision trail.

## What makes it different

- Evidence-first scoring with traceable highlights.
- Multi-JD and multi-resume batch matching.
- Bias-aware screening and missing-evidence flags.
- Recruiter workspace for projects, notes, and collaboration.

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

## Product docs

- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
