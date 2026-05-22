import { AlertTriangle, Info, ShieldAlert, FileText, CheckCircle2, ChevronRight, Play, Terminal, Cpu } from "lucide-react";
import { motion } from "framer-motion";

function Reviews() {
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVars = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVars} initial="hidden" animate="show" className="flex flex-col gap-6 pb-10 h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1 flex items-center gap-3">
            <Cpu className="text-primary" /> AI Analysis
          </h1>
          <p className="text-gray-400 text-sm">Intelligent engineering assistant review for PR #42</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* Left Panel: Issues List */}
        <motion.div variants={itemVars} className="lg:col-span-1 flex flex-col gap-4">
          <div className="glass-card rounded-2xl p-5 border-white/10">
            <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <ShieldAlert size={16} className="text-danger" /> Critical Findings
            </h3>
            
            <div className="flex flex-col gap-3">
              {[
                { file: "server.js", issue: "SQL Injection Vulnerability", sev: "High", icon: ShieldAlert, color: "text-danger", bg: "bg-danger/10" },
                { file: "auth.js", issue: "Missing JWT Expiration", sev: "Medium", icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
                { file: "Button.tsx", issue: "Unnecessary Re-render", sev: "Low", icon: Info, color: "text-blue-400", bg: "bg-blue-400/10" },
              ].map((item, i) => (
                <div key={i} className={`p-4 rounded-xl border ${i===0 ? 'bg-white/5 border-white/20 shadow-lg' : 'bg-surface border-transparent hover:border-white/10 hover:bg-white/5'} cursor-pointer transition-all`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <FileText size={10} /> {item.file}
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${item.bg} ${item.color}`}>
                      {item.sev}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-gray-200">{item.issue}</h4>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Panel: Detailed AI Review */}
        <motion.div variants={itemVars} className="lg:col-span-2 glass-card rounded-2xl border-white/10 flex flex-col overflow-hidden relative">
          {/* Animated Gradient Header */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-danger"></span>
              </span>
              <h2 className="text-xl font-bold text-white">SQL Injection Vulnerability</h2>
            </div>
            <p className="text-sm text-gray-400">Detected in <code className="font-mono text-primary px-1 bg-primary/10 rounded">server.js</code> line 42.</p>
          </div>

          <div className="p-6 flex-1 overflow-y-auto">
            {/* AI Summary Typing Effect Simulation */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <SparklesIcon /> AI Summary
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed bg-white/5 p-4 rounded-xl border border-white/5">
                The current implementation constructs a database query using unescaped user input directly from the request body. This allows malicious actors to manipulate the SQL statement, potentially leading to unauthorized data access or deletion.
              </p>
            </div>

            {/* Code Block */}
            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Terminal size={16} /> Vulnerable Code
              </h3>
              <div className="rounded-xl overflow-hidden bg-[#0d1117] border border-white/10 font-mono text-sm shadow-xl">
                <div className="flex bg-[#161b22] px-4 py-2 border-b border-white/5 text-gray-400 text-xs gap-2">
                  <div className="w-3 h-3 rounded-full bg-danger/80" />
                  <div className="w-3 h-3 rounded-full bg-warning/80" />
                  <div className="w-3 h-3 rounded-full bg-success/80" />
                </div>
                <div className="p-4 overflow-x-auto text-gray-300">
                  <div className="flex"><span className="text-gray-600 select-none mr-4">41</span><span className="text-purple-400">const</span> <span className="text-blue-300">userId</span> <span className="text-pink-400">=</span> req.body.id;</div>
                  <div className="flex bg-danger/20 -mx-4 px-4 border-l-2 border-danger"><span className="text-gray-600 select-none mr-4">42</span><span className="text-purple-400">const</span> <span className="text-blue-300">query</span> <span className="text-pink-400">=</span> <span className="text-green-300">`SELECT * FROM users WHERE id = ${userId}`</span>;</div>
                  <div className="flex"><span className="text-gray-600 select-none mr-4">43</span>db.<span className="text-yellow-200">execute</span>(query);</div>
                </div>
              </div>
            </div>

            {/* Suggested Fix */}
            <div>
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-success" /> Suggested Fix
              </h3>
              <div className="rounded-xl overflow-hidden bg-[#0d1117] border border-success/30 font-mono text-sm shadow-xl shadow-success/5">
                <div className="p-4 overflow-x-auto text-gray-300">
                  <div className="flex bg-success/10 -mx-4 px-4 border-l-2 border-success"><span className="text-gray-600 select-none mr-4">42</span><span className="text-purple-400">const</span> <span className="text-blue-300">query</span> <span className="text-pink-400">=</span> <span className="text-green-300">'SELECT * FROM users WHERE id = ?'</span>;</div>
                  <div className="flex bg-success/10 -mx-4 px-4 border-l-2 border-success"><span className="text-gray-600 select-none mr-4">43</span>db.<span className="text-yellow-200">execute</span>(query, [userId]);</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-surface/80 backdrop-blur-md border-t border-white/10 flex justify-end gap-3">
            <button className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Dismiss
            </button>
            <button className="px-6 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-primary to-indigo-600 hover:from-primary-hover hover:to-indigo-700 shadow-lg shadow-primary/25 transition-all flex items-center gap-2">
              <Play size={14} fill="currentColor" /> Apply Fix
            </button>
          </div>
        </motion.div>
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
