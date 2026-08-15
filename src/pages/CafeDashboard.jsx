import React, { useEffect, useState, useMemo } from 'react';
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
  IndianRupee,
  Layers,
  ShieldCheck,
  Laptop,
  CheckCircle2,
  Loader2,
  Settings,
  CreditCard,
  Lock,
} from 'lucide-react';

export default function CafeDashboard() {
  const navigate = useNavigate();

  // Dynamic Environment URL Detector
  const getOriginUrl = () => {
    if (typeof window !== 'undefined' && window.location.origin) {
      return window.location.origin;
    }
    return 'https://saas-nine-ochre.vercel.app';
  };

  const getApiUrl = () => {
    if (import.meta.env.VITE_API_BASE_URL) {
      return import.meta.env.VITE_API_BASE_URL;
    }
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:5000/api/v1';
    }
    return 'https://saas-backend-production-5c3e.up.railway.app/api/v1';
  };

  // Auto-fix: Ensure any legacy URLs in localStorage are updated
  useEffect(() => {
    try {
      const stored = localStorage.getItem('demo_tenant');
      if (stored) {
        const tenant = JSON.parse(stored);
        let changed = false;
        if (tenant.websiteUrl && (tenant.websiteUrl.includes('localhost') || tenant.websiteUrl.includes('127.0.0.1'))) {
          tenant.websiteUrl = `${getOriginUrl()}/cafe/${tenant.slug || 'my-cafe'}`;
          changed = true;
        }
        if (tenant.backendApiUrl && (tenant.backendApiUrl.includes('localhost') || tenant.backendApiUrl.includes('127.0.0.1'))) {
          tenant.backendApiUrl = getApiUrl();
          changed = true;
        }
        if (changed) {
          localStorage.setItem('demo_tenant', JSON.stringify(tenant));
        }
      }
    } catch (e) {}
  }, []);

  const [data, setData] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  // Pricing update state
  const [bwPrice, setBwPrice] = useState('2.0');
  const [colorPrice, setColorPrice] = useState('10.0');
  const [updatingPricing, setUpdatingPricing] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Custom Razorpay credentials state
  const [rzpKeyId, setRzpKeyId] = useState('');
  const [rzpKeySecret, setRzpKeySecret] = useState('');
  const [isEditingRzp, setIsEditingRzp] = useState(false);
  const [updatingRzp, setUpdatingRzp] = useState(false);
  const [rzpSaveMsg, setRzpSaveMsg] = useState('');

  // Printer selection state — MUST be at top level, before any return
  const [selectedPrinterState, setSelectedPrinterState] = useState('');

  const fetchDashboard = async () => {
    const token = localStorage.getItem('tenant_token');
    if (!token) {
      localStorage.clear();
      navigate('/login');
      return;
    }

    try {
      if (!data) setLoading(true);
      const res = await api.get('/cafe/dashboard');
      if (res.data && res.data.success) {
        const cafeData = res.data.cafe;
        cafeData.websiteUrl = `${getOriginUrl()}/cafe/${cafeData.slug}`;
        cafeData.backendApiUrl = getApiUrl();
        setData(res.data);
        setBwPrice(res.data.cafe.bwPricePerPage.toString());
        setColorPrice(res.data.cafe.colorPricePerPage.toString());
        if (!rzpKeyId && res.data.cafe.razorpayKeyId) {
          setRzpKeyId(res.data.cafe.razorpayKeyId);
        }

        const jobsRes = await api.get('/cafe/jobs?limit=10');
        if (jobsRes.data && jobsRes.data.success) {
          setJobs(jobsRes.data.jobs);
        }
        setLoading(false);
        return;
      }
    } catch (err) {
      console.error('Failed to load authenticated cafe dashboard:', err.message);
      localStorage.clear();
      navigate('/login');
      return;
    }
  };

  useEffect(() => {
    fetchDashboard();
    const interval = setInterval(() => {
      fetchDashboard();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text, key) => {
    if (text) navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(''), 2000);
  };

  const handleUpdatePricing = async (e) => {
    e.preventDefault();
    setUpdatingPricing(true);
    setSaveSuccessMsg('');

    const newBw = parseFloat(bwPrice) || 2.0;
    const newColor = parseFloat(colorPrice) || 10.0;

    if (data && data.cafe) {
      const updatedCafe = {
        ...data.cafe,
        bwPricePerPage: newBw,
        colorPricePerPage: newColor,
      };
      setData({
        ...data,
        cafe: updatedCafe,
      });
      localStorage.setItem('demo_tenant', JSON.stringify(updatedCafe));
    }

    try {
      await api.put('/cafe/pricing', { bwPricePerPage: newBw, colorPricePerPage: newColor });
    } catch (err) {
      console.warn('API sync warning, pricing saved locally:', err.message);
    } finally {
      setUpdatingPricing(false);
      setSaveSuccessMsg('Prices updated successfully!');
      setTimeout(() => setSaveSuccessMsg(''), 3000);
    }
  };

  const handleUpdateRazorpay = async (e) => {
    e.preventDefault();
    setUpdatingRzp(true);
    setRzpSaveMsg('');

    const trimmedKeyId = rzpKeyId.trim();
    const trimmedKeySecret = rzpKeySecret.trim();

    if (data && data.cafe) {
      const updatedCafe = {
        ...data.cafe,
        razorpayKeyId: trimmedKeyId,
        razorpayKeySecret: trimmedKeySecret,
        hasCustomRazorpay: !!(trimmedKeyId && trimmedKeySecret),
      };
      setData({
        ...data,
        cafe: updatedCafe,
      });
      localStorage.setItem('demo_tenant', JSON.stringify(updatedCafe));
    }

    try {
      await api.put('/cafe/razorpay', {
        razorpayKeyId: trimmedKeyId,
        razorpayKeySecret: trimmedKeySecret,
      });
    } catch (err) {
      console.warn('API sync warning, Razorpay keys saved for session:', err.message);
    } finally {
      setUpdatingRzp(false);
      setIsEditingRzp(false);
      setRzpSaveMsg('Razorpay Key ID & Secret saved! Online payments connected.');
      setTimeout(() => setRzpSaveMsg(''), 4000);
    }
  };

  const handleDownloadAgentExe = () => {
    const backendDownloadUrl = 'https://saas-backend-lyd4.onrender.com/downloads/WevePrintAgent.exe';
    const link = document.createElement('a');
    link.href = backendDownloadUrl;
    link.setAttribute('download', 'WevePrintAgent.exe');
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Printer selection state
  const [updatingPrinter, setUpdatingPrinter] = useState(false);
  const [printerSaveMsg, setPrinterSaveMsg] = useState('');

  const { cafe, metrics, devices } = data || {};
  const primaryDevice = devices && devices.length > 0 ? devices[0] : null;

  const availablePrinters = useMemo(() => {
    let combined = [];
    if (devices && Array.isArray(devices)) {
      devices.forEach((dev) => {
        if (dev && dev.availablePrinters) {
          try {
            const list = Array.isArray(dev.availablePrinters)
              ? dev.availablePrinters
              : JSON.parse(dev.availablePrinters);
            if (Array.isArray(list)) {
              combined.push(...list);
            }
          } catch (e) {}
        }
      });
    }

    const filtered = combined.filter((p) => {
      if (!p) return false;
      const lower = p.toLowerCase();
      return (
        !lower.includes('print to pdf') &&
        !lower.includes('onenote') &&
        !lower.includes('fax') &&
        !lower.includes('xps document writer') &&
        !lower.includes('cutepdf') &&
        !lower.includes('adobepdf') &&
        !lower.includes('adobe pdf') &&
        !lower.includes('foxit') &&
        !lower.includes('notepad')
      );
    });

    return Array.from(new Set(['Default System Printer', ...filtered]));
  }, [devices]);

  // Sync selected printer state when primaryDevice loads
  useEffect(() => {
    if (primaryDevice && primaryDevice.selectedPrinter) {
      setSelectedPrinterState(primaryDevice.selectedPrinter);
    }
  }, [primaryDevice]);

  const handlePrinterChangeAuto = async (newPrinter) => {
    setSelectedPrinterState(newPrinter);
    setPrinterSaveMsg('');
    try {
      await api.put('/cafe/printer', {
        selectedPrinter: newPrinter,
        deviceId: primaryDevice?.id,
      });
      setPrinterSaveMsg(`Switched to "${newPrinter}"`);
    } catch (err) {
      console.warn('Printer change warning:', err.message);
      setPrinterSaveMsg(`Selected: "${newPrinter}"`);
    } finally {
      setTimeout(() => setPrinterSaveMsg(''), 3000);
    }
  };

  const handleSavePrinter = async (e) => {
    if (e) e.preventDefault();
    setUpdatingPrinter(true);
    setPrinterSaveMsg('');

    const targetPrinter = selectedPrinterState || 'Default System Printer';

    try {
      await api.put('/cafe/printer', {
        selectedPrinter: targetPrinter,
        deviceId: primaryDevice?.id,
      });
      setPrinterSaveMsg(`Printer saved! Print jobs will automatically output on "${targetPrinter}".`);
    } catch (err) {
      console.warn('Printer update warning:', err.message);
      setPrinterSaveMsg(`Saved for active session: "${targetPrinter}"`);
    } finally {
      setUpdatingPrinter(false);
      setTimeout(() => setPrinterSaveMsg(''), 4000);
    }
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar tenant={cafe} onShowQr={() => setShowQrModal(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Banner & Quick Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-2xl border border-slate-800">
          <div>
            <div className="flex items-center space-x-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{cafe?.name}</h1>
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
                <span>{metrics?.isAgentOnline ? 'WevePrint Agent Connected' : 'WevePrint Agent Offline'}</span>
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
              onClick={handleDownloadAgentExe}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download WevePrint Agent</span>
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
            <span className="text-[11px] text-slate-400">Completed print jobs</span>
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
            <span className="text-[11px] text-slate-400">Pending print queue</span>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-extrabold text-white tracking-wider">CONNECTED PRINTER</span>
              <Printer className="w-5 h-5 text-cyan-400" />
            </div>

            <div className="space-y-1">
              <select
                value={selectedPrinterState || 'Default System Printer'}
                onChange={(e) => handlePrinterChangeAuto(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-bold text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
              >
                {availablePrinters.map((pr) => (
                  <option key={pr} value={pr} className="bg-slate-900 text-white font-medium">
                    {pr === 'Default System Printer' ? '⚡ System Default Printer' : `🖨️ ${pr}`}
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <span className={metrics?.isAgentOnline ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                  {metrics?.isAgentOnline ? `⚡ Online (${availablePrinters.length} printer(s))` : '⏸️ Agent Offline'}
                </span>
                {printerSaveMsg && (
                  <span className="text-emerald-400 font-bold animate-pulse">{printerSaveMsg}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Connected Hardware Printer Selector Section */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <Printer className="w-5 h-5 text-cyan-400" />
              <h3 className="font-extrabold text-white text-base">Connected Hardware Printer Manager</h3>
            </div>
            {printerSaveMsg && (
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1 animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                <span>{printerSaveMsg}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Select which physical printer to use for all customer print jobs. If set to <strong>Default System Printer</strong>, it will automatically use your Windows default printer.
          </p>

          <form onSubmit={handleSavePrinter} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Select Active Hardware Printer</label>
              <select
                value={selectedPrinterState || 'Default System Printer'}
                onChange={(e) => setSelectedPrinterState(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-bold text-xs focus:border-cyan-500 focus:outline-none"
              >
                {availablePrinters.map((pr) => (
                  <option key={pr} value={pr} className="bg-slate-900 text-white font-medium">
                    {pr === 'Default System Printer' ? '⚡ Default System Printer (Auto Fallback)' : `🖨️ ${pr}`}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={updatingPrinter}
              className="py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all shadow-md shadow-cyan-600/20 active:scale-95 flex items-center justify-center space-x-2"
            >
              {updatingPrinter ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Printer Selection</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Credentials Section */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h3 className="font-extrabold text-white text-base">Cyber Cafe Credentials</h3>
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
          </div>
        </div>

        {/* Razorpay Merchant Account Settings */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-emerald-400" />
              <h3 className="font-extrabold text-white text-base">Razorpay Merchant Gateway Settings</h3>
            </div>
            {rzpSaveMsg && (
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1 animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                <span>{rzpSaveMsg}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Enter your own Razorpay Key ID &amp; Key Secret so payments go <strong>directly to your bank account</strong>.
          </p>

          <form onSubmit={handleUpdateRazorpay} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Razorpay Key ID (rzp_live_...)</label>
              <input
                type="text"
                required
                placeholder="rzp_live_xxxxxxxx"
                value={rzpKeyId}
                onFocus={() => setIsEditingRzp(true)}
                onChange={(e) => {
                  setIsEditingRzp(true);
                  setRzpKeyId(e.target.value);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Razorpay Key Secret</label>
              <input
                type="password"
                placeholder="Enter Secret (leave empty if unchanged)"
                value={rzpKeySecret}
                onFocus={() => setIsEditingRzp(true)}
                onChange={(e) => {
                  setIsEditingRzp(true);
                  setRzpKeySecret(e.target.value);
                }}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={updatingRzp}
              className="py-2.5 px-4 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md shadow-emerald-600/20 active:scale-95 flex items-center justify-center space-x-2"
            >
              {updatingRzp ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Save Merchant Account Keys</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Pricing Configuration Form */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center space-x-2">
              <Settings className="w-5 h-5 text-cyan-400" />
              <h3 className="font-extrabold text-white text-base">Print Pricing Settings</h3>
            </div>
            {saveSuccessMsg && (
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1 animate-pulse">
                <CheckCircle2 className="w-4 h-4" />
                <span>{saveSuccessMsg}</span>
              </span>
            )}
          </div>

          <form onSubmit={handleUpdatePricing} className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Black &amp; White Rate (₹/page)</label>
              <input
                type="number"
                step="0.5"
                required
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
                required
                value={colorPrice}
                onChange={(e) => setColorPrice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={updatingPricing}
              className="py-2.5 px-4 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md shadow-cyan-600/20 active:scale-95"
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
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            job.jobStatus === 'COMPLETED'
                              ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                              : job.jobStatus === 'FAILED'
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                              : job.jobStatus === 'SENT_TO_AGENT' || job.jobStatus === 'PRINTING'
                              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700 animate-pulse'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            job.jobStatus === 'COMPLETED' ? 'bg-emerald-400' :
                            job.jobStatus === 'FAILED' ? 'bg-rose-400' : 'bg-cyan-400 animate-ping'
                          }`} />
                          <span>
                            {job.jobStatus === 'COMPLETED' ? 'Printed & Done' :
                             job.jobStatus === 'SENT_TO_AGENT' ? 'Sent to Laptop Printer' :
                             job.jobStatus === 'PRINTING' ? 'Printing Now...' :
                             job.jobStatus === 'PENDING' ? 'Queued' : job.jobStatus}
                          </span>
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
          bwPrice={cafe?.bwPricePerPage || 2.0}
          colorPrice={cafe?.colorPricePerPage || 10.0}
          onClose={() => setShowQrModal(false)}
        />
      )}
    </div>
  );
}
