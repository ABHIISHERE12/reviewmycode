import { FileCode2, FolderGit2, ShieldAlert, Zap } from "lucide-react";

function Dashboard() {
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-gradient">Overview</h1>
        <p className="page-description">Here's a summary of your code quality metrics.</p>
      </div>

      <div className="stats-grid">
        <div className="card stat-card delay-1">
          <h3>
            <FileCode2 size={18} color="var(--accent-color)" />
            Total Reviews
          </h3>
          <p className="value text-gradient-accent">128</p>
        </div>

        <div className="card stat-card delay-2">
          <h3>
            <FolderGit2 size={18} color="var(--accent-color)" />
            Repositories
          </h3>
          <p className="value text-gradient-accent">12</p>
        </div>

        <div className="card stat-card delay-3">
          <h3>
            <ShieldAlert size={18} color="var(--danger-color)" />
            Security Issues
          </h3>
          <p className="value text-gradient-accent">8</p>
        </div>

        <div className="card stat-card delay-3">
          <h3>
            <Zap size={18} color="var(--warning-color)" />
            AI Suggestions
          </h3>
          <p className="value text-gradient-accent">342</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
