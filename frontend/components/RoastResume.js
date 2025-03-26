"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";

const API_BASE_URL = "http://localhost:8000";

export default function RoastResume() {
  const [resumeFile, setResumeFile] = useState(null);
  const [roastLevel, setRoastLevel] = useState("Spicy");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const roastLevels = ["Mild", "Spicy", "Burnt"];
  const sectionOrder = ["structure", "readability", "projects", "skills", "overall"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeFile) {
      setError("Please upload a resume file.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    setCurrentSectionIndex(0);

    const formData = new FormData();
    formData.append("file", resumeFile);
    formData.append("roast_level", roastLevel.toLowerCase());

    try {
      const res = await fetch(`${API_BASE_URL}/resume-roast/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.roast || "Failed to roast resume");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseRoast = (roast) => {
    const sections = {
      structure: "",
      readability: "",
      projects: "",
      skills: "",
      overall: "",
    };

    if (!roast) return sections;

    const lines = roast.split("\n");
    let currentSection = null;

    for (const line of lines) {
      const structureMatch = line.match(/^-?\s*\*\*\s*Structure\s*\*.*?:/i);
      const readabilityMatch = line.match(/^-?\s*\*\*\s*Readability\s*\*.*?:/i);
      const projectsMatch = line.match(/^-?\s*\*\*\s*Projects\s*\*.*?:/i);
      const skillsMatch = line.match(/^-?\s*\*\*\s*Skills\s*\*.*?:/i);
      const overallMatch = line.match(/^-?\s*\*\*\s*Overall Vibe\s*\*.*?:/i);

      if (structureMatch) {
        currentSection = "structure";
        sections.structure = line.replace(structureMatch[0], "").trim();
      } else if (readabilityMatch) {
        currentSection = "readability";
        sections.readability = line.replace(readabilityMatch[0], "").trim();
      } else if (projectsMatch) {
        currentSection = "projects";
        sections.projects = line.replace(projectsMatch[0], "").trim();
      } else if (skillsMatch) {
        currentSection = "skills";
        sections.skills = line.replace(skillsMatch[0], "").trim();
      } else if (overallMatch) {
        currentSection = "overall";
        sections.overall = line.replace(overallMatch[0], "").trim();
      } else if (currentSection && line.trim()) {
        sections[currentSection] += " " + line.trim();
      }
    }

    if (
      !sections.structure &&
      !sections.readability &&
      !sections.projects &&
      !sections.skills &&
      !sections.overall
    ) {
      sections.overall = roast.trim();
    }

    return sections;
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Roast copied to clipboard!");
    });
  };

  const handleNext = () => {
    if (currentSectionIndex < sectionOrder.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="bg-gray-900 p-8 rounded-xl shadow-2xl shadow-purple-500/30 max-w-2xl mx-auto relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-500 rounded-full opacity-50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
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

      <h3 className="text-3xl font-bold text-purple-400 mb-6 text-center relative z-10">
        ✨ Roast Your Resume ✨
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        <div>
          <label className="block text-gray-300 mb-2">Upload Resume (PDF)</label>
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
            className="w-full p-3 bg-gray-800 rounded-md text-gray-300 border border-gray-700 focus:border-purple-500 focus:ring focus:ring-purple-500/50 transition"
          />
        </div>

        <div>
          <label className="block text-gray-300 mb-2">Select Roast Level</label>
          <div className="flex space-x-4">
            {roastLevels.map((level) => (
              <motion.button
                key={level}
                type="button"
                onClick={() => setRoastLevel(level)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-md font-semibold transition ${
                  roastLevel === level
                    ? "bg-purple-600 text-white"
                    : "bg-gray-700 text-gray-300"
                }`}
              >
                {level}
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(147, 51, 234, 0.5)" }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          disabled={loading || !resumeFile}
          className="w-full py-3 bg-purple-500 rounded-md text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            "Roasting..."
          ) : (
            <>
              <Sparkles className="w-5 h-5" /> Get Roasted
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
            className="mt-4 p-4 bg-red-500/20 rounded-md text-red-300 text-center relative z-10"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && result.roast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 space-y-6 relative z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="flex items-center justify-center gap-3"
            >
              <Sparkles
                className={`w-8 h-8 ${
                  roastLevel === "Mild"
                    ? "text-blue-400"
                    : roastLevel === "Spicy"
                    ? "text-purple-400"
                    : "text-pink-500"
                } animate-pulse`}
              />
              <span className="text-lg font-semibold text-gray-300">
                Roast Level: {roastLevel}
              </span>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentSectionIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.1 }}
                className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-purple-500/20"
              >
                <h4 className="text-xl font-semibold text-purple-400 mb-4 capitalize">
                  {sectionOrder[currentSectionIndex]}
                </h4>
                <p className="text-gray-300 leading-relaxed">
                  {parseRoast(result.roast)[sectionOrder[currentSectionIndex]] ||
                    "No roast available for this section."}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrevious}
                disabled={currentSectionIndex === 0}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md disabled:opacity-50"
              >
                Previous
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                disabled={currentSectionIndex === sectionOrder.length - 1}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md disabled:opacity-50"
              >
                Next
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(147, 51, 234, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => copyToClipboard(result.roast)}
              className="w-full py-3 bg-purple-500 rounded-md text-white font-semibold flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" /> Share Roast
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}