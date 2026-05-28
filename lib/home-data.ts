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

type MediaResource = {
  secureUrl: string;
};

export type HomeData = {
  menu: MenuItem[];
  events: EventItem[];
  apartments: ApartmentItem[];
  media: {
    barOverview: string[];
    apartmentOverview: string[];
  };
};

const fallbackData: HomeData = {
  menu: [
    {
      id: 'f1',
      title: 'Whole Lake Kivu Grilled Fish',
      description: 'A golden charcoal-grilled fish served with warm vegetables, beans, and soft ugali.',
      category: 'Lake Signature',
      basePrice: 18000,
      spiceLevel: 2,
      pairingHint: 'Pair with mango juice or a crisp sunset cocktail',
    },
    {
      id: 'c1',
      title: 'Chez West Fire-Grilled Chicken',
      description: 'Slow-marinated chicken, chips, garden salad, and a polished beach-table presentation.',
      category: 'Grill Classics',
      basePrice: 16000,
      spiceLevel: 3,
      pairingHint: 'Pair with passion mojito',
    },
    {
      id: 'd1',
      title: 'Mango Juice & Milkshake Ritual',
      description: 'Fresh tropical juices and creamy milkshakes prepared for warm Lake Kivu afternoons.',
      category: 'Signature Drinks',
      basePrice: 6000,
      spiceLevel: 0,
      pairingHint: 'Best before a boat ride',
    },
  ],
  events: [
    {
      id: 'e1',
      title: 'Golden Hour Lake Deck',
      description: 'A refined sunset mood with music, grilled plates, and table service near Lake Kivu.',
      startsAt: new Date().toISOString(),
    },
    {
      id: 'e2',
      title: 'Weekend Chez West Nights',
      description: 'Loud music, privacy corners, drinks, dancing, and a lively Rubavu beach atmosphere.',
      startsAt: new Date(Date.now() + 86400000).toISOString(),
    },
  ],
  apartments: [
    {
      id: 'a1',
      name: 'El Classico Apartment - Modern Lake Stay',
      description:
        'Stylish, furnished accommodation near Lake Kivu with restaurant access, internet, TV, breakfast, and boat-experience add-ons.',
      rooms: [
        { id: 'r1', title: 'Classic King Room', capacity: 2, baseNightlyRate: 80 },
        { id: 'r2', title: 'Family Comfort Room', capacity: 4, baseNightlyRate: 140 },
      ],
    },
  ],
  media: {
    barOverview: [
      'https://res.cloudinary.com/do1zvhe3j/image/upload/v1777837390/elclassico/bar-overview/bny19igudahdbtyqh7eh.jpg',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1600&q=85',
    ],
    apartmentOverview: [
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=85',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=85',
    ],
  },
};

async function fetchPublicMedia(apiBase: string, folder: string): Promise<string[]> {
  try {
    const mediaRes = await fetch(`${apiBase}/admin/media/public?folder=${encodeURIComponent(folder)}`, {
      next: { revalidate: 60 },
    });

    if (!mediaRes.ok) {
      return [];
    }

    const payload = (await mediaRes.json()) as { resources?: MediaResource[] };
    return (payload.resources ?? []).map((item) => item.secureUrl).filter(Boolean);
  } catch {
    return [];
  }
}

export async function getHomeData(): Promise<HomeData> {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4001/api';

  try {
    const [menuRes, eventsRes, apartmentsRes, barMedia, apartmentMedia] = await Promise.all([
      fetch(`${apiBase}/menu/items`, { next: { revalidate: 120 } }),
      fetch(`${apiBase}/events`, { next: { revalidate: 120 } }),
      fetch(`${apiBase}/apartments`, { next: { revalidate: 120 } }),
      fetchPublicMedia(apiBase, 'bar-overview'),
      fetchPublicMedia(apiBase, 'apartment-overview'),
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
      media: {
        barOverview: barMedia.length > 0 ? barMedia : fallbackData.media.barOverview,
        apartmentOverview:
          apartmentMedia.length > 0 ? apartmentMedia : fallbackData.media.apartmentOverview,
      },
    };
  } catch {
    return fallbackData;
  }
}
