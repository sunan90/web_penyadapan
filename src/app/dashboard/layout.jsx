export default function DashboardLayout({ children }) {
  return (
    <div className="drawer lg:drawer-open">
      {/* Toggle input untuk drawer */}
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />

      {/* --- Content Area --- */}
      <div className="drawer-content flex flex-col min-h-screen bg-gray-50">
        {/* Tombol buka sidebar (tampil hanya di layar kecil) */}
        <div className="lg:hidden p-4">
          <label
            htmlFor="my-drawer-2"
            className="btn btn-outline btn-sm text-sm"
          >
            ☰ Menu
          </label>
        </div>

        {/* Konten halaman */}
        <div className="px-4 lg:px-6 pb-6">{children}</div>
      </div>

      {/* --- Sidebar Area --- */}
      <div className="drawer-side z-40">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <aside className="w-72 min-h-full bg-white border-r border-gray-200 shadow-md">
          <div className="p-6 text-2xl font-bold text-gray-800 border-b">🌿 Panel Penilai</div>

          <ul className="menu p-4 space-y-2 text-gray-700">
            <li>
              <a href="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/dashboard/penilaian" className="block px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                Penilaian
              </a>
            </li>
            <li>
              <a href="/dashboard/rekap" className="block px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                Rekap Penilaian
              </a>
            </li>
            <li>
              <a href="/dashboard/profile" className="block px-4 py-2 rounded-lg hover:bg-blue-100 transition">
                Profil
              </a>
            </li>
            <li>
              <a href="/logout" className="block px-4 py-2 rounded-lg text-red-500 hover:bg-red-100 transition">
                Logout
              </a>
            </li>
          </ul>
        </aside>
      </div>
    </div>
  );
}