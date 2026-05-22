import { useState, useEffect } from "react";
import { AlertTriangle, Info, ShieldAlert, FileText, CheckCircle2, Play, Terminal, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import api from "../api/axios";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // Fetch repositories first to get their IDs
        const repoRes = await api.get("/repos");
        if (repoRes.data.data.length > 0) {
          const firstRepoId = repoRes.data.data[0]._id;
          // Fetch reviews for the first repo as default
          const reviewRes = await api.get(`/reviews/repo/${firstRepoId}`);
          if (reviewRes.data.data.length > 0) {
            const rev = reviewRes.data.data[0];
            setReviews([rev]);
            setSelectedReview(rev);
            if (rev.findings && rev.findings.length > 0) {
              setSelectedFinding(rev.findings[0]);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const getSeverityIcon = (sev) => {
    if (sev === "critical" || sev === "high") return <ShieldAlert size={16} className="text-danger" />;
    if (sev === "medium") return <AlertTriangle size={16} className="text-warning" />;
    return <Info size={16} className="text-blue-400" />;
  };

  const getSeverityClasses = (sev) => {
    if (sev === "critical" || sev === "high") return "bg-danger/10 text-danger border-danger/20";
    if (sev === "medium") return "bg-warning/10 text-warning border-warning/20";
    return "bg-blue-400/10 text-blue-400 border-blue-400/20";
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Loading AI Reviews...</div>;
  }

  if (!selectedReview) {
    return (
      <div className="text-center py-20 text-gray-400">
        No completed AI reviews found. Go to Repositories and analyze a Pull Request first.
      </div>
    );
  }

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="flex flex-col gap-6 pb-10 h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-3">
            <Cpu className="text-primary" /> AI Analysis
          </h1>
          <p className="text-gray-400 text-sm">Intelligent engineering assistant review for PR #{selectedReview.pullRequest?.number || "Unknown"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left Panel: Issues List */}
        <motion.div variants={itemVars} className="lg:col-span-1 flex flex-col gap-4 h-[600px] overflow-y-auto pr-2">
          <div className="glass-card rounded-2xl p-5 border-white/10 h-full">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldAlert size={16} className="text-danger" /> Findings ({selectedReview.findings?.length || 0})
            </h3>
            
            <div className="flex flex-col gap-3">
              {selectedReview.findings?.map((finding, i) => (
                <div 
                  key={i} 
                  onClick={() => setSelectedFinding(finding)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedFinding === finding 
                    ? 'bg-white/5 border-primary shadow-lg' 
                    : 'bg-surface border-transparent hover:border-white/10 hover:bg-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md flex items-center gap-1 truncate max-w-[70%]">
                      <FileText size={10} className="shrink-0" /> {finding.file}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${getSeverityClasses(finding.severity)}`}>
                      {finding.severity}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-200 line-clamp-2">{finding.issue}</h4>
                </div>
              ))}
              
              {selectedReview.findings?.length === 0 && (
                <div className="text-gray-400 text-sm text-center py-10">
                  <CheckCircle2 size={32} className="text-success mx-auto mb-2" />
                  No issues found! Code looks great.
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Panel: Detailed AI Review */}
        {selectedFinding ? (
          <motion.div variants={itemVars} className="lg:col-span-2 glass-card rounded-2xl border-white/10 flex flex-col overflow-hidden relative h-[600px]">
            {/* Animated Gradient Header */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
            
            <div className="p-6 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3 mb-2">
                {getSeverityIcon(selectedFinding.severity)}
                <h2 className="text-xl font-bold text-white">{selectedFinding.issue}</h2>
              </div>
              <p className="text-sm text-gray-400">
                Detected in <code className="font-mono text-primary px-1 bg-primary/10 rounded">{selectedFinding.file}</code> 
                {selectedFinding.line && ` around line ${selectedFinding.line}`}.
              </p>
            </div>

            <div className="p-6 flex-1 overflow-y-auto">
              {/* Category */}
              <div className="mb-6 flex gap-2">
                <span className="px-3 py-1 bg-white/5 text-gray-300 text-xs rounded-lg font-medium border border-white/10 capitalize">
                  Category: {selectedFinding.category}
                </span>
              </div>

              {/* AI Summary */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <SparklesIcon /> Analysis
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                  {selectedReview.summary}
                </p>
              </div>

              {/* Suggested Fix */}
              <div>
                <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-success" /> Suggested Fix
                </h3>
                <div className="rounded-xl overflow-hidden bg-[#0d1117] border border-success/30 font-mono text-sm shadow-xl shadow-success/5">
                  <div className="p-4 overflow-x-auto text-gray-300 whitespace-pre">
                    {selectedFinding.suggestion}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface/80 backdrop-blur-md border-t border-white/10 flex justify-end gap-3 shrink-0">
              <button className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Dismiss
              </button>
              <button className="px-6 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-hover hover:to-indigo-700 shadow-lg shadow-primary/25 transition-all flex items-center gap-2">
                <Play size={14} fill="currentColor" /> Apply Fix
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div variants={itemVars} className="lg:col-span-2 glass-card rounded-2xl border-white/10 flex items-center justify-center text-gray-400 h-[600px]">
            Select a finding to view details
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function SparklesIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

export default Reviews;
