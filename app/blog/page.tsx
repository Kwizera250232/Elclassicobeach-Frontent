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

export default async function BlogRoute() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-cream text-abyss">
      <header className="bg-abyss px-5 py-8 text-white lg:px-12">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <a href="/" className="font-[var(--font-heading)] text-3xl font-semibold tracking-[0.15em]">
            EL CLASSICO
          </a>
          <nav className="flex flex-wrap gap-4 text-xs font-black uppercase tracking-[0.24em] text-white/70">
            <a className="transition hover:text-gold" href="/">Home</a>
            <a className="transition hover:text-gold" href="/#offers">Offers</a>
            <a className="transition hover:text-gold" href="/#accommodation">Accommodation</a>
            <a className="transition hover:text-gold" href="/#contact">Contact</a>
          </nav>
        </div>
      </header>

      <section className="bg-abyss px-5 pb-20 pt-10 text-white lg:px-12 lg:pb-28">
        <div className="mx-auto max-w-[1320px] text-center">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-gold">News and updates</p>
          <h1 className="mx-auto mt-6 max-w-5xl font-[var(--font-heading)] text-6xl font-semibold leading-[0.9] tracking-[-0.055em] md:text-8xl">
            El Classico Magazine
          </h1>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-white/70">
            Updates from El Classico Beach Chez West and El Classico Apartment: food, offers, events,
            accommodations, Lake Kivu travel, and Rubavu beach stories.
          </p>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-12">
        <div className="mx-auto max-w-[1320px]">
          {posts.length > 0 ? (
            <div className="grid gap-8 lg:grid-cols-3">
              {posts.map((post, index) => (
                <article
                  key={post.id}
                  className={index === 0 ? 'bg-white lg:col-span-2 lg:grid lg:grid-cols-2' : 'bg-white'}
                >
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="aspect-square w-full object-cover"
                    />
                  ) : (
                    <div className="grid aspect-square w-full place-items-center bg-abyss p-8 text-center text-gold">
                      <span className="font-[var(--font-heading)] text-5xl leading-none">El Classico Magazine</span>
                    </div>
                  )}
                  <div className="border border-t-0 border-abyss/10 p-7 lg:border-l-0 lg:border-t">
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-gold">
                      {formatDate(post.publishedAt ?? post.createdAt)}
                    </p>
                    <h2 className="mt-5 font-[var(--font-heading)] text-4xl font-semibold leading-none text-abyss">
                      {post.title}
                    </h2>
                    <p className="mt-5 text-sm leading-7 text-slate-600">{post.excerpt}</p>
                    <div className="mt-6 whitespace-pre-line text-sm leading-7 text-slate-700">
                      {post.content}
                    </div>
                  </div>
                </article>
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
