const STAT_CARDS = [
  { label: "Total Views", value: "12,408", accent: true },
  { label: "Total Posts", value: "42" },
  { label: "Published", value: "38" },
  { label: "Total Likes", value: "890" },
];

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-8">
      <header className="bg-[color:var(--color-card)] rounded-lg border border-[color:var(--color-border)] p-8 shadow-sm">
        <h2 className="text-3xl font-black tracking-tight text-[color:var(--color-card-foreground)] leading-tight">
          Dashboard Overview
        </h2>
        <p className="text-[14px] text-[color:var(--color-muted-foreground)] mt-2">
          Manage your blog content and view analytics.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {STAT_CARDS.map(({ label, value, accent }) => (
          <div
            key={label}
            className="bg-[color:var(--color-card)] p-6 rounded-lg border border-[color:var(--color-border)] shadow-sm"
          >
            <h3 className="text-[13px] font-medium text-[color:var(--color-muted-foreground)] mb-1.5">
              {label}
            </h3>
            <p
              className={`text-4xl font-black tracking-tight leading-none ${
                accent
                  ? "text-[color:var(--color-primary)]"
                  : "text-[color:var(--color-card-foreground)]"
              }`}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-[color:var(--color-card)] p-6 rounded-lg border border-[color:var(--color-border)] shadow-sm min-h-80">
        <h3 className="text-base font-bold text-[color:var(--color-card-foreground)] mb-3">
          Recent Activity
        </h3>
        <p className="text-[13px] text-[color:var(--color-muted-foreground)]">
          Activity feed will be connected to Supabase.
        </p>
      </div>
    </div>
  );
}
