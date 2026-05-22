import { FileCode2, FolderGit2, ShieldAlert, Zap, TrendingUp, ArrowRight, ChevronRight } from "lucide-react";
import { GithubIcon } from "./GithubIcon";
import { motion } from "framer-motion";

function Dashboard() {
  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="flex flex-col gap-8 pb-10">
      
      {/* Hero Section */}
      <motion.div variants={itemVars} className="relative rounded-3xl p-8 overflow-hidden glass-card border-white/10 bg-gradient-to-br from-surface to-panel">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Abhi 👋</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mt-1">
              Your workspaces are performing beautifully. AI has analyzed <span className="text-gray-200 font-medium">1,248</span> lines of code today and found <span className="text-success font-medium">0</span> critical vulnerabilities.
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

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
            <div className="relative w-16 h-16 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-white/10" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-success stroke-current" strokeWidth="3" strokeDasharray="87, 100" fill="none" strokeLinecap="round" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-lg font-bold text-white">87%</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400 font-medium">Overall Health</p>
              <p className="text-xs text-success mt-0.5 flex items-center gap-1">
                <TrendingUp size={12} /> +2.4% from last week
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVars} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { title: "Total Reviews", value: "1,248", change: "+12%", trend: "up", icon: FileCode2, color: "text-blue-400", bg: "bg-blue-400/10" },
          { title: "Active Repositories", value: "12", change: "+2", trend: "up", icon: FolderGit2, color: "text-purple-400", bg: "bg-purple-400/10" },
          { title: "Security Issues", value: "8", change: "-4%", trend: "down", icon: ShieldAlert, color: "text-danger", bg: "bg-danger/10" },
          { title: "AI Suggestions", value: "342", change: "+48", trend: "up", icon: Zap, color: "text-warning", bg: "bg-warning/10" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-5 rounded-2xl glass-card group cursor-default relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} ring-1 ring-inset ring-white/10`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-md ${stat.trend === 'up' ? (stat.title === 'Security Issues' ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success') : (stat.title === 'Security Issues' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger')}`}>
                {stat.change}
              </span>
            </div>
            
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-100 tracking-tight">{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* GitHub Connect & Recent Activity Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <motion.div variants={itemVars} className="lg:col-span-2 p-6 rounded-3xl glass-card flex flex-col justify-center relative overflow-hidden min-h-[300px]">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-center sm:items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-[#24292e] border border-white/10">
                  <GithubIcon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">GitHub Connected</h3>
              </div>
              <p className="text-gray-400 text-sm mb-6 max-w-md">
                Your account is successfully linked. ReviewAI is currently monitoring 12 repositories for security vulnerabilities and code quality improvements.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-sm font-medium text-white transition-colors">
                  Sync Repositories
                </button>
                <button className="px-4 py-2 rounded-lg bg-transparent text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                  Manage Connection <ArrowRight size={14} />
                </button>
              </div>
            </div>
            
            <div className="shrink-0 flex items-center justify-center p-4">
              <div className="relative">
                <div className="absolute inset-0 bg-success/20 rounded-full blur-xl animate-pulse-slow" />
                <div className="w-24 h-24 rounded-full border-2 border-success/30 flex items-center justify-center relative bg-surface">
                  <img src="https://i.pravatar.cc/150?img=11" alt="GitHub Avatar" className="w-20 h-20 rounded-full border-2 border-surface" />
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-success border-2 border-surface rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
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
