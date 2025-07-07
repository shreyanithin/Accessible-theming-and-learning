"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ColorSightLanding() {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => { setIsVisible(true); }, []);

  return (
    <div className="flex min-h-screen font-sans">
      {/* Left Section */}
      <div className="flex-1 bg-gradient-to-br from-neutral-900 to-neutral-800 flex flex-col justify-center px-16 py-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <div className="text-blue-600 text-7xl font-bold mb-16 text-center md:text-left">Inclusify</div>
          <h1 className="text-7xl font-extrabold text-white mb-10 leading-tight">
            See design<br />through every<br />eye.
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-lg">
            Make your colors work for everyone by simulating real-world color vision deficiencies. Build interfaces that are inclusive, accessible, and beautifully clear for all users.
          </p>
          <motion.div whileHover={{ scale: 1.07 }} className="inline-block">
            <Link
              href="/"
              className="bg-gradient-to-r from-red-600 to-red-500 text-white text-xl font-bold px-10 py-5 rounded-full shadow-lg hover:scale-105 transition-transform block"
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Section */}
      <div className="flex-1 bg-gradient-to-br from-red-700 to-red-500 flex items-center justify-center px-8 py-20">
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-lg rotate-3"
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
        >
          {/* Image Comparison */}
          <div className="flex gap-2 mb-8">
            <div className="flex-1 flex flex-col items-center">
              <img src="/babykutty.jpg" alt="Normal Vision" className="rounded-xl w-full h-48 object-cover mb-2" />
              <span className="bg-black/80 text-white text-xs px-3 py-1 rounded-full font-semibold">Normal Vision</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <img src="/babykutty.jpg" alt="Color Blind View" className="rounded-xl w-full h-48 object-cover mb-2 grayscale" />
              <span className="bg-black/80 text-white text-xs px-3 py-1 rounded-full font-semibold">Color Blind View</span>
            </div>
          </div>
          {/* Color Swatches */}
          <div className="bg-gray-50 rounded-xl p-5">
            <div className="font-semibold text-center mb-3 text-black">Color Accessibility Demo</div>
            <div className="flex justify-between mb-2">
              <span className="text-xs font-bold text-black">Normal Vision</span>
              <span className="text-xs font-bold text-black">Color Blind View</span>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-2">
                <span className="w-6 h-6 rounded-full bg-red-500 inline-block"></span>
                <span className="w-6 h-6 rounded-full bg-green-500 inline-block"></span>
                <span className="w-6 h-6 rounded-full bg-blue-500 inline-block"></span>
                <span className="w-6 h-6 rounded-full bg-yellow-400 inline-block"></span>
              </div>
              <div className="flex gap-2">
                <span className="w-6 h-6 rounded-full bg-yellow-900 inline-block"></span>
                <span className="w-6 h-6 rounded-full bg-gray-600 inline-block"></span>
                <span className="w-6 h-6 rounded-full bg-blue-400 inline-block"></span>
                <span className="w-6 h-6 rounded-full bg-yellow-700 inline-block"></span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}