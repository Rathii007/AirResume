"use client";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Particles } from "@tsparticles/react";
import { tsParticles } from "@tsparticles/engine";
import dynamic from "next/dynamic";

// Lazy-load components
const MatchResume = dynamic(() => import("@/components/MatchResume"), { ssr: false });
const GenerateResume = dynamic(() => import("@/components/GenerateResume"), { ssr: false });
const RoastResume = dynamic(() => import("@/components/RoastResume"), { ssr: false });
const LandingPage = dynamic(() => import("@/components/LandingPage"), { ssr: false });
const Feedback = dynamic(() => import("@/components/Feedback"), { ssr: false }); // Added Feedback import

export default function App() {
  const [activeTab, setActiveTab] = useState("landing");
  const [isMounted, setIsMounted] = useState(false);
  const [warpFlash, setWarpFlash] = useState(false);
  const [particleCount, setParticleCount] = useState(5);
  const [dotCount, setDotCount] = useState(30);
  const [dots, setDots] = useState([]);

  useEffect(() => {
    setIsMounted(true);

    if (typeof window !== "undefined") {
      const hardwareConcurrency = window.navigator.hardwareConcurrency || 4;
      setParticleCount(hardwareConcurrency < 4 ? 3 : 5);

      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      const newDotCount = isMobile ? 15 : 30;
      setDotCount(newDotCount);

      setDots(
        [...Array(newDotCount)].map(() => ({
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          duration: 3 + Math.random() * 2,
        }))
      );
    }
  }, []);

  useEffect(() => {
    console.log(`Active tab changed to: ${activeTab}`); // Debug: Log activeTab changes
  }, [activeTab]);

  const particlesInit = useCallback(async () => {
    await tsParticles.load({
      id: "header-particles",
      options: particlesOptions,
    });
  }, []);

  const particlesOptions = {
    particles: {
      number: {
        value: particleCount,
        density: {
          enable: true,
          value_area: 800,
        },
      },
      color: {
        value: ["#9333ea", "#3b82f6", "#facc15"],
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.5,
        random: true,
      },
      size: {
        value: 3,
        random: true,
      },
      move: {
        enable: true,
        speed: 0.5,
        direction: "none",
        random: true,
        out_mode: "out",
      },
    },
    interactivity: {
      events: {
        onhover: {
          enable: false,
        },
      },
    },
  };

  const punchlineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const punchlineText = "Your resume’s a mess? We’ll fix, craft, or mock it—";

  const sectionVariants = {
    initial: {
      opacity: 0,
      scale: 0.98,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        opacity: { duration: 0.2, ease: "easeInOut" },
        scale: { duration: 0.2, ease: "easeInOut" },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      transition: {
        opacity: { duration: 0.2, ease: "easeInOut" },
        scale: { duration: 0.2, ease: "easeInOut" },
      },
    },
  };

  const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), delay);
    };
  };

  const handleTabChange = debounce((tab) => {
    console.log(`handleTabChange called with tab: ${tab}`); // Debug: Log when handleTabChange is called
    setWarpFlash(true);
    setActiveTab(tab);
  }, 200);

  const handleRefresh = () => {
    window.location.reload();
  };

  // Galaxy-themed cursor (same as in LandingPage.js)
  const galaxyCursor = `url('data:image/svg+xml;utf8,<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="%23D8B4FE" stroke-width="1.5"><circle cx="16" cy="16" r="12" opacity="0.5"/><circle cx="16" cy="16" r="8" opacity="0.7"/><path d="M16 4a12 12 0 0 1 8 8" stroke-dasharray="2"/><path d="M16 28a12 12 0 0 1 -8 -8" stroke-dasharray="2"/><circle cx="16" cy="16" r="3" fill="%23EDE9FE"/></g></svg>') 16 16, auto`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      <style>{`
        .galaxy-cursor:hover {
          cursor: ${galaxyCursor};
        }
      `}</style>

      <AnimatePresence>
        {warpFlash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 z-50 pointer-events-none"
            onAnimationComplete={() => setWarpFlash(false)}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(circle at center, rgba(147, 51, 234, 0.1), rgba(0, 0, 0, 0.8))",
          }}
        />
        {isMounted && (
          <>
            {dots.map((dot, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-twinkle"
                style={{
                  left: dot.left,
                  top: dot.top,
                  animationDuration: `${dot.duration}s`,
                }}
              />
            ))}
          </>
        )}
        <motion.div
          className="absolute w-16 h-16 bg-purple-700 rounded-full opacity-30 hidden md:block"
          style={{ left: "10%", top: "15%" }}
          animate={{
            x: [0, 30, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <div
            className="absolute w-20 h-20 border-2 border-dashed border-purple-400 rounded-full opacity-20"
            style={{ top: "-2px", left: "-2px" }}
          />
        </motion.div>
        <motion.div
          className="absolute w-12 h-12 bg-blue-600 rounded-full opacity-30 hidden md:block"
          style={{ right: "15%", bottom: "20%" }}
          animate={{
            x: [0, -25, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          <div
            className="absolute w-16 h-16 border-2 border-dashed border-blue-400 rounded-full opacity-20"
            style={{ top: "-2px", left: "-2px" }}
          />
        </motion.div>
        <motion.div
          className="absolute w-24 h-24 bg-yellow-400 rounded-full opacity-20 hidden md:block"
          style={{ right: "5%", top: "5%" }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-6 bg-yellow-300 opacity-40"
              style={{
                top: "50%",
                left: "50%",
                transform: `rotate(${i * 30}deg) translate(24px, -50%)`,
              }}
              animate={{
                scaleY: [1, 1.8, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>
      </div>

      <div className="relative z-10">
        <header className="relative p-4 sm:p-6 z-20">
          <div className="absolute inset-0 pointer-events-none">
            <Particles
              id="header-particles"
              init={particlesInit}
              options={particlesOptions}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:justify-between items-center relative z-10 space-y-4 sm:space-y-0">
            <motion.button
              onClick={handleRefresh}
              className="galaxy-cursor text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              whileHover={{
                scale: 1.05,
                textShadow: "0 0 20px rgba(147, 51, 234, 0.8)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              AirResume
            </motion.button>
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
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                "🚀 AirResume – Your AI-Powered Gateway to the Perfect Job! ✨"
              </motion.span>
            </motion.p>
          </div>
        </header>

        {activeTab !== "landing" && (
          <nav className="flex justify-center space-x-2 sm:space-x-4 mb-6 sm:mb-8 z-20 flex-wrap px-4">
            {["match", "generate", "roast", "feedback"].map((tab) => ( // Added "feedback" to nav tabs
              <motion.button
                key={tab}
                onClick={() => {
                  console.log(`Nav button clicked: Switching to tab ${tab}`); // Debug: Log nav button clicks
                  handleTabChange(tab);
                }}
                className={`galaxy-cursor px-3 py-2 sm:px-4 sm:py-2 rounded-md font-semibold transition-colors text-sm sm:text-base ${
                  activeTab === tab
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                } m-1 touch-manipulation`}
                whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </motion.button>
            ))}
            <motion.button
              onClick={() => {
                console.log("Nav button clicked: Switching to landing"); // Debug: Log nav button click for Home
                handleTabChange("landing");
              }}
              className="galaxy-cursor px-3 py-2 sm:px-4 sm:py-2 rounded-md font-semibold bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors text-sm sm:text-base m-1 touch-manipulation"
              whileHover={{ scale: 1.1, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
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
              {console.log(`Rendering main with activeTab: ${activeTab}`)} {/* Debug: Log current activeTab */}
              {activeTab === "landing" && <LandingPage setActiveTab={setActiveTab} />}
              {activeTab === "match" && <MatchResume />}
              {activeTab === "generate" && <GenerateResume />}
              {activeTab === "roast" && <RoastResume />}
              {activeTab === "feedback" && (
                <>
                  {console.log("Rendering Feedback component")} {/* Debug: Confirm Feedback is rendering */}
                  <Feedback />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}