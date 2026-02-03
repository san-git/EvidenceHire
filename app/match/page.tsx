export default function MatchPage() {
  return (
    <main className="page match-page">
      <nav className="nav">
        <a className="logo" href="/">
          EvidenceHire
        </a>
        <div className="nav-actions">
          <a className="button ghost" href="/">
            Back to home
          </a>
        </div>
      </nav>

      <section className="section">
        <div className="section-title">
          <h1>Match resumes to job descriptions</h1>
          <p>
            Upload multiple job descriptions and resumes. EvidenceHire will score fit and
            highlight the evidence behind each match.
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
                rows={7}
              />
            </label>
            <label className="field">
              <span>Upload JD files</span>
              <input className="input" type="file" multiple />
            </label>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>Resumes</h2>
              <span className="tag">Batch</span>
            </div>
            <label className="field">
              <span>Upload resumes</span>
              <input className="input" type="file" multiple />
            </label>
            <label className="field">
              <span>Notes</span>
              <textarea
                className="textarea"
                placeholder="Add role context, seniority, or must-have skills."
                rows={5}
              />
            </label>
          </div>
        </div>

        <div className="actions">
          <button className="button primary" type="button">
            Run match
          </button>
          <button className="button ghost" type="button">
            Save project
          </button>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Results preview</h2>
          <p>Once you run a match, you will see ranked candidates with evidence.</p>
        </div>
        <div className="card-grid">
          <div className="card result-card">
            <div className="result-score">92</div>
            <div>
              <h3>Senior Sourcer</h3>
              <p>Matched to: Growth Recruiter (Fintech)</p>
              <p className="muted">Top evidence: 4 years fintech sourcing</p>
            </div>
          </div>
          <div className="card result-card">
            <div className="result-score">81</div>
            <div>
              <h3>Talent Partner</h3>
              <p>Matched to: GTM Recruiter</p>
              <p className="muted">Top evidence: Owned hiring plan for 20 roles</p>
            </div>
          </div>
          <div className="card result-card">
            <div className="result-score">68</div>
            <div>
              <h3>Recruiting Coordinator</h3>
              <p>Matched to: People Ops Associate</p>
              <p className="muted">Top evidence: ATS operations experience</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
