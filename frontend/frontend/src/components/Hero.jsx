import { useEffect, useState } from "react";
import { Check, Play, Rocket } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
  const lines = [
    "Your Personal AI Code Reviewer",
    "Instant feedback.",
    "Smarter commits.",
    "Cleaner code.",
  ];

  const keywords = ["performance...", "security...", "clean architecture..."];

  const [typed, setTyped] = useState("");
  const [kwIndex, setKwIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typingForward, setTypingForward] = useState(true);

  useEffect(() => {
    const cur = keywords[kwIndex];
    const speed = 80;

    const t = setInterval(() => {
      if (typingForward) {
        setCharIndex((i) => {
          const next = i + 1;
          if (next > cur.length) {
            setTypingForward(false);
            setTimeout(() => {}, 600);
          }
          return Math.min(next, cur.length);
        });
      } else {
        setCharIndex((i) => {
          const next = i - 1;
          if (next < 0) {
            setTypingForward(true);
            setKwIndex((k) => (k + 1) % keywords.length);
          }
          return Math.max(next, 0);
        });
      }
    }, speed);

    return () => clearInterval(t);
  }, [kwIndex, typingForward]);

  useEffect(() => {
    setTyped(keywords[kwIndex].slice(0, charIndex));
  }, [charIndex, kwIndex]);

  return (
    <section className="relative w-full h-full flex items-center justify-center px-8 py-12">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gradient blobs */}
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12, x: [-30, 30, -30], y: [-10, 10, -10] }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
          className="absolute w-96 h-96 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 blur-3xl left-1/4 top-10 mix-blend-screen"
        />
        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08, x: [20, -20, 20], y: [10, -10, 10] }}
          transition={{ duration: 14, repeat: Infinity, repeatType: "reverse" }}
          className="absolute w-72 h-72 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 blur-2xl right-8 bottom-20 mix-blend-screen"
        />
        {/* Floating glass code cards */}
        <motion.div
          aria-hidden
          initial={{ y: 0 }}
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse" }}
          className="absolute transform -translate-x-1/2 w-64 p-3 rounded-xl bg-white/5 border border-white/6 backdrop-blur-lg left-1/3 top-1/3 shadow-2xl"
        >
          <div className="h-36 rounded-xl overflow-hidden bg-gradient-to-b from-white/3 to-transparent p-3 text-xs text-gray-200 font-mono">
            <pre className="whitespace-pre-wrap">{`function review(code) {
  const issues = ai.scan(code);
  return issues;
}`}</pre>
          </div>
        </motion.div>

        <motion.div
          aria-hidden
          initial={{ y: 0 }}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
          className="absolute transform -translate-x-1/2 w-44 p-2 rounded-xl bg-white/4 border border-white/6 backdrop-blur-md right-20 top-1/4"
        >
          <div className="text-xs text-gray-100 font-mono">{`const score = 98 // AI confidence`}</div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative max-w-2xl w-full z-10 flex flex-col gap-6"
      >
        <div className="text-left">
          <div className="space-y-2">
            {lines.map((line, idx) => (
              <motion.h2
                key={line}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15, duration: 0.6 }}
                className={`text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white/95`}
              >
                {line}
              </motion.h2>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="mt-4 text-sm text-gray-300 max-w-xl"
          >
            Get intelligent code reviews, architecture suggestions, bug
            detection, and performance insights tailored to your coding style.
          </motion.p>

          <div className="mt-5 flex items-center gap-4 flex-wrap">
            <button className="inline-flex items-center gap-2 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white px-5 py-3 rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400">
              <Rocket size={16} />
              Start Reviewing
            </button>

            <button className="inline-flex items-center gap-2 border border-white/10 text-gray-100 px-4 py-3 rounded-xl hover:bg-white/3 transition-colors">
              <Play size={14} />
              Watch Demo
            </button>
          </div>

          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <Badge icon={<Check size={14} />} text="AI Powered" />
            <Badge icon={<Check size={14} />} text="Secure Reviews" />
            <Badge icon={<Check size={14} />} text="Real-time Analysis" />
          </div>

          <div className="mt-6 text-sm text-gray-300 flex items-center gap-2">
            <div className="font-mono text-blue-300">{typed}</div>
            <span className="ml-1 w-3 h-6 bg-transparent text-blue-300 animate-pulse">
              |
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Badge({ icon, text }) {
  return (
    <div className="inline-flex items-center gap-2 bg-white/4 border border-white/6 px-3 py-1.5 rounded-xl text-xs text-gray-100">
      <span className="text-blue-300">{icon}</span>
      <span className="font-medium">{text}</span>
    </div>
  );
}
