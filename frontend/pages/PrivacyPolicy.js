import { motion } from "framer-motion";
import Link from "next/link";

export default function PrivacyPolicy() {
  console.log('[DEBUG] PrivacyPolicy.js - Page rendered on server/client');

  return (
    <div className="text-white min-h-screen bg-gray-900 flex flex-col items-center py-20 px-6">
      <motion.h1
        className="text-5xl font-bold text-purple-400 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Privacy Policy
      </motion.h1>
      <motion.div
        className="max-w-3xl text-gray-300 space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <section>
          <h2 className="text-2xl font-semibold text-white mb-2">Introduction</h2>
          <p>
            At AirResume, we value your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our services.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-white mb-2">Data Collection</h2>
          <p>
            We collect information you provide, such as your name, email, and resume data, to deliver our services. We also collect usage data to improve our platform.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-white mb-2">Data Usage</h2>
          <p>
            Your data is used to generate resumes, provide insights, and enhance user experience. We do not sell your personal information to third parties.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-white mb-2">Data Security</h2>
          <p>
            We implement industry-standard security measures to protect your data. However, no system is completely secure, and we cannot guarantee absolute security.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-white mb-2">Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please reach out to us at <a href="mailto:support@airresume.com" className="text-purple-400 hover:underline">support@airresume.com</a>.
          </p>
        </section>
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