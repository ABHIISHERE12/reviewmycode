import { GitBranch, ExternalLink, Activity, Star, GitFork, Clock, ShieldCheck, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

function Repositories() {
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const repos = [
    { 
      name: "AI-Code-Review", 
      lang: "TypeScript", 
      langColor: "bg-blue-500",
      stars: 124, 
      forks: 12, 
      updated: "2h ago", 
      health: 94,
      status: "Connected",
      prs: 3
    },
    { 
      name: "MERN-Ecommerce", 
      lang: "JavaScript", 
      langColor: "bg-yellow-400",
      stars: 45, 
      forks: 8, 
      updated: "1d ago", 
      health: 78,
      status: "Connected",
      prs: 1
    },
    { 
      name: "DevOps-Pipeline", 
      lang: "Python", 
      langColor: "bg-blue-600",
      stars: 89, 
      forks: 22, 
      updated: "3d ago", 
      health: 45,
      status: "Issues Found",
      prs: 0
    },
  ];

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="flex flex-col gap-6 pb-10">
      <motion.div variants={itemVars} className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Repositories</h1>
          <p className="text-gray-400 text-sm">Manage, analyze, and monitor your connected codebases.</p>
        </div>
        <button className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all text-sm self-start">
          Import Repository
        </button>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {repos.map((repo, i) => (
          <motion.div 
            variants={itemVars}
            key={i} 
            className="rounded-2xl glass-card flex flex-col overflow-hidden group"
          >
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                    <GitBranch size={18} className="text-gray-300" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-100 group-hover:text-primary transition-colors">{repo.name}</h3>
                </div>
                <button className="text-gray-500 hover:text-white transition-colors">
                  <ExternalLink size={16} />
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-400 mb-6 font-medium">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${repo.langColor}`} />
                  {repo.lang}
                </div>
                <div className="flex items-center gap-1">
                  <Star size={12} /> {repo.stars}
                </div>
                <div className="flex items-center gap-1">
                  <GitFork size={12} /> {repo.forks}
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} /> {repo.updated}
                </div>
              </div>

              {/* Health Bar */}
              <div className="mb-2 flex justify-between items-end text-sm">
                <span className="text-gray-400 font-medium flex items-center gap-1">
                  <ShieldCheck size={14} className={repo.health > 80 ? "text-success" : (repo.health > 50 ? "text-warning" : "text-danger")} />
                  AI Health Score
                </span>
                <span className={`font-bold ${repo.health > 80 ? "text-success" : (repo.health > 50 ? "text-warning" : "text-danger")}`}>
                  {repo.health}/100
                </span>
              </div>
              <div className="h-2 w-full bg-surface rounded-full overflow-hidden border border-white/5">
                <div 
                  className={`h-full rounded-full ${repo.health > 80 ? "bg-success" : (repo.health > 50 ? "bg-warning" : "bg-danger")}`} 
                  style={{ width: `${repo.health}%` }} 
                />
              </div>
            </div>

            <div className="p-4 bg-surface/50 border-t border-border flex items-center justify-between">
              <span className="text-sm font-medium text-gray-400 flex items-center gap-2">
                {repo.prs > 0 ? (
                  <>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    {repo.prs} Open PRs
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
    </motion.div>
  );
}

export default Repositories;
