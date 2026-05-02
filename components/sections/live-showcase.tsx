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
        <article id="menu-highlights" className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm scroll-mt-24">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-600">Fish & Chicken Menu</p>
          <h3 className="mt-2 font-[var(--font-heading)] text-3xl text-gray-900">Signature Plates</h3>
          <div className="mt-4 space-y-3">
            {menu.map((item) => (
              <div key={item.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs uppercase tracking-[0.16em] text-amber-600">{item.category}</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{item.title}</p>
                <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                <div className="mt-2 flex items-center justify-between text-sm text-amber-600">
                  <span>{'$'}{item.basePrice.toFixed(2)}</span>
                  <span>Spice {item.spiceLevel}/5</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article id="nightlife" className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm scroll-mt-24">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-600">Party & Nightlife</p>
          <h3 className="mt-2 font-[var(--font-heading)] text-3xl text-gray-900">Upcoming Events</h3>
          <div className="mt-4 space-y-3">
            {events.map((event) => (
              <div key={event.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <p className="text-sm text-amber-600">{new Date(event.startsAt).toLocaleString('en-US')}</p>
                <p className="mt-1 text-lg font-semibold text-gray-900">{event.title}</p>
                <p className="mt-1 text-sm text-gray-600">{event.description}</p>
              </div>
            ))}
          </div>
        </article>

        <article id="apartment-stays" className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm scroll-mt-24">
          <p className="text-xs uppercase tracking-[0.24em] text-amber-600">El Classico Apartment</p>
          <h3 className="mt-2 font-[var(--font-heading)] text-3xl text-gray-900">Lake Kivu Stay</h3>
          <div className="mt-4 space-y-3">
            {apartments.map((apartment) => (
              <div key={apartment.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <p className="text-lg font-semibold text-gray-900">{apartment.name}</p>
                <p className="mt-1 text-sm text-gray-600">{apartment.description}</p>
                <div className="mt-2 space-y-1 text-sm text-amber-600">
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
