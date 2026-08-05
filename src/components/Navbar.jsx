import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Printer, LogOut, ShieldAlert, LayoutDashboard, QrCode, Mail } from 'lucide-react';

export default function Navbar({ tenant, isAdmin, onShowQr }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('tenant_token');
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-card border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Printer className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
              WevePrint
            </span>
          </div>
        </Link>

        <div className="flex items-center space-x-4">
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
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cafe Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/25 transition-all hover:scale-[1.02]"
              >
                Register Cafe
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
