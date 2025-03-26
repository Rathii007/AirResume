import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

export default function Contact() {
  console.log('[DEBUG] Contact.js - Page rendered on server/client');

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('[DEBUG] Contact.js - Form submitted with data:', formData);
    try {
      const response = await fetch("http://localhost:8000/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData).toString(),
      });
      if (response.ok) {
        console.log('[DEBUG] Contact.js - Form submission successful');
        setSubmitted(true);
        setError(null);
      } else {
        throw new Error("Failed to submit the form.");
      }
    } catch (err) {
      console.error('[DEBUG] Contact.js - Form submission error:', err);
      setError("There was an error submitting your message. Please try again.");
    }
  };

  return (
    <div className="text-white min-h-screen bg-gray-900 flex flex-col items-center py-20 px-6">
      <motion.h1
        className="text-5xl font-bold text-purple-400 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Contact Us
      </motion.h1>
      <motion.div
        className="max-w-2xl w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        {submitted ? (
          <div className="text-center text-gray-300">
            <p className="text-2xl">Thank you for reaching out!</p>
            <p>We’ll get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-gray-300 mb-2">
                Message
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="5"
                required
              />
            </div>
            {error && (
              <p className="text-red-500 text-center">{error}</p>
            )}
            <motion.button
              type="submit"
              className="w-full py-3 bg-purple-500 rounded-md text-white font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Send Message
            </motion.button>
          </form>
        )}
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