"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { HomeData } from '@/lib/home-data';

type PremiumHomeProps = {
  data: HomeData;
};

type SquareImageProps = {
  src: string;
  alt: string;
  label?: string;
  priority?: boolean;
  className?: string;
};

const images = {
  apartmentBreakfast:
    'https://res.cloudinary.com/do1zvhe3j/image/upload/v1777837390/elclassico/bar-overview/bny19igudahdbtyqh7eh.jpg',
  kigaliFishOne:
    'https://www.kigaliup.net/wp-content/uploads/2021/12/WhatsApp-Image-2021-12-23-at-08.33.51.jpeg',
  kigaliFishTwo:
    'https://www.kigaliup.net/wp-content/uploads/2021/12/WhatsApp-Image-2021-12-23-at-08.33.37.jpeg',
  apartmentRoom:
    'https://q-xx.bstatic.com/xdata/images/hotel/max1280x900/829171217.jpg?k=4208cc1ebd5d4b1d618f5180ce134a6ce1cfd7e876bfb18d2f873562296df090&o=&a=2237691',
};

const navItems = [
  ['Home', '#home'],
  ['About', '#about'],
  ['Categories', '#categories'],
  ['Offers', '#offers'],
  ['Legacy', '#legacy'],
  ['Accommodation', '#accommodation'],
  ['Magazine', '/blog'],
  ['Contact', '#contact'],
] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 34 },
  visible: { opacity: 1, y: 0 },
};

