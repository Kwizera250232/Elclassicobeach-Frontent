import { ExperienceGrid } from '@/components/sections/experience-grid';
import { HeroSection } from '@/components/sections/hero';
import { LiveShowcase } from '@/components/sections/live-showcase';
import { getHomeData } from '@/lib/home-data';

const servicePillars = [
  {
    eyebrow: 'Dining',
    title: 'Beachfront restaurant with signature fish and chicken service',
    text: 'Fast lunch service, plated dinner experiences, mocktails, cocktails, and group menus tuned for couples, families, and corporate guests.',
  },
  {
    eyebrow: 'Nightlife',
    title: 'Live DJ nights and premium table bookings',
    text: 'A nightlife layer built for weekly programming, private celebrations, and guest upsells without mixing the hospitality and entertainment journeys.',
  },
  {
    eyebrow: 'Stay',
    title: 'Apartment accommodation connected to the venue',
    text: 'Guests can dine, attend events, and extend their visit into a short stay with apartment inventory presented as a distinct booking track.',
  },
];

const bookingSteps = [
  'Choose dining, event, or apartment experience.',
  'Confirm your date, guest count, and preferred package.',
  'Receive a direct call or WhatsApp follow-up for final confirmation.',
];

const quickFacts = [
  { label: 'Opening Hours', value: '10:00 - Late, daily' },
  { label: 'Location Focus', value: 'Lakefront bar, restaurant, and stay' },
  { label: 'Guest Promise', value: 'Fast response, secure booking handling' },
];

