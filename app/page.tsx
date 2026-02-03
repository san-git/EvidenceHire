const valueProps = [
  {
    title: "Evidence-first matching",
    description:
      "Every fit score includes the exact signals behind it, so recruiters can trust and explain decisions."
  },
  {
    title: "Multi-JD, multi-resume batch runs",
    description:
      "Drop in a hiring plan and a stack of resumes, then compare across roles in one pass."
  },
  {
    title: "Bias-aware screening",
    description:
      "Surface skills, not stereotypes, with guardrails that flag missing evidence and hidden bias."
  }
];

const steps = [
  {
    title: "Load roles",
    description: "Paste a JD, upload files, or add multiple roles at once."
  },
  {
    title: "Add talent",
    description: "Upload resumes in batches or pull from your existing ATS."
  },
  {
    title: "Review evidence",
    description: "See fit scores, skill gaps, and explainable highlights."
  }
];

export default function Home() {
  return (
    <main className="page">
      <nav className="nav">
        <div className="logo">EvidenceHire</div>
        <div className="nav-actions">
          <a className="button ghost" href="/match">
            Try matching
          </a>
          <a className="button primary" href="/match">
            Join the beta
          </a>
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Recruiting, but accountable.</p>
          <h1>Evidence-first sourcing that your whole team can trust.</h1>
          <p className="lead">
            EvidenceHire turns every decision into a clear, defensible story. Batch match
            roles and resumes, explain fit scores, and collaborate on the same evidence.
          </p>
          <div className="cta-row">
            <a className="button primary" href="/match">
              Start matching
            </a>
            <button className="button ghost" type="button">
              View roadmap
            </button>
          </div>
          <div className="metrics">
            <div>
              <div className="metric">5x</div>
              <div className="metric-label">faster shortlists</div>
            </div>
            <div>
              <div className="metric">92%</div>
              <div className="metric-label">fit clarity score</div>
            </div>
            <div>
              <div className="metric">100%</div>
              <div className="metric-label">traceable evidence</div>
            </div>
          </div>
        </div>

        <div className="hero-card">
          <div className="card-header">
            <span className="tag">Match Preview</span>
            <span className="tag soft">Beta</span>
          </div>
          <div className="score">
            <div className="score-value">87</div>
            <div className="score-label">Overall fit</div>
          </div>
          <div className="evidence">
            <div>
              <div className="evidence-title">Top evidence</div>
              <p className="evidence-item">Built full-cycle hiring for 12 roles</p>
              <p className="evidence-item">3 years sourcing in fintech</p>
              <p className="evidence-item">Advanced Boolean search expertise</p>
            </div>
            <div className="evidence-gap">
              <div className="evidence-title">Gaps to validate</div>
              <p className="evidence-item">No hiring analytics tools listed</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Why recruiters love EvidenceHire</h2>
          <p>Built to save time, improve quality, and protect decision-making.</p>
        </div>
        <div className="card-grid">
          {valueProps.map((item) => (
            <div className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section split">
        <div>
          <div className="section-title">
            <h2>How it works</h2>
            <p>Three steps between intake and confident shortlist.</p>
          </div>
          <div className="step-list">
            {steps.map((step, index) => (
              <div className="step" key={step.title}>
                <div className="step-index">0{index + 1}</div>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="callout">
          <h3>Unique value prop</h3>
          <p>
            EvidenceHire is the only recruiting workspace that pairs AI scoring with an
            audit trail recruiters can share with hiring managers.
          </p>
          <a className="button primary" href="/match">
            Try the beta
          </a>
        </div>
      </section>

      <footer className="footer">
        <div>
          <div className="logo">EvidenceHire</div>
          <p>Evidence-first recruiting for modern sourcing teams.</p>
        </div>
        <div className="footer-links">
          <a href="/match">Product</a>
          <a href="/match">Beta access</a>
          <a href="/match">Contact</a>
        </div>
      </footer>
    </main>
  );
}
