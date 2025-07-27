export default function DashboardLayout({ children }) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      
      {/* Content Area */}
      <div className="drawer-content flex flex-col min-h-screen bg-gray-50">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <label htmlFor="my-drawer-2" className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </label>
            <h1 className="text-xl font-semibold text-gray-800">🌿 Panel Penilai</h1>
            <div className="w-6"></div> {/* Spacer untuk balance */}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-sm p-4 sm:p-6">
            {children}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 px-6 text-center text-sm text-gray-500 border-t">
          © {new Date().getFullYear()} Panel Penilai - Sistem Penilaian Pohon
        </footer>
      </div>

      {/* Sidebar */}
      <div className="drawer-side z-40">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <aside className="w-72 min-h-full bg-white border-r border-gray-200 flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <span className="text-green-600">🌿</span>
              <span>Panel Penilai</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">Sistem Penilaian Pohon</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {[
                { path: "/dashboard", icon: "📊", name: "Dashboard" },
                { path: "/dashboard/pohon", icon: "🌳", name: "Pohon" },
                { path: "/dashboard/rekap", icon: "📋", name: "Rekap Penilaian" },
                { path: "/dashboard/blok", icon: "🛣️", name: "Blok" },
                { path: "/dashboard/penyadap", icon: "👤", name: "Penyadap" },
              ].map((item) => (
                <li key={item.path}>
                  <a
                    href={item.path}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-green-50 hover:text-green-700 text-gray-700"
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            {/* <a
              href="/logout"
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all hover:bg-red-50 text-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="font-medium">Logout</span>
            </a> */}
          </div>
        </aside>
      </div>
    </div>
  );
}