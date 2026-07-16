import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Fungsi untuk mengecek menu mana yang sedang aktif
  const isActive = (path) => location.pathname === path;

  // Gaya untuk menu aktif dan tidak aktif
  const baseMenuClass = "flex items-center gap-3 p-3 rounded-xl transition-all font-medium text-sm ";
  const activeMenuClass = baseMenuClass + "bg-green-100 text-green-700";
  const inactiveMenuClass = baseMenuClass + "text-gray-500 hover:bg-gray-100";

  return (
    <div className="w-64 bg-white border-r border-gray-100 flex flex-col justify-between min-h-screen p-6 fixed">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-green-600 p-2 rounded-lg text-white">
            {/* Ikon Heartbeat sederhana */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800">HealthLog</h1>
        </div>

        {/* Menu Navigasi */}
        <nav className="space-y-2">
          <Link to="/dashboard" className={isActive('/dashboard') ? activeMenuClass : inactiveMenuClass}>
            Dashboard
          </Link>
          <Link to="/riwayat" className={isActive('/riwayat') ? activeMenuClass : inactiveMenuClass}>
            Riwayat
          </Link>
          <Link to="/artikel" className={isActive('/artikel') ? activeMenuClass : inactiveMenuClass}>
            Artikel
          </Link>
        </nav>
      </div>

      {/* Tombol Logout */}
      <button 
        onClick={() => navigate('/login')} 
        className="flex items-center gap-3 p-3 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all font-medium text-sm w-full"
      >
        Logout
      </button>
    </div>
  );
}