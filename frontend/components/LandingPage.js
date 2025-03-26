"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";
import { FaRocket, FaFire, FaMagic, FaLinkedin } from "react-icons/fa";

// Dynamically import motion to reduce initial bundle size
const MotionDiv = dynamic(() => import("framer-motion").then((mod) => mod.motion.div), { ssr: false });
const MotionH1 = dynamic(() => import("framer-motion").then((mod) => mod.motion.h1), { ssr: false });
const MotionP = dynamic(() => import("framer-motion").then((mod) => mod.motion.p), { ssr: false });
const MotionButton = dynamic(() => import("framer-motion").then((mod) => mod.motion.button), { ssr: false });

export default function LandingPage({ setActiveTab }) {
  const [quizAnswers, setQuizAnswers] = useState({
    keywords: "",
    length: "",
    structure: "",
  });
  const [quizResult, setQuizResult] = useState(null);
  const [isQuizVisible, setIsQuizVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsQuizVisible(true);
      },
      { threshold: 0.1 }
    );
    const quizSection = document.getElementById("quiz");
    if (quizSection) observer.observe(quizSection);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <FaRocket className="text-5xl text-purple-400 mx-auto mb-4" />,
      title: "Match Your Resume",
      desc: "Upload your resume and a job description to see how well they align. Get actionable insights to improve your match score.",
      tab: "match",
      animation: { 
        scale: [1, 1.15, 1], 
        rotate: [0, 5, -5, 0],
        transition: { duration: 1.5, ease: "easeInOut", repeat: Infinity }
      },
    },
    {
      icon: <FaMagic className="text-5xl text-blue-400 mx-auto mb-4" />,
      title: "Generate a Resume",
      desc: "Create a professional resume from scratch with AI-powered templates tailored to your industry.",
      tab: "generate",
      animation: { 
        scale: [1, 1.1, 1], 
        y: [0, -10, 0],
        transition: { duration: 1.2, ease: "easeInOut", repeat: Infinity }
      },
    },
    {
      icon: <FaFire className="text-5xl text-red-400 mx-auto mb-4" />,
      title: "Roast Your Resume",
      desc: "Get a humorous yet insightful critique of your resume to identify areas for improvement.",
      tab: "roast",
      animation: { 
        scale: [1, 1.15, 1], 
        rotate: [0, -5, 5, 0],
        transition: { duration: 1.4, ease: "easeInOut", repeat: Infinity }
      },
    },
  ];

  const handleQuizSubmit = () => {
    const score = Object.values(quizAnswers).reduce((acc, answer) => {
      if (answer === "yes") return acc + 33;
      return acc;
    }, 0);
    setQuizResult(
      score >= 66
        ? "🚀 Your resume is in great shape! Ready to match it with your dream job?"
        : score >= 33
        ? "🌟 Your resume has potential! Let’s polish it with AirResume."
        : "☄️ Your resume needs some work. Start with our tools to make it shine!"
    );
  };

  const handleFeatureClick = (tab) => {
    setActiveTab(tab);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Updated galaxy-themed cursor with brighter colors
  const galaxyCursor = `url('data:image/svg+xml;utf8,<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="%23D8B4FE" stroke-width="1.5"><circle cx="16" cy="16" r="12" opacity="0.5"/><circle cx="16" cy="16" r="8" opacity="0.7"/><path d="M16 4a12 12 0 0 1 8 8" stroke-dasharray="2"/><path d="M16 28a12 12 0 0 1 -8 -8" stroke-dasharray="2"/><circle cx="16" cy="16" r="3" fill="%23EDE9FE"/></g></svg>') 16 16, auto`;

  return (
    <div className="text-white relative overflow-hidden">
      <style>{`
        .galaxy-cursor:hover {
          cursor: ${galaxyCursor};
        }
        .orbital-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }
        .particle {
          position: absolute;
          background: rgba(216, 180, 254, 0.5);
          border-radius: 50%;
        }
      `}</style>

      {/* Background orbiting particles */}
      <MotionDiv className="orbital-bg">
        {[...Array(10)].map((_, i) => (
          <MotionDiv
            key={i}
            className="particle"
            style={{
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50, 0],
              y: [0, Math.random() * 100 - 50, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </MotionDiv>

      <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 relative z-10">
        <MotionP
          // onClick={handleRefresh}
          className="galaxy-cursor text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          // whileHover={{ scale: 1.05 }}
          // whileTap={{ scale: 0.95 }}
        >
          AirResume
        </MotionP>
        <MotionP
          className="text-2xl md:text-3xl text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
        >
          Transform Your Career with AI-Powered Resume Magic
        </MotionP>
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
        >
          <ScrollLink
            to="features"
            smooth={true}
            duration={500}
            className="galaxy-cursor px-8 py-4 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-purple-500/50 transition"
          >
            Explore Now
          </ScrollLink>
        </MotionDiv>
      </section>

      <section id="features" className="py-20 px-6 relative z-10">
        <h2 className="text-4xl font-bold text-center text-purple-400 mb-12">Why Choose AirResume?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <MotionDiv
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6, ease: "easeOut" }}
              className="galaxy-cursor bg-gray-800 p-6 rounded-lg shadow-lg shadow-purple-500/20 text-center"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 25px rgba(147, 51, 234, 0.3)",
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              <MotionDiv
                animate={feature.animation}
              >
                {feature.icon}
              </MotionDiv>
              <h3 className="text-2xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
              <MotionButton
                onClick={() => handleFeatureClick(feature.tab)}
                className={`galaxy-cursor mt-4 px-4 py-2 bg-${
                  feature.tab === "match"
                    ? "purple"
                    : feature.tab === "generate"
                    ? "blue"
                    : "red"
                }-500 text-white rounded-md`}
                whileHover={{ 
                  scale: 1.1, 
                  backgroundColor: `${
                    feature.tab === "match"
                      ? "#a855f7"
                      : feature.tab === "generate"
                      ? "#3b82f6"
                      : "#ef4444"
                  }`,
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {feature.title.split(" ")[0]} Now
              </MotionButton>
            </MotionDiv>
          ))}
        </div>
      </section>

      {isQuizVisible && (
        <section id="quiz" className="py-20 px-6 bg-gray-900 relative z-10">
          <h2 className="text-4xl font-bold text-center text-purple-400 mb-12">Resume Readiness Quiz</h2>
          <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg shadow-purple-500/20">
            <p className="text-gray-300 mb-6 text-center">
              Answer a few quick questions to see how ready your resume is for the job market!
            </p>
            <div className="space-y-6">
              {[
                { question: "Does your resume include keywords specific to your target job?", key: "keywords" },
                { question: "Is your resume 1-2 pages long?", key: "length" },
                {
                  question: "Does your resume have a clear structure (e.g., sections for Experience, Education)?",
                  key: "structure",
                },
              ].map((item, i) => (
                <div key={i}>
                  <p className="text-gray-300 mb-2">{item.question}</p>
                  <div className="flex justify-center space-x-4">
                    <MotionButton
                      onClick={() => setQuizAnswers({ ...quizAnswers, [item.key]: "yes" })}
                      className={`galaxy-cursor px-4 py-2 rounded-md ${
                        quizAnswers[item.key] === "yes" ? "bg-green-500" : "bg-gray-700"
                      } text-white`}
                      whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(34, 197, 94, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      Yes
                    </MotionButton>
                    <MotionButton
                      onClick={() => setQuizAnswers({ ...quizAnswers, [item.key]: "no" })}
                      className={`galaxy-cursor px-4 py-2 rounded-md ${
                        quizAnswers[item.key] === "no" ? "bg-red-500" : "bg-gray-700"
                      } text-white`}
                      whileHover={{ scale: 1.05, boxShadow: "0 0 10px rgba(239, 68, 68, 0.3)" }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                      No
                    </MotionButton>
                  </div>
                </div>
              ))}
              <MotionButton
                onClick={handleQuizSubmit}
                className="galaxy-cursor w-full py-3 bg-purple-500 rounded-md text-white font-semibold flex items-center justify-center gap-2"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 15px rgba(147, 51, 234, 0.4)",
                  transition: { duration: 0.2, ease: "easeOut" }
                }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                Get Your Result
              </MotionButton>
            </div>
            {quizResult && (
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-gray-700 rounded-md text-center text-gray-300"
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                {quizResult}
              </MotionDiv>
            )}
          </div>
        </section>
      )}

      <footer className="py-6 text-center text-gray-400 relative z-10">
        <p className="mt-2">
          <span className="text-purple-400">© 2025 AirResume. All rights reserved.</span>
        </p>
        <div className="mt-2 space-x-4">
          <Link href="/about" className="galaxy-cursor hover:text-purple-400 transition">About</Link>
          <Link href="/contact" className="galaxy-cursor hover:text-purple-400 transition">Contact</Link>
          <Link href="/privacy" className="galaxy-cursor hover:text-purple-400 transition">Privacy Policy</Link>
          <MotionDiv
            whileHover={{ scale: 1.2, rotate: 360 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="galaxy-cursor inline-block text-gray-400 hover:text-purple-400 transition"
          >
            <a href="https://www.linkedin.com/in/mayank-rathi07/" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="w-6 h-6" />
            </a>
          </MotionDiv>
        </div>
      </footer>
    </div>
  );
}