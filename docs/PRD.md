# EvidenceHire PRD

## Vision

Build the most trusted, evidence-first recruiting workspace where every recommendation is explainable and collaboration-ready.

## Primary users

- Agency recruiters and sourcers
- In-house recruiting teams
- Founders and hiring managers running early-stage hiring

## Core user stories

- As a recruiter, I can upload multiple JDs and resumes and get ranked fit scores.
- As a recruiter, I can see evidence for every score and share it with hiring managers.
- As a hiring manager, I can review why a candidate is recommended or not.
- As a team, we can collaborate on a shared pipeline and record decisions.

## MVP scope

- Create a project with multiple roles and candidate batches.
- Upload JDs and resumes (PDF, DOCX).
- Parse text, extract key skills, and generate embeddings.
- Compute fit scores with explainable evidence.
- Review ranked results and export to CSV.

## Out of scope for MVP

- Full ATS replacement
- Automated outreach sequences
- Marketplace of candidates

## Differentiators

- Evidence trail for every fit score, not just a number.
- Bias-aware screening that flags missing evidence and risky signals.
- Batch matching across multiple roles in one run.

## Success metrics

- Time to shortlist is reduced by 50% or more.
- Recruiter confidence score above 8/10.
- At least 60% of beta teams run weekly matches.

## Risks and mitigation

- Resume parsing accuracy: Start with robust PDF/DOCX extraction and manual overrides.
- Bias in models: Add evidence-only scoring and human-in-the-loop checks.
- Cost control: Use caching, batching, and smaller embeddings for MVP.
