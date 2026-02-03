import CreateProjectForm from "./CreateProjectForm";
import SignOutButton from "./SignOutButton";
import { createSupabaseServer } from "@/lib/supabase/server";

const formatRelative = (dateString: string) => {
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
};

const formatDate = (dateString: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
    new Date(dateString)
  );

export default async function DashboardPage() {
  const supabase = createSupabaseServer();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="page dashboard-page">
        <nav className="nav">
          <a className="logo" href="/">
            EvidenceHire
          </a>
          <div className="nav-actions">
            <a className="button ghost" href="/match">
              Try matching
            </a>
            <a className="button ghost" href="/login">
              Sign in
            </a>
          </div>
        </nav>

        <section className="section auth-panel">
          <div className="section-title">
            <h1>Recruiting workspace</h1>
            <p>Sign in to view your real projects, candidates, and match runs.</p>
          </div>
          <a className="button primary" href="/login">
            Sign in to EvidenceHire
          </a>
        </section>
      </main>
    );
  }

  const { data: projects } = await supabase
    .from("projects")
    .select("id, name, status, created_at, roles(count), candidates(count)")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

  const projectIds = (projects ?? []).map((project) => project.id);

  const { data: matchRuns } = projectIds.length
    ? await supabase
        .from("match_runs")
        .select("id, created_at, notes, projects(name)")
        .in("project_id", projectIds)
        .order("created_at", { ascending: false })
        .limit(3)
    : { data: [] };

  const totals = (projects ?? []).reduce(
    (acc, project) => {
      const roleCount = project.roles?.[0]?.count ?? 0;
      const candidateCount = project.candidates?.[0]?.count ?? 0;
      return {
        roles: acc.roles + roleCount,
        candidates: acc.candidates + candidateCount
      };
    },
    { roles: 0, candidates: 0 }
  );

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
          <SignOutButton />
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
            <h2>{projects?.length ?? 0}</h2>
            <p className="muted">Across {totals.roles} open roles</p>
          </div>
          <div className="card overview-card">
            <p className="muted">Candidates screened</p>
            <h2>{totals.candidates}</h2>
            <p className="muted">Across all projects</p>
          </div>
          <div className="card overview-card">
            <p className="muted">Last match run</p>
            <h2>{matchRuns?.[0] ? formatRelative(matchRuns[0].created_at) : "-"}</h2>
            <p className="muted">Evidence audit ready</p>
          </div>
        </div>
      </section>

      <section className="section split">
        <div>
          <div className="section-title">
            <h2>Create a project</h2>
            <p>Start tracking roles and candidates for a new hiring initiative.</p>
          </div>
          <CreateProjectForm />
        </div>
        <div className="callout">
          <h3>Connect your data</h3>
          <p>
            Upload JDs and resumes to run evidence-first matches and store every decision.
          </p>
          <a className="button primary" href="/match">
            Run a match
          </a>
        </div>
      </section>

      <section className="section">
        <div className="section-title">
          <h2>Projects</h2>
          <p>Keep roles, candidates, and match runs in one place.</p>
        </div>
        <div className="card-grid">
          {(projects ?? []).length === 0 ? (
            <div className="card empty">
              <p>No projects yet. Create one to get started.</p>
            </div>
          ) : (
            (projects ?? []).map((project) => (
              <div className="card project-card" key={project.id}>
                <div>
                  <h3>{project.name}</h3>
                  <p className="muted">
                    {project.roles?.[0]?.count ?? 0} roles · {project.candidates?.[0]?.count ?? 0} candidates
                  </p>
                </div>
                <div className="project-meta">
                  <span className="tag soft">{project.status ?? "Active"}</span>
                  <p className="muted">Created: {formatDate(project.created_at)}</p>
                </div>
                <button className="button ghost" type="button">
                  Open project
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="section split">
        <div>
          <div className="section-title">
            <h2>Recent match runs</h2>
            <p>See evidence trends and scoring outcomes across roles.</p>
          </div>
          <div className="card-list">
            {(matchRuns ?? []).length === 0 ? (
              <div className="card empty">
                <p>No match runs yet. Run a match to see results.</p>
              </div>
            ) : (
              (matchRuns ?? []).map((run) => (
                <div className="card run-card" key={run.id}>
                  <div>
                    <h3>{run.projects?.name ?? "Project"}</h3>
                    <p className="muted">{run.notes ?? "Match run"}</p>
                  </div>
                  <div className="tag soft">{formatDate(run.created_at)}</div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="callout">
          <h3>Next up</h3>
          <p>
            Connect parsing and embeddings to auto-populate evidence-ready shortlists.
          </p>
          <a className="button primary" href="/match">
            Test the matcher
          </a>
        </div>
      </section>
    </main>
  );
}
