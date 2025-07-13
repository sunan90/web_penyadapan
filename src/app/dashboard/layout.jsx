export default function DashboardLayout({ children }) {
  return   ( <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col p-6">
        {/* Page content here */}
        {children}
      </div>

      <div className="drawer-side">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <li className="mb-2 text-xl font-semibold">Menu</li>
          <li><a className="active">Dashboard</a></li>
          <li><a href="/dashboard/penilaian">Penilaian</a></li>
          <li><a href="/dashboard/rekap">Rekap Penilaian</a></li>
          <li><a href="/dashboard/profile">Profil</a></li>
          <li><a href="/logout" className="text-red-500">Logout</a></li>
        </ul>
      </div>
    </div>
    )
}