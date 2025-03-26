import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Custom404() {
  const router = useRouter();
  const [attemptedRoute, setAttemptedRoute] = useState("");

  useEffect(() => {
    // Only access router.asPath on the client side
    setAttemptedRoute(router.asPath);
    console.log(`[DEBUG] 404.js - Attempted route: ${router.asPath}`);
    console.log(`[DEBUG] 404.js - Query params:`, router.query);
  }, [router.asPath, router.query]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
      <h1 className="text-5xl font-bold text-purple-400 mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-gray-300 mb-8">
        The page you are looking for does not exist. Attempted route: <strong>{attemptedRoute}</strong>
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}