"use client";

import { useEffect, useState } from 'react';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4001/api';

type Tab = 'overview' | 'media' | 'menu' | 'events' | 'apartments' | 'reservations' | 'blog';
type MediaResource = { publicId: string; secureUrl: string };
type MenuItem = { id: string; title: string; description: string; basePrice: string; isAvailable: boolean };
type EventItem = { id: string; title: string; description: string; startsAt: string; endsAt: string; coverImageUrl?: string };
type ApartmentItem = { id: string; name: string; description: string; coverImageUrl?: string };
type ReservationItem = { id: string; guests: number; zone?: string; notes?: string; reservationAt: string; user?: { fullName: string; email: string } };
type BlogPost = { id: string; title: string; excerpt: string; content: string; coverImage?: string; published: boolean; publishedAt?: string; createdAt: string };

const mediaFolders = ['bar-overview', 'apartment-overview', 'blog', 'welcome', 'hero'] as const;

async function apiFetch(path: string, token: string, opts: RequestInit = {}) {
  const res = await fetch(`${apiBase}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(opts.headers ?? {}) },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// ── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [email, setEmail] = useState('admin@elclassico.rw');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setBusy(true); setError('');
    try {
      const res = await fetch(`${apiBase}/auth/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      if (data?.user?.role !== 'ADMIN') throw new Error('Not an admin account');
      const t = data.tokens.accessToken as string;
      window.localStorage.setItem('elclassico_admin_token', t);
      onLogin(t);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally { setBusy(false); }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-2xl">🏖</div>
          <h1 className="text-xl font-bold text-gray-900">El Classico Admin</h1>
          <p className="mt-1 text-sm text-gray-500">Sign in to manage your venue</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input type="email" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
            <input type="password" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
          </div>
        </div>
        {error && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        <button onClick={handleLogin} disabled={busy} className="mt-5 w-full rounded-lg bg-amber-500 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60">
          {busy ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}

// ── Sidebar ──────────────────────────────────────────────────────────────────
const NAV: { id: Tab; label: string; icon: string }[] = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'blog', label: 'Blog Posts', icon: '✍️' },
  { id: 'menu', label: 'Menu Items', icon: '🍽' },
  { id: 'events', label: 'Events', icon: '🎉' },
  { id: 'apartments', label: 'Apartments', icon: '🏠' },
  { id: 'reservations', label: 'Reservations', icon: '📅' },
  { id: 'media', label: 'Media Gallery', icon: '🖼' },
];

function Sidebar({ active, setActive, onLogout }: { active: Tab; setActive: (t: Tab) => void; onLogout: () => void }) {
  return (
    <aside className="flex h-screen w-56 flex-col border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500">El Classico</p>
        <h2 className="mt-0.5 text-base font-bold text-gray-900">Admin Panel</h2>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-3">
        {NAV.map((item) => (
          <button key={item.id} onClick={() => setActive(item.id)}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${active === item.id ? 'bg-amber-50 font-semibold text-amber-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
            <span>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <div className="border-t border-gray-200 p-3">
        <button onClick={onLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-500 hover:bg-gray-100">
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}

// ── Overview ─────────────────────────────────────────────────────────────────
function OverviewTab({ token }: { token: string }) {
  const [stats, setStats] = useState({ blog: 0, menu: 0, events: 0, reservations: 0, apartments: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [blog, menu, events, reservations, apartments] = await Promise.all([
          apiFetch('/blog/all', token), apiFetch('/menu', token), apiFetch('/events', token),
          apiFetch('/reservations', token), apiFetch('/apartments', token),
        ]);
        setStats({
          blog: Array.isArray(blog) ? blog.length : 0,
          menu: Array.isArray(menu) ? menu.length : 0,
          events: Array.isArray(events) ? events.length : 0,
          reservations: Array.isArray(reservations) ? reservations.length : 0,
          apartments: Array.isArray(apartments) ? apartments.length : 0,
        });
      } catch {}
    }
    void load();
  }, [token]);

  const cards = [
    { label: 'Blog Posts', value: stats.blog, icon: '✍️', color: 'bg-blue-50 text-blue-600' },
    { label: 'Menu Items', value: stats.menu, icon: '🍽', color: 'bg-green-50 text-green-600' },
    { label: 'Events', value: stats.events, icon: '🎉', color: 'bg-purple-50 text-purple-600' },
    { label: 'Reservations', value: stats.reservations, icon: '📅', color: 'bg-amber-50 text-amber-600' },
    { label: 'Apartments', value: stats.apartments, icon: '🏠', color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Dashboard Overview</h2>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className={`mb-2 inline-flex rounded-lg p-2 text-lg ${c.color}`}>{c.icon}</div>
            <p className="text-2xl font-bold text-gray-900">{c.value}</p>
            <p className="text-xs text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-2 font-semibold text-gray-900">Connection</h3>
        <p className="text-sm text-gray-500">API endpoint: <span className="font-mono text-gray-800">{apiBase}</span></p>
        <p className="mt-1 text-sm text-gray-500">Admin login: <span className="font-mono text-gray-800">admin@elclassico.rw</span></p>
      </div>
    </div>
  );
}

// ── Blog ─────────────────────────────────────────────────────────────────────
function BlogTab({ token }: { token: string }) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', coverImage: '', published: false });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function load() {
    try { const data = await apiFetch('/blog/all', token); setPosts(Array.isArray(data) ? data : []); } catch {}
  }
  useEffect(() => { void load(); }, [token]);

  function startNew() { setEditing(null); setForm({ title: '', excerpt: '', content: '', coverImage: '', published: false }); }
  function startEdit(p: BlogPost) { setEditing(p); setForm({ title: p.title, excerpt: p.excerpt, content: p.content, coverImage: p.coverImage ?? '', published: p.published }); }

  async function save() {
    if (!form.title || !form.excerpt || !form.content) { setMsg('Title, excerpt and content are required'); return; }
    setBusy(true); setMsg('');
    try {
      if (editing) await apiFetch(`/blog/${editing.id}`, token, { method: 'PATCH', body: JSON.stringify(form) });
      else await apiFetch('/blog', token, { method: 'POST', body: JSON.stringify(form) });
      setMsg(editing ? 'Post updated.' : 'Post published.'); startNew(); void load();
    } catch (e) { setMsg(e instanceof Error ? e.message : 'Save failed'); }
    finally { setBusy(false); }
  }

  async function remove(id: string) {
    if (!confirm('Delete this post?')) return;
    try { await apiFetch(`/blog/${id}`, token, { method: 'DELETE' }); void load(); } catch {}
  }

  async function togglePublish(p: BlogPost) {
    try { await apiFetch(`/blog/${p.id}`, token, { method: 'PATCH', body: JSON.stringify({ published: !p.published }) }); void load(); } catch {}
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Blog Posts</h2>
        <button onClick={startNew} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">+ New Post</button>
      </div>

      {/* Editor */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-semibold text-gray-900">{editing ? 'Edit Post' : 'Write New Post'}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Title *</label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Post title..." />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Cover Image URL</label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none" value={form.coverImage} onChange={(e) => setForm({ ...form, coverImage: e.target.value })} placeholder="https://..." />
          </div>
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-xs font-medium text-gray-600">Excerpt *</label>
          <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short description shown in the blog list..." />
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-xs font-medium text-gray-600">Content *</label>
          <textarea rows={8} className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Write your full article here..." />
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} className="h-4 w-4 accent-amber-500" />
            Publish immediately
          </label>
          <button onClick={save} disabled={busy} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60">
            {busy ? 'Saving...' : editing ? 'Update Post' : 'Publish Post'}
          </button>
          {editing && <button onClick={startNew} className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">Cancel</button>}
        </div>
        {msg && <p className="mt-2 text-sm text-amber-600">{msg}</p>}
      </div>

      {/* List */}
      <div className="space-y-3">
        {posts.map((p) => (
          <div key={p.id} className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            {p.coverImage && <img src={p.coverImage} alt="" className="h-16 w-24 flex-shrink-0 rounded-lg object-cover" />}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${p.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {p.published ? 'Published' : 'Draft'}
                </span>
                <span className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</span>
              </div>
              <h4 className="mt-1 font-semibold text-gray-900">{p.title}</h4>
              <p className="mt-0.5 line-clamp-2 text-sm text-gray-500">{p.excerpt}</p>
            </div>
            <div className="flex flex-shrink-0 flex-wrap gap-2">
              <button onClick={() => togglePublish(p)} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50">
                {p.published ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => startEdit(p)} className="rounded-lg border border-amber-200 px-3 py-1.5 text-xs text-amber-600 hover:bg-amber-50">Edit</button>
              <button onClick={() => remove(p.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50">Delete</button>
            </div>
          </div>
        ))}
        {posts.length === 0 && <p className="py-8 text-center text-sm text-gray-400">No blog posts yet. Write your first one above.</p>}
      </div>
    </div>
  );
}

// ── Menu ─────────────────────────────────────────────────────────────────────
function MenuTab({ token }: { token: string }) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({ title: '', description: '', basePrice: '', isAvailable: true });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function load() { try { const data = await apiFetch('/menu', token); setItems(Array.isArray(data) ? data : []); } catch {} }
  useEffect(() => { void load(); }, [token]);

  function startEdit(item: MenuItem) { setEditing(item); setForm({ title: item.title, description: item.description, basePrice: item.basePrice, isAvailable: item.isAvailable }); }
  function startNew() { setEditing(null); setForm({ title: '', description: '', basePrice: '', isAvailable: true }); }

  async function save() {
    setBusy(true); setMsg('');
    try {
      const body = { ...form, basePrice: parseFloat(form.basePrice) || 0 };
      if (editing) await apiFetch(`/menu/${editing.id}`, token, { method: 'PATCH', body: JSON.stringify(body) });
      else await apiFetch('/menu', token, { method: 'POST', body: JSON.stringify(body) });
      setMsg(editing ? 'Updated.' : 'Created.'); startNew(); void load();
    } catch (e) { setMsg(e instanceof Error ? e.message : 'Save failed'); }
    finally { setBusy(false); }
  }

  async function remove(id: string) {
    if (!confirm('Delete this item?')) return;
    try { await apiFetch(`/menu/${id}`, token, { method: 'DELETE' }); void load(); } catch {}
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Menu Items</h2>
        <button onClick={startNew} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">+ Add Item</button>
      </div>
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-semibold text-gray-900">{editing ? 'Edit Item' : 'New Item'}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Title</label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Price (RWF)</label>
            <input type="number" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none" value={form.basePrice} onChange={(e) => setForm({ ...form, basePrice: e.target.value })} />
          </div>
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-xs font-medium text-gray-600">Description</label>
          <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="mt-3 flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} className="h-4 w-4 accent-amber-500" />
            Available
          </label>
          <button onClick={save} disabled={busy} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60">
            {busy ? 'Saving...' : editing ? 'Update' : 'Add Item'}
          </button>
          {editing && <button onClick={startNew} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600">Cancel</button>}
        </div>
        {msg && <p className="mt-2 text-sm text-amber-600">{msg}</p>}
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Item</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Price</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.description}</p>
                </td>
                <td className="px-4 py-3 text-gray-700">{Number(item.basePrice).toLocaleString()} RWF</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${item.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {item.isAvailable ? 'Available' : 'Unavailable'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => startEdit(item)} className="mr-2 text-xs text-amber-600 hover:underline">Edit</button>
                  <button onClick={() => remove(item.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-400">No menu items yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Events ───────────────────────────────────────────────────────────────────
function EventsTab({ token }: { token: string }) {
  const [items, setItems] = useState<EventItem[]>([]);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [form, setForm] = useState({ title: '', description: '', startsAt: '', endsAt: '', coverImageUrl: '' });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function load() { try { const data = await apiFetch('/events', token); setItems(Array.isArray(data) ? data : []); } catch {} }
  useEffect(() => { void load(); }, [token]);

  function startEdit(ev: EventItem) { setEditing(ev); setForm({ title: ev.title, description: ev.description, startsAt: ev.startsAt?.slice(0, 16) ?? '', endsAt: ev.endsAt?.slice(0, 16) ?? '', coverImageUrl: ev.coverImageUrl ?? '' }); }
  function startNew() { setEditing(null); setForm({ title: '', description: '', startsAt: '', endsAt: '', coverImageUrl: '' }); }

  async function save() {
    setBusy(true); setMsg('');
    try {
      if (editing) await apiFetch(`/events/${editing.id}`, token, { method: 'PATCH', body: JSON.stringify(form) });
      else await apiFetch('/events', token, { method: 'POST', body: JSON.stringify(form) });
      setMsg(editing ? 'Updated.' : 'Created.'); startNew(); void load();
    } catch (e) { setMsg(e instanceof Error ? e.message : 'Save failed'); }
    finally { setBusy(false); }
  }

  async function remove(id: string) {
    if (!confirm('Delete this event?')) return;
    try { await apiFetch(`/events/${id}`, token, { method: 'DELETE' }); void load(); } catch {}
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Events</h2>
        <button onClick={startNew} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600">+ New Event</button>
      </div>
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 font-semibold text-gray-900">{editing ? 'Edit Event' : 'New Event'}</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Title</label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Cover Image URL</label>
            <input className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none" value={form.coverImageUrl} onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Starts At</label>
            <input type="datetime-local" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">Ends At</label>
            <input type="datetime-local" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none" value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} />
          </div>
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-xs font-medium text-gray-600">Description</label>
          <textarea rows={3} className="w-full resize-y rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </div>
        <div className="mt-3 flex gap-3">
          <button onClick={save} disabled={busy} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60">
            {busy ? 'Saving...' : editing ? 'Update' : 'Create Event'}
          </button>
          {editing && <button onClick={startNew} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600">Cancel</button>}
        </div>
        {msg && <p className="mt-2 text-sm text-amber-600">{msg}</p>}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((ev) => (
          <div key={ev.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            {ev.coverImageUrl && <img src={ev.coverImageUrl} alt="" className="mb-3 h-36 w-full rounded-lg object-cover" />}
            <h4 className="font-semibold text-gray-900">{ev.title}</h4>
            <p className="mt-1 text-xs text-gray-500">{new Date(ev.startsAt).toLocaleString()} to {new Date(ev.endsAt).toLocaleString()}</p>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600">{ev.description}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => startEdit(ev)} className="rounded-lg border border-amber-200 px-3 py-1.5 text-xs text-amber-600 hover:bg-amber-50">Edit</button>
              <button onClick={() => remove(ev.id)} className="rounded-lg border border-red-200 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50">Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-2 py-8 text-center text-sm text-gray-400">No events yet.</p>}
      </div>
    </div>
  );
}

// ── Apartments ───────────────────────────────────────────────────────────────
function ApartmentsTab({ token }: { token: string }) {
  const [items, setItems] = useState<ApartmentItem[]>([]);
  useEffect(() => {
    apiFetch('/apartments', token).then((data) => setItems(Array.isArray(data) ? data : [])).catch(() => {});
  }, [token]);
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Apartments</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((apt) => (
          <div key={apt.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            {apt.coverImageUrl && <img src={apt.coverImageUrl} alt="" className="mb-3 h-40 w-full rounded-lg object-cover" />}
            <h4 className="font-semibold text-gray-900">{apt.name}</h4>
            <p className="mt-1 line-clamp-3 text-sm text-gray-500">{apt.description}</p>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-3 py-8 text-center text-sm text-gray-400">No apartments configured yet.</p>}
      </div>
    </div>
  );
}

// ── Reservations ─────────────────────────────────────────────────────────────
function ReservationsTab({ token }: { token: string }) {
  const [items, setItems] = useState<ReservationItem[]>([]);
  useEffect(() => {
    apiFetch('/reservations', token).then((data) => setItems(Array.isArray(data) ? data : [])).catch(() => {});
  }, [token]);
  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Reservations</h2>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Guest</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Guests</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Zone</th>
              <th className="px-4 py-3 text-left font-medium text-gray-600">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{r.user?.fullName ?? 'Unknown'}</p>
                  <p className="text-xs text-gray-500">{r.user?.email}</p>
                </td>
                <td className="px-4 py-3 text-gray-700">{new Date(r.reservationAt).toLocaleString()}</td>
                <td className="px-4 py-3 text-gray-700">{r.guests}</td>
                <td className="px-4 py-3 text-gray-700">{r.zone ?? '—'}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{r.notes ?? '—'}</td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No reservations yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Media ─────────────────────────────────────────────────────────────────────
function MediaTab({ token }: { token: string }) {
  const [folder, setFolder] = useState<(typeof mediaFolders)[number]>('bar-overview');
  const [resources, setResources] = useState<MediaResource[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  async function load() {
    try { const data = await apiFetch(`/admin/media?folder=${encodeURIComponent(folder)}`, token); setResources(data.resources ?? []); } catch {}
  }
  useEffect(() => { void load(); }, [token, folder]);

  async function upload() {
    if (!file) return;
    setBusy(true); setMsg('');
    try {
      const fd = new FormData();
      fd.append('file', file); fd.append('folder', folder);
      const res = await fetch(`${apiBase}/admin/media/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd });
      if (!res.ok) throw new Error('Upload failed');
      setFile(null); setMsg('Uploaded.'); void load();
    } catch (e) { setMsg(e instanceof Error ? e.message : 'Upload failed'); }
    finally { setBusy(false); }
  }

  async function removeMedia(publicId: string) {
    try { await fetch(`${apiBase}/admin/media?publicId=${encodeURIComponent(publicId)}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } }); void load(); } catch {}
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Media Gallery</h2>
      <div className="mb-4 flex flex-wrap gap-2">
        {mediaFolders.map((f) => (
          <button key={f} onClick={() => setFolder(f)} className={`rounded-full px-4 py-1.5 text-sm transition ${folder === f ? 'bg-amber-500 font-semibold text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-100'}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="flex-1 text-sm text-gray-600" />
        <button onClick={upload} disabled={busy || !file} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60">{busy ? 'Uploading...' : 'Upload'}</button>
        <button onClick={load} className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">Refresh</button>
      </div>
      {msg && <p className="mb-3 text-sm text-amber-600">{msg}</p>}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {resources.map((r) => (
          <div key={r.publicId} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <img src={r.secureUrl} alt="" className="h-48 w-full object-cover" />
            <div className="p-3">
              <p className="line-clamp-1 text-xs text-gray-500">{r.publicId}</p>
              <div className="mt-2 flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(r.secureUrl)} className="rounded-lg border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50">Copy URL</button>
                <button onClick={() => removeMedia(r.publicId)} className="rounded-lg border border-red-200 px-3 py-1 text-xs text-red-500 hover:bg-red-50">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {resources.length === 0 && <p className="col-span-3 py-8 text-center text-sm text-gray-400">No images in this folder yet.</p>}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState('');
  const [tab, setTab] = useState<Tab>('overview');

  useEffect(() => {
    const stored = window.localStorage.getItem('elclassico_admin_token');
    if (stored) setToken(stored);
  }, []);

  function logout() {
    window.localStorage.removeItem('elclassico_admin_token');
    setToken('');
  }

  if (!token) return <LoginScreen onLogin={setToken} />;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active={tab} setActive={setTab} onLogout={logout} />
      <main className="flex-1 overflow-y-auto p-8">
        {tab === 'overview' && <OverviewTab token={token} />}
        {tab === 'blog' && <BlogTab token={token} />}
        {tab === 'menu' && <MenuTab token={token} />}
        {tab === 'events' && <EventsTab token={token} />}
        {tab === 'apartments' && <ApartmentsTab token={token} />}
        {tab === 'reservations' && <ReservationsTab token={token} />}
        {tab === 'media' && <MediaTab token={token} />}
      </main>
    </div>
  );
}