const testimonials = [
  {
    quote:
      'The venue feels premium without losing its energy. Dinner, the DJ set, and the lake-view apartment all felt like one polished experience.',
    name: 'Aline N.',
  },
  {
    quote:
      'This is the kind of destination that works for an evening out and a weekend stay. The service flow feels organized and high-end.',
    name: 'Patrick M.',
  },
];

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-6 md:px-8 md:py-10">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/20 bg-black/20 px-4 py-3 backdrop-blur-sm">
        <div>
          <p className="font-[var(--font-heading)] text-2xl tracking-wide text-[#fff6e5]">EL CLASSICO</p>
          <p className="text-xs uppercase tracking-[0.2em] text-sand">Beach Chez West + Apartment</p>
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-sm text-white/85">
          <a className="rounded-full px-3 py-2 transition hover:bg-white/10" href="#menu-highlights">
            Menu
          </a>
          <a className="rounded-full px-3 py-2 transition hover:bg-white/10" href="#nightlife">
            Events
          </a>
          <a className="rounded-full px-3 py-2 transition hover:bg-white/10" href="#apartment-stays">
            Apartment
          </a>
          <a className="rounded-full bg-white px-4 py-2 font-semibold text-abyss transition hover:bg-[#fff6e5]" href="#book-now">
            Book Now
          </a>
        </nav>
      </header>

      <HeroSection />

      <section className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[2rem] border border-white/15 bg-black/20 p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-sand">Positioning</p>
          <h2 className="mt-3 font-[var(--font-heading)] text-4xl leading-tight text-[#fff6e5] md:text-5xl">
            One destination for dining, nightlife, and short-stay hospitality.
          </h2>
          <p className="mt-4 max-w-2xl text-base text-white/82">
            The site is structured to keep restaurant reservations, event promotions, and apartment stays
            connected in the brand story while remaining operationally separate for booking and follow-up.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
          {quickFacts.map((fact) => (
            <article key={fact.label} className="rounded-[1.75rem] border border-white/15 bg-white/[0.06] p-5 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-sand/90">{fact.label}</p>
              <p className="mt-3 text-lg font-semibold text-white">{fact.value}</p>
            </article>
          ))}
        </div>
      </section>

      <ExperienceGrid />

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {servicePillars.map((pillar) => (
          <article key={pillar.title} className="rounded-[1.8rem] border border-white/15 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-6">
            <p className="text-xs uppercase tracking-[0.24em] text-sand">{pillar.eyebrow}</p>
            <h3 className="mt-3 font-[var(--font-heading)] text-3xl text-[#fff6e5]">{pillar.title}</h3>
            <p className="mt-3 text-sm leading-6 text-white/78">{pillar.text}</p>
          </article>
        ))}
      </section>

      <LiveShowcase menu={data.menu} events={data.events} apartments={data.apartments} />

      <section id="book-now" className="mt-10 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-[2rem] border border-[#f6ddac]/25 bg-[#f6ddac]/10 p-6 text-[#fff6e5] md:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-[#f6ddac]">Booking Flow</p>
          <h2 className="mt-3 font-[var(--font-heading)] text-4xl md:text-5xl">Clean and direct reservation journey.</h2>
          <div className="mt-6 space-y-4">
            {bookingSteps.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-2xl border border-white/10 bg-black/15 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-abyss">
                  0{index + 1}
                </span>
                <p className="text-sm leading-6 text-white/85">{step}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/15 bg-black/20 p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-sand">Reservation Channels</p>
              <h3 className="mt-3 font-[var(--font-heading)] text-4xl text-[#fff6e5]">Designed for quick conversion.</h3>
              <p className="mt-4 text-sm leading-6 text-white/80">
                The homepage is ready to route guests toward table reservations, VIP event requests, and
                apartment inquiries with separate contact handling to keep operations clear and secure.
              </p>
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-sand/85">Dining Desk</p>
                <p className="mt-2 text-lg font-semibold text-white">Ideal for lunch, dinner, and group tables</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-sand/85">Event Desk</p>
                <p className="mt-2 text-lg font-semibold text-white">VIP seating, birthdays, and live show nights</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-sand/85">Stay Desk</p>
                <p className="mt-2 text-lg font-semibold text-white">Apartment availability and concierge add-ons</p>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
        <article className="rounded-[2rem] border border-white/15 bg-black/20 p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-sand">Guest Confidence</p>
          <h2 className="mt-3 font-[var(--font-heading)] text-4xl text-[#fff6e5] md:text-5xl">
            Premium atmosphere backed by organized service.
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {testimonials.map((item) => (
              <blockquote key={item.name} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm leading-6 text-white/82">“{item.quote}”</p>
                <footer className="mt-4 text-xs uppercase tracking-[0.2em] text-sand">{item.name}</footer>
              </blockquote>
            ))}
          </div>
        </article>

        <article className="rounded-[2rem] border border-white/15 bg-[linear-gradient(180deg,rgba(217,170,75,0.16),rgba(8,27,42,0.6))] p-6 md:p-8">
          <p className="text-sm uppercase tracking-[0.24em] text-sand">Visit Information</p>
          <div className="mt-4 space-y-5 text-white/84">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-sand/90">Best For</p>
              <p className="mt-2 text-lg font-semibold text-white">Date nights, group dining, sunset events, short stays</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-sand/90">Service Style</p>
              <p className="mt-2 text-lg font-semibold text-white">Host-led arrival, table service, curated nightlife upsells</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-sand/90">Booking Assurance</p>
              <p className="mt-2 text-lg font-semibold text-white">Only the dedicated apps/web instance serves this site on port 3001.</p>
            </div>
          </div>
        </article>
      </section>

      <section className="mt-10 rounded-3xl border border-white/20 bg-black/25 p-6 md:p-10">
        <p className="text-sm uppercase tracking-[0.24em] text-sand">Launch Scope</p>
        <h2 className="mt-2 font-[var(--font-heading)] text-4xl text-[#fff6e5]">MVP Foundations Ready</h2>
        <p className="mt-3 max-w-2xl text-white/85">
          This isolated scaffold includes backend auth and core domain schema, plus a premium frontend
          direction ready for reservations, food ordering, events, and apartment booking flows.
        </p>
      </section>

      <footer className="mb-10 mt-6 rounded-3xl border border-white/12 bg-black/20 px-6 py-5 text-sm text-white/70">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <p>El Classico Beach Chez West and Apartment experience site.</p>
          <p>Active isolated frontend: apps/web on port 3001.</p>
        </div>
      </footer>
    </main>
  );
}
