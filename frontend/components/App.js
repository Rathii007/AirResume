"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Particles } from "@tsparticles/react";
import { tsParticles } from "@tsparticles/engine";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaRocket } from "react-icons/fa";

const MatchResume = dynamic(() => import("@/components/MatchResume"), { ssr: false });
const GenerateResume = dynamic(() => import("@/components/GenerateResume"), { ssr: false });
const RoastResume = dynamic(() => import("@/components/RoastResume"), { ssr: false });
const LandingPage = dynamic(() => import("@/components/LandingPage"), { ssr: false });

<link rel="preload" href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" as="style" />

export default function App() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("landing");
  const [isMounted, setIsMounted] = useState(false);
  const [warpFlash, setWarpFlash] = useState(false);
  const [particleCount, setParticleCount] = useState(5);
  const [dotCount, setDotCount] = useState(30);
  const [dots, setDots] = useState([]);

  useEffect(() => {
    setIsMounted(true);

    const hardwareConcurrency = navigator.hardwareConcurrency || 4;
    setParticleCount(hardwareConcurrency < 4 ? 3 : 5);

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const newDotCount = isMobile ? 15 : 30;
    setDotCount(newDotCount);

    setDots(
      [...Array(newDotCount)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 5 + Math.random() * 3,
      }))
    );
  }, []);

  const particlesInit = useCallback(async () => {
    await tsParticles.load({
      id: "header-particles",
      options: particlesOptions,
    });
  }, []);

  const particlesOptions = {
    particles: {
      number: { value: particleCount, density: { enable: true, value_area: 800 } },
      color: { value: ["#9333ea", "#3b82f6", "#facc15"] },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      move: { enable: true, speed: 0.3, direction: "none", random: true, out_mode: "out" },
    },
    interactivity: { events: { onhover: { enable: false } } },
  };

  const punchlineVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const punchlineText = "Your resume’s a mess? We’ll fix, craft, or mock it—";

  const sectionVariants = {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeInOut" } },
    exit: { opacity: 0, scale: 0.98, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  const handleTabChange = debounce((tab) => {
    setWarpFlash(true);
    setActiveTab(tab);
    if (tab !== "landing") {
      router.push("/", undefined, { shallow: true });
    }
  }, 300);

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      <AnimatePresence>
        {warpFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 z-50 pointer-events-none"
            onAnimationComplete={() => setWarpFlash(false)}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(circle at center, rgba(147, 51, 234, 0.1), rgba(0, 0, 0, 0.8))" }}
        />
        {isMounted && (
          <>
            {dots.map((dot, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-twinkle"
                style={{ left: dot.left, top: dot.top, animationDuration: `${dot.duration}s` }}
              />
            ))}
            <motion.div
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <FaRocket className="text-4xl text-purple-400" />
            </motion.div>
          </>
        )}
      </div>

      <div className="relative z-10">
        <header className="relative p-4 sm:p-6 z-20">
          <div className="absolute inset-0 pointer-events-none">
            <Particles id="header-particles" init={particlesInit} options={particlesOptions} />
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between items-center relative z-10 space-y-4 sm:space-y-0">
            <motion.h1
              className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              whileHover={{ scale: 1.05, textShadow: "0 0 20px rgba(147, 51, 234, 0.8)" }}
            >
              AirResume
            </motion.h1>
            <motion.p
              className="text-base sm:text-lg text-gray-300 font-medium text-center sm:text-right"
              variants={punchlineVariants}
              initial="hidden"
              animate="visible"
            >
              {punchlineText.split("").map((char, index) => (
                <motion.span key={index} variants={letterVariants}>
                  {char}
                </motion.span>
              ))}
              <motion.span
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
              >
                "🚀 AirResume – Your AI-Powered Gateway to the Perfect Job! ✨"
              </motion.span>
            </motion.p>
          </div>
        </header>

        {activeTab !== "landing" && (
          <nav className="flex justify-center space-x-2 sm:space-x-4 mb-6 sm:mb-8 z-20 flex-wrap px-4">
            {["match", "generate", "roast"].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md font-semibold transition-colors text-sm sm:text-base ${
                  activeTab === tab
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                } m-1 touch-manipulation`}
                whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
            <motion.button
              onClick={() => handleTabChange("landing")}
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-md font-semibold transition-colors text-sm sm:text-base ${
                activeTab === "landing"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              } m-1 touch-manipulation`}
              whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
            >
              Home
            </motion.button>
          </nav>
        )}

        <main className="flex justify-center z-10 px-4 sm:px-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={sectionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full max-w-full sm:max-w-4xl will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              {activeTab === "landing" && <LandingPage setActiveTab={setActiveTab} />}
              {activeTab === "match" && <MatchResume />}
              {activeTab === "generate" && <GenerateResume />}
              {activeTab === "roast" && <RoastResume />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}