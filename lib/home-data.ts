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

type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  publishedAt?: string | null;
  createdAt?: string;
};

export type HomeData = {
  menu: MenuItem[];
  events: EventItem[];
  apartments: ApartmentItem[];
  blogPosts: BlogPost[];
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
  blogPosts: [
    {
      id: 'b1',
      title: 'Classic Deal Night keeps Friday to Sunday vibrant',
      excerpt:
        'Beach music, selected drinks, and table service continue to drive weekend energy for visitors around Rubavu Port.',
      publishedAt: new Date().toISOString(),
    },
    {
      id: 'b2',
      title: 'Fresh fish and grilled chicken remain our signature plates',
      excerpt:
        'The kitchen team is focusing on clean local flavors, balanced portions, and faster serving time during peak sunset hours.',
      publishedAt: new Date().toISOString(),
    },
    {
      id: 'b3',
      title: 'Apartment guests now combine room nights with boat moments',
      excerpt:
        'Accommodation experiences are packaged with scenic lake sessions to create one premium day-to-night destination flow.',
      publishedAt: new Date().toISOString(),
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

async function fetchJsonList<T>(url: string, revalidate: number): Promise<T[]> {
  try {
    const res = await fetch(url, { next: { revalidate } });
    if (!res.ok) {
      return [];
    }

    const payload = await res.json();
    return Array.isArray(payload) ? (payload as T[]) : [];
  } catch {
    return [];
  }
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function normalizeMenuItem(item: Partial<MenuItem> & { basePrice?: unknown }, index: number): MenuItem {
  return {
    id: item.id ?? `menu-${index}`,
    title: item.title ?? 'El Classico Signature Plate',
    description: item.description ?? 'Chef-selected beach menu item from El Classico.',
    category: item.category ?? 'Signature',
    basePrice: toNumber(item.basePrice),
    spiceLevel: toNumber(item.spiceLevel, 0),
    pairingHint: item.pairingHint ?? null,
  };
}

function normalizeEventItem(item: Partial<EventItem>, index: number): EventItem {
  return {
    id: item.id ?? `event-${index}`,
    title: item.title ?? 'El Classico Event',
    description: item.description ?? 'Live beach programming and hospitality moments.',
    startsAt: item.startsAt ?? new Date().toISOString(),
  };
}

function normalizeApartmentItem(item: Partial<ApartmentItem>, index: number): ApartmentItem {
  return {
    id: item.id ?? `apartment-${index}`,
    name: item.name ?? 'El Classico Apartment',
    description: item.description ?? 'Comfortable apartment stay connected to the beach experience.',
    rooms: Array.isArray(item.rooms) ? item.rooms : [],
  };
}

function normalizeBlogPost(item: Partial<BlogPost>, index: number): BlogPost {
  return {
    id: item.id ?? `blog-${index}`,
    title: item.title ?? 'El Classico Update',
    excerpt: item.excerpt ?? 'Latest update from El Classico Beach Chez West.',
    publishedAt: item.publishedAt ?? item.createdAt ?? null,
    createdAt: item.createdAt,
  };
}

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

  const [menu, events, apartments, blogPosts, barMedia, apartmentMedia] = await Promise.all([
    fetchJsonList<Partial<MenuItem> & { basePrice?: unknown }>(`${apiBase}/menu`, 120),
    fetchJsonList<Partial<EventItem>>(`${apiBase}/events`, 120),
    fetchJsonList<Partial<ApartmentItem>>(`${apiBase}/apartments`, 120),
    fetchJsonList<Partial<BlogPost>>(`${apiBase}/blog`, 120),
    fetchPublicMedia(apiBase, 'bar-overview'),
    fetchPublicMedia(apiBase, 'apartment-overview'),
  ]);

  return {
    menu: menu.length > 0 ? menu.slice(0, 3).map(normalizeMenuItem) : fallbackData.menu,
    events: events.length > 0 ? events.slice(0, 3).map(normalizeEventItem) : fallbackData.events,
    apartments:
      apartments.length > 0
        ? apartments.slice(0, 2).map(normalizeApartmentItem)
        : fallbackData.apartments,
    blogPosts:
      blogPosts.length > 0 ? blogPosts.slice(0, 3).map(normalizeBlogPost) : fallbackData.blogPosts,
    media: {
      barOverview: barMedia.length > 0 ? barMedia : fallbackData.media.barOverview,
      apartmentOverview:
        apartmentMedia.length > 0 ? apartmentMedia : fallbackData.media.apartmentOverview,
    },
  };
}
