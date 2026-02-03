const projects = [
  {
    name: "Fintech GTM Hiring",
    roles: 3,
    candidates: 48,
    status: "Active",
    lastRun: "2 hours ago"
  },
  {
    name: "Consumer Growth Team",
    roles: 2,
    candidates: 31,
    status: "Active",
    lastRun: "Yesterday"
  },
  {
    name: "Early Stage Ops",
    roles: 1,
    candidates: 18,
    status: "Draft",
    lastRun: "3 days ago"
  }
];

const recentRuns = [
  {
    role: "Growth Recruiter",
    date: "Today",
    summary: "12 candidates matched, 4 above 85"
  },
  {
    role: "Recruiting Ops",
    date: "Yesterday",
    summary: "8 candidates matched, 2 above 80"
  },
  {
    role: "Senior Sourcer",
    date: "Jan 29",
    summary: "15 candidates matched, 5 above 90"
  }
];

export default function DashboardPage() {
  return (
    <main className="page dashboard-page">
      <nav className="nav">
        <a className="logo" href="/">
          EvidenceHire
        </a>
        <div className="nav-actions">
          <a className="button ghost" href="/match">
            Run a match
          </a>
          <a className="button ghost" href="/login">
            Sign in
          </a>
        </div>
      </nav>

      <section className="section">
        <div className="section-title">
          <h1>Recruiting workspace</h1>
          <p>Track projects, see match outcomes, and keep every decision evidence-ready.</p>
        </div>

        <div className="overview-grid">
          <div className="card overview-card">
            <p className="muted">Active projects</p>
            <h2>3</h2>
            <p className="muted">Across 6 open roles</p>
          </div>
          <div className="card overview-card">
            <p className="muted">Candidates screened</p>
            <h2>97</h2>
            <p className="muted">This week</p>
          </div>
          <div className="card overview-card">
            <p className="muted">Average fit score</p>
            <h2>82</h2>
            <p className="muted">Evidence quality 8.6/10</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Projects</h2>
          <p>Keep roles, candidates, and match runs in one place.</p>
        </div>
        <div className="card-grid">
          {projects.map((project) => (
            <div className="card project-card" key={project.name}>
              <div>
                <h3>{project.name}</h3>
                <p className="muted">
                  {project.roles} roles · {project.candidates} candidates
                </p>
              </div>
              <div className="project-meta">
                <span className="tag soft">{project.status}</span>
                <p className="muted">Last run: {project.lastRun}</p>
              </div>
              <button className="button ghost" type="button">
                Open project
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="section split">
        <div>
          <div className="section-title">
            <h2>Recent match runs</h2>
            <p>See evidence trends and scoring outcomes across roles.</p>
          </div>
          <div className="card-list">
            {recentRuns.map((run) => (
              <div className="card run-card" key={run.role}>
                <div>
                  <h3>{run.role}</h3>
                  <p className="muted">{run.summary}</p>
                </div>
                <div className="tag soft">{run.date}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="callout">
          <h3>Connect your data</h3>
          <p>
            Link Supabase to store real projects, resumes, and match runs with secure
            access controls.
          </p>
          <a className="button primary" href="/login">
            Set up authentication
          </a>
        </div>
      </section>
    </main>
  );
}
