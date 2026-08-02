import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import { ShieldCheck, Store, Printer, IndianRupee, Laptop, Power, RefreshCw, Loader2 } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Login form state
  const [email, setEmail] = useState('admin@autoprint.com');
  const [password, setPassword] = useState('admin123');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, cafesRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/cafes'),
      ]);

      if (statsRes.data.success) setStats(statsRes.data.stats);
      if (cafesRes.data.success) setCafes(cafesRes.data.cafes);
      setIsLoggedIn(true);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setIsLoggedIn(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('admin_token', res.data.token);
        fetchAdminData();
      }
    } catch (err) {
      alert('Admin Login failed: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'DISABLED' : 'ACTIVE';
    try {
      const res = await api.patch(`/admin/cafes/${id}/status`, { status: nextStatus });
      if (res.data.success) {
        fetchAdminData();
      }
    } catch (err) {
      alert('Status toggle failed');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-slate-800 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3 border border-amber-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">Super Admin Portal</h2>
              <p className="text-xs text-slate-400 mt-1">Platform management & Cyber Cafe controls</p>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg shadow-amber-500/25 transition-all"
              >
                Sign In as Super Admin
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar isAdmin={true} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Platform Super Admin</h1>
            <p className="text-xs text-slate-400">Monitor all registered Cyber Cafes & global metrics</p>
          </div>
          <button onClick={fetchAdminData} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Global Platform Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400">TOTAL CYBER CAFES</span>
            <h3 className="text-3xl font-extrabold text-white mt-1">{stats?.totalCafes || 0}</h3>
            <span className="text-[11px] text-emerald-400">{stats?.activeCafes || 0} Active</span>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400">TOTAL PLATFORM PRINTS</span>
            <h3 className="text-3xl font-extrabold text-cyan-400 mt-1">{stats?.totalPrintJobsCompleted || 0}</h3>
            <span className="text-[11px] text-slate-400">Pages printed across platform</span>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400">TOTAL REVENUE</span>
            <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">
              ₹{(stats?.totalPlatformRevenue || 0).toFixed(2)}
            </h3>
            <span className="text-[11px] text-slate-400">Platform earnings</span>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <span className="text-xs font-bold text-slate-400">ACTIVE ONLINE AGENTS</span>
            <h3 className="text-3xl font-extrabold text-indigo-400 mt-1">{stats?.activeOnlineDevices || 0}</h3>
            <span className="text-[11px] text-slate-400">Connected Windows laptops</span>
          </div>
        </div>

        {/* Cyber Cafes Management Table */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <h3 className="font-extrabold text-white text-base mb-4">Registered Cyber Cafes Directory</h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">Cyber Cafe Name</th>
                  <th className="p-3">Slug / URL</th>
                  <th className="p-3">Email / Phone</th>
                  <th className="p-3">Total Prints</th>
                  <th className="p-3">Device Status</th>
                  <th className="p-3">Account Status</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {cafes.map((cafe) => {
                  const device = cafe.devices && cafe.devices.length > 0 ? cafe.devices[0] : null;
                  return (
                    <tr key={cafe.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-semibold text-white">{cafe.name}</td>
                      <td className="p-3 font-mono text-cyan-300">{cafe.slug}</td>
                      <td className="p-3 text-slate-400">
                        {cafe.email}
                        {cafe.phone ? ` • ${cafe.phone}` : ''}
                      </td>
                      <td className="p-3 font-bold text-slate-200">{cafe._count?.printJobs || 0}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            device?.isOnline
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {device?.isOnline ? 'ONLINE' : 'OFFLINE'}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            cafe.status === 'ACTIVE'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {cafe.status}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleStatus(cafe.id, cafe.status)}
                          className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                            cafe.status === 'ACTIVE'
                              ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
                              : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {cafe.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
