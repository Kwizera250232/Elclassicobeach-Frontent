"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import type { HomeData } from '@/lib/home-data';

type PremiumHomeProps = {
  data: HomeData;
};

type ImageCard = {
  src: string;
  eyebrow: string;
  title: string;
  copy: string;
};

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Apartments', href: '#apartments' },
  { label: 'Dining', href: '#dining' },
  { label: 'Lake Life', href: '#lake-life' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Visit', href: '#visit' },
];

const barFallbackImages = [
  'https://res.cloudinary.com/do1zvhe3j/image/upload/v1777837390/elclassico/bar-overview/bny19igudahdbtyqh7eh.jpg',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85',
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?auto=format&fit=crop&w=1600&q=85',
];

const apartmentFallbackImages = [
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=85',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85',
];

const rubavuImages = [
  'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=85',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
];

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 },
};

const revealTransition = { duration: 0.8, ease: [0.22, 1, 0.36, 1] };

function mergeImages(primary: string[], fallback: string[]) {
  return Array.from(new Set([...primary.filter(Boolean), ...fallback]));
}

function formatPrice(value: number | string) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) {
    return 'On request';
  }

  return `RWF ${amount.toLocaleString('en-US')}`;
}

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.22 }}
      transition={{ ...revealTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`text-[0.68rem] font-bold uppercase tracking-[0.36em] ${
        light ? 'text-gold' : 'text-ocean'
      }`}
    >
      {children}
    </p>
  );
}

