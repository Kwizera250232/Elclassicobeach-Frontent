type MenuItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  basePrice: number;
  spiceLevel: number;
  pairingHint?: string | null;
};

type EventItem = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
};

type ApartmentItem = {
  id: string;
  name: string;
  description: string;
  rooms: Array<{ id: string; title: string; capacity: number; baseNightlyRate: string | number }>;
};

type LiveShowcaseProps = {
  menu: MenuItem[];
  events: EventItem[];
  apartments: ApartmentItem[];
};

export function LiveShowcase({ menu, events, apartments }: LiveShowcaseProps) {
  return (
    <section className="mt-10 space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <article id="menu-highlights" className="rounded-2xl border border-white/20 bg-black/25 p-5 scroll-mt-24">
          <p className="text-xs uppercase tracking-[0.24em] text-sand">Fish & Chicken Menu</p>
          <h3 className="mt-2 font-[var(--font-heading)] text-3xl text-[#fff6e5]">Signature Plates</h3>
          <div className="mt-4 space-y-3">
            {menu.map((item) => (
              <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-sand/90">{item.category}</p>
                <p className="mt-1 text-lg font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-sm text-white/80">{item.description}</p>
                <div className="mt-2 flex items-center justify-between text-sm text-[#f6ddac]">
                  <span>{'$'}{item.basePrice.toFixed(2)}</span>
                  <span>Spice {item.spiceLevel}/5</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article id="nightlife" className="rounded-2xl border border-white/20 bg-black/25 p-5 scroll-mt-24">
          <p className="text-xs uppercase tracking-[0.24em] text-sand">Party & Nightlife</p>
          <h3 className="mt-2 font-[var(--font-heading)] text-3xl text-[#fff6e5]">Upcoming Events</h3>
          <div className="mt-4 space-y-3">
            {events.map((event) => (
              <div key={event.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-sm text-[#f6ddac]">{new Date(event.startsAt).toLocaleString('en-US')}</p>
                <p className="mt-1 text-lg font-semibold text-white">{event.title}</p>
                <p className="mt-1 text-sm text-white/80">{event.description}</p>
              </div>
            ))}
          </div>
        </article>

        <article id="apartment-stays" className="rounded-2xl border border-white/20 bg-black/25 p-5 scroll-mt-24">
          <p className="text-xs uppercase tracking-[0.24em] text-sand">El Classico Apartment</p>
          <h3 className="mt-2 font-[var(--font-heading)] text-3xl text-[#fff6e5]">Lake Kivu Stay</h3>
          <div className="mt-4 space-y-3">
            {apartments.map((apartment) => (
              <div key={apartment.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-lg font-semibold text-white">{apartment.name}</p>
                <p className="mt-1 text-sm text-white/80">{apartment.description}</p>
                <div className="mt-2 space-y-1 text-sm text-[#f6ddac]">
                  {apartment.rooms.slice(0, 2).map((room) => (
                    <p key={room.id}>
                      {room.title} • {room.capacity} guests • {'$'}{Number(room.baseNightlyRate).toFixed(2)}/night
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
