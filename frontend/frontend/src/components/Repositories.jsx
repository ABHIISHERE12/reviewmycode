import { useState, useEffect } from "react";
import {
  GitBranch,
  ExternalLink,
  Activity,
  Star,
  GitFork,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function Repositories() {
  const navigate = useNavigate();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [analyzingRepo, setAnalyzingRepo] = useState(null);

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  };

  const handleAnalyze = async (repoId) => {
    try {
      setAnalyzingRepo(repoId);
      await api.post(`/prs/analyze/${repoId}`);
      navigate(`/reviews/${repoId}`);
    } catch (error) {
      console.error("Analyze failed:", error);
      setError("Failed to analyze repository");
    } finally {
      setAnalyzingRepo(null);
    }
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
      await fetchRepos();
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
      TypeScript: "bg-gradient-to-br from-indigo-500 to-purple-600",
      Python: "bg-blue-600",
      HTML: "bg-gradient-to-br from-indigo-500 to-purple-600",
      CSS: "bg-indigo-400",
    };
    return colors[lang] || "bg-gray-400";
  };

  return (
    <motion.div
      variants={containerVars}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8 pb-12 w-full max-w-7xl mx-auto"
    >
      {/* HEADER */}
      <motion.div variants={itemVars} className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            Repositories
          </h1>
          <p className="text-gray-400 text-base max-w-lg">
            Manage, analyze, and monitor your connected codebases with deep AI intelligence.
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="group relative flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all text-sm disabled:opacity-50 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <RefreshCw size={16} className={syncing ? "animate-spin" : "group-hover:text-transparent bg-clip-text transition-colors"} />
          <span className="relative z-10">{syncing ? "Syncing..." : "Sync GitHub"}</span>
        </button>
      </motion.div>

      {error && (
        <motion.div variants={itemVars} className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
          {error}
        </motion.div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <RefreshCw className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-gray-400 font-medium animate-pulse">Loading repositories...</p>
        </div>
      ) : repos.length === 0 ? (
        <div className="text-center py-32 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-sm">
          <GitBranch className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg font-medium">No repositories found</p>
          <p className="text-gray-500 mt-2">Click Sync GitHub to import your projects.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {repos.map((repo) => (
            <motion.div
              variants={itemVars}
              key={repo._id}
              className="relative group rounded-xl bg-[#0a0a0a] border border-white/10 flex flex-col overflow-hidden hover:border-white/20 transition-all duration-300 shadow-lg hover:shadow-indigo-500/10"
            >
              {/* Subtle hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="p-6 flex-1 relative z-10">
                <div className="flex justify-between items-start mb-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 group-hover:text-transparent bg-clip-text group-hover:border-indigo-500/30 transition-all duration-300">
                      <GitBranch size={20} />
                    </div>
                    <h3 className="font-bold text-lg text-gray-100 group-hover:text-white transition-colors line-clamp-1">
                      {repo.name}
                    </h3>
                  </div>
                  <a
                    href={`https://github.com/${repo.owner}/${repo.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-400 mb-8 font-medium">
                  {repo.language && (
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white/5 border border-white/5">
                      <div className={`w-2 h-2 rounded-xl ${getLangColor(repo.language)}`} />
                      {repo.language}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white/5 border border-white/5">
                    <Star size={14} className="text-gray-500" />
                    {repo.stars}
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-white/5 border border-white/5">
                    <GitFork size={14} className="text-gray-500" />
                    {repo.forks}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end text-sm">
                    <span className="text-gray-400 font-medium flex items-center gap-1.5">
                      <ShieldCheck
                        size={16}
                        className={
                          repo.healthScore > 80 ? "text-emerald-400" : repo.healthScore > 50 ? "text-amber-400" : "text-rose-400"
                        }
                      />
                      AI Health
                    </span>
                    <span
                      className={`font-bold text-base ${
                        repo.healthScore > 80 ? "text-emerald-400" : repo.healthScore > 50 ? "text-amber-400" : "text-rose-400"
                      }`}
                    >
                      {repo.healthScore}<span className="text-xs text-gray-500 font-normal">/100</span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-xl overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${repo.healthScore}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-xl relative ${
                        repo.healthScore > 80 ? "bg-emerald-500" : repo.healthScore > 50 ? "bg-amber-500" : "bg-rose-500"
                      }`}
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </motion.div>
                  </div>
                </div>
              </div>

              <div className="p-5 bg-white/[0.02] border-t border-white/5 flex items-center justify-between relative z-10 backdrop-blur-md">
                <span className="text-sm font-medium px-3 py-1 bg-white/5 rounded-xl text-gray-400 border border-white/5">
                  {repo.openPRs > 0 ? (
                    <span className="text-transparent bg-clip-text">{repo.openPRs} Open PRs</span>
                  ) : (
                    "No open PRs"
                  )}
                </span>
                <button
                  onClick={() => handleAnalyze(repo._id)}
                  disabled={analyzingRepo === repo._id}
                  className="relative group/btn flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/30 hover:border-indigo-500 px-4 py-2 rounded-xl transition-all duration-300 disabled:opacity-50 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-white/10 to-indigo-500/0 opacity-0 group-hover/btn:opacity-100 group-hover/btn:animate-pulse" />
                  {analyzingRepo === repo._id ? (
                    <RefreshCw size={16} className="animate-spin text-indigo-300" />
                  ) : (
                    <Activity size={16} className="text-transparent bg-clip-text group-hover/btn:text-white transition-colors" />
                  )}
                  <span className="relative z-10">
                    {analyzingRepo === repo._id ? "Analyzing..." : "Analyze"}
                  </span>
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
