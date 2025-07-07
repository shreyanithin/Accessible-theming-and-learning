'use client';

/** Mini layout that respects CSS variables */
export default function PreviewCard() {
  return (
    <section className="rounded shadow border mt-6">
      {/* Navbar */}
      <nav
        className="px-4 py-3 font-bold rounded-t"
        style={{ background: 'var(--primary)', color: 'var(--text)' }}
      >
        Brand Navbar
      </nav>

      {/* Card body */}
      <div
        className="p-6 space-y-2"
        style={{ background: 'var(--secondary)', color: 'var(--text)' }}
      >
        <h3 className="text-lg font-semibold">Demo Card</h3>
        <p>This card shows your theme in action.</p>

        <button
          className="mt-4 px-4 py-2 rounded font-bold"
          style={{ background: 'var(--primary)', color: 'var(--text)' }}
        >
          Primary Button
        </button>
      </div>
    </section>
  );
}
