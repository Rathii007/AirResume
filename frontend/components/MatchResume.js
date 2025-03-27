"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Trophy, Rocket, ArrowUp } from "lucide-react";
import { Radar } from "react-chartjs-2";
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from "chart.js";
import Confetti from "react-confetti";
import { memo } from "react";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const API_BASE_URL = "http://localhost:8000";

const RadarChart = memo(({ data }) => (
  <Radar
    data={data}
    options={{
      scales: {
        r: {
          beginAtZero: true,
          max: 1,
          ticks: { stepSize: 0.2, color: "rgba(147, 51, 234, 1)" },
          grid: { color: "rgba(147, 51, 234, 0.3)" },
          angleLines: { color: "rgba(147, 51, 234, 0.3)" },
          pointLabels: { fontSize: 12, color: "rgba(147, 51, 234, 1)" },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      animation: {
        duration: 0,
      },
    }}
  />
));

export default function MatchResume() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [cachedResults, setCachedResults] = useState({});
  const [dotPositions, setDotPositions] = useState(
    [...Array(10)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }))
  );
  const resultRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const hardwareConcurrency = window.navigator.hardwareConcurrency || 4;
    if (result) {
      const score = result.match_score || result.ats_score || 0;
      if (score >= 80 && !(isMobile && hardwareConcurrency < 4)) {
        setShowConfetti(true);
      }
      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [result]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setError("Please upload a resume.");
      return;
    }

    const cacheKey = `${resumeFile.name}-${jobDescription}`;
    if (cachedResults[cacheKey]) {
      setResult(cachedResults[cacheKey]);
      const score = cachedResults[cacheKey].match_score || cachedResults[cacheKey].ats_score || 0;
      if (score >= 80) {
        setShowConfetti(true);
      }
      setDotPositions(
        [...Array(10)].map(() => ({
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }))
      );
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setShowConfetti(false);

    const formData = new FormData();
    formData.append("resume", resumeFile);
    if (jobDescription) {
      formData.append("job_description", jobDescription);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/match-resume/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error.includes("empty") || errorData.error.includes("invalid")
            ? "Oops! It looks like the uploaded file is empty or not a valid resume PDF. Please upload a valid PDF to analyze."
            : errorData.error || "Something went wrong while analyzing your resume. Please try again."
        );
      }

      const data = await res.json();
      setResult(data);
      setCachedResults((prev) => ({ ...prev, [cacheKey]: data }));
      const score = data.match_score || data.ats_score || 0;
      if (score >= 80) {
        setShowConfetti(true);
      }
      setDotPositions(
        [...Array(10)].map(() => ({
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }))
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Match results copied to clipboard!");
    });
  };

  const getMatchBadge = (score) => {
    if (score >= 80) return { label: "Galactic!", color: "text-green-400", icon: <Trophy className="w-6 h-6" /> };
    if (score >= 50) return { label: "Stellar", color: "text-yellow-400", icon: <Trophy className="w-6 h-6" /> };
    return { label: "Cosmic Drift", color: "text-red-400", icon: <Trophy className="w-6 h-6" /> };
  };

  const getQuickFix = (metric, value) => {
    switch (metric) {
      case "keyword_score":
        return value < 70 ? "🚀 Boost: Inject 2-3 keywords to ignite your score!" : "🌟 Keywords are blazing!";
      case "structure_score":
        return value < 70 ? "🪐 Reinforce: Add sections like Experience to stabilize your orbit!" : "🌟 Structure is rock-solid!";
      case "readability_score":
        return value < 70 ? "✨ Polish: Shorten sentences for a smoother flight!" : "🌟 Reads like a cosmic dream!";
      case "length_score":
        return value < 70 ? "☄️ Adjust: Aim for 1-2 pages for a perfect landing!" : "🌟 Length is interstellar!";
      default:
        return "";
    }
  };

  const parseFeedback = (feedback) => {
    const lines = feedback.split("\n");
    let summary = [];
    let suggestions = [];

    let isSummary = true;
    for (const line of lines) {
      if (line.startsWith("- ")) {
        isSummary = false;
        suggestions.push(line.replace("- ", "").trim());
      } else if (line.trim() && isSummary) {
        summary.push(line.trim());
      }
    }

    return { summary: summary.join(" "), suggestions };
  };

  const radarData = result
    ? {
        labels: ["Keywords", "Structure", "Readability", "Length"],
        datasets: [
          {
            label: "ATS Metrics",
            data: [
              (result.metrics?.keyword_score || 0) / 100,
              (result.metrics?.structure_score || 0) / 100,
              (result.metrics?.readability_score || 0) / 100,
              (result.metrics?.length_score || 0) / 100,
            ],
            backgroundColor: "rgba(147, 51, 234, 0.2)",
            borderColor: "rgba(147, 51, 234, 1)",
            borderWidth: 2,
          },
        ],
      }
    : null;

  const overallScore = result ? (result.match_score || result.ats_score || 0) : 0;
  const overallScoreDisplay = result ? (result.match_score_raw || result.ats_score_raw || "0%") : "0%";
  const isJobDescriptionProvided = result && "match_score" in result;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.1, ease: "easeInOut" }}
      className="bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none z-0">
        {dotPositions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500 rounded-full opacity-50"
            style={{ left: pos.left, top: pos.top }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <h3 className="text-3xl font-bold text-purple-400 mb-6 text-center relative z-10">
          ✨ Analyze Your Resume Fit ✨
        </h3>

        {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={100} />}

        <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:gap-6">
            <div>
              <label className="block text-gray-200 font-semibold mb-2 text-sm sm:text-base">Upload Resume (PDF)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && file.type !== "application/pdf") {
                    setError("Please upload a PDF file.");
                    setResumeFile(null);
                  } else {
                    setError(null);
                    setResumeFile(file);
                  }
                }}
                className="w-full p-3 bg-gray-800 rounded-lg text-gray-300 border border-gray-700 focus:border-purple-500 focus:ring focus:ring-purple-500/50 transition text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block text-gray-200 font-semibold mb-2 text-sm sm:text-base">Job Description (Optional)</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here to match your resume..."
                className="w-full p-3 bg-gray-800 rounded-lg text-gray-300 border border-gray-700 focus:border-purple-500 focus:ring focus:ring-purple-500/50 transition h-24 sm:h-36 resize-none text-sm sm:text-base"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(147, 51, 234, 0.7)" }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading || !resumeFile}
            className="w-full py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-bold disabled:opacity-50 flex items-center justify-center gap-3 text-sm sm:text-base touch-manipulation"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-t-transparent border-white rounded-full"
              />
            ) : (
              <>
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" /> Analyze Resume
              </>
            )}
          </motion.button>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 sm:mt-6 p-3 sm:p-4 bg-red-500/20 rounded-lg text-red-300 text-center text-sm sm:text-base"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && (
            <motion.div
              ref={resultRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-6 sm:mt-10 space-y-6 sm:space-y-8"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="flex items-center justify-center gap-4"
              >
                <Rocket className="w-8 h-8 sm:w-10 sm:h-10 text-purple-400 animate-bounce" />
                <span className="text-lg sm:text-xl font-bold text-purple-400 text-center">
                  Cosmic Resume Explorer Badge Unlocked! 🚀
                </span>
              </motion.div>

              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 p-6 rounded-xl shadow-lg relative overflow-hidden"
              >
                <div className="absolute inset-0 pointer-events-none z-0">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full opacity-20 hidden sm:block"
                      style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                      animate={{ scale: [0.5, 1, 0.5] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ))}
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-purple-400 mb-4 sm:mb-6 relative z-10">
                  {isJobDescriptionProvided ? "Job Match Score" : "ATS Score"}
                </h4>
                <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6 relative z-10">
                  <span className={`text-4xl sm:text-5xl font-extrabold ${getMatchBadge(overallScore).color}`}>
                    {overallScoreDisplay}
                  </span>
                  {getMatchBadge(overallScore).icon}
                </div>
                <span className={`text-lg sm:text-xl font-semibold ${getMatchBadge(overallScore).color} relative z-10`}>
                  {getMatchBadge(overallScore).label}
                </span>
                <div className="mt-4 sm:mt-6 relative z-10">
                  <div className="w-full bg-gray-700 rounded-full h-4 sm:h-6">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${overallScore}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      className={`h-4 sm:h-6 rounded-full ${
                        overallScore >= 80
                          ? "bg-gradient-to-r from-green-400 to-green-600"
                          : overallScore >= 50
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                          : "bg-gradient-to-r from-red-400 to-red-600"
                      }`}
                    />
                  </div>
                </div>
              </motion.div>

              {radarData && (
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-800 p-6 rounded-xl shadow-lg relative overflow-hidden"
                >
                  <div className="absolute inset-0 pointer-events-none z-0">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-white rounded-full opacity-20 hidden sm:block"
                        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                        animate={{ scale: [0.5, 1, 0.5] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      />
                    ))}
                  </div>
                  <h4 className="text-xl sm:text-2xl font-bold text-purple-400 mb-4 sm:mb-6 relative z-10">Metrics Breakdown</h4>
                  <RadarChart data={radarData} />
                </motion.div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {["keyword_score", "structure_score", "readability_score", "length_score"].map((metric) => (
                  <motion.div
                    key={metric}
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 0 15px rgba(147, 51, 234, 0.3)" }}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg relative overflow-hidden"
                  >
                    <div className="absolute inset-0 pointer-events-none z-0">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-white rounded-full opacity-20 hidden sm:block"
                          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                          animate={{ scale: [0.5, 1, 0.5] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center relative z-10">
                      <h5 className="text-base sm:text-lg font-semibold text-purple-400 capitalize">
                        {metric.replace("_score", "")}
                      </h5>
                      <span className="text-gray-200 font-bold text-sm sm:text-base">{result.metrics[metric]}%</span>
                    </div>
                    <p className="text-gray-300 mt-2 relative z-10 text-sm sm:text-base">{getQuickFix(metric, result.metrics[metric])}</p>
                  </motion.div>
                ))}
              </div>

              {["structure_feedback", "readability_feedback", "ai_feedback", "missing_keywords"].map((section, index) => {
                if (!result[section] || (section === "missing_keywords" && result[section].length === 0)) return null;
                const title =
                  section === "structure_feedback"
                    ? "Structure Feedback"
                    : section === "readability_feedback"
                    ? "Readability Feedback"
                    : section === "ai_feedback"
                    ? isJobDescriptionProvided
                      ? "Job Match Feedback"
                      : "ATS Feedback"
                    : "Missing Keywords";
                const content =
                  section === "ai_feedback"
                    ? isJobDescriptionProvided
                      ? result.ai_feedback
                      : { ats_readiness: result.ai_feedback.ats_readiness, suggestions: result.ai_feedback.suggestions }
                    : result[section];

                return (
                  <motion.div
                    key={section}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.01, boxShadow: "0 0 20px rgba(147, 51, 234, 0.4)" }}
                    className="bg-gray-800 p-6 rounded-xl shadow-lg relative overflow-hidden"
                  >
                    <div className="absolute inset-0 pointer-events-none z-0">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-white rounded-full opacity-20 hidden sm:block"
                          style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                          animate={{ scale: [0.5, 1, 0.5] }}
                          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        />
                      ))}
                    </div>
                    <h4 className="text-xl sm:text-2xl font-bold text-purple-400 mb-4 relative z-10">{title}</h4>
                    {section === "missing_keywords" ? (
                      <ul className="list-disc list-inside text-gray-300 space-y-2 relative z-10 text-sm sm:text-base">
                        {content.map((item, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="text-red-400"
                          >
                            {item}
                          </motion.li>
                        ))}
                      </ul>
                    ) : (
                      <>
                        {parseFeedback(typeof content === "string" ? content : content.ats_readiness || content.strengths)
                          .summary && (
                          <p className="text-gray-200 leading-relaxed mb-4 relative z-10 text-sm sm:text-base">
                            {parseFeedback(
                              typeof content === "string" ? content : content.ats_readiness || content.strengths
                            ).summary}
                          </p>
                        )}
                        {parseFeedback(
                          typeof content === "string" ? content : content.suggestions || content.strengths
                        ).suggestions.length > 0 && (
                          <>
                            <h5 className="text-base sm:text-lg font-semibold text-gray-200 mb-2 relative z-10">
                              {section === "ai_feedback" && isJobDescriptionProvided
                                ? "🌟 Job Match Challenges"
                                : section === "ai_feedback"
                                ? "☄️ ATS Missions"
                                : section === "structure_feedback"
                                ? "🪐 Structure Missions"
                                : "✨ Readability Quests"}
                            </h5>
                            <ul className="list-disc list-inside text-gray-300 space-y-2 relative z-10 text-sm sm:text-base">
                              {parseFeedback(
                                typeof content === "string" ? content : content.suggestions || content.strengths
                              ).suggestions.map((suggestion, idx) => (
                                <motion.li
                                  key={idx}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                >
                                  {section === "ai_feedback" && isJobDescriptionProvided
                                    ? `🪐 Challenge ${idx + 1}: ${suggestion} ✨`
                                    : `🚀 Mission ${idx + 1}: ${suggestion} 🌟`}
                                </motion.li>
                              ))}
                            </ul>
                          </>
                        )}
                        {section === "ai_feedback" && isJobDescriptionProvided && (
                          <>
                            <h5 className="text-base sm:text-lg font-semibold text-gray-200 mb-2 mt-4 relative z-10">
                              Overall Quality
                            </h5>
                            <p className="text-gray-200 relative z-10 text-sm sm:text-base">{content.overall_quality}</p>
                          </>
                        )}
                        {section === "readability_feedback" && (
                          <p className="text-gray-300 mt-4 relative z-10 text-sm sm:text-base">
                            Average Sentence Length: {result.metrics.avg_sentence_length.toFixed(1)} words
                          </p>
                        )}
                      </>
                    )}
                  </motion.div>
                );
              })}

              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(147, 51, 234, 0.7)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  copyToClipboard(
                    `${isJobDescriptionProvided ? "Job Match Score" : "ATS Score"}: ${overallScoreDisplay} (${
                      getMatchBadge(overallScore).label
                    })\n` +
                      `Metrics: ${JSON.stringify(result.metrics, null, 2)}\n` +
                      (result.missing_keywords ? `Missing Keywords: ${result.missing_keywords.join(", ")}\n` : "") +
                      `Structure Feedback: ${result.structure_feedback}\n` +
                      `Readability Feedback: ${result.readability_feedback}\n` +
                      `AI Feedback: ${JSON.stringify(result.ai_feedback, null, 2)}`
                  )
                }
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg text-white font-bold flex items-center justify-center gap-3 text-sm sm:text-base touch-manipulation"
              >
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" /> Share Results
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed bottom-4 sm:bottom-6 right-4 sm:right-6 p-2 sm:p-3 bg-purple-500 rounded-full text-white shadow-lg touch-manipulation"
            >
              <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}