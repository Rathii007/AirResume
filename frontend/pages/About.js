import { motion } from "framer-motion";
import Link from "next/link";

export default function About() {
  console.log('[DEBUG] About.js - Page rendered on server/client');

  return (
    <div className="text-white min-h-screen bg-gray-900 flex flex-col items-center py-20 px-6">
      <motion.h1
        className="text-5xl font-bold text-purple-400 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        About AirResume
      </motion.h1>
      <motion.div
        className="max-w-3xl text-center text-gray-300 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <p>
          AirResume is an AI-powered platform designed to help job seekers create, optimize, and perfect their resumes. Our mission is to empower individuals to land their dream jobs by providing cutting-edge tools and insights.
        </p>
        <p>
          Founded in 2024, we leverage advanced AI technology from xAI to offer features like resume matching, generation, and critique. Whether you're starting from scratch or looking to improve an existing resume, AirResume has you covered.
        </p>
        <p>
          Join thousands of users who have transformed their career journeys with AirResume. Let’s make your resume shine!
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <Link
          href="/"
          className="mt-8 px-6 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition inline-block"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}