import { GitBranch, ExternalLink, Play } from "lucide-react";

function Repositories() {
  const repos = [
    { name: "AI-Code-Review", status: "Connected", isPrivate: true },
    { name: "MERN-Ecommerce", status: "Connected", isPrivate: false },
    { name: "DevOps-Pipeline", status: "Disconnected", isPrivate: true },
  ];

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-gradient">Repositories</h1>
        <p className="page-description">Manage and analyze your connected codebases.</p>
      </div>

      <div className="repo-grid delay-1">
        {repos.map((repo) => (
          <div className="card repo-card" key={repo.name}>
            <div className="repo-header">
              <h3 className="repo-name">
                <Github size={20} />
                {repo.name}
              </h3>
              <span className={`badge ${repo.status === 'Connected' ? 'badge-success' : 'badge-danger'}`}>
                {repo.status}
              </span>
            </div>

            <div className="flex-center" style={{ color: "var(--text-secondary)", fontSize: "0.875rem", marginBottom: "1rem" }}>
              {repo.isPrivate ? 'Private Repository' : 'Public Repository'}
            </div>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
              <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }}>
                <Play size={16} /> Analyze
              </button>
              <button className="btn">
                <ExternalLink size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Repositories;