function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function UnderlineTitle({
  eyebrow,
  title,
  centered = false,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  centered?: boolean;
  light?: boolean;
}) {
  return (
    <div className={centered ? 'mx-auto max-w-4xl text-center' : 'max-w-4xl'}>
      {eyebrow ? (
        <p
          className={`text-[0.67rem] font-bold uppercase tracking-[0.36em] ${
            light ? 'text-gold' : 'text-ocean'
          }`}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`mt-4 font-[var(--font-heading)] text-5xl font-semibold leading-[0.98] tracking-[-0.045em] md:text-7xl ${
          light ? 'text-cream' : 'text-abyss'
        }`}
      >
        {title}
      </h2>
      <span className={`mt-6 block h-px w-28 bg-gold ${centered ? 'mx-auto' : ''}`} />
    </div>
  );
}

function SquareImage({ src, alt, label, priority = false, className = '' }: SquareImageProps) {
  return (
    <div
      className={`group relative aspect-square overflow-hidden bg-abyss shadow-[0_24px_90px_rgba(8,27,42,0.16)] ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 1024px) 33vw, 100vw"
        className="object-cover transition duration-[1400ms] group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-80" />
      {label ? (
        <p className="absolute bottom-5 left-5 right-5 text-[0.66rem] font-extrabold uppercase tracking-[0.28em] text-white">
          {label}
        </p>
      ) : null}
    </div>
  );
}

function GoldButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-none border border-gold bg-gold px-8 py-4 text-[0.68rem] font-extrabold uppercase tracking-[0.25em] text-abyss transition duration-500 hover:bg-abyss hover:text-gold"
    >
      {children}
    </a>
  );
}

function OutlineButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex items-center justify-center rounded-none border border-abyss px-7 py-3 text-[0.66rem] font-extrabold uppercase tracking-[0.22em] text-abyss transition duration-500 hover:border-gold hover:bg-gold"
    >
      {children}
    </a>
  );
}

function RoomCard({
  image,
  title,
  copy,
}: {
  image: string;
  title: string;
  copy: string;
}) {
  return (
    <Reveal>
      <article className="bg-white">
        <SquareImage src={image} alt={title} label="El Classico Apartment" />
        <div className="border border-t-0 border-abyss/10 p-7 text-center">
          <h3 className="font-[var(--font-heading)] text-4xl leading-none text-abyss">{title}</h3>
          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-600">{copy}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <OutlineButton href="#contact">Learn More</OutlineButton>
            <OutlineButton href="tel:+250783256132">Book Now</OutlineButton>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function PremiumHome({ data }: PremiumHomeProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const firstMenuItem = data.menu[0]?.title ?? 'Grilled fish, chicken, juice, and beach dining';

  return (
    <main className="min-h-screen bg-cream text-abyss">
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition duration-500 ${
          scrolled
            ? 'border-abyss/10 bg-cream/95 shadow-xl shadow-black/5 backdrop-blur'
            : 'border-white/20 bg-black/20 text-white backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 lg:px-12">
          <a href="#home" className="font-[var(--font-heading)] text-3xl font-semibold tracking-[0.15em]">
            EL CLASSICO
          </a>
          <nav className="hidden items-center gap-8 lg:flex">
            {navItems.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-[0.66rem] font-extrabold uppercase tracking-[0.26em] transition hover:text-gold"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-5 lg:flex">
            <a className="text-[0.66rem] font-extrabold uppercase tracking-[0.24em]" href="tel:+250783256132">
              Call Us
            </a>
            <a
              className="border border-gold bg-gold px-5 py-3 text-[0.66rem] font-extrabold uppercase tracking-[0.22em] text-abyss"
              href="#contact"
            >
              Book Now
            </a>
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="border border-current px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] lg:hidden"
          >
            Menu
          </button>
        </div>
        {menuOpen ? (
          <div className="border-t border-abyss/10 bg-cream px-5 py-5 text-abyss lg:hidden">
            <div className="grid gap-3">
              {navItems.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="py-2 text-sm font-bold uppercase tracking-[0.22em]"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <section id="home" className="relative overflow-hidden bg-abyss px-5 pb-20 pt-32 lg:px-12 lg:pb-28 lg:pt-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(217,170,75,0.18),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="order-2 text-center text-white lg:order-1 lg:text-left">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.45em] text-gold">
              Rubavu • Lake Kivu • Nyamyumba
            </p>
            <h1 className="mt-8 font-[var(--font-heading)] text-6xl font-semibold leading-[0.86] tracking-[-0.06em] md:text-8xl lg:text-[8.8rem]">
              El Classico Beach
              <span className="mt-3 block text-3xl tracking-[-0.03em] text-cream md:text-5xl">
                Bar and Restaurant
              </span>
              <span className="mt-4 block text-4xl tracking-[-0.04em] text-gold md:text-6xl">
                El Classico Apartment
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/72 lg:mx-0">
              A smart Lake Kivu destination for food, drinks, accommodation, boat trips, celebrations,
              and premium Rubavu beach moments.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <GoldButton href="#about">Explore</GoldButton>
              <a
                href="tel:+250783256132"
                className="border border-white/45 px-8 py-4 text-[0.68rem] font-extrabold uppercase tracking-[0.25em] text-white transition hover:bg-white hover:text-abyss"
              >
                Book Now
              </a>
            </div>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <SquareImage
              src={images.apartmentBreakfast}
              alt="El Classico Apartment breakfast and exterior"
              label="El Classico Beach Chez West"
              priority
            />
          </Reveal>
        </div>
      </section>

      <section id="about" className="px-5 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-2">
          <Reveal className="order-2 lg:order-1">
            <SquareImage
              src={images.kigaliFishOne}
              alt="El Classico Beach best food and lake experience"
              label="El Classico Beach"
            />
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <UnderlineTitle title="El Classico Beach Chez West" eyebrow="Designed for Lake Kivu life" />
            <p className="mt-8 text-lg leading-9 text-slate-700">
              El Classico Beach Chez West is a beach bar and restaurant on the shores of Lake Kivu in
              Rubavu District, Western Province. It is known for its popular atmosphere, delicious grilled
              fish, drinks, music, privacy corners, boat riding, and a beautiful Gisenyi beach experience.
            </p>
            <p className="mt-5 text-lg leading-9 text-slate-700">
              El Classico Apartment is the smart accommodation side of the brand: modern rooms near Lake
              Kivu with comfort, breakfast, restaurant service, and support for guests who want to stay
              longer in Rubavu.
            </p>
          </Reveal>
        </div>
      </section>

      <section id="categories" className="bg-cream px-5 py-20 lg:px-12 lg:py-24">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <UnderlineTitle
              centered
              title="El Classico categories"
              eyebrow="Choose a real destination"
            />
            <p className="mx-auto mt-8 max-w-3xl text-center text-lg leading-9 text-slate-700">
              Every category opens the real destination on the website so visitors can quickly reach food,
              rooms, offers, events, magazine updates, and booking contact.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['Bar and Restaurant', '#offers', 'Fish, chicken, drinks, milkshakes, mango juice, and beach dining.'],
              ['El Classico Apartment', '#accommodation', 'Rooms, breakfast, long-stay comfort, and Lake Kivu travel support.'],
              ['Events and Parties', '#contact', 'Birthdays, parties, celebrations, swimming, and group preparation.'],
              ['El Classico Magazine', '/blog', 'News, updates, announcements, and stories from El Classico Beach.'],
            ].map(([title, href, copy], index) => (
              <Reveal key={title} delay={index * 0.06}>
                <a
                  href={href}
                  className="group block min-h-[250px] border border-abyss/10 bg-white p-7 transition duration-500 hover:-translate-y-1 hover:border-gold hover:shadow-[0_28px_90px_rgba(8,27,42,0.12)]"
                >
                  <p className="font-[var(--font-heading)] text-5xl leading-none text-gold">0{index + 1}</p>
                  <h3 className="mt-8 font-[var(--font-heading)] text-4xl leading-none text-abyss">
                    {title}
                  </h3>
                  <p className="mt-5 text-sm leading-7 text-slate-600">{copy}</p>
                  <p className="mt-7 text-xs font-black uppercase tracking-[0.24em] text-ocean">
                    View destination
                  </p>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="offers" className="bg-white px-5 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SquareImage
              src={images.apartmentRoom}
              alt="El Classico Apartment room"
              label="El Classico Apartment"
            />
          </Reveal>
          <Reveal>
            <UnderlineTitle title="Special Offer" eyebrow="El Classico Beach and Apartment" />
            <p className="mt-8 text-lg leading-9 text-slate-700">
              At El Classico Beach Chez West and El Classico Apartment, guests enjoy very good and
              delicious food including fish, grilled plates, fresh drinks, milkshakes, mango juice, boats,
              and Lake Kivu exploring. When sleeping at El Classico Apartment, we offer free breakfast and
              Lake Kivu travelling support for guests who stay long.
            </p>
            <p className="mt-5 text-base font-semibold uppercase tracking-[0.2em] text-ocean">
              Featured now: {firstMenuItem}
            </p>
            <div className="mt-8">
              <GoldButton href="#accommodation">View Offers</GoldButton>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="legacy" className="bg-cream px-5 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <UnderlineTitle
              centered
              title="Legacy of El Classico Beach Chez West"
              eyebrow="Kalisimbi Award recognition"
            />
            <p className="mx-auto mt-8 max-w-3xl text-center text-lg leading-9 text-slate-700">
              El Classico Beach Chez West is rewarded by the Kalisimbi Award as a known Rubavu name in
              hospitality, entertainment, and beach restaurant culture. The legacy comes from serving local
              guests and visitors with Lake Kivu views, food, music, and welcoming service.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <Reveal>
              <SquareImage src={images.kigaliFishTwo} alt="El Classico grilled fish" label="Well-grilled fish" />
            </Reveal>
            <Reveal delay={0.08}>
              <SquareImage src={images.apartmentBreakfast} alt="El Classico breakfast" label="Sweet Summer" />
            </Reveal>
            <Reveal delay={0.16}>
              <SquareImage src={images.kigaliFishOne} alt="Lake Kivu food experience" label="Lake Kivu mood" />
            </Reveal>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              [
                'How beautiful the view is',
                'Enjoy Lake Kivu water, Rubavu beach air, modern boat trips, food service, drinks, music, and peaceful moments for photos and celebration.',
              ],
              [
                'Sweet Summer at El Classico Beach',
                'Summer days at El Classico bring mango juice, milkshakes, grilled fish, chicken, privacy corners, and a warm beach restaurant feeling.',
              ],
              [
                'Lake Kivu exploring',
                'Guests can travel on Lake Kivu, visit beaches, and explore islands including Akabakobwa, Akarwa Kamahoro, and Amashyuza.',
              ],
            ].map(([title, copy], index) => (
              <Reveal key={title} delay={index * 0.08}>
                <article className="border-t border-gold pt-7">
                  <h3 className="font-[var(--font-heading)] text-4xl leading-none text-abyss">{title}</h3>
                  <p className="mt-5 text-sm leading-7 text-slate-600">{copy}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="accommodation" className="bg-abyss px-5 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1320px]">
          <Reveal>
            <UnderlineTitle
              centered
              light
              title="Accommodation"
              eyebrow="El Classico Apartment suites and rooms"
            />
            <p className="mx-auto mt-8 max-w-3xl text-center text-lg leading-9 text-white/70">
              Rest near Lake Kivu in comfortable, smart rooms with breakfast, internet, TV, restaurant
              access, and booking support for longer stays.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <RoomCard
              image={images.apartmentRoom}
              title="Classic Room"
              copy="A clean modern room for two guests, designed for short stays and relaxed Lake Kivu weekends."
            />
            <RoomCard
              image={images.apartmentBreakfast}
              title="Breakfast Stay"
              copy="Wake up to breakfast service and easy access to El Classico Beach Chez West restaurant."
            />
            <RoomCard
              image={images.apartmentRoom}
              title="Long Stay Comfort"
              copy="A smart choice for guests staying longer, with Lake Kivu travel support and restaurant service."
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <Reveal>
            <UnderlineTitle title="El Classico Beach Chez West best choice" eyebrow="Why guests choose us" />
            <p className="mt-8 text-lg leading-9 text-slate-700">
              El Classico Beach Chez West is a best choice in Gisenyi for a bar and restaurant, fresh fish,
              something to drink in your choice, something to eat, modern boat trips, accommodation, and
              prepared events like birthdays, parties, and many other celebrations.
            </p>
            <div className="mt-8">
              <GoldButton href="/blog">Learn More</GoldButton>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-5">
            <Reveal>
              <SquareImage src={images.kigaliFishTwo} alt="El Classico fish" label="Good fish" />
            </Reveal>
            <Reveal delay={0.08}>
              <SquareImage src={images.apartmentBreakfast} alt="El Classico apartment" label="Accommodation" />
            </Reveal>
            <Reveal delay={0.16} className="col-span-2">
              <SquareImage src={images.kigaliFishOne} alt="El Classico restaurant" label="Bar and Restaurant" />
            </Reveal>
          </div>
        </div>
      </section>

      <section id="contact" className="bg-cream px-5 py-20 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[1fr_0.8fr]">
          <Reveal>
            <UnderlineTitle title="Contact Us" eyebrow="For booking and information" />
            <p className="mt-8 text-3xl font-semibold text-abyss">0783256132</p>
            <p className="mt-2 text-2xl font-semibold text-abyss">0789400200</p>
            <p className="mt-8 text-lg leading-9 text-slate-700">
              At El Classico Beach Gisenyi you will find: Bar and Restaurant, Accommodations, Swimming,
              and support to prepare various events like birthdays, parties, and many others. We have good
              fish cooked there and caught there; you can find something to drink in your choice and
              something to eat.
            </p>
            <p className="mt-5 text-lg leading-9 text-slate-700">
              At El Classico Beach, they help you travel to Lake Kivu, visit the beaches and other
              beautiful places in your own choice in a modern boat. They help you visit islands like
              Akabakobwa, Akarwa Kamahoro, and Amashyuza. For more information or to book, contact
              +250783256132 or +250789400200.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <GoldButton href="tel:+250783256132">Call 0783256132</GoldButton>
              <GoldButton href="https://wa.me/250789400200">WhatsApp</GoldButton>
            </div>
          </Reveal>
          <Reveal>
            <SquareImage src={images.apartmentBreakfast} alt="El Classico contact" label="Book El Classico" />
          </Reveal>
        </div>
      </section>

      <footer className="bg-[#030a10] px-5 py-16 text-white lg:px-12">
        <div className="mx-auto grid max-w-[1320px] gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <h2 className="font-[var(--font-heading)] text-5xl leading-none text-cream">
              EL CLASSICO BEACH CHEZ WEST AND EL CLASSICO APARTMENT
            </h2>
            <p className="mt-6 max-w-xl text-sm leading-7 text-white/60">
              Bar, restaurant, accommodation, swimming, events, food, drinks, and Lake Kivu travel in
              Rubavu Gisenyi.
            </p>
          </div>
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-gold">Contact</p>
            <div className="mt-5 space-y-2 text-sm text-white/70">
              <p>+250 783 256 132</p>
              <p>+250 789 400 200</p>
            </div>
          </div>
          <div>
            <p className="text-[0.68rem] font-bold uppercase tracking-[0.3em] text-gold">Location</p>
            <p className="mt-5 text-sm leading-7 text-white/70">
              Rubavu Gisenyi, Western Province, Nyamyumba, near New Port.
            </p>
            <a className="mt-5 inline-block text-sm font-bold text-gold" href="/blog">
              El Classico Magazine
            </a>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-[1320px] border-t border-white/10 pt-6 text-xs uppercase tracking-[0.24em] text-white/40">
          El Classico Beach Chez West • Rubavu Rwanda
        </div>
      </footer>
    </main>
  );
}
