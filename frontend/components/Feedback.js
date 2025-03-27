"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

// Galaxy-themed cursor (same as in App.js and LandingPage.js)
const galaxyCursor = `url('data:image/svg+xml;utf8,<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="%23D8B4FE" stroke-width="1.5"><circle cx="16" cy="16" r="12" opacity="0.5"/><circle cx="16" cy="16" r="8" opacity="0.7"/><path d="M16 4a12 12 0 0 1 8 8" stroke-dasharray="2"/><path d="M16 28a12 12 0 0 1 -8 -8" stroke-dasharray="2"/><circle cx="16" cy="16" r="3" fill="%23EDE9FE"/></g></svg>') 16 16, auto`;

const Feedback = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    // Validate feedback length
    if (!feedback) {
      newErrors.feedback = "Feedback is required.";
    } else if (feedback.length < 10) {
      newErrors.feedback = "Feedback must be at least 10 characters long.";
    } else if (feedback.length > 1000) {
      newErrors.feedback = "Feedback cannot exceed 1000 characters.";
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/feedback/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, feedback }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setName("");
        setEmail("");
        setFeedback("");
        setErrors({});
      } else {
        setMessage("Failed to submit feedback. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Orbital Background Particles (similar to LandingPage.js) */}
      <motion.div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-purple-400 rounded-full opacity-50"
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
      </motion.div>

      {/* Orbital Rings (similar to LandingPage.js) */}
      <motion.div
        className="absolute w-96 h-96 border-2 border-purple-400 rounded-full opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-80 h-80 border-2 border-blue-400 rounded-full opacity-20"
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-64 h-64 border-2 border-indigo-400 rounded-full opacity-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Feedback Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 bg-gray-800 bg-opacity-90 p-8 rounded-lg shadow-lg shadow-purple-500/20 w-full max-w-md border border-purple-500"
      >
        <h2 className="text-3xl font-bold text-center text-purple-400 mb-6">Share Your Cosmic Feedback</h2>
        <p className="text-center text-gray-300 mb-6">Help us navigate the galaxy of improvement!</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">Name (optional)</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full p-3 bg-gray-700 text-gray-200 border border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Email (optional)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full p-3 bg-gray-700 text-gray-200 border border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              placeholder="your.email@galaxy.com"
            />
            {errors.email && <p className="mt-1 text-red-400 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
              className="mt-1 w-full p-3 bg-gray-700 text-gray-200 border border-purple-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all h-32 resize-none"
              placeholder="Tell us your thoughts..."
            />
            {errors.feedback && <p className="mt-1 text-red-400 text-sm">{errors.feedback}</p>}
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            className={`galaxy-cursor w-full py-3 rounded-md text-white font-semibold transition-all ${
              isSubmitting
                ? "bg-purple-600 opacity-50 cursor-not-allowed"
                : "bg-purple-500 hover:bg-purple-400 active:bg-purple-600"
            }`}
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(147, 51, 234, 0.4)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {isSubmitting ? "Submitting..." : "Send Feedback"}
          </motion.button>
        </form>

        {message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 text-center ${
              message.includes("Thank") ? "text-green-400" : "text-red-400"
            }`}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
};

export default Feedback;