export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <header className="bg-[color:var(--color-card)] rounded-2xl border border-[color:var(--color-border)] p-8 shadow-sm">
        <h2 className="text-3xl font-bold tracking-tight text-[color:var(--color-card-foreground)]">
          Dashboard Overview
        </h2>
        <p className="text-[color:var(--color-muted-foreground)] mt-2">
          Manage your blog content and view analytics.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[color:var(--color-card)] p-6 rounded-xl border border-[color:var(--color-border)] shadow-sm">
          <h3 className="text-sm font-medium text-[color:var(--color-muted-foreground)] mb-1">
            Total Views
          </h3>
          <p className="text-3xl font-bold text-[color:var(--color-primary)]">
            12,408
          </p>
        </div>
        <div className="bg-[color:var(--color-card)] p-6 rounded-xl border border-[color:var(--color-border)] shadow-sm">
          <h3 className="text-sm font-medium text-[color:var(--color-muted-foreground)] mb-1">
            Total Posts
          </h3>
          <p className="text-3xl font-bold text-[color:var(--color-card-foreground)]">
            42
          </p>
        </div>
        <div className="bg-[color:var(--color-card)] p-6 rounded-xl border border-[color:var(--color-border)] shadow-sm">
          <h3 className="text-sm font-medium text-[color:var(--color-muted-foreground)] mb-1">
            Total Likes
          </h3>
          <p className="text-3xl font-bold text-[color:var(--color-card-foreground)]">
            890
          </p>
        </div>
      </div>

      <div className="bg-[color:var(--color-card)] p-6 rounded-xl border border-[color:var(--color-border)] shadow-sm min-h-[400px]">
        <h3 className="text-lg font-semibold mb-4 text-[color:var(--color-card-foreground)]">
          Recent Activity
        </h3>
        <p className="text-[color:var(--color-muted-foreground)] text-sm">
          Activity feed will be connected to Supabase.
        </p>
      </div>
    </div>
  );
}
