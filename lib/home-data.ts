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

export type HomeData = {
  menu: MenuItem[];
  events: EventItem[];
  apartments: ApartmentItem[];
};

const fallbackData: HomeData = {
  menu: [
    {
      id: 'f1',
      title: 'Lake Kivu Grilled Tilapia',
      description: 'Charcoal grilled fish, citrus butter, plantain crisp, and herb rice.',
      category: 'Fish Signature',
      basePrice: 18,
      spiceLevel: 2,
      pairingHint: 'Pair with ginger-lime spritz',
    },
    {
      id: 'c1',
      title: 'Chez West Fire Chicken',
      description: 'Slow-marinated chicken, smoked chili glaze, and sweet potato wedges.',
      category: 'Chicken Classics',
      basePrice: 16,
      spiceLevel: 3,
      pairingHint: 'Pair with passion mojito',
    },
  ],
  events: [
    {
      id: 'e1',
      title: 'Sunset Party on the Deck',
      description: 'Afro-house sunset set with premium beach seating.',
      startsAt: new Date().toISOString(),
    },
    {
      id: 'e2',
      title: 'Friday Chicken & Beats',
      description: 'Live DJ lineup, grill stations, and VIP table service.',
      startsAt: new Date(Date.now() + 86400000).toISOString(),
    },
  ],
  apartments: [
    {
      id: 'a1',
      name: 'El Classico Apartment - Lake View',
      description: 'Luxury lake-facing suite with curated hospitality touchpoints.',
      rooms: [
        { id: 'r1', title: 'Executive Lake View', capacity: 2, baseNightlyRate: 120 },
        { id: 'r2', title: 'Family Panorama', capacity: 4, baseNightlyRate: 190 },
      ],
    },
  ],
};

export async function getHomeData(): Promise<HomeData> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4001/api';

  try {
    const [menuRes, eventsRes, apartmentsRes] = await Promise.all([
      fetch(`${apiBase}/menu/items`, { next: { revalidate: 120 } }),
      fetch(`${apiBase}/events`, { next: { revalidate: 120 } }),
      fetch(`${apiBase}/apartments`, { next: { revalidate: 120 } }),
    ]);

    if (!menuRes.ok || !eventsRes.ok || !apartmentsRes.ok) {
      return fallbackData;
    }

    const [menu, events, apartments] = (await Promise.all([
      menuRes.json(),
      eventsRes.json(),
      apartmentsRes.json(),
    ])) as [MenuItem[], EventItem[], ApartmentItem[]];

    return {
      menu: menu.length > 0 ? menu.slice(0, 3) : fallbackData.menu,
      events: events.length > 0 ? events.slice(0, 3) : fallbackData.events,
      apartments: apartments.length > 0 ? apartments.slice(0, 2) : fallbackData.apartments,
    };
  } catch {
    return fallbackData;
  }
}
