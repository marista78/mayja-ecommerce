import React from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const SECTION_TITLES = {
  '/admin/dashboard': 'Resumen General',
  '/admin/inventario': 'Gestión de Inventario',
  '/admin/productos': 'Gestión de Productos',
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pageTitle = SECTION_TITLES[location.pathname] || 'Panel de Administración';

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar Profesional */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-2xl flex-shrink-0">
        <div className="p-8 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="bg-white text-slate-900 w-8 h-8 rounded flex items-center justify-center font-bold">M</div>
            <span className="text-white font-black uppercase tracking-tighter text-lg">Mayja Admin</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
              location.pathname === '/admin/dashboard' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white text-slate-400'
            }`}
          >
            📊 Resumen
          </Link>
          <Link
            to="/admin/inventario"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
              location.pathname === '/admin/inventario' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white text-slate-400'
            }`}
          >
            📋 Inventario
          </Link>
          <Link
            to="/admin/productos"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all font-medium text-sm ${
              location.pathname === '/admin/productos' ? 'bg-slate-800 text-white' : 'hover:bg-slate-800 hover:text-white text-slate-400'
            }`}
          >
            🏷️ Productos
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-all text-sm font-medium"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        {/* Header Superior Dinámico */}
        <header className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-10 sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800">{pageTitle}</h2>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
              Admin Mode
            </span>
          </div>
        </header>

        {/* Renderizado de páginas hijas */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;
