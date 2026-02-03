# EvidenceHire Architecture

## Default stack

- Frontend: Next.js App Router
- API: Next.js route handlers
- Database: Supabase Postgres
- Storage: Supabase Storage
- Matching: pgvector embeddings + scoring service
- Hosting: Vercel

## Data flow

```mermaid
graph TD
  A[User uploads JD and resumes] --> B[Storage bucket]
  B --> C[Parser service]
  C --> D[Clean text + skills]
  D --> E[Embeddings + vectors]
  E --> F[pgvector similarity]
  F --> G[Evidence and scores]
  G --> H[Reviewer UI]
```

## Core services

- Parser: Extract text and normalize skills.
- Matching: Embed documents, compute similarity, and generate evidence.
- Reviewer: Summarize top evidence and gaps for each candidate.

## Security and privacy

- Store resumes encrypted at rest with strict access controls.
- Log all scoring decisions with timestamps and evidence hashes.
- Provide data deletion and export for user control.
