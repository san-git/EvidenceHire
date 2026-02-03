"use client";

import { useMemo, useState, type ChangeEvent } from "react";

type MatchResult = {
  resumeId: string;
  resumeName: string;
  jdId: string;
  jdTitle: string;
  score: number;
  evidence: string[];
  gaps: string[];
};

type MatchResponse = {
  results: MatchResult[];
  bestByResume: Record<string, MatchResult>;
  meta: {
    jdCount: number;
    resumeCount: number;
  };
  error?: string;
};

const splitBlocks = (text: string) =>
  text
    .split(/\n-{3,}\n/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0);

const parseBlocks = (text: string, label: string) => {
  const blocks = splitBlocks(text);
  return blocks.map((block, index) => {
    const lines = block.split("\n");
    const firstLine = lines[0]?.trim() ?? "";
    let title = `${label} ${index + 1}`;
    let content = block;

    if (/^(title|role|name):/i.test(firstLine)) {
      title = firstLine.split(":").slice(1).join(":").trim() || title;
      content = lines.slice(1).join("\n").trim();
    }

    return {
      title,
      text: content
    };
  });
};

const sampleJD = `Title: Growth Recruiter\nLooking for 4+ years of sourcing experience in fintech. Must be strong in pipeline reporting, outreach, and hiring manager calibration.`;
const sampleResume = `Name: Jordan Lee\nRecruiter with 5 years experience in fintech and SaaS. Built hiring plans, ran sourcing sprints, and partnered with hiring managers to close 18 roles in 2024.`;

export default function MatchPage() {
  const [jdText, setJdText] = useState(sampleJD);
  const [resumeText, setResumeText] = useState(sampleResume);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [bestByResume, setBestByResume] = useState<Record<string, MatchResult>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedJds = useMemo(() => parseBlocks(jdText, "JD"), [jdText]);
  const parsedResumes = useMemo(() => parseBlocks(resumeText, "Resume"), [resumeText]);

  const handleFileAppend = async (
    event: ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    const contents = await Promise.all(files.map((file) => file.text()));
    setter((prev) => [prev.trim(), ...contents].filter(Boolean).join("\n---\n"));
  };

  const runMatch = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          jds: parsedJds,
          resumes: parsedResumes
        })
      });

      const data = (await response.json()) as MatchResponse;
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to run match.");
      }

      setResults(data.results ?? []);
      setBestByResume(data.bestByResume ?? {});
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="page match-page">
      <nav className="nav">
        <a className="logo" href="/">
          EvidenceHire
        </a>
        <div className="nav-actions">
          <a className="button ghost" href="/dashboard">
            Workspace
          </a>
          <a className="button ghost" href="/">
            Back to home
          </a>
        </div>
      </nav>

      <section className="section">
        <div className="section-title">
          <h1>Match resumes to job descriptions</h1>
          <p>
            Paste multiple JDs and resumes (split each item with a line that only
            contains <code>---</code>). EvidenceHire will score fit and highlight the
            evidence behind each match.
          </p>
        </div>

        <div className="match-grid">
          <div className="panel">
            <div className="panel-header">
              <h2>Job descriptions</h2>
              <span className="tag">Multi-JD</span>
            </div>
            <label className="field">
              <span>Paste JD text</span>
              <textarea
                className="textarea"
                placeholder="Paste one or more job descriptions here."
                rows={10}
                value={jdText}
                onChange={(event) => setJdText(event.target.value)}
              />
            </label>
            <label className="field">
              <span>Upload JD files (.txt for now)</span>
              <input
                className="input"
                type="file"
                accept=".txt"
                multiple
                onChange={(event) => handleFileAppend(event, setJdText)}
              />
            </label>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>Resumes</h2>
              <span className="tag">Batch</span>
            </div>
            <label className="field">
              <span>Paste resume text</span>
              <textarea
                className="textarea"
                placeholder="Paste one or more resumes here."
                rows={10}
                value={resumeText}
                onChange={(event) => setResumeText(event.target.value)}
              />
            </label>
            <label className="field">
              <span>Upload resume files (.txt for now)</span>
              <input
                className="input"
                type="file"
                accept=".txt"
                multiple
                onChange={(event) => handleFileAppend(event, setResumeText)}
              />
            </label>
          </div>
        </div>

        <div className="actions">
          <button className="button primary" type="button" onClick={runMatch} disabled={isLoading}>
            {isLoading ? "Matching..." : "Run match"}
          </button>
          <button className="button ghost" type="button">
            Save project
          </button>
        </div>
        {error ? <p className="error">{error}</p> : null}
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Best match per resume</h2>
          <p>EvidenceHire picks the strongest role fit and shows why.</p>
        </div>
        <div className="card-grid">
          {Object.values(bestByResume).length === 0 ? (
            <div className="card empty">
              <p>Run a match to see evidence-driven results here.</p>
            </div>
          ) : (
            Object.values(bestByResume).map((match) => (
              <div className="card result-card" key={`${match.resumeId}-${match.jdId}`}> 
                <div className="result-score">{match.score}</div>
                <div>
                  <h3>{match.resumeName}</h3>
                  <p>Matched to: {match.jdTitle}</p>
                  <p className="muted">Top evidence: {match.evidence[0] ?? ""}</p>
                  <p className="muted">Gaps to validate: {match.gaps.slice(0, 2).join(", ")}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Full match matrix</h2>
          <p>Compare every resume against every role in the batch.</p>
        </div>
        <div className="matrix">
          {results.length === 0 ? (
            <div className="card empty">
              <p>No results yet. Run a match to populate the matrix.</p>
            </div>
          ) : (
            results.map((match) => (
              <div className="card matrix-row" key={`${match.resumeId}-${match.jdId}`}> 
                <div>
                  <p className="matrix-title">{match.resumeName}</p>
                  <p className="muted">Role: {match.jdTitle}</p>
                </div>
                <div className="matrix-score">{match.score}</div>
                <div className="matrix-evidence">
                  <span>Evidence</span>
                  <p>{match.evidence.join(" · ") || "No evidence extracted"}</p>
                </div>
                <div className="matrix-evidence">
                  <span>Gaps</span>
                  <p>{match.gaps.join(" · ") || "No gaps detected"}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
