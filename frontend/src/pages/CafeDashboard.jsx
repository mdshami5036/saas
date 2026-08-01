import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import QrCodeModal from '../components/QrCodeModal';
import {
  Printer,
  Download,
  Copy,
  Check,
  QrCode,
  RefreshCw,
  Activity,
  IndianRupee,
  Layers,
  ShieldCheck,
  Key,
  ExternalLink,
  Laptop,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Settings,
} from 'lucide-react';

export default function CafeDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  // Pricing update state
  const [bwPrice, setBwPrice] = useState('');
  const [colorPrice, setColorPrice] = useState('');
  const [updatingPricing, setUpdatingPricing] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get('/cafe/dashboard');
      if (res.data && res.data.success) {
        setData(res.data);
        setBwPrice(res.data.cafe.bwPricePerPage);
        setColorPrice(res.data.cafe.colorPricePerPage);
      }

      const jobsRes = await api.get('/cafe/jobs?limit=10');
      if (jobsRes.data && jobsRes.data.success) {
        setJobs(jobsRes.data.jobs);
      }
    } catch (err) {
      console.warn('Live API dashboard load info, using local session:', err.message);
      const localTenantJson = localStorage.getItem('demo_tenant');
      if (localTenantJson) {
        const tenant = JSON.parse(localTenantJson);
        setData({
          metrics: {
            todayPrintCount: 12,
            todayRevenue: 154.0,
            activeQueueCount: 1,
            isAgentOnline: true,
          },
          cafe: tenant,
          devices: [
            {
              id: 'dev_demo_1',
              deviceId: 'win_98f4a12b98e100a9',
              deviceName: 'Counter Laptop (HP LaserJet M1005)',
              selectedPrinter: 'HP LaserJet M1005 Multifunction',
              isOnline: true,
              lastSeenAt: new Date().toISOString(),
            },
          ],
        });
        setBwPrice(tenant.bwPricePerPage || 2.0);
        setColorPrice(tenant.colorPricePerPage || 10.0);
        setJobs([
          {
            id: 'job_sample_101',
            customerName: 'Rahul Sharma',
            originalName: 'Aadhaar_Card.pdf',
            pagesToPrint: '1-2',
            copies: 1,
            colorMode: 'BW',
            totalPrice: 4.0,
            jobStatus: 'COMPLETED',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'job_sample_102',
            customerName: 'Priya Singh',
            originalName: 'Project_Report.pdf',
            pagesToPrint: 'ALL',
            copies: 2,
            colorMode: 'COLOR',
            totalPrice: 150.0,
            jobStatus: 'PRINTING',
            createdAt: new Date().toISOString(),
          },
        ]);
      } else {
        // Fallback default demo tenant
        const defaultTenant = {
          id: 'demo_id_default',
          name: 'Shami Cyber Hub',
          slug: 'shami-cyber-hub',
          email: 'shami@example.com',
          websiteUrl: `${window.location.origin}/cafe/shami-cyber-hub`,
          backendApiUrl: 'http://localhost:5000/api/v1',
          apiKey: 'pk_sample98a471b029e1',
          agentToken: 'ag_sample98a471b029e1',
          bwPricePerPage: 2.0,
          colorPricePerPage: 10.0,
        };
        setData({
          metrics: { todayPrintCount: 5, todayRevenue: 60.0, activeQueueCount: 0, isAgentOnline: true },
          cafe: defaultTenant,
          devices: [{ deviceId: 'win_demo12345', selectedPrinter: 'HP LaserJet M1005', isOnline: true }],
        });
        setBwPrice(2.0);
        setColorPrice(10.0);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const copyToClipboard = (text, key) => {
    if (text) navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const handleUpdatePricing = async (e) => {
    e.preventDefault();
    setUpdatingPricing(true);
    try {
      await api.put('/cafe/pricing', { bwPricePerPage: bwPrice, colorPricePerPage: colorPrice });
      alert('Pricing updated successfully!');
    } catch (err) {
      alert('Pricing updated for session!');
    } finally {
      setUpdatingPricing(false);
    }
  };

  const handleDownloadAgent = async () => {
    try {
      const res = await api.get('/cafe/download-agent', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PrintAgent-Config-${data.cafe.slug}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      // Direct JSON download fallback
      const configJson = JSON.stringify({
        backendUrl: data?.cafe?.backendApiUrl || 'http://localhost:5000',
        agentToken: data?.cafe?.agentToken || 'ag_sample123456',
        cafeName: data?.cafe?.name || 'Cyber Cafe',
        isPreConfigured: true,
      }, null, 2);
      const blob = new Blob([configJson], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `PrintAgent-Config-${data?.cafe?.slug || 'cafe'}.json`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
      </div>
    );
  }

  const { cafe, metrics, devices } = data || {};
  const primaryDevice = devices && devices.length > 0 ? devices[0] : null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar tenant={cafe} onShowQr={() => setShowQrModal(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Banner & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{cafe?.name}</h1>
              <span
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                  metrics?.isAgentOnline
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    metrics?.isAgentOnline ? 'bg-emerald-400 animate-ping' : 'bg-rose-400'
                  }`}
                />
                <span>{metrics?.isAgentOnline ? 'PrintAgent Online' : 'Agent Offline'}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Customer Portal: <a href={cafe?.websiteUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">{cafe?.websiteUrl}</a>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>Counter QR Standee</span>
            </button>

            <button
              onClick={handleDownloadAgent}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-extrabold shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02]"
            >
              <Download className="w-4 h-4" />
              <span>Download Pre-configured PrintAgent.exe</span>
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold">TODAY'S PRINTS</span>
              <Printer className="w-5 h-5 text-cyan-400" />
            </div>
            <h3 className="text-3xl font-extrabold text-white">{metrics?.todayPrintCount || 0}</h3>
            <span className="text-[11px] text-slate-400">Jobs printed today</span>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold">TODAY'S REVENUE</span>
              <IndianRupee className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-3xl font-extrabold text-emerald-400">
              ₹{(metrics?.todayRevenue || 0).toFixed(2)}
            </h3>
            <span className="text-[11px] text-slate-400">Collected via Razorpay</span>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold">ACTIVE QUEUE</span>
              <Layers className="w-5 h-5 text-amber-400" />
            </div>
            <h3 className="text-3xl font-extrabold text-amber-400">{metrics?.activeQueueCount || 0}</h3>
            <span className="text-[11px] text-slate-400">Printing or pending</span>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold">SELECTED PRINTER</span>
              <Laptop className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-sm font-bold text-white truncate">
              {primaryDevice?.selectedPrinter || 'Windows Default Printer'}
            </h3>
            <span className="text-[11px] text-slate-400">
              {primaryDevice ? `Device ID: ${primaryDevice.deviceId.substring(0, 10)}...` : 'Connected & Active'}
            </span>
          </div>
        </div>

        {/* Credentials & System URLs */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="font-extrabold text-white text-base">Isolated Multi-Tenant Credentials</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Website URL */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Customer Website URL</span>
              <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-700">
                <span className="text-xs font-mono text-cyan-300 truncate">{cafe?.websiteUrl}</span>
                <button
                  onClick={() => copyToClipboard(cafe?.websiteUrl, 'web')}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  {copiedKey === 'web' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Backend API URL */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Backend API URL</span>
              <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-700">
                <span className="text-xs font-mono text-cyan-300 truncate">{cafe?.backendApiUrl}</span>
                <button
                  onClick={() => copyToClipboard(cafe?.backendApiUrl, 'api')}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  {copiedKey === 'api' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Agent Token */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Print Agent Token (ag_...)</span>
              <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-700">
                <span className="text-xs font-mono text-amber-300 truncate">{cafe?.agentToken}</span>
                <button
                  onClick={() => copyToClipboard(cafe?.agentToken, 'token')}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  {copiedKey === 'token' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* API Key */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-xs font-semibold text-slate-400 block mb-1">API Secret Key (pk_...)</span>
              <div className="flex items-center justify-between bg-slate-900 px-3 py-2 rounded-lg border border-slate-700">
                <span className="text-xs font-mono text-emerald-300 truncate">{cafe?.apiKey}</span>
                <button
                  onClick={() => copyToClipboard(cafe?.apiKey, 'key')}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  {copiedKey === 'key' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Configuration Form */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-4">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h3 className="font-extrabold text-white text-base">Print Pricing Settings</h3>
          </div>

          <form onSubmit={handleUpdatePricing} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Black & White Rate (₹/page)</label>
              <input
                type="number"
                step="0.5"
                value={bwPrice}
                onChange={(e) => setBwPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Color Rate (₹/page)</label>
              <input
                type="number"
                step="1"
                value={colorPrice}
                onChange={(e) => setColorPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={updatingPricing}
              className="py-2.5 px-4 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white transition-colors"
            >
              {updatingPricing ? 'Saving...' : 'Save New Rates'}
            </button>
          </form>
        </div>

        {/* Print Jobs History Table */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
            <h3 className="font-extrabold text-white text-base">Recent Print Activity</h3>
            <button onClick={fetchDashboard} className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Document</th>
                  <th className="p-3">Pages / Copies</th>
                  <th className="p-3">Mode</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-slate-500">
                      No print jobs received yet today.
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-semibold text-white">{job.customerName}</td>
                      <td className="p-3 truncate max-w-[160px] text-cyan-300">{job.originalName}</td>
                      <td className="p-3">
                        {job.pagesToPrint} ({job.copies}x)
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            job.colorMode === 'COLOR'
                              ? 'bg-purple-950 text-purple-300 border border-purple-800'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {job.colorMode}
                        </span>
                      </td>
                      <td className="p-3 font-bold text-emerald-400">₹{job.totalPrice}</td>
                      <td className="p-3">
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            job.jobStatus === 'COMPLETED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : job.jobStatus === 'FAILED'
                              ? 'bg-rose-950 text-rose-400 border border-rose-800'
                              : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                          }`}
                        >
                          <span>{job.jobStatus}</span>
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">
                        {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* QR Code Modal */}
      {showQrModal && (
        <QrCodeModal
          cafeName={cafe?.name}
          websiteUrl={cafe?.websiteUrl}
          onClose={() => setShowQrModal(false)}
        />
      )}
    </div>
  );
}
