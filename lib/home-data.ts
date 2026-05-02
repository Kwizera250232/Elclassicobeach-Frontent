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
  media: {
    barOverview: [
      '/gallery/01-el-classico-promo.jpg',
      '/gallery/02-boat-lake-kivu.jpg',
      '/gallery/03-fish-platter.jpg',
      '/gallery/04-cocktails-service.jpg',
      '/gallery/05-classic-deal-event.jpg',
    ],
    apartmentOverview: [
      '/gallery/06-apartment-suite-1.jpg',
      '/gallery/07-apartment-suite-2.jpg',
      '/gallery/08-apartment-suite-3.jpg',
      '/gallery/09-apartment-overview.jpg',
      '/gallery/10-apartment-outside-view.jpg',
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
