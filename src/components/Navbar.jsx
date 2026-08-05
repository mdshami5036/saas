import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Printer, LogOut, ShieldAlert, LayoutDashboard, QrCode, Menu, X } from 'lucide-react';

export default function Navbar({ tenant, isAdmin, onShowQr }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('tenant_token');
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact Us', path: '/contact' },
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms', path: '/terms-conditions' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Printer className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
              WevePrint
            </span>
          </div>
        </Link>

        {/* Center: Desktop Navigation Bar */}
        {!tenant && !isAdmin && (
          <nav className="hidden lg:flex items-center space-x-6 text-xs sm:text-sm font-semibold">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`transition-colors py-1 ${
                    isActive
                      ? 'text-cyan-400 font-extrabold border-b-2 border-cyan-400'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          {tenant && (
            <>
              <button
                onClick={onShowQr}
                className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium border border-slate-700 transition-colors"
              >
                <QrCode className="w-4 h-4 text-cyan-400" />
                <span>Show Counter QR</span>
              </button>

              <Link
                to="/dashboard"
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-semibold transition-colors shadow-md shadow-cyan-600/20"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          )}

          {isAdmin && (
            <>
              <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-950/80 text-amber-400 border border-amber-800 text-xs font-bold">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>SUPER ADMIN</span>
              </span>

              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          )}

          {!tenant && !isAdmin && (
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Link
                to="/login"
                className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-extrabold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/25 transition-all hover:scale-[1.02]"
              >
                Register Cafe
              </Link>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                title="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && !tenant && !isAdmin && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-2 animate-fadeIn">
          {navLinks.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                location.pathname === item.path
                  ? 'bg-cyan-500/10 text-cyan-400 font-extrabold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
