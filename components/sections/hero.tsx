"use client";

import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-8 shadow-sm md:p-14">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-orange-100/50 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="relative max-w-2xl"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">Lake Kivu Signature Experience</p>
        <h1 className="mt-4 font-[var(--font-heading)] text-5xl leading-tight text-gray-900 md:text-7xl">
          El Classico Beach Chez West
        </h1>
        <p className="mt-5 max-w-xl text-base text-gray-600 md:text-lg">
          Premium dining, high-energy nights, and seamless apartment booking in one platform designed
          for modern luxury hospitality.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            className="rounded-full bg-amber-500 px-6 py-3 font-semibold text-white hover:bg-amber-600"
            href="#book-now"
          >
            Reserve a Table
          </a>
          <a
            className="rounded-full border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            href="#apartment-stays"
          >
            Explore Apartments
          </a>
        </div>
      </motion.div>
    </section>
  );
}
