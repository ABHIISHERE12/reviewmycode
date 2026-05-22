import { useState, useEffect, useContext } from "react";
import { FileCode2, FolderGit2, ShieldAlert, Zap, TrendingUp, ArrowRight, ChevronRight } from "lucide-react";
import { GithubIcon } from "./GithubIcon";
import { motion } from "framer-motion";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalRepos: 0,
    totalPRs: 0,
    totalReviews: 0,
    avgHealthScore: 100,
    totalIssuesFound: 0,
    criticalSecurityIssues: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/analytics/overview");
        setStats(res.data.data);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const handleConnectGithub = () => {
    const token = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    window.location.href = `${apiUrl}/github/connect?token=${token}`;
  };

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="flex flex-col gap-8 pb-10">
      
      {/* Hero Section */}
      <motion.div variants={itemVars} className="relative rounded-3xl p-8 overflow-hidden glass-card border-white/10 bg-gradient-to-br from-surface to-panel">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-xl blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-500 to-purple-600">{user?.name || "Developer"} 👋</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mt-1">
              Your workspaces are performing beautifully. AI has generated <span className="text-gray-200 font-medium">{stats.totalReviews}</span> reviews and found <span className="text-danger font-medium">{stats.criticalSecurityIssues}</span> critical vulnerabilities.
            </p>
            
            <div className="flex items-center gap-4 mt-4">
              <button className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium flex items-center gap-2 transition-colors shadow-lg shadow-primary/25">
                <Zap size={16} className="fill-white/20" />
                Analyze New Commit
              </button>
              <button className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-gray-300 font-medium transition-colors">
                View Reports
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/5 backdrop-blur-md">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-white/10" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className={`${stats.avgHealthScore > 80 ? "text-success" : (stats.avgHealthScore > 50 ? "text-warning" : "text-danger")} stroke-current`} strokeWidth="3" strokeDasharray={`${stats.avgHealthScore}, 100`} fill="none" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-lg font-bold text-white">{stats.avgHealthScore}%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Overall Health</p>
              <p className="text-xs text-success mt-0.5 flex items-center gap-1">
                <TrendingUp size={12} /> Syncing live
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVars} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { title: "Total PRs", value: stats.totalPRs, change: "", trend: "up", icon: FileCode2, color: "text-transparent bg-clip-text", bg: "bg-indigo-400/10" },
          { title: "Active Repositories", value: stats.totalRepos, change: "", trend: "up", icon: FolderGit2, color: "text-purple-400", bg: "bg-purple-400/10" },
          { title: "Security Issues", value: stats.criticalSecurityIssues, change: "", trend: "down", icon: ShieldAlert, color: "text-danger", bg: "bg-danger/10" },
          { title: "Total AI Reviews", value: stats.totalReviews, change: "", trend: "up", icon: Zap, color: "text-warning", bg: "bg-warning/10" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-5 rounded-xl glass-card group cursor-default relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} ring-1 ring-inset ring-white/10`}>
                <stat.icon size={20} />
              </div>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-100 tracking-tight">{loading ? "-" : stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* GitHub Connect & Quick Actions Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <motion.div variants={itemVars} className="lg:col-span-2 p-6 rounded-3xl glass-card flex flex-col justify-center relative overflow-hidden min-h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-600/5 pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center sm:items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-[#24292e] border border-white/10">
                  <GithubIcon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">
                  {user?.githubConnected ? "GitHub Connected" : "Connect GitHub"}
                </h3>
              </div>
              <p className="text-gray-400 text-sm mb-6 max-w-md">
                {user?.githubConnected 
                  ? `Your account is successfully linked to @${user.githubUsername}. ReviewAI is currently monitoring ${stats.totalRepos} repositories for security vulnerabilities and code quality improvements.`
                  : "Connect your GitHub account to import repositories and enable automated AI code reviews for your pull requests."}
              </p>
              <div className="flex flex-wrap gap-3">
                {!user?.githubConnected ? (
                  <button 
                    onClick={handleConnectGithub}
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-sm font-medium text-white transition-colors"
                  >
                    Connect with GitHub
                  </button>
                ) : (
                  <button className="px-4 py-2 rounded-xl bg-transparent border border-white/10 hover:bg-white/5 text-sm font-medium text-gray-300 transition-colors">
                    Manage Connection
                  </button>
                )}
              </div>
            </div>
            
            {user?.githubConnected && (
              <div className="shrink-0 flex items-center justify-center p-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-success/20 rounded-xl blur-xl animate-pulse-slow" />
                  <div className="w-24 h-24 rounded-xl border-2 border-success/30 flex items-center justify-center relative bg-surface">
                    <img src={user.githubAvatar} alt="GitHub Avatar" className="w-20 h-20 rounded-xl border-2 border-surface" />
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-success border-2 border-surface rounded-xl flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div variants={itemVars} className="p-6 rounded-3xl glass-card">
          <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            {[
              "Generate Security Report",
              "Review Open Pull Requests",
              "Analyze Dependencies",
              "Update AI Preferences"
            ].map((action, i) => (
              <button key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 text-sm text-gray-300 transition-all text-left group">
                {action}
                <ChevronRight size={16} className="text-gray-500 group-hover:text-white transition-colors" />
              </button>
            ))}
          </div>
        </motion.div>
        
      </div>
    </motion.div>
  );
}

export default Dashboard;
