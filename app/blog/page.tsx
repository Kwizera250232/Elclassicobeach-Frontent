import type { Metadata } from 'next';

type BlogPost = {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  publishedAt?: string | null;
  createdAt: string;
};

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4001/api';

export const metadata: Metadata = {
  title: 'El Classico Magazine',
  description:
    'News, stories, updates, offers, events, food, apartments, and Lake Kivu travel from El Classico Beach Chez West.',
};

async function getPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${apiBase}/blog`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = (await res.json()) as BlogPost[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function formatDate(value?: string | null) {
  if (!value) return 'El Classico update';
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

function getPostHref(post: BlogPost) {
  return `/blog/${encodeURIComponent(post.slug || post.id)}`;
}

export default async function BlogRoute() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-cream text-abyss">
      <header className="bg-abyss px-4 py-7 text-white sm:px-5 sm:py-8 lg:px-12">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <a href="/" className="font-[var(--font-heading)] text-2xl font-semibold tracking-[0.1em] sm:text-3xl sm:tracking-[0.15em]">
            EL CLASSICO
          </a>
          <nav className="flex flex-wrap gap-3 text-[0.68rem] font-black uppercase tracking-[0.14em] text-white/70 sm:gap-4 sm:text-xs sm:tracking-[0.24em]">
            <a className="transition hover:text-gold" href="/">Home</a>
            <a className="transition hover:text-gold" href="/#offers">Offers</a>
            <a className="transition hover:text-gold" href="/#accommodation">Accommodation</a>
            <a className="transition hover:text-gold" href="/#contact">Contact</a>
          </nav>
        </div>
      </header>

      <section className="bg-abyss px-4 pb-16 pt-8 text-white sm:px-5 sm:pb-20 sm:pt-10 lg:px-12 lg:pb-28">
        <div className="mx-auto max-w-[1320px] text-center">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-gold sm:text-xs sm:tracking-[0.4em]">News and updates</p>
          <h1 className="mx-auto mt-6 max-w-5xl break-words font-[var(--font-heading)] text-[clamp(3.2rem,16vw,5.2rem)] font-semibold leading-[0.9] tracking-[-0.05em] md:text-8xl">
            El Classico Magazine
          </h1>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-white/70">
            Updates from El Classico Beach Chez West and El Classico Apartment: food, offers, events,
            accommodations, Lake Kivu travel, and Rubavu beach stories.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-5 sm:py-20 lg:px-12">
        <div className="mx-auto max-w-[1320px]">
          {posts.length > 0 ? (
            <div className="grid gap-8 lg:grid-cols-3">
              {posts.map((post) => (
                <a
                  key={post.id}
                  href={getPostHref(post)}
                  className="group block bg-white transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_90px_rgba(8,27,42,0.14)]"
                >
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="aspect-square w-full object-cover"
                    />
                  ) : (
                    <div className="grid aspect-square w-full place-items-center bg-abyss p-6 text-center text-gold sm:p-8">
                      <span className="font-[var(--font-heading)] text-4xl leading-none sm:text-5xl">El Classico Magazine</span>
                    </div>
                  )}
                  <div className="border border-t-0 border-abyss/10 p-7">
                    <h2 className="mt-5 break-words font-[var(--font-heading)] text-3xl font-semibold leading-none text-abyss sm:text-4xl">
                      {post.title}
                    </h2>
                    <p className="mt-6 text-xs font-black uppercase tracking-[0.24em] text-gold">
                      Read more
                    </p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-3xl border border-abyss/10 bg-white p-10 text-center">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-gold">Coming soon</p>
              <h2 className="mt-4 font-[var(--font-heading)] text-5xl font-semibold">
                No magazine updates yet.
              </h2>
              <p className="mt-5 text-slate-600">
                New stories, offers, and announcements from El Classico Beach will appear here soon.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
