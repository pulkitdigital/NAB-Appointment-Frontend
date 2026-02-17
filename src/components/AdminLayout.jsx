//Frontend/src/components/AdminLayout.jsx
import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navigation = [
  {
    name: 'Dashboard',
    path: '/admin',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    name: 'Appointments',
    path: '/admin/appointments',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    name: 'CA Management',
    path: '/admin/ca',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    name: 'Settings',
    path: '/admin/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const BrandLogo = () => (
  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
    <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  </div>
);

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [tabletCollapsed, setTabletCollapsed] = useState(true);

  // Auto-close drawer on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && setMobileOpen(false);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const isActiveLink = (path) => location.pathname === path;

  const NavLink = ({ item, collapsed = false }) => (
    <Link
      to={item.path}
      title={collapsed ? item.name : undefined}
      className={`
        group flex items-center rounded-lg transition-all duration-150 relative
        ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}
        ${isActiveLink(item.path) ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-100'}
      `}
    >
      <span className={`flex-shrink-0 ${isActiveLink(item.path) ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`}>
        {item.icon}
      </span>
      {!collapsed && <span className="ml-3 text-sm font-semibold whitespace-nowrap">{item.name}</span>}
      {collapsed && (
        <span className="absolute left-full ml-2 px-2 py-1 text-xs font-semibold text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
          {item.name}
        </span>
      )}
    </Link>
  );

  const LogoutButton = ({ collapsed = false }) => (
    <button
      onClick={handleLogout}
      title={collapsed ? 'Logout' : undefined}
      className={`group flex items-center w-full rounded-lg transition-all duration-150 text-red-600 hover:bg-red-50 relative ${collapsed ? 'justify-center px-2 py-2.5' : 'px-3 py-2.5'}`}
    >
      <LogoutIcon />
      {!collapsed && <span className="ml-3 text-sm font-semibold">Logout</span>}
      {collapsed && (
        <span className="absolute left-full ml-2 px-2 py-1 text-xs font-semibold text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
          Logout
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── DESKTOP SIDEBAR (lg+) ── */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:z-50 lg:w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="flex items-center h-16 flex-shrink-0 px-6 gap-3 bg-gray-900 border-b border-gray-800">
          <BrandLogo />
          <h1 className="text-lg font-bold text-white">Admin Panel</h1>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => <NavLink key={item.path} item={item} />)}
        </nav>
        <div className="flex-shrink-0 border-t border-gray-200 p-3">
          {user?.email && (
            <div className="flex items-center gap-2 px-3 py-2 mb-1 rounded-lg bg-gray-50">
              <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-white uppercase">
                  {user.email.charAt(0)}
                </span>
              </div>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          )}
          <LogoutButton />
        </div>
      </aside>

      {/* ── TABLET SIDEBAR (md–lg) ── collapsible icon rail */}
      <aside className={`hidden md:flex lg:hidden flex-col fixed inset-y-0 z-50 bg-white border-r border-gray-200 shadow-sm transition-all duration-300 overflow-hidden ${tabletCollapsed ? 'w-16' : 'w-56'}`}>
        <div className={`flex items-center h-16 flex-shrink-0 bg-gray-900 border-b border-gray-800 overflow-hidden transition-all duration-300 ${tabletCollapsed ? 'justify-center px-0' : 'px-4 gap-3'}`}>
          <BrandLogo />
          {!tabletCollapsed && <h1 className="text-sm font-bold text-white whitespace-nowrap">Admin Panel</h1>}
        </div>
        <button
          onClick={() => setTabletCollapsed(!tabletCollapsed)}
          className="mx-auto mt-3 mb-1 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
        >
          <svg className={`w-4 h-4 transition-transform duration-300 ${tabletCollapsed ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto overflow-x-hidden">
          {navigation.map((item) => <NavLink key={item.path} item={item} collapsed={tabletCollapsed} />)}
        </nav>
        <div className="flex-shrink-0 border-t border-gray-200 p-2">
          {user?.email && (
            <div className={`flex items-center gap-2 mb-1 rounded-lg bg-gray-50 overflow-hidden transition-all duration-300 ${tabletCollapsed ? 'justify-center px-0 py-2' : 'px-3 py-2'}`}>
              <div
                className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0"
                title={tabletCollapsed ? user.email : undefined}
              >
                <span className="text-xs font-bold text-white uppercase">
                  {user.email.charAt(0)}
                </span>
              </div>
              {!tabletCollapsed && (
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              )}
              {tabletCollapsed && (
                <span className="absolute left-full ml-2 px-2 py-1 text-xs font-semibold text-white bg-gray-900 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 whitespace-nowrap z-50">
                  {user.email}
                </span>
              )}
            </div>
          )}
          <LogoutButton collapsed={tabletCollapsed} />
        </div>
      </aside>

      {/* ── MOBILE DRAWER (< md) ── */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              key="drawer"
              initial={{ x: -288 }} animate={{ x: 0 }} exit={{ x: -288 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative flex flex-col w-72 max-w-[85vw] bg-white shadow-2xl"
            >
              <div className="flex items-center h-16 flex-shrink-0 px-6 gap-3 bg-gray-900 border-b border-gray-800">
                <BrandLogo />
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="ml-auto flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => <NavLink key={item.path} item={item} />)}
              </nav>
              <div className="flex-shrink-0 border-t border-gray-200 p-3">
                {user?.email && (
                  <div className="flex items-center gap-2 px-3 py-2 mb-1 rounded-lg bg-gray-50">
                    <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-white uppercase">
                        {user.email.charAt(0)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                )}
                <LogoutButton />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── MAIN CONTENT ── */}
      <div className={`flex flex-col flex-1 min-w-0 w-full lg:pl-64 transition-all duration-300 ${tabletCollapsed ? 'md:pl-16' : 'md:pl-56'}`}>

        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-40 flex items-center h-16 bg-white border-b border-gray-200 shadow-sm px-4 gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Open menu"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <BrandLogo />
          <h1 className="text-base font-bold text-gray-900">Admin Panel</h1>
          <span className="ml-auto text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
            {navigation.find(n => n.path === location.pathname)?.name ?? 'Admin'}
          </span>
        </header>

        <main className="flex-1 min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;