import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Zap,
  Layout,
  Code2,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  FileCode2,
  ChevronDown,
  ChevronUp,
  Activity,
  Lightbulb,
} from "lucide-react";
import api from "../api/axios";

const ReviewDetails = () => {
  const { repoId } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedFiles, setExpandedFiles] = useState({});

  useEffect(() => {
    let pollInterval = null;
    let attempts = 0;
    const MAX_ATTEMPTS = 20; // poll for up to ~60 seconds

    const fetchReview = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/reviews/repo/${repoId}`);
        if (res.data && res.data.data && res.data.data.length > 0) {
          setReview(res.data.data[0]);
          setLoading(false);
          if (pollInterval) clearInterval(pollInterval);
          return true; // done
        }
      } catch (error) {
        // 404 means review not ready yet — keep polling
        if (error?.response?.status !== 404) {
          console.error("Failed to fetch review:", error);
          setLoading(false);
          if (pollInterval) clearInterval(pollInterval);
          return true;
        }
      }
      return false;
    };

    const startPolling = async () => {
      const done = await fetchReview();
      if (!done) {
        // Review not ready yet — start polling
        pollInterval = setInterval(async () => {
          attempts++;
          if (attempts >= MAX_ATTEMPTS) {
            clearInterval(pollInterval);
            setLoading(false);
            return;
          }
          const isDone = await fetchReview();
          if (isDone) clearInterval(pollInterval);
        }, 3000);
      }
    };

    startPolling();

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [repoId]);

  const toggleFile = (filename) => {
    setExpandedFiles((prev) => ({
      ...prev,
      [filename]: !prev[filename],
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-emerald-400";
    if (score >= 60) return "text-amber-400";
    return "text-rose-400";
  };

  const getScoreBg = (score) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getSeverityBadge = (severity) => {
    const config = {
      critical: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      high: "bg-gradient-to-br from-indigo-500 to-purple-600/10 text-transparent bg-clip-text border-indigo-500/20",
      medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      low: "bg-gradient-to-br from-indigo-500 to-purple-600/10 text-transparent bg-clip-text border-indigo-500/20",
    };
    const style = config[severity?.toLowerCase()] || config.low;
    return (
      <span className={`px-2.5 py-0.5 rounded-xl text-xs font-semibold border ${style} uppercase tracking-wider`}>
        {severity || "LOW"}
      </span>
    );
  };

  if (loading && !review) {
    return (
      <div className="h-screen flex flex-col items-center justify-center space-y-8 bg-[#030303]">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-24 h-24 rounded-xl border-2 border-indigo-500/20 animate-ping" />
          <div className="absolute w-16 h-16 rounded-xl border-2 border-indigo-500/40 animate-pulse" />
          <Activity className="w-10 h-10 text-transparent bg-clip-text relative z-10" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white">AI is Analyzing Your Code</h2>
          <p className="text-gray-400 text-sm max-w-sm">
            Gemini is performing a deep analysis of your pull request. This may take up to 60 seconds.
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm w-64">
          {[
            "Fetching pull request files...",
            "Running per-file analysis...",
            "Generating intelligence report...",
            "Calculating quality scores...",
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3 text-gray-400">
              <div
                className="w-2 h-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shrink-0"
                style={{ animation: `pulse 1.5s ease-in-out ${i * 0.4}s infinite` }}
              />
              <span>{step}</span>
            </div>
          ))}
        </div>
        <p className="text-gray-600 text-xs animate-pulse">Checking for results every 3 seconds...</p>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[#030303]">
        <AlertTriangle className="w-16 h-16 text-amber-500 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2">No AI Review Found</h2>
        <p className="text-gray-400 mb-8 max-w-md text-center">
          We couldn't find an AI review for this repository. It might still be processing or hasn't been requested yet.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-medium flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Repositories
        </button>
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: Activity },
    { id: "files", label: "File Reviews", icon: FileCode2 },
    { id: "issues", label: "Critical Findings", icon: AlertTriangle },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#030303] text-gray-200 overflow-hidden">
      {/* HEADER SECTION — fixed, never scrolls */}
      <div className="flex-shrink-0 bg-[#0a0a0a] border-b border-white/5 backdrop-blur-xl z-30">
        <div className="w-full px-8 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-medium transition-colors w-fit group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Repositories
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                AI Intelligence Report
              </h1>
              <p className="text-gray-400 text-sm">
                Comprehensive analysis and architectural insights generated by Gemini AI.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-500 font-medium mb-0.5 uppercase tracking-wider">Overall Health</p>
                <p className={`text-3xl font-black ${getScoreColor(review.score)} drop-shadow-sm`}>
                  {review.score}<span className="text-lg text-gray-600 font-bold">/100</span>
                </p>
              </div>
              <svg className="w-14 h-14 transform -rotate-90">
                <circle cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-white/5" />
                <motion.circle
                  initial={{ strokeDashoffset: 151 }}
                  animate={{ strokeDashoffset: 151 - (151 * review.score) / 100 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx="28" cy="28" r="24" stroke="currentColor" strokeWidth="6" fill="transparent"
                  strokeDasharray={151}
                  className={getScoreColor(review.score)}
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>

          {/* TABS */}
          <div className="flex gap-6 mt-3 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative pb-3 text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                    isActive ? "text-transparent bg-clip-text" : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <Icon size={15} />
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTENT AREA — flex-1 means it fills remaining height; overflow-y-auto makes it scroll independently */}
      <div className="flex-1 overflow-y-auto">
        <div className="w-full px-8 py-6">
        <AnimatePresence mode="wait">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* METRICS GRID */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Architecture", score: review.architectureScore || 0, icon: Layout },
                  { label: "Security", score: review.securityScore || 0, icon: ShieldAlert },
                  { label: "Performance", score: review.performanceScore || 0, icon: Zap },
                  { label: "Maintainability", score: review.maintainabilityScore || 0, icon: Code2 },
                ].map((metric, idx) => (
                  <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-xl p-5 flex flex-col justify-between hover:bg-white/[0.02] transition-colors relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <metric.icon size={64} />
                    </div>
                    <div className="flex items-center gap-3 mb-4 relative z-10">
                      <div className="p-2.5 rounded-xl bg-white/5 text-gray-400">
                        <metric.icon size={18} />
                      </div>
                      <span className="font-semibold text-gray-200">{metric.label}</span>
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-end justify-between mb-3">
                        <span className={`text-3xl font-bold ${getScoreColor(metric.score)}`}>
                          {metric.score}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-xl overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.score}%` }}
                          transition={{ duration: 1, delay: idx * 0.1 }}
                          className={`h-full rounded-xl ${getScoreBg(metric.score)}`}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* SUMMARY & INSIGHTS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-8 shadow-xl">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <Activity className="text-indigo-500" /> Executive Summary
                    </h2>
                    <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-4">
                      {review.summary?.split("\n\n").map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </div>

                  {review.strengths && review.strengths.length > 0 && (
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-8 shadow-xl border-l-4 border-l-emerald-500">
                      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <CheckCircle2 className="text-emerald-500" /> Engineering Strengths
                      </h2>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {review.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start gap-3 bg-white/[0.02] p-4 rounded-xl">
                            <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                            <span className="text-gray-300 text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="space-y-8">
                  {review.improvements && review.improvements.length > 0 && (
                    <div className="bg-[#0a0a0a] border border-white/5 rounded-xl p-8 shadow-xl border-t-4 border-t-indigo-500">
                      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Lightbulb className="text-indigo-500" /> Recommendations
                      </h2>
                      <ul className="space-y-4">
                        {review.improvements.map((improvement, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 mt-2 shrink-0 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                            <span className="text-gray-300 text-sm leading-relaxed">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* FILES TAB */}
          {activeTab === "files" && (
            <motion.div
              key="files"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {review.fileReviews && review.fileReviews.length > 0 ? (
                review.fileReviews.map((fileReview, idx) => (
                  <div key={idx} className="bg-[#0a0a0a] border border-white/5 rounded-xl overflow-hidden shadow-lg">
                    <button
                      onClick={() => toggleFile(fileReview.file)}
                      className="w-full px-6 py-5 flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <FileCode2 className="text-gray-500" size={20} />
                        <span className="font-mono text-sm text-gray-200">{fileReview.file}</span>
                        {fileReview.issues?.length > 0 && (
                          <span className="px-2.5 py-1 rounded-xl bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/20">
                            {fileReview.issues.length} Issues
                          </span>
                        )}
                      </div>
                      {expandedFiles[fileReview.file] ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                    </button>

                    <AnimatePresence>
                      {expandedFiles[fileReview.file] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-white/5"
                        >
                          <div className="p-6 space-y-8">
                            {fileReview.issues?.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Specific Issues</h4>
                                <div className="space-y-4">
                                  {fileReview.issues.map((issue, i) => (
                                    <div key={i} className="bg-[#111] border border-white/5 rounded-xl p-5">
                                      <div className="flex items-start justify-between gap-4 mb-3">
                                        <p className="text-gray-200 text-sm font-medium">{issue.issue}</p>
                                        {getSeverityBadge(issue.severity)}
                                      </div>
                                      <div className="bg-[#1a1a1a] p-4 rounded-xl mt-3 border border-white/5">
                                        <p className="text-sm text-gray-400"><span className="text-transparent bg-clip-text font-semibold mr-2">Fix:</span>{issue.suggestion}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {fileReview.suggestions?.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">General Suggestions</h4>
                                <ul className="list-disc list-inside space-y-2 text-sm text-gray-300 ml-2">
                                  {fileReview.suggestions.map((sug, i) => (
                                    <li key={i}>{sug}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {(!fileReview.issues?.length && !fileReview.suggestions?.length) && (
                              <div className="text-center py-6 text-gray-500 text-sm italic">
                                No issues or suggestions found for this file. Looks good!
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-[#0a0a0a] rounded-xl border border-white/5">
                  <FileCode2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No file-specific reviews available.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* CRITICAL FINDINGS TAB */}
          {activeTab === "issues" && (
            <motion.div
              key="issues"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {review.findings && review.findings.length > 0 ? (
                <div className="space-y-4">
                  {review.findings.map((item, index) => (
                    <div key={index} className="bg-[#0a0a0a] border border-rose-500/20 rounded-xl p-6 flex gap-4 hover:border-rose-500/40 transition-colors shadow-[0_4px_20px_rgba(225,29,72,0.05)] relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500" />
                      <div className="pt-1">
                        <AlertTriangle className="text-rose-500" size={24} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold text-gray-100">{item.issue || "Critical Finding"}</h3>
                          {getSeverityBadge(item.severity || "critical")}
                        </div>
                        {item.impact && (
                          <p className="text-sm text-gray-400 mb-4 mt-2">
                            <span className="text-rose-400 font-semibold mr-2">Impact:</span>{item.impact}
                          </p>
                        )}
                        {item.fix && (
                          <div className="bg-[#111] p-4 rounded-xl border border-white/5">
                            <p className="text-sm text-gray-300">
                              <span className="text-emerald-400 font-semibold mr-2">Recommended Fix:</span>{item.fix}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-[#0a0a0a] rounded-xl border border-emerald-500/20 shadow-[0_4px_20px_rgba(16,185,129,0.05)]">
                  <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">No Critical Issues</h3>
                  <p className="text-gray-400">The AI did not find any critical or high-severity issues in this codebase.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetails;
