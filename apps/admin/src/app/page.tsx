export default function AdminDashboard() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h2>
        <p className="text-gray-500 mt-2">
          Manage your blog content and view analytics.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Total Views
          </h3>
          <p className="text-3xl font-bold text-blue-600">12,408</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Total Posts
          </h3>
          <p className="text-3xl font-bold">42</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">
            Total Likes
          </h3>
          <p className="text-3xl font-bold">890</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
        <p className="text-gray-500 text-sm">
          Activity feed will be connected to Supabase.
        </p>
      </div>
    </div>
  );
}
