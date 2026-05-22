import { useState, useEffect } from "react";
import { GitBranch, ExternalLink, Activity, Star, GitFork, Clock, ShieldCheck, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import api from "../api/axios";

function Repositories() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const fetchRepos = async () => {
    try {
      setLoading(true);
      const res = await api.get("/repos");
      setRepos(res.data.data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch repos", err);
      setError("Failed to load repositories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();
  }, []);

  const handleSync = async () => {
    try {
      setSyncing(true);
      await api.post("/repos/sync");
      await fetchRepos(); // Refresh list after sync
    } catch (err) {
      console.error("Failed to sync repos", err);
      setError("Failed to sync repositories from GitHub");
    } finally {
      setSyncing(false);
    }
  };

  const getLangColor = (lang) => {
    const colors = {
      JavaScript: "bg-yellow-400",
      TypeScript: "bg-blue-500",
      Python: "bg-blue-600",
      HTML: "bg-orange-500",
      CSS: "bg-blue-400",
    };
    return colors[lang] || "bg-gray-400";
  };

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="flex flex-col gap-6 pb-10">
      <motion.div variants={itemVars} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Repositories</h1>
          <p className="text-gray-400 text-sm">Manage, analyze, and monitor your connected codebases.</p>
        </div>
        
        <div className="flex items-center gap-3 self-start">
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all text-sm disabled:opacity-50"
          >
            <RefreshCw size={16} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Syncing..." : "Sync GitHub"}
          </button>
        </div>
      </motion.div>

      {error && <div className="text-red-400 text-sm">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : repos.length === 0 ? (
        <div className="text-center py-20 bg-surface/30 rounded-2xl border border-white/5">
          <p className="text-gray-400">No repositories found. Click Sync GitHub to import.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {repos.map((repo) => (
            <motion.div 
              variants={itemVars}
              key={repo._id} 
              className="rounded-2xl glass-card flex flex-col overflow-hidden group"
            >
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                      <GitBranch size={18} className="text-gray-300" />
                    </div>
                    <h3 className="font-semibold text-lg text-gray-100 group-hover:text-primary transition-colors line-clamp-1">{repo.name}</h3>
                  </div>
                  <a href={`https://github.com/${repo.owner}/${repo.name}`} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-white transition-colors">
                    <ExternalLink size={16} />
                  </a>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 font-medium flex-wrap">
                  {repo.language && (
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${getLangColor(repo.language)}`} />
                      {repo.language}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Star size={12} /> {repo.stars}
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork size={12} /> {repo.forks}
                  </div>
                </div>

                {/* Health Bar */}
                <div className="mb-2 flex justify-between items-end text-sm">
                  <span className="text-gray-400 font-medium flex items-center gap-1">
                    <ShieldCheck size={14} className={repo.healthScore > 80 ? "text-success" : (repo.healthScore > 50 ? "text-warning" : "text-danger")} />
                    AI Health Score
                  </span>
                  <span className={`font-bold ${repo.healthScore > 80 ? "text-success" : (repo.healthScore > 50 ? "text-warning" : "text-danger")}`}>
                    {repo.healthScore}/100
                  </span>
                </div>
                <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={`h-full rounded-full ${repo.healthScore > 80 ? "bg-success" : (repo.healthScore > 50 ? "bg-warning" : "bg-danger")}`} 
                    style={{ width: `${repo.healthScore}%` }} 
                  />
                </div>
              </div>

              <div className="p-4 bg-surface/50 border-t border-border flex items-center justify-between">
                <span className="text-sm font-medium text-gray-400 flex items-center gap-2">
                  {repo.openPRs > 0 ? (
                    <>
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                      </span>
                      {repo.openPRs} Open PRs
                    </>
                  ) : "No open PRs"}
                </span>
                
                <button className="flex items-center gap-2 text-sm font-medium text-white bg-primary/10 hover:bg-primary border border-primary/20 hover:border-primary px-3 py-1.5 rounded-lg transition-all">
                  <Activity size={14} /> Analyze
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default Repositories;
