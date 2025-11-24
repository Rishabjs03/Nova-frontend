"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-gray-900 relative overflow-hidden">
      {/* Paper Texture */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0),
        repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px),
        repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.02) 2px, rgba(0,0,0,0.02) 4px)
      `,
          backgroundSize: "8px 8px, 32px 32px, 32px 32px",
        }}
      />

      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex items-center justify-between px-8 py-6"
      >
        <div
          className="text-2xl font-semibold tracking-tight text-gray-900 cursor-pointer"
          onClick={() => router.push("/")}
        >
          Nova
        </div>
        {/* Placeholder for future nav items if needed */}
      </motion.nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="flex flex-col items-center gap-8"
        >
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
            className="text-center space-y-4 cursor-pointer"
          >
            <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-gray-900">
              Experience Nova
            </h1>
            <p className="text-lg md:text-xl text-gray-500 max-w-md mx-auto">
              Your intelligent companion for text and voice interactions.
            </p>
          </motion.div>

          {/* Playground Button */}
          <Link href="/text">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="group flex items-center gap-3 px-8 py-4 bg-gray-900/90 backdrop-blur-md border border-gray-800/50 text-white rounded-full text-lg font-medium transition-all hover:bg-gray-800 shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]"
            >
              <span>Playground</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-transform group-hover:translate-x-1"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </motion.button>
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="relative z-10 py-6 text-center text-sm text-gray-400"
      >
        Made by{" "}
        <a
          href="https://x.com/Yrishavjs"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-gray-900 transition-colors underline decoration-gray-300 underline-offset-4 hover:decoration-gray-900"
        >
          Rishav
        </a>
      </motion.footer>
    </div>
  );
}
