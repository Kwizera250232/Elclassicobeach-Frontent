"use client";

import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/20 bg-gradient-to-br from-[#0d2f47]/80 via-[#11354e]/70 to-[#311f18]/65 p-8 shadow-glow md:p-14">
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sunset/30 blur-3xl" />
      <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
        className="relative max-w-2xl"
      >
        <p className="text-sm uppercase tracking-[0.3em] text-sand">Lake Kivu Signature Experience</p>
        <h1 className="mt-4 font-[var(--font-heading)] text-5xl leading-tight text-[#fff6e5] md:text-7xl">
          El Classico Beach Chez West
        </h1>
        <p className="mt-5 max-w-xl text-base text-[#f3e8d0]/90 md:text-lg">
          Premium dining, high-energy nights, and seamless apartment booking in one platform designed
          for modern luxury hospitality.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            className="rounded-full bg-gradient-to-r from-gold to-sunset px-6 py-3 font-semibold text-abyss"
            href="#book-now"
          >
            Reserve a Table
          </a>
          <a
            className="rounded-full border border-white/30 bg-black/15 px-6 py-3 font-semibold text-white"
            href="#apartment-stays"
          >
            Explore Apartments
          </a>
        </div>
      </motion.div>
    </section>
  );
}