function SectionHeading({
  eyebrow,
  title,
  copy,
  centered = false,
  light = false,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  centered?: boolean;
  light?: boolean;
}) {
  return (
    <Reveal className={centered ? 'mx-auto max-w-4xl text-center' : 'max-w-4xl'}>
      <Eyebrow light={light}>{eyebrow}</Eyebrow>
      <h2
        className={`mt-5 font-[var(--font-heading)] text-5xl font-semibold leading-[0.95] tracking-[-0.04em] md:text-7xl ${
          light ? 'text-cream' : 'text-abyss'
        }`}
      >
        {title}
      </h2>
      {copy ? (
        <p
          className={`mt-6 text-base leading-8 md:text-lg ${
            light ? 'text-white/72' : 'text-slate-600'
          } ${centered ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}
        >
          {copy}
        </p>
      ) : null}
    </Reveal>
  );
}

function LuxuryButton({
  children,
  href,
  variant = 'gold',
}: {
  children: React.ReactNode;
  href: string;
  variant?: 'gold' | 'ghost' | 'dark';
}) {
  const classes = {
    gold:
      'border-gold bg-gold text-abyss shadow-[0_18px_50px_rgba(217,170,75,0.28)] hover:bg-[#f0c56b]',
    ghost: 'border-white/45 bg-white/10 text-white backdrop-blur-md hover:bg-white hover:text-abyss',
    dark: 'border-abyss bg-abyss text-cream hover:bg-ocean',
  };

  return (
    <a
      href={href}
      className={`group inline-flex items-center justify-center gap-3 rounded-full border px-7 py-3 text-xs font-bold uppercase tracking-[0.22em] transition duration-500 ${classes[variant]}`}
    >
      {children}
      <span className="transition duration-500 group-hover:translate-x-1">→</span>
    </a>
  );
}

function ResponsiveImage({
  src,
  alt,
  priority = false,
  className = '',
  sizes = '(min-width: 1024px) 50vw, 100vw',
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      className={`object-cover ${className}`}
    />
  );
}

function ImagePanel({
  item,
  className = '',
  priority = false,
}: {
  item: ImageCard;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Reveal className={className}>
      <article className="group relative min-h-[360px] overflow-hidden rounded-[2rem] bg-abyss shadow-[0_34px_90px_rgba(8,27,42,0.18)]">
        <ResponsiveImage
          src={item.src}
          alt={item.title}
          priority={priority}
          className="scale-105 transition duration-[1400ms] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,27,42,0.02),rgba(8,27,42,0.82))]" />
        <div className="absolute inset-x-0 bottom-0 p-7 text-white md:p-9">
          <p className="text-[0.66rem] font-bold uppercase tracking-[0.34em] text-gold">{item.eyebrow}</p>
          <h3 className="mt-3 font-[var(--font-heading)] text-4xl leading-none tracking-[-0.03em]">
            {item.title}
          </h3>
          <p className="mt-4 max-w-md text-sm leading-6 text-white/76">{item.copy}</p>
        </div>
      </article>
    </Reveal>
  );
}

export function PremiumHome({ data }: PremiumHomeProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const barImages = useMemo(
    () => mergeImages(data.media.barOverview, barFallbackImages),
    [data.media.barOverview],
  );
  const apartmentImages = useMemo(
    () => mergeImages(data.media.apartmentOverview, apartmentFallbackImages),
    [data.media.apartmentOverview],
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const experienceCards: ImageCard[] = [
    {
      src: apartmentImages[0],
      eyebrow: 'Stay',
      title: 'Apartments with a resort rhythm',
      copy: 'Modern rooms, breakfast, Wi-Fi, TV, and direct access to the food, music, and lake experiences guests travel for.',
    },
    {
      src: barImages[2],
      eyebrow: 'Dining',
      title: 'Fire-grilled Lake Kivu cuisine',
      copy: 'Whole fish, grilled chicken, vegetables, ugali, juices, and cocktails presented with a polished beach-club standard.',
    },
    {
      src: barImages[1],
      eyebrow: 'Lake Life',
      title: 'Boat moments and sunset energy',
      copy: 'Rubavu lake days move from quiet water views to golden-hour music, private corners, and memorable group celebrations.',
    },
  ];

  const galleryCards: ImageCard[] = [
    {
      src: barImages[0],
      eyebrow: 'Chez West',
      title: 'The El Classico signature',
      copy: 'A beach bar identity rooted in Rubavu, Lake Kivu, music, food, and hospitality.',
    },
    {
      src: apartmentImages[1],
      eyebrow: 'Apartments',
      title: 'Soft modern rooms',
      copy: 'Comfortable furnished stays for couples, families, business guests, and weekend visitors.',
    },
    {
      src: barImages[3],
      eyebrow: 'Restaurant',
      title: 'Table rituals',
      copy: 'A refined plating mood for grilled classics, juices, and relaxed lakeside dining.',
    },
    {
      src: barImages[4],
      eyebrow: 'Nightfall',
      title: 'Music after sunset',
      copy: 'A lively beach atmosphere with privacy corners, dancing, drinks, and premium table service.',
    },
    {
      src: apartmentImages[2],
      eyebrow: 'Hospitality',
      title: 'Stay longer in Rubavu',
      copy: 'A complete day-to-night destination for dining, entertainment, and short stays.',
    },
  ];

  return (
    <main className="min-h-screen overflow-hidden bg-cream text-abyss">
      <header
        className={`fixed inset-x-0 top-0 z-50 transition duration-500 ${
          scrolled ? 'bg-abyss/88 shadow-2xl shadow-black/20 backdrop-blur-xl' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-5 py-4 md:px-8 lg:px-12">
          <a href="#top" className="group flex items-center gap-4" aria-label="El Classico home">
            <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/60 bg-black/25 font-[var(--font-heading)] text-2xl font-bold text-gold backdrop-blur">
              EC
            </span>
            <span>
              <span className="block font-[var(--font-heading)] text-2xl font-semibold leading-none tracking-[0.16em] text-white">
                EL CLASSICO
              </span>
              <span className="mt-1 block text-[0.63rem] font-bold uppercase tracking-[0.28em] text-gold/90">
                Beach • Restaurant • Apartments
              </span>
            </span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-white/82 transition hover:text-gold"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="tel:+250783256132"
              className="text-[0.7rem] font-bold uppercase tracking-[0.22em] text-white/82 transition hover:text-gold"
            >
              Call Us
            </a>
            <a
              href="#book"
              className="rounded-full border border-gold bg-gold px-5 py-3 text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-abyss transition hover:bg-cream"
            >
              Book Now
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="rounded-full border border-white/30 bg-white/10 px-4 py-3 text-xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            Menu
          </button>
        </div>

        <motion.div
          id="mobile-menu"
          initial={false}
          animate={menuOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
          className="overflow-hidden border-t border-white/10 bg-abyss/96 lg:hidden"
        >
          <div className="grid gap-1 px-5 py-5">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-sm font-bold uppercase tracking-[0.24em] text-white/82 transition hover:bg-white/10 hover:text-gold"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#book"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-full bg-gold px-5 py-4 text-center text-xs font-extrabold uppercase tracking-[0.24em] text-abyss"
            >
              Book Now
            </a>
          </div>
        </motion.div>
      </header>

      <section id="top" className="relative flex min-h-screen items-end overflow-hidden bg-abyss">
        <ResponsiveImage
          src={barImages[1]}
          alt="Luxury Lake Kivu beach experience at El Classico"
          priority
          sizes="100vw"
          className="scale-105"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_20%,rgba(217,170,75,0.2),transparent_34%),linear-gradient(90deg,rgba(4,12,19,0.78),rgba(4,12,19,0.35)_48%,rgba(4,12,19,0.2)),linear-gradient(180deg,rgba(4,12,19,0.2),rgba(4,12,19,0.86))]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent" />

        <div className="relative mx-auto grid w-full max-w-[1500px] gap-10 px-5 pb-8 pt-32 md:px-8 lg:grid-cols-[1fr_0.42fr] lg:px-12 lg:pb-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-5xl"
          >
            <p className="text-xs font-bold uppercase tracking-[0.45em] text-gold md:text-sm">
              Welcome to El Classico
            </p>
            <h1 className="mt-7 font-[var(--font-heading)] text-[4.6rem] font-semibold leading-[0.8] tracking-[-0.07em] text-white sm:text-[6.5rem] md:text-[9rem] lg:text-[11rem]">
              Luxury Beach
              <span className="block text-cream">Experience</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/82 md:text-2xl md:leading-10">
              Bar • Restaurant • Apartments near Lake Kivu, designed for unforgettable sunsets,
              refined dining, and elevated stays in Rubavu.
            </p>
            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <LuxuryButton href="#about">Explore</LuxuryButton>
              <LuxuryButton href="#book" variant="ghost">
                Book Now
              </LuxuryButton>
            </div>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="self-end rounded-[2rem] border border-white/18 bg-white/10 p-5 text-white shadow-[0_24px_90px_rgba(0,0,0,0.3)] backdrop-blur-xl"
          >
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.32em] text-gold">
              Rubavu, Rwanda
            </p>
            <p className="mt-4 font-[var(--font-heading)] text-3xl leading-tight">
              A cinematic lakefront escape where food, music, water, and comfort meet.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {['Beach Bar', 'Restaurant', 'Apartments'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-black/18 px-3 py-4">
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.2em] text-white/72">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>

        <div className="absolute bottom-0 left-0 right-0 hidden border-t border-white/14 bg-black/22 backdrop-blur-md xl:block">
          <div className="mx-auto grid max-w-[1500px] grid-cols-4 divide-x divide-white/12 px-12">
            {[
              ['Location', 'Rubavu District • Lake Kivu'],
              ['Signature', 'Fish • Chicken • Drinks'],
              ['Stay', 'Modern furnished apartments'],
              ['Contact', '+250 783 256 132'],
            ].map(([label, value]) => (
              <div key={label} className="px-8 py-5">
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.28em] text-gold">{label}</p>
                <p className="mt-2 text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="relative bg-cream px-5 py-24 md:px-8 md:py-32 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(217,170,75,0.12),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(15,59,87,0.08),transparent_35%)]" />
        <div className="relative mx-auto max-w-[1350px]">
          <SectionHeading
            centered
            eyebrow="Experience the spirit of Lake Kivu"
            title="A Rubavu beach address with international resort presence."
            copy="El Classico Beach Chez West is known as a waterfront bar and restaurant on the shores of Lake Kivu in Rubavu, with music, food, boat moments, private corners, and modern apartment stays connected to the destination."
          />

          <div className="mt-16 grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <Reveal>
              <div className="relative min-h-[620px] overflow-hidden rounded-[2.8rem] shadow-[0_30px_110px_rgba(8,27,42,0.24)]">
                <ResponsiveImage src={barImages[0]} alt="El Classico Beach Chez West" />
                <div className="absolute inset-0 bg-gradient-to-t from-abyss/70 via-transparent to-transparent" />
                <div className="absolute bottom-7 left-7 right-7 rounded-[1.5rem] border border-white/18 bg-white/12 p-6 text-white backdrop-blur-xl">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-gold">
                    Chez West
                  </p>
                  <p className="mt-3 font-[var(--font-heading)] text-4xl leading-none">
                    Beach hospitality made for sunsets.
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="grid gap-5 md:grid-cols-2">
              {[
                ['01', 'Beach Bar', 'A stylish Lake Kivu meeting point for drinks, music, and relaxed waterfront energy.'],
                ['02', 'Restaurant', 'Local favorites elevated with premium plating, grilled fish, chicken, vegetables, juices, and cocktails.'],
                ['03', 'Apartments', 'Comfortable furnished rooms near the lake with breakfast, internet, TV, and restaurant access.'],
                ['04', 'Rubavu Moments', 'Boat rides, golden-hour photos, group celebrations, and an easy path into Gisenyi lake life.'],
              ].map(([number, title, copy], index) => (
                <Reveal key={title} delay={index * 0.08}>
                  <article className="min-h-[250px] rounded-[2rem] border border-abyss/10 bg-white/78 p-7 shadow-[0_18px_70px_rgba(8,27,42,0.07)] backdrop-blur transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(8,27,42,0.13)]">
                    <p className="font-[var(--font-heading)] text-5xl text-gold">{number}</p>
                    <h3 className="mt-5 font-[var(--font-heading)] text-3xl leading-none text-abyss">
                      {title}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-slate-600">{copy}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-24 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-[1450px]">
          <SectionHeading
            centered
            eyebrow="Signature offers"
            title="Choose your El Classico escape."
            copy="A premium homepage flow modeled around resort discovery: accommodations, dining, and experiences are presented as distinct but connected reasons to visit."
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {experienceCards.map((item, index) => (
              <ImagePanel key={item.title} item={item} priority={index === 0} />
            ))}
          </div>
        </div>
      </section>

      <section id="apartments" className="relative overflow-hidden bg-abyss px-5 py-24 md:px-8 md:py-32 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(217,170,75,0.18),transparent_34%),linear-gradient(180deg,rgba(8,27,42,1),rgba(4,12,19,1))]" />
        <div className="relative mx-auto grid max-w-[1450px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow="Featured apartments"
              title="Stay steps from the Lake Kivu lifestyle."
              copy="El Classico Apartments are presented for guests who want a polished Rubavu base: modern rooms, calm surroundings, restaurant service, breakfast, internet, TV, and boat-experience add-ons."
              light
            />
            <Reveal className="mt-10">
              <div className="grid gap-4 sm:grid-cols-2">
                {data.apartments.map((apartment) => (
                  <article
                    key={apartment.id}
                    className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-6 text-white backdrop-blur"
                  >
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-gold">
                      El Classico stay
                    </p>
                    <h3 className="mt-4 font-[var(--font-heading)] text-3xl leading-none">
                      {apartment.name}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-white/68">{apartment.description}</p>
                    <div className="mt-5 space-y-3">
                      {apartment.rooms.slice(0, 2).map((room) => (
                        <div
                          key={room.id}
                          className="rounded-2xl border border-white/10 bg-black/18 p-4 text-sm text-white/82"
                        >
                          <span className="font-semibold text-white">{room.title}</span>
                          <span className="block text-white/60">
                            {room.capacity} guests • from {formatPrice(room.baseNightlyRate)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="relative min-h-[540px] overflow-hidden rounded-[2.6rem] md:mt-20">
                <ResponsiveImage src={apartmentImages[0]} alt="El Classico apartment bedroom" />
              </div>
              <div className="space-y-5">
                <div className="relative min-h-[300px] overflow-hidden rounded-[2.2rem]">
                  <ResponsiveImage src={apartmentImages[1]} alt="Modern apartment stay" />
                </div>
                <div className="rounded-[2.2rem] border border-gold/30 bg-gold p-7 text-abyss">
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.28em]">Stay benefit</p>
                  <p className="mt-5 font-[var(--font-heading)] text-4xl leading-none">
                    Book 2+ nights and ask about a Lake Kivu boat moment.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="dining" className="bg-cream px-5 py-24 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-[1450px]">
          <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal>
              <div className="relative min-h-[700px] overflow-hidden rounded-[2.8rem]">
                <ResponsiveImage src={barImages[2]} alt="El Classico grilled dining experience" />
                <div className="absolute inset-0 bg-gradient-to-t from-abyss/82 via-abyss/5 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 rounded-[1.8rem] border border-white/14 bg-black/24 p-7 text-white backdrop-blur-xl">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.32em] text-gold">
                    Restaurant experience
                  </p>
                  <p className="mt-4 font-[var(--font-heading)] text-5xl leading-none">
                    Fresh fish, fire chicken, juices, cocktails.
                  </p>
                </div>
              </div>
            </Reveal>

            <div>
              <SectionHeading
                eyebrow="Restaurant and bar"
                title="A table culture built for long afternoons and golden nights."
                copy="The food and beverage story is intentionally cinematic: generous local plates, tropical drinks, a polished table setting, and the social energy that made Chez West known in Rubavu."
              />

              <div className="mt-10 space-y-4">
                {data.menu.slice(0, 3).map((item, index) => (
                  <Reveal key={item.id} delay={index * 0.08}>
                    <article className="group rounded-[2rem] border border-abyss/10 bg-white p-6 shadow-[0_18px_70px_rgba(8,27,42,0.06)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(8,27,42,0.12)]">
                      <div className="flex items-start justify-between gap-5">
                        <div>
                          <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-ocean">
                            {item.category}
                          </p>
                          <h3 className="mt-3 font-[var(--font-heading)] text-4xl leading-none text-abyss">
                            {item.title}
                          </h3>
                        </div>
                        <p className="rounded-full bg-abyss px-4 py-2 text-xs font-bold text-gold">
                          {formatPrice(item.basePrice)}
                        </p>
                      </div>
                      <p className="mt-4 text-sm leading-7 text-slate-600">{item.description}</p>
                      {item.pairingHint ? (
                        <p className="mt-4 text-sm font-semibold text-ocean">{item.pairingHint}</p>
                      ) : null}
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="lake-life" className="relative min-h-[760px] overflow-hidden bg-abyss px-5 py-24 md:px-8 md:py-32 lg:px-12">
        <ResponsiveImage src={barImages[1]} alt="Lake Kivu beach and boat experience" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,12,19,0.82),rgba(4,12,19,0.28)),linear-gradient(180deg,rgba(4,12,19,0.18),rgba(4,12,19,0.82))]" />
        <div className="relative mx-auto max-w-[1450px]">
          <div className="max-w-3xl">
            <SectionHeading
              eyebrow="Beach and Lake Experience"
              title="The day begins on the water and ends under warm lights."
              copy="Guests can settle into the lakefront rhythm: boat rides, photo moments, sunset dining, live music, privacy corners, and a complete Rubavu night out without leaving the El Classico world."
              light
            />
            <Reveal className="mt-10">
              <div className="grid gap-4 sm:grid-cols-3">
                {['Boat rides', 'Sunset tables', 'Music nights'].map((item) => (
                  <div key={item} className="rounded-[1.6rem] border border-white/12 bg-white/10 p-5 backdrop-blur">
                    <p className="font-[var(--font-heading)] text-3xl leading-none text-white">{item}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="gallery" className="bg-white px-5 py-24 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-[1450px]">
          <SectionHeading
            centered
            eyebrow="Gallery"
            title="A cinematic visual rhythm for food, rooms, water, and nightlife."
            copy="The gallery uses oversized editorial image cards, soft overlays, and hover motion so every part of the brand feels premium and immersive."
          />

          <div className="mt-14 grid gap-5 lg:grid-cols-12">
            <ImagePanel item={galleryCards[0]} className="lg:col-span-7" />
            <ImagePanel item={galleryCards[1]} className="lg:col-span-5" />
            <ImagePanel item={galleryCards[2]} className="lg:col-span-4" />
            <ImagePanel item={galleryCards[3]} className="lg:col-span-4" />
            <ImagePanel item={galleryCards[4]} className="lg:col-span-4" />
          </div>
        </div>
      </section>

      <section className="bg-cream px-5 py-24 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-[1350px]">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <SectionHeading
              eyebrow="Guest voices"
              title="Premium atmosphere with the soul of Rubavu."
              copy="The redesign treats testimonials like a resort credibility section: elegant quotes, warm spacing, and service cues that make the destination feel trustworthy."
            />
            <div className="grid gap-5 md:grid-cols-2">
              {[
                [
                  'Dinner by the lake felt special from the first drink to the final song. El Classico has the right mix of privacy, energy, and beautiful views.',
                  'Aline N.',
                ],
                [
                  'The apartment made it easy to stay longer in Rubavu. Breakfast, restaurant access, and the lake experience all felt connected.',
                  'Patrick M.',
                ],
                [
                  'A perfect place for visitors who want food, music, boat moments, and a polished beach atmosphere in one destination.',
                  'Sarah K.',
                ],
                [
                  'The fish, the sunset, and the music made the evening feel like a premium resort moment on Lake Kivu.',
                  'Jean Claude R.',
                ],
              ].map(([quote, name], index) => (
                <Reveal key={name} delay={index * 0.06}>
                  <blockquote className="rounded-[2rem] border border-abyss/10 bg-white p-7 shadow-[0_18px_70px_rgba(8,27,42,0.06)]">
                    <p className="font-[var(--font-heading)] text-3xl leading-tight text-abyss">“{quote}”</p>
                    <footer className="mt-6 text-[0.7rem] font-bold uppercase tracking-[0.28em] text-ocean">
                      {name}
                    </footer>
                  </blockquote>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="visit" className="bg-abyss px-5 py-24 md:px-8 md:py-32 lg:px-12">
        <div className="mx-auto max-w-[1450px]">
          <SectionHeading
            centered
            eyebrow="Explore Rubavu"
            title="Turn one visit into a Lake Kivu itinerary."
            copy="A premium resort website should help guests imagine the full stay. These pathways show how El Classico fits into Rubavu travel, dining, and water activities."
            light
          />

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {[
              ['Lake Kivu Arrival', 'Check in, settle into the apartment, and begin with a lakeside lunch.', rubavuImages[0]],
              ['Golden Hour Boat Ride', 'Book a scenic boat moment before returning for grilled fish and drinks.', rubavuImages[1]],
              ['Chez West Night', 'Move into music, cocktails, privacy corners, and a premium table experience.', rubavuImages[2]],
            ].map(([title, copy, src], index) => (
              <Reveal key={title} delay={index * 0.08}>
                <article className="overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/[0.06] text-white">
                  <div className="relative h-72">
                    <ResponsiveImage src={src} alt={title} />
                  </div>
                  <div className="p-7">
                    <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em] text-gold">
                      Day 0{index + 1}
                    </p>
                    <h3 className="mt-4 font-[var(--font-heading)] text-4xl leading-none">{title}</h3>
                    <p className="mt-4 text-sm leading-7 text-white/68">{copy}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="book" className="relative overflow-hidden bg-gold px-5 py-20 md:px-8 lg:px-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(255,255,255,0.34),transparent_28%),linear-gradient(120deg,rgba(255,255,255,0.18),transparent)]" />
        <div className="relative mx-auto grid max-w-[1350px] items-center gap-8 lg:grid-cols-[1fr_auto]">
          <Reveal>
            <Eyebrow>Book the experience</Eyebrow>
            <h2 className="mt-5 font-[var(--font-heading)] text-5xl font-semibold leading-none tracking-[-0.04em] text-abyss md:text-7xl">
              Reserve your table, apartment, or Lake Kivu moment.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-abyss/78 md:text-lg">
              Call or WhatsApp El Classico to confirm dining, event seating, apartment availability, and
              special boat experiences near Rubavu Port.
            </p>
          </Reveal>
          <Reveal className="flex flex-col gap-4 sm:flex-row lg:flex-col">
            <LuxuryButton href="tel:+250783256132" variant="dark">
              Call +250 783 256 132
            </LuxuryButton>
            <LuxuryButton href="https://wa.me/250783256132" variant="dark">
              WhatsApp Booking
            </LuxuryButton>
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#030a10] px-5 py-16 text-white md:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1450px] gap-10 lg:grid-cols-[1.1fr_0.7fr_0.7fr_0.9fr]">
          <div>
            <p className="font-[var(--font-heading)] text-5xl font-semibold tracking-[-0.04em] text-cream">
              El Classico
            </p>
            <p className="mt-4 max-w-md text-sm leading-7 text-white/62">
              A premium beach bar, restaurant, and apartment experience in Rubavu District near Lake
              Kivu, crafted for dining, music, sunset leisure, and modern hospitality.
            </p>
          </div>
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-gold">Explore</p>
            <div className="mt-5 grid gap-3 text-sm text-white/68">
              {navItems.map((item) => (
                <a key={item.href} href={item.href} className="transition hover:text-gold">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-gold">Contact</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-white/68">
              <p>Rubavu / Gisenyi, Rwanda</p>
              <p>Near Lake Kivu and New Rubavu Port</p>
              <a className="block text-white transition hover:text-gold" href="tel:+250783256132">
                +250 783 256 132
              </a>
            </div>
          </div>
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-gold">Find us</p>
            <div className="mt-5 overflow-hidden rounded-[1.5rem] border border-white/10">
              <iframe
                title="El Classico Beach map"
                src="https://www.google.com/maps?q=El%20Classico%20Beach%20Chez%20West%20Rubavu%20Rwanda&output=embed"
                loading="lazy"
                className="h-56 w-full grayscale"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-[1450px] flex-col gap-3 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.24em] text-white/38 md:flex-row md:items-center md:justify-between">
          <p>© 2026 El Classico Beach Chez West</p>
          <p>Luxury beach hospitality in Rubavu, Rwanda</p>
        </div>
      </footer>
    </main>
  );
}
