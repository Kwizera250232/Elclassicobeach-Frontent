"use client";

import { useEffect, useMemo, useState } from 'react';

type MediaResource = {
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  createdAt?: string;
};

const folders = ['bar-overview', 'apartment-overview', 'blog', 'welcome', 'hero'] as const;

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4001/api';

export default function AdminPage() {
  const [email, setEmail] = useState('admin@elclassico.rw');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string>('');
  const [activeFolder, setActiveFolder] = useState<(typeof folders)[number]>('bar-overview');
  const [resources, setResources] = useState<MediaResource[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const canManage = useMemo(() => Boolean(token), [token]);

  useEffect(() => {
    const stored = window.localStorage.getItem('elclassico_admin_token');
    if (stored) {
      setToken(stored);
    }
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }
    void refresh();
  }, [token, activeFolder]);

  async function login() {
    setBusy(true);
    setMessage('');

    try {
      const response = await fetch(`${apiBase}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid admin credentials');
      }

      const payload = await response.json();
      const accessToken = payload?.tokens?.accessToken as string | undefined;
      const role = payload?.user?.role as string | undefined;

      if (!accessToken || role !== 'ADMIN') {
        throw new Error('This account is not an admin');
      }

      window.localStorage.setItem('elclassico_admin_token', accessToken);
      setToken(accessToken);
      setMessage('Logged in successfully.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  async function refresh() {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${apiBase}/admin/media?folder=${encodeURIComponent(activeFolder)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Unable to load media');
      }

      const payload = await response.json();
      setResources(payload.resources ?? []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to load media');
    }
  }

  async function upload() {
    if (!token || !file) {
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', activeFolder);

      const response = await fetch(`${apiBase}/admin/media/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setFile(null);
      setMessage('Image uploaded successfully.');
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  async function remove(publicId: string) {
    if (!token) {
      return;
    }

    setBusy(true);
    setMessage('');

    try {
      const response = await fetch(
        `${apiBase}/admin/media?publicId=${encodeURIComponent(publicId)}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      setMessage('Image removed.');
      await refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Delete failed');
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    window.localStorage.removeItem('elclassico_admin_token');
    setToken('');
    setResources([]);
    setMessage('Logged out.');
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-8 md:px-8">
      <section className="rounded-3xl border border-white/15 bg-black/20 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.24em] text-sand">Admin Media Manager</p>
        <h1 className="mt-2 font-[var(--font-heading)] text-5xl text-[#fff6e5]">El Classico Dashboard</h1>
        <p className="mt-3 max-w-2xl text-white/80">
          Login as admin to upload homepage images and manage galleries for bar, apartment, blog, and welcome sections.
        </p>
      </section>

      {!canManage ? (
        <section className="mt-6 rounded-3xl border border-white/15 bg-black/25 p-6 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm text-white/80">
              Admin Email
              <input
                className="mt-2 w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-white"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                type="email"
              />
            </label>

            <label className="text-sm text-white/80">
              Password
              <input
                className="mt-2 w-full rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-white"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type="password"
              />
            </label>
          </div>

          <button
            className="mt-4 rounded-full bg-white px-6 py-3 font-semibold text-abyss disabled:opacity-60"
            onClick={login}
            disabled={busy}
          >
            {busy ? 'Signing in...' : 'Sign In'}
          </button>
        </section>
      ) : (
        <section className="mt-6 rounded-3xl border border-white/15 bg-black/25 p-6 md:p-8">
          <div className="flex flex-wrap gap-2">
            {folders.map((folder) => (
              <button
                key={folder}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  activeFolder === folder
                    ? 'bg-white text-abyss'
                    : 'border border-white/25 text-white hover:bg-white/10'
                }`}
                onClick={() => setActiveFolder(folder)}
              >
                {folder}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="max-w-sm rounded-xl border border-white/20 bg-black/20 px-3 py-2 text-sm text-white"
            />
            <button
              className="rounded-full bg-gradient-to-r from-gold to-sunset px-6 py-3 font-semibold text-abyss disabled:opacity-60"
              onClick={upload}
              disabled={busy || !file}
            >
              {busy ? 'Processing...' : 'Upload Image'}
            </button>
            <button
              className="rounded-full border border-white/30 px-5 py-3 text-white"
              onClick={refresh}
              disabled={busy}
            >
              Refresh
            </button>
            <button
              className="rounded-full border border-white/30 px-5 py-3 text-white"
              onClick={logout}
              disabled={busy}
            >
              Logout
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {resources.map((item) => (
              <article key={item.publicId} className="overflow-hidden rounded-2xl border border-white/15 bg-black/20">
                <img src={item.secureUrl} alt={item.publicId} className="h-52 w-full object-cover" />
                <div className="space-y-2 p-4">
                  <p className="line-clamp-2 text-xs text-white/70">{item.publicId}</p>
                  <div className="flex gap-2">
                    <button
                      className="rounded-full border border-white/30 px-3 py-1 text-xs text-white"
                      onClick={() => navigator.clipboard.writeText(item.secureUrl)}
                    >
                      Copy URL
                    </button>
                    <button
                      className="rounded-full border border-[#df6e47]/60 px-3 py-1 text-xs text-[#ffb59c]"
                      onClick={() => remove(item.publicId)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {message ? <p className="mt-4 text-sm text-[#f6ddac]">{message}</p> : null}
    </main>
  );
}
