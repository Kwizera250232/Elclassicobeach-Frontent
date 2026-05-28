import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

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

async function getPost(slug: string): Promise<BlogPost | null> {
  const posts = await getPosts();
  const decodedSlug = decodeURIComponent(slug);
  return posts.find((post) => post.slug === decodedSlug || post.id === decodedSlug) ?? null;
}

function formatDate(value?: string | null) {
  if (!value) return 'El Classico update';
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) {
    return { title: 'Magazine article not found' };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();

  return (
    <main className="min-h-screen bg-cream text-abyss">
      <header className="bg-abyss px-4 py-7 text-white sm:px-5 sm:py-8 lg:px-12">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <a href="/" className="font-[var(--font-heading)] text-2xl font-semibold tracking-[0.1em] sm:text-3xl sm:tracking-[0.15em]">
            EL CLASSICO
          </a>
          <nav className="flex flex-wrap gap-3 text-[0.68rem] font-black uppercase tracking-[0.14em] text-white/70 sm:gap-4 sm:text-xs sm:tracking-[0.24em]">
            <a className="transition hover:text-gold" href="/blog">Magazine</a>
            <a className="transition hover:text-gold" href="/#contact">Contact</a>
            <a className="transition hover:text-gold" href="/">Home</a>
          </nav>
        </div>
      </header>

      <article className="px-4 py-12 sm:px-5 sm:py-14 lg:px-12 lg:py-20">
        <div className="mx-auto max-w-[1120px] bg-white">
          {post.coverImage ? (
            <img src={post.coverImage} alt={post.title} className="aspect-square w-full object-cover lg:aspect-[16/9]" />
          ) : (
            <div className="grid aspect-square w-full place-items-center bg-abyss p-6 text-center text-gold sm:p-8 lg:aspect-[16/9]">
              <span className="font-[var(--font-heading)] text-4xl leading-none sm:text-6xl">El Classico Magazine</span>
            </div>
          )}
          <div className="border border-t-0 border-abyss/10 p-5 sm:p-7 md:p-12">
            <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-gold sm:text-xs sm:tracking-[0.25em]">
              {formatDate(post.publishedAt ?? post.createdAt)}
            </p>
            <h1 className="mt-5 break-words font-[var(--font-heading)] text-[clamp(2.8rem,13vw,4.8rem)] font-semibold leading-[0.95] tracking-[-0.04em] md:text-7xl">
              {post.title}
            </h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-600">{post.excerpt}</p>
            <div className="mt-10 whitespace-pre-line text-base leading-9 text-slate-700 md:text-lg">
              {post.content}
            </div>
            <a
              href="/blog"
              className="mt-12 inline-flex border border-abyss bg-abyss px-5 py-3 text-[0.68rem] font-black uppercase tracking-[0.16em] text-gold sm:px-6 sm:text-xs sm:tracking-[0.22em]"
            >
              Back to Magazine
            </a>
          </div>
        </div>
      </article>
    </main>
  );
}
