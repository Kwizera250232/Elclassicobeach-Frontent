"use client";

import { motion } from 'framer-motion';
import { LuxuryCard } from '../ui/luxury-card';

const cards = [
  {
    title: 'Beach Menu & Pairings',
    subtitle: 'Cuisine',
    body: 'Chef-curated fish and chicken menus with spice levels and drink pairing suggestions.',
  },
  {
    title: 'VIP Event Nights',
    subtitle: 'Nightlife',
    body: 'DJ lineups, countdowns, and premium table packages with frictionless reservations.',
  },
  {
    title: 'Apartment Booking Engine',
    subtitle: 'Stay',
    body: 'Live room availability, seasonal rates, and concierge add-ons in one checkout flow.',
  },
];

export function ExperienceGrid() {
  return (
    <section className="mt-10 grid gap-4 md:grid-cols-3">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: index * 0.1 }}
        >
          <LuxuryCard title={card.title} subtitle={card.subtitle}>
            {card.body}
          </LuxuryCard>
        </motion.div>
      ))}
    </section>
  );
}
