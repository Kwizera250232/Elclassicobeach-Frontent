"use client";

import { useEffect, useMemo, useRef, useState } from 'react';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4001/api';

type Tab = 'overview' | 'magazine' | 'menu' | 'events' | 'media' | 'business';
type Status = { type: 'success' | 'error' | 'info'; text: string } | null;

type BlogPost = {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  published: boolean;
  publishedAt?: string | null;
  createdAt: string;
};

type MenuCategory = { id: string; name: string; slug: string; itemCount?: number };
type MenuItem = {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  category: string;
  spiceLevel: number;
  pairingHint?: string | null;
  isAvailable: boolean;
  basePrice: number;
};
type EventItem = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  coverImageUrl?: string | null;
};
type ApartmentItem = {
  id: string;
  name: string;
  description: string;
  coverImageUrl?: string | null;
  rooms?: Array<{ id: string; title: string; capacity: number; baseNightlyRate: string | number }>;
};
type ReservationItem = {
  id: string;
  guests: number;
  zone?: string | null;
  notes?: string | null;
  reservationAt: string;
  user?: { fullName?: string | null; email?: string | null } | null;
};
type MediaResource = { publicId: string; secureUrl: string; width?: number; height?: number };

const mediaFolders = ['hero', 'welcome', 'bar-overview', 'apartment-overview', 'blog', 'offers'] as const;

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${apiBase}${path}`, { ...options, headers });
  if (!res.ok) {
    const message = await res.text().catch(() => '');
    throw new Error(message || `Request failed with ${res.status}`);
  }
  return (await res.json()) as T;
}

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function Panel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={cx('rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-sm', className)}>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-slate-400">{hint}</span> : null}
    </label>
  );
}

function StatusNote({ status }: { status: Status }) {
  if (!status) return null;
  return (
    <p
      className={cx(
        'mt-4 rounded-2xl px-4 py-3 text-sm',
        status.type === 'success' && 'bg-emerald-50 text-emerald-700',
        status.type === 'error' && 'bg-red-50 text-red-700',
        status.type === 'info' && 'bg-blue-50 text-blue-700',
      )}
    >
      {status.text}
    </p>
  );
}

function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState('admin@elclassico.rw');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  async function login() {
    setBusy(true);
    setStatus(null);
    try {
      const payload = await request<{
        user?: { role?: string };
        tokens?: { accessToken?: string };
      }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      });

      if (payload.user?.role !== 'ADMIN' || !payload.tokens?.accessToken) {
        throw new Error('This account is not authorized for the admin panel.');
      }

      window.localStorage.setItem('elclassico_admin_token', payload.tokens.accessToken);
      onLogin(payload.tokens.accessToken);
    } catch (error) {
      setStatus({
        type: 'error',
        text: error instanceof Error ? error.message : 'Login failed.',
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_20%_10%,rgba(217,170,75,0.18),transparent_32%),linear-gradient(135deg,#081b2a,#030a10)] px-5 py-12 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1fr_0.82fr]">
          <section className="self-center">
            <p className="text-xs font-black uppercase tracking-[0.38em] text-gold">Secure dashboard</p>
            <h1 className="mt-6 font-[var(--font-heading)] text-6xl font-semibold leading-[0.9] tracking-[-0.05em] md:text-8xl">
              El Classico Admin Panel
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              Manage El Classico Magazine posts, menu items, events, public media, destination links,
              and operational content from one modern dashboard.
            </p>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white p-7 text-slate-900 shadow-2xl">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-gold">Admin login</p>
            <h2 className="mt-3 font-[var(--font-heading)] text-4xl font-semibold">Sign in</h2>
            <div className="mt-7 space-y-4">
              <Field label="Email">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && login()}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-gold"
                />
              </Field>
              <Field label="Password">
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && login()}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-gold"
                />
              </Field>
            </div>
            <button
              type="button"
              onClick={login}
              disabled={busy}
              className="mt-6 w-full rounded-2xl bg-abyss px-5 py-3 text-sm font-black uppercase tracking-[0.22em] text-gold transition hover:bg-ocean disabled:opacity-60"
            >
              {busy ? 'Signing in...' : 'Open Dashboard'}
            </button>
            <StatusNote status={status} />
          </section>
        </div>
      </div>
    </main>
  );
}

const tabs: Array<{ id: Tab; label: string; description: string }> = [
  { id: 'overview', label: 'Overview', description: 'Live links and dashboard summary' },
  { id: 'magazine', label: 'Magazine', description: 'Post El Classico updates' },
  { id: 'menu', label: 'Menu', description: 'Food categories and items' },
  { id: 'events', label: 'Events', description: 'Create upcoming events' },
  { id: 'media', label: 'Media', description: 'Upload website images' },
  { id: 'business', label: 'Business', description: 'Apartments and bookings' },
];

function Shell({
  token,
  onLogout,
}: {
  token: string;
  onLogout: () => void;
}) {
  const [active, setActive] = useState<Tab>('overview');

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-200 bg-white px-5 py-6 lg:block">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-gold">El Classico</p>
        <h1 className="mt-2 font-[var(--font-heading)] text-4xl font-semibold leading-none">
          Admin Panel
        </h1>
        <nav className="mt-8 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={cx(
                'w-full rounded-2xl px-4 py-3 text-left transition',
                active === tab.id ? 'bg-abyss text-white' : 'text-slate-600 hover:bg-slate-100',
              )}
            >
              <span className="block text-sm font-bold">{tab.label}</span>
              <span className={cx('mt-1 block text-xs', active === tab.id ? 'text-white/58' : 'text-slate-400')}>
                {tab.description}
              </span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-6 left-5 right-5 space-y-3">
          <a
            href="/"
            className="block rounded-2xl border border-slate-200 px-4 py-3 text-center text-xs font-black uppercase tracking-[0.2em] text-slate-600 transition hover:border-gold hover:text-abyss"
          >
            View website
          </a>
          <button
            type="button"
            onClick={onLogout}
            className="w-full rounded-2xl bg-slate-100 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </aside>

      <section className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/92 px-5 py-4 backdrop-blur lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-gold">Dashboard</p>
              <h2 className="font-[var(--font-heading)] text-4xl font-semibold leading-none">
                {tabs.find((tab) => tab.id === active)?.label}
              </h2>
            </div>
            <div className="flex gap-2 overflow-x-auto lg:hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActive(tab.id)}
                  className={cx(
                    'shrink-0 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em]',
                    active === tab.id ? 'bg-abyss text-gold' : 'bg-slate-100 text-slate-500',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="p-5 lg:p-8">
          {active === 'overview' && <OverviewTab token={token} setActive={setActive} />}
          {active === 'magazine' && <MagazineTab token={token} />}
          {active === 'menu' && <MenuTab token={token} />}
          {active === 'events' && <EventsTab token={token} />}
          {active === 'media' && <MediaTab token={token} />}
          {active === 'business' && <BusinessTab token={token} />}
        </div>
      </section>
    </main>
  );
}

function OverviewTab({ token, setActive }: { token: string; setActive: (tab: Tab) => void }) {
  const [counts, setCounts] = useState({ posts: 0, items: 0, categories: 0, events: 0, apartments: 0 });

  useEffect(() => {
    async function load() {
      const [posts, items, categories, events, apartments] = await Promise.allSettled([
        request<BlogPost[]>('/blog/all', {}, token),
        request<MenuItem[]>('/menu/items'),
        request<MenuCategory[]>('/menu/categories'),
        request<EventItem[]>('/events'),
        request<ApartmentItem[]>('/apartments'),
      ]);
      setCounts({
        posts: posts.status === 'fulfilled' ? posts.value.length : 0,
        items: items.status === 'fulfilled' ? items.value.length : 0,
        categories: categories.status === 'fulfilled' ? categories.value.length : 0,
        events: events.status === 'fulfilled' ? events.value.length : 0,
        apartments: apartments.status === 'fulfilled' ? apartments.value.length : 0,
      });
    }
    void load();
  }, [token]);

  const destinations: Array<{ title: string; href: string; action: Tab | null; copy: string }> = [
    { title: 'Homepage', href: '/', action: null, copy: 'Public luxury homepage' },
    { title: 'El Classico Magazine', href: '/blog', action: 'magazine', copy: 'Published news and updates' },
    { title: 'Offers section', href: '/#offers', action: null, copy: 'Special offers destination' },
    { title: 'Accommodation', href: '/#accommodation', action: null, copy: 'Apartment rooms section' },
    { title: 'Contact / Booking', href: '/#contact', action: null, copy: 'Phone and WhatsApp booking' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ['Magazine posts', counts.posts],
          ['Menu items', counts.items],
          ['Categories', counts.categories],
          ['Events', counts.events],
          ['Apartments', counts.apartments],
        ].map(([label, value]) => (
          <Panel key={label as string}>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">{label}</p>
            <p className="mt-3 font-[var(--font-heading)] text-5xl font-semibold">{value}</p>
          </Panel>
        ))}
      </div>

      <Panel>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-gold">Real destinations</p>
            <h3 className="mt-2 font-[var(--font-heading)] text-4xl font-semibold">
              Clickable website links
            </h3>
          </div>
          <p className="max-w-xl text-sm leading-6 text-slate-500">
            Every View or Learn More link points to a live page or a real section on the public site.
          </p>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {destinations.map((item) => (
            <article key={item.href} className="rounded-2xl border border-slate-200 p-4">
              <h4 className="font-semibold text-slate-900">{item.title}</h4>
              <p className="mt-1 min-h-10 text-xs leading-5 text-slate-500">{item.copy}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={item.href}
                  className="rounded-full bg-abyss px-3 py-1.5 text-xs font-bold text-gold"
                >
                  View
                </a>
                {item.action ? (
                  <button
                    type="button"
                    onClick={() => setActive(item.action!)}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600"
                  >
                    Manage
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function MagazineTab({ token }: { token: string }) {
  const blank = { title: '', excerpt: '', content: '', coverImage: '', published: true };
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [gallery, setGallery] = useState<MediaResource[]>([]);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState(blank);
  const [busy, setBusy] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  async function load() {
    try {
      const [nextPosts, media] = await Promise.allSettled([
        request<BlogPost[]>('/blog/all', {}, token),
        request<{ resources?: MediaResource[] }>('/admin/media?folder=blog', {}, token),
      ]);
      if (nextPosts.status === 'fulfilled') setPosts(nextPosts.value);
      if (media.status === 'fulfilled') setGallery(media.value.resources ?? []);
      if (nextPosts.status === 'rejected') throw nextPosts.reason;
    } catch (error) {
      setStatus({ type: 'error', text: error instanceof Error ? error.message : 'Could not load posts.' });
    }
  }

  useEffect(() => {
    void load();
  }, [token]);

  function startEdit(post: BlogPost) {
    setEditing(post);
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage ?? '',
      published: post.published,
    });
  }

  async function save() {
    if (!form.title.trim() || form.excerpt.trim().length < 10 || form.content.trim().length < 10) {
      setStatus({ type: 'error', text: 'Title, excerpt, and content are required. Excerpt/content need at least 10 characters.' });
      return;
    }
    setBusy(true);
    setStatus(null);
    try {
      const body = JSON.stringify({
        ...form,
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        coverImage: form.coverImage.trim() || undefined,
      });
      if (editing) {
        await request(`/blog/${editing.id}`, { method: 'PATCH', body }, token);
      } else {
        await request('/blog', { method: 'POST', body }, token);
      }
      setStatus({ type: 'success', text: editing ? 'Magazine post updated.' : 'Magazine post created.' });
      setEditing(null);
      setForm(blank);
      await load();
    } catch (error) {
      setStatus({ type: 'error', text: error instanceof Error ? error.message : 'Save failed.' });
    } finally {
      setBusy(false);
    }
  }

  async function toggle(post: BlogPost) {
    await request(`/blog/${post.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ published: !post.published }),
    }, token);
    await load();
  }

  async function remove(post: BlogPost) {
    if (!window.confirm(`Delete "${post.title}"?`)) return;
    await request(`/blog/${post.id}`, { method: 'DELETE' }, token);
    await load();
  }

  async function uploadCover(file: File | null) {
    if (!file) return;
    const body = new FormData();
    body.append('file', file);
    body.append('folder', 'blog');
    setUploadingCover(true);
    setStatus(null);
    try {
      const uploaded = await request<{ secureUrl?: string }>('/admin/media/upload', { method: 'POST', body }, token);
      if (!uploaded.secureUrl) throw new Error('Upload completed, but no image URL was returned.');
      setForm((current) => ({ ...current, coverImage: uploaded.secureUrl! }));
      setStatus({ type: 'success', text: 'Featured image uploaded and attached to this article.' });
      await load();
    } catch (error) {
      setStatus({ type: 'error', text: error instanceof Error ? error.message : 'Image upload failed.' });
    } finally {
      setUploadingCover(false);
      if (coverInputRef.current) coverInputRef.current.value = '';
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <Panel>
        <p className="text-xs font-black uppercase tracking-[0.28em] text-gold">El Classico Magazine</p>
        <h3 className="mt-2 font-[var(--font-heading)] text-4xl font-semibold">
          {editing ? 'Edit update' : 'Post a new update'}
        </h3>
        <div className="mt-6 space-y-4">
          <Field label="Title">
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-gold"
              placeholder="Weekend at El Classico Beach"
            />
          </Field>
          <Field label="Excerpt">
            <input
              value={form.excerpt}
              onChange={(event) => setForm({ ...form, excerpt: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-gold"
              placeholder="Short summary shown on the magazine page"
            />
          </Field>
          <Field label="Cover image URL" hint="Use a Cloudinary URL from Media or another approved image URL.">
            <input
              value={form.coverImage}
              onChange={(event) => setForm({ ...form, coverImage: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-gold"
              placeholder="https://res.cloudinary.com/..."
            />
          </Field>
          <div className="rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                  Featured image
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Choose from gallery with one click, or upload from your device.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => void uploadCover(event.target.files?.[0] ?? null)}
                />
                <button
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  disabled={uploadingCover}
                  className="rounded-full bg-abyss px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-gold disabled:opacity-60"
                >
                  {uploadingCover ? 'Uploading...' : 'Upload from device'}
                </button>
                <button
                  type="button"
                  onClick={() => void load()}
                  className="rounded-full bg-white px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500"
                >
                  Refresh gallery
                </button>
              </div>
            </div>
            {form.coverImage ? (
              <div className="mt-4 flex items-center gap-4 rounded-2xl bg-white p-3">
                <img src={form.coverImage} alt="" className="h-20 w-20 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-800">Current featured image</p>
                  <p className="truncate text-xs text-slate-400">{form.coverImage}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, coverImage: '' })}
                  className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600"
                >
                  Remove
                </button>
              </div>
            ) : null}
            <div className="mt-4 grid max-h-72 gap-3 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((image) => (
                <button
                  key={image.publicId}
                  type="button"
                  onClick={() => setForm({ ...form, coverImage: image.secureUrl })}
                  className={cx(
                    'group overflow-hidden rounded-2xl border bg-white text-left transition',
                    form.coverImage === image.secureUrl ? 'border-gold ring-2 ring-gold/30' : 'border-slate-200 hover:border-gold',
                  )}
                  title="Use this image"
                >
                  <img src={image.secureUrl} alt="" className="aspect-square w-full object-cover transition group-hover:scale-105" />
                  <span className="block truncate px-3 py-2 text-xs font-bold text-slate-500">
                    Use this image
                  </span>
                </button>
              ))}
              {gallery.length === 0 ? (
                <p className="col-span-full rounded-2xl bg-white p-4 text-sm text-slate-400">
                  No blog gallery images yet. Use “Upload from device” to add one immediately.
                </p>
              ) : null}
            </div>
          </div>
          <Field label="Article content">
            <textarea
              rows={10}
              value={form.content}
              onChange={(event) => setForm({ ...form, content: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-gold"
              placeholder="Write the full El Classico Beach update..."
            />
          </Field>
          <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(event) => setForm({ ...form, published: event.target.checked })}
              className="h-4 w-4 accent-gold"
            />
            Publish on El Classico Magazine
          </label>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="rounded-2xl bg-abyss px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-gold disabled:opacity-60"
          >
            {busy ? 'Saving...' : editing ? 'Update post' : 'Publish post'}
          </button>
          {editing ? (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setForm(blank);
              }}
              className="rounded-2xl bg-slate-100 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-500"
            >
              Cancel
            </button>
          ) : null}
          <a
            href="/blog"
            className="rounded-2xl border border-slate-200 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-slate-600"
          >
            View Magazine
          </a>
        </div>
        <StatusNote status={status} />
      </Panel>

      <Panel>
        <h3 className="font-[var(--font-heading)] text-4xl font-semibold">All magazine posts</h3>
        <div className="mt-5 space-y-3">
          {posts.map((post) => (
            <article key={post.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex flex-col gap-4 md:flex-row">
                {post.coverImage ? (
                  <img src={post.coverImage} alt="" className="aspect-square w-full rounded-2xl object-cover md:w-28" />
                ) : null}
                <div className="min-w-0 flex-1">
                  <span
                    className={cx(
                      'rounded-full px-3 py-1 text-xs font-bold',
                      post.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500',
                    )}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                  <h4 className="mt-3 font-semibold text-slate-900">{post.title}</h4>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{post.excerpt}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="button" onClick={() => startEdit(post)} className="rounded-full bg-gold px-3 py-1.5 text-xs font-bold text-abyss">
                      Edit
                    </button>
                    <button type="button" onClick={() => toggle(post)} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                      {post.published ? 'Unpublish' : 'Publish'}
                    </button>
                    <button type="button" onClick={() => remove(post)} className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
          {posts.length === 0 ? <p className="py-10 text-center text-sm text-slate-400">No magazine posts yet.</p> : null}
        </div>
      </Panel>
    </div>
  );
}

function MenuTab({ token }: { token: string }) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [form, setForm] = useState({
    categoryId: '',
    title: '',
    description: '',
    basePrice: '',
    imageUrl: '',
    spiceLevel: '0',
    pairingHint: '',
    isAvailable: true,
  });
  const [status, setStatus] = useState<Status>(null);
  const grouped = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      items: items.filter((item) => item.category === category.name),
    }));
  }, [categories, items]);

  async function load() {
    const [nextCategories, nextItems] = await Promise.all([
      request<MenuCategory[]>('/menu/categories'),
      request<MenuItem[]>('/menu/items'),
    ]);
    setCategories(nextCategories);
    setItems(nextItems);
    setForm((current) => ({
      ...current,
      categoryId: current.categoryId || nextCategories[0]?.id || '',
    }));
  }

  useEffect(() => {
    void load().catch((error) => setStatus({ type: 'error', text: error.message }));
  }, []);

  async function createItem() {
    if (!form.categoryId || !form.title.trim() || !form.description.trim()) {
      setStatus({ type: 'error', text: 'Choose a category and fill title/description.' });
      return;
    }
    try {
      await request('/menu/items', {
        method: 'POST',
        body: JSON.stringify({
          categoryId: form.categoryId,
          title: form.title.trim(),
          description: form.description.trim(),
          basePrice: Number(form.basePrice) || 0,
          imageUrl: form.imageUrl.trim() || undefined,
          spiceLevel: Number(form.spiceLevel) || 0,
          pairingHint: form.pairingHint.trim() || undefined,
          isAvailable: form.isAvailable,
        }),
      }, token);
      setStatus({ type: 'success', text: 'Menu item added to the selected category.' });
      setForm((current) => ({ ...current, title: '', description: '', basePrice: '', imageUrl: '', pairingHint: '' }));
      await load();
    } catch (error) {
      setStatus({ type: 'error', text: error instanceof Error ? error.message : 'Could not create menu item.' });
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <Panel>
        <p className="text-xs font-black uppercase tracking-[0.28em] text-gold">Menu manager</p>
        <h3 className="mt-2 font-[var(--font-heading)] text-4xl font-semibold">Add food or drink</h3>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Categories are real backend categories. Select one, create the item, and it becomes available through the menu API.
        </p>
        <div className="mt-6 space-y-4">
          <Field label="Category">
            <select
              value={form.categoryId}
              onChange={(event) => setForm({ ...form, categoryId: event.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-gold"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </Field>
          <Field label="Title">
            <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-gold" />
          </Field>
          <Field label="Description">
            <textarea rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-gold" />
          </Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Price RWF">
              <input type="number" value={form.basePrice} onChange={(event) => setForm({ ...form, basePrice: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-gold" />
            </Field>
            <Field label="Spice level">
              <input type="number" min={0} value={form.spiceLevel} onChange={(event) => setForm({ ...form, spiceLevel: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-gold" />
            </Field>
          </div>
          <Field label="Image URL">
            <input value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-gold" />
          </Field>
          <Field label="Pairing hint">
            <input value={form.pairingHint} onChange={(event) => setForm({ ...form, pairingHint: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-gold" />
          </Field>
          <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
            <input type="checkbox" checked={form.isAvailable} onChange={(event) => setForm({ ...form, isAvailable: event.target.checked })} className="h-4 w-4 accent-gold" />
            Available publicly
          </label>
        </div>
        <button type="button" onClick={createItem} className="mt-5 rounded-2xl bg-abyss px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-gold">
          Add item
        </button>
        <StatusNote status={status} />
      </Panel>

      <Panel>
        <h3 className="font-[var(--font-heading)] text-4xl font-semibold">Real categories</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {grouped.map((category) => (
            <article key={category.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="font-semibold text-slate-900">{category.name}</h4>
                  <p className="text-xs text-slate-400">/{category.slug}</p>
                </div>
                <a href="/#offers" className="rounded-full bg-abyss px-3 py-1.5 text-xs font-bold text-gold">View</a>
              </div>
              <div className="mt-4 space-y-2">
                {category.items.map((item) => (
                  <div key={item.id} className="rounded-xl bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-500">{Number(item.basePrice).toLocaleString()} RWF</p>
                  </div>
                ))}
                {category.items.length === 0 ? <p className="text-sm text-slate-400">No items yet.</p> : null}
              </div>
            </article>
          ))}
          {categories.length === 0 ? (
            <p className="col-span-2 rounded-2xl bg-amber-50 p-4 text-sm text-amber-700">
              No categories are configured in the backend yet. Add backend categories first, then menu items can attach to them.
            </p>
          ) : null}
        </div>
      </Panel>
    </div>
  );
}

function EventsTab({ token }: { token: string }) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [form, setForm] = useState({ title: '', description: '', startsAt: '', endsAt: '', coverImageUrl: '' });
  const [status, setStatus] = useState<Status>(null);

  async function load() {
    setEvents(await request<EventItem[]>('/events'));
  }

  useEffect(() => {
    void load().catch((error) => setStatus({ type: 'error', text: error.message }));
  }, []);

  async function createEvent() {
    try {
      await request('/events', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          startsAt: new Date(form.startsAt).toISOString(),
          endsAt: new Date(form.endsAt).toISOString(),
          coverImageUrl: form.coverImageUrl.trim() || undefined,
        }),
      }, token);
      setStatus({ type: 'success', text: 'Event created.' });
      setForm({ title: '', description: '', startsAt: '', endsAt: '', coverImageUrl: '' });
      await load();
    } catch (error) {
      setStatus({ type: 'error', text: error instanceof Error ? error.message : 'Could not create event.' });
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
      <Panel>
        <p className="text-xs font-black uppercase tracking-[0.28em] text-gold">Events</p>
        <h3 className="mt-2 font-[var(--font-heading)] text-4xl font-semibold">Create event</h3>
        <div className="mt-6 space-y-4">
          <Field label="Title"><input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-gold" /></Field>
          <Field label="Description"><textarea rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-gold" /></Field>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Starts"><input type="datetime-local" value={form.startsAt} onChange={(event) => setForm({ ...form, startsAt: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-gold" /></Field>
            <Field label="Ends"><input type="datetime-local" value={form.endsAt} onChange={(event) => setForm({ ...form, endsAt: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-gold" /></Field>
          </div>
          <Field label="Cover image URL"><input value={form.coverImageUrl} onChange={(event) => setForm({ ...form, coverImageUrl: event.target.value })} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-gold" /></Field>
        </div>
        <button type="button" onClick={createEvent} className="mt-5 rounded-2xl bg-abyss px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-gold">
          Create event
        </button>
        <StatusNote status={status} />
      </Panel>
      <Panel>
        <h3 className="font-[var(--font-heading)] text-4xl font-semibold">Upcoming events</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <article key={event.id} className="rounded-2xl border border-slate-200 p-4">
              {event.coverImageUrl ? <img src={event.coverImageUrl} alt="" className="mb-4 aspect-square w-full rounded-2xl object-cover" /> : null}
              <h4 className="font-semibold">{event.title}</h4>
              <p className="mt-1 text-xs text-slate-400">{new Date(event.startsAt).toLocaleString()}</p>
              <p className="mt-3 text-sm leading-6 text-slate-500">{event.description}</p>
            </article>
          ))}
          {events.length === 0 ? <p className="col-span-2 py-10 text-center text-sm text-slate-400">No events yet.</p> : null}
        </div>
      </Panel>
    </div>
  );
}

function MediaTab({ token }: { token: string }) {
  const [folder, setFolder] = useState<(typeof mediaFolders)[number]>('blog');
  const [resources, setResources] = useState<MediaResource[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    const payload = await request<{ resources?: MediaResource[] }>(`/admin/media?folder=${encodeURIComponent(folder)}`, {}, token);
    setResources(payload.resources ?? []);
  }

  useEffect(() => {
    void load().catch((error) => setStatus({ type: 'error', text: error.message }));
  }, [folder, token]);

  async function upload() {
    if (!file) return;
    const body = new FormData();
    body.append('file', file);
    body.append('folder', folder);
    setBusy(true);
    try {
      await request('/admin/media/upload', { method: 'POST', body }, token);
      setFile(null);
      setStatus({ type: 'success', text: 'Image uploaded. Copy its URL for homepage or magazine content.' });
      await load();
    } catch (error) {
      setStatus({ type: 'error', text: error instanceof Error ? error.message : 'Upload failed.' });
    } finally {
      setBusy(false);
    }
  }

  async function remove(publicId: string) {
    if (!window.confirm('Delete this image from Cloudinary?')) return;
    await request(`/admin/media?publicId=${encodeURIComponent(publicId)}`, { method: 'DELETE' }, token);
    await load();
  }

  return (
    <div className="space-y-6">
      <Panel>
        <p className="text-xs font-black uppercase tracking-[0.28em] text-gold">Media library</p>
        <h3 className="mt-2 font-[var(--font-heading)] text-4xl font-semibold">Upload images</h3>
        <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end">
          <Field label="Folder">
            <select value={folder} onChange={(event) => setFolder(event.target.value as (typeof mediaFolders)[number])} className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-gold lg:w-72">
              {mediaFolders.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </Field>
          <Field label="Image file">
            <input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm" />
          </Field>
          <button type="button" onClick={upload} disabled={busy || !file} className="rounded-2xl bg-abyss px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-gold disabled:opacity-60">
            {busy ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        <StatusNote status={status} />
      </Panel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {resources.map((resource) => (
          <article key={resource.publicId} className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm">
            <img src={resource.secureUrl} alt="" className="aspect-square w-full object-cover" />
            <div className="p-4">
              <p className="truncate text-xs text-slate-400">{resource.publicId}</p>
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={() => navigator.clipboard.writeText(resource.secureUrl)} className="rounded-full bg-abyss px-3 py-1.5 text-xs font-bold text-gold">Copy URL</button>
                <button type="button" onClick={() => remove(resource.publicId)} className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">Delete</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function BusinessTab({ token }: { token: string }) {
  const [apartments, setApartments] = useState<ApartmentItem[]>([]);
  const [reservations, setReservations] = useState<ReservationItem[]>([]);

  useEffect(() => {
    async function load() {
      const [apartmentData, reservationData] = await Promise.allSettled([
        request<ApartmentItem[]>('/apartments'),
        request<ReservationItem[]>('/reservations', {}, token),
      ]);
      if (apartmentData.status === 'fulfilled') setApartments(apartmentData.value);
      if (reservationData.status === 'fulfilled') setReservations(reservationData.value);
    }
    void load();
  }, [token]);

  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-gold">Business</p>
            <h3 className="mt-2 font-[var(--font-heading)] text-4xl font-semibold">Apartments and bookings</h3>
          </div>
          <a href="/#accommodation" className="rounded-2xl bg-abyss px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-gold">
            View Accommodation
          </a>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel>
          <h4 className="font-[var(--font-heading)] text-3xl font-semibold">Apartments</h4>
          <div className="mt-4 space-y-3">
            {apartments.map((apartment) => (
              <article key={apartment.id} className="rounded-2xl border border-slate-200 p-4">
                <h5 className="font-semibold">{apartment.name}</h5>
                <p className="mt-2 text-sm leading-6 text-slate-500">{apartment.description}</p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.18em] text-gold">
                  {apartment.rooms?.length ?? 0} rooms
                </p>
              </article>
            ))}
            {apartments.length === 0 ? <p className="py-8 text-center text-sm text-slate-400">No apartments found.</p> : null}
          </div>
        </Panel>

        <Panel>
          <h4 className="font-[var(--font-heading)] text-3xl font-semibold">Reservations</h4>
          <div className="mt-4 space-y-3">
            {reservations.map((reservation) => (
              <article key={reservation.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h5 className="font-semibold">{reservation.user?.fullName ?? 'Guest reservation'}</h5>
                    <p className="text-xs text-slate-400">{reservation.user?.email ?? 'No email'}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {reservation.guests} guests
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-500">{new Date(reservation.reservationAt).toLocaleString()}</p>
                <p className="mt-2 text-sm text-slate-500">{reservation.notes ?? reservation.zone ?? 'No notes'}</p>
              </article>
            ))}
            {reservations.length === 0 ? <p className="py-8 text-center text-sm text-slate-400">No reservations yet.</p> : null}
          </div>
        </Panel>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState('');

  useEffect(() => {
    setToken(window.localStorage.getItem('elclassico_admin_token') ?? '');
  }, []);

  function logout() {
    window.localStorage.removeItem('elclassico_admin_token');
    setToken('');
  }

  if (!token) return <LoginScreen onLogin={setToken} />;
  return <Shell token={token} onLogout={logout} />;
}
