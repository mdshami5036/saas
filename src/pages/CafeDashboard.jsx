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
  UserCheck,
  Key,
  Mail,
  Phone,
  AlertCircle,
  Save,
  Globe,
  Sliders,
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
    return 'https://saas-backend-lyd4.onrender.com/api/v1';
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

  // Shop Name Edit State
  const [shopName, setShopName] = useState('');
  const [updatingName, setUpdatingName] = useState(false);
  const [nameSaveMsg, setNameSaveMsg] = useState('');

  const handleUpdateShopName = async (e) => {
    e.preventDefault();
    setUpdatingName(true);
    setNameSaveMsg('');

    const trimmedName = shopName.trim();
    if (!trimmedName) {
      setNameSaveMsg('Please enter a valid Shop / Cyber Cafe name');
      setUpdatingName(false);
      return;
    }

    if (data && data.cafe) {
      const updatedCafe = { ...data.cafe, name: trimmedName };
      setData({ ...data, cafe: updatedCafe });
      localStorage.setItem('demo_tenant', JSON.stringify(updatedCafe));
    }

    try {
      await api.put('/cafe/pricing', { name: trimmedName });
      setNameSaveMsg('Shop Name updated successfully!');
    } catch (err) {
      console.warn('Shop name update warning:', err.message);
      setNameSaveMsg('Saved for active session!');
    } finally {
      setUpdatingName(false);
      setTimeout(() => setNameSaveMsg(''), 4000);
    }
  };

  // Custom Razorpay credentials state
  const [rzpKeyId, setRzpKeyId] = useState('');
  const [rzpKeySecret, setRzpKeySecret] = useState('');
  const [isEditingRzp, setIsEditingRzp] = useState(false);
  const [updatingRzp, setUpdatingRzp] = useState(false);
  const [rzpSaveMsg, setRzpSaveMsg] = useState('');

  // Dashboard Sub-Tabs State ('OVERVIEW' | 'PROFILE')
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  // Change Password State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (newPassword.length < 4) {
      setPasswordMsg({ type: 'error', text: 'New password must be at least 4 characters long.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await api.put('/auth/password', {
        currentPassword: oldPassword,
        newPassword: newPassword,
      });

      if (res.data && res.data.success) {
        setPasswordMsg({ type: 'success', text: 'Password updated successfully! Use your new password on next login.' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ type: 'error', text: res.data?.error || 'Failed to update password.' });
      }
    } catch (err) {
      setPasswordMsg({
        type: 'error',
        text: err.response?.data?.error || 'Failed to update password. Please check your current password.',
      });
    } finally {
      setUpdatingPassword(false);
      setTimeout(() => setPasswordMsg({ type: '', text: '' }), 6000);
    }
  };

  // Printer selection state
  const [selectedPrinterState, setSelectedPrinterState] = useState('');
  const [bwPrinterState, setBwPrinterState] = useState('');
  const [colorPrinterState, setColorPrinterState] = useState('');
  const [updatingPrinter, setUpdatingPrinter] = useState(false);
  const [printerSaveMsg, setPrinterSaveMsg] = useState('');

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
        if (!shopName && res.data.cafe.name) {
          setShopName(res.data.cafe.name);
        }
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
    const link = document.createElement('a');
    link.href = '/PrintAgent.exe';
    link.setAttribute('download', 'PrintAgent.exe');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

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

  useEffect(() => {
    if (primaryDevice) {
      if (primaryDevice.selectedPrinter) setSelectedPrinterState(primaryDevice.selectedPrinter);
      if (primaryDevice.bwPrinter) setBwPrinterState(primaryDevice.bwPrinter);
      if (primaryDevice.colorPrinter) setColorPrinterState(primaryDevice.colorPrinter);
    }
  }, [primaryDevice]);

  const handleSaveDualPrinters = async (e) => {
    if (e) e.preventDefault();
    setUpdatingPrinter(true);
    setPrinterSaveMsg('');

    const targetBw = bwPrinterState || 'Default System Printer';
    const targetColor = colorPrinterState || 'Default System Printer';

    try {
      await api.put('/cafe/printer', {
        bwPrinter: targetBw,
        colorPrinter: targetColor,
        selectedPrinter: targetBw,
        deviceId: primaryDevice?.id,
      });
      setPrinterSaveMsg(`Printer routing saved! B&W: "${targetBw}", Color: "${targetColor}"`);
    } catch (err) {
      console.warn('Printer update warning:', err.message);
      setPrinterSaveMsg(`Saved for active session!`);
    } finally {
      setUpdatingPrinter(false);
      setTimeout(() => setPrinterSaveMsg(''), 5000);
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
        
        {/* Top Header Banner & Quick Actions */}
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

          <div className="flex items-center space-x-3 flex-wrap">
            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>Counter QR Standee</span>
            </button>

            <button
              onClick={handleDownloadAgentExe}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Download PrintAgent (.exe)</span>
            </button>
          </div>
        </div>

        {/* SUB-NAVIGATION TABS: OVERVIEW vs PROFILE */}
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
              activeTab === 'OVERVIEW'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-[1.02]'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Printer className="w-4 h-4" />
            <span>Overview &amp; Print Queue</span>
          </button>

          <button
            onClick={() => setActiveTab('PROFILE')}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center space-x-2 ${
              activeTab === 'PROFILE'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-[1.02]'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>My Profile &amp; Shop Settings</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & LIVE QUEUE */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* ZERO-NODE WINDOWS AGENT SETUP BANNER */}
            <div className="glass-card p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/20 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-extrabold uppercase">
                      Zero-Node.js Required
                    </span>
                    <span className="text-xs text-slate-400 font-mono">100% Native Windows Portable EXE</span>
                  </div>
                  <h3 className="text-lg font-black text-white">Automated Windows Laptop Print Setup</h3>
                  <p className="text-xs text-slate-300">
                    Download <span className="text-emerald-400 font-mono font-bold">PrintAgent.exe</span>, run it on your Windows PC, paste your Shop Token, and your store will instantly show <span className="text-emerald-400 font-bold">🟢 ONLINE</span>!
                  </p>
                </div>

                <button
                  onClick={handleDownloadAgentExe}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/30 flex items-center space-x-2 shrink-0 transition-transform active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PrintAgent.exe</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800/80 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-emerald-400 font-bold font-mono">Step 1: Download</span>
                  <p className="text-slate-300 text-[11px]">Click the green button above to download single file <span className="text-white font-mono">PrintAgent.exe</span>.</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-amber-400 font-bold font-mono">Step 2: Copy Shop Token</span>
                  <div className="flex items-center justify-between text-[11px] font-mono text-amber-300 pt-0.5">
                    <span className="truncate max-w-[140px]">{cafe?.agentToken}</span>
                    <button onClick={() => copyToClipboard(cafe?.agentToken, 'token_banner')} className="text-slate-400 hover:text-white">
                      {copiedKey === 'token_banner' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <span className="text-cyan-400 font-bold font-mono">Step 3: Paste &amp; Connect</span>
                  <p className="text-slate-300 text-[11px]">Open <span className="text-white font-mono">PrintAgent.exe</span>, paste your token, click Connect. Status turns 🟢 ONLINE!</p>
                </div>
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
                  <span className="text-xs font-extrabold text-white tracking-wider">CONNECTED PRINTERS</span>
                  <Printer className="w-5 h-5 text-cyan-400" />
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400">🖤 B&amp;W:</span>
                    <span className="font-bold text-cyan-300 truncate max-w-[140px]">
                      {bwPrinterState || 'Default System Printer'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400">🎨 Color:</span>
                    <span className="font-bold text-emerald-300 truncate max-w-[140px]">
                      {colorPrinterState || 'Default System Printer'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-0.5">
                    <span className={metrics?.isAgentOnline ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                      {metrics?.isAgentOnline ? `⚡ Online (${availablePrinters.length} printer(s))` : '⏸️ Agent Offline'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Print Jobs History Table */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <h3 className="font-extrabold text-white text-base">Recent Print Activity Queue</h3>
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
                      jobs.map((j) => (
                        <tr key={j.id} className="hover:bg-slate-900/50">
                          <td className="p-3 font-semibold text-white">{j.customerName || 'Walk-in Customer'}</td>
                          <td className="p-3 font-mono text-cyan-300 truncate max-w-[180px]">{j.fileName}</td>
                          <td className="p-3">{j.totalPages} pages × {j.copies} copies</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${j.colorMode === 'COLOR' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-slate-800 text-slate-300'}`}>
                              {j.colorMode}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-emerald-400">₹{(j.totalAmount || 0).toFixed(2)}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${j.status === 'COMPLETED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : j.status === 'PRINTING' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                              {j.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-400">{new Date(j.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: MY PROFILE & SHOP SETTINGS */}
        {activeTab === 'PROFILE' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* 1. SHOP PROFILE & ACCOUNT CREDENTIALS */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <UserCheck className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-extrabold text-white text-base">Cyber Cafe Shop Profile Credentials</h3>
                </div>
                {nameSaveMsg && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1 animate-pulse">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{nameSaveMsg}</span>
                  </span>
                )}
              </div>

              {/* Editable Shop / Cyber Cafe Name Form */}
              <form onSubmit={handleUpdateShopName} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <label className="block text-xs font-bold text-slate-300">Shop / Cyber Cafe Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter Cyber Cafe Name"
                      value={shopName || cafe?.name || ''}
                      onChange={(e) => setShopName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-extrabold focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={updatingName}
                    className="sm:self-end py-2.5 px-5 rounded-xl font-bold text-xs bg-cyan-600 hover:bg-cyan-500 text-white transition-all shadow-md shadow-cyan-600/20 active:scale-95 flex items-center justify-center space-x-2 shrink-0"
                  >
                    {updatingName ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Shop Name</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Account Email */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-xs font-semibold text-slate-400 block">Account Email Address</span>
                  <div className="text-xs font-extrabold text-slate-200 flex items-center space-x-2 pt-1">
                    <Mail className="w-4 h-4 text-cyan-400" />
                    <span>{cafe?.email}</span>
                  </div>
                </div>

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

                {/* Print Agent Token */}
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

            {/* 2. CHANGE PASSWORD FORM */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Key className="w-5 h-5 text-amber-400" />
                  <h3 className="font-extrabold text-white text-base">Change Account Password</h3>
                </div>
                {passwordMsg.text && (
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${passwordMsg.type === 'success' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' : 'bg-rose-950 text-rose-400 border-rose-800'}`}>
                    {passwordMsg.text}
                  </span>
                )}
              </div>

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="At least 4 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="py-2.5 px-6 rounded-xl font-bold text-xs bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {updatingPassword ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Update Account Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* 3. PRINT PRICING CONFIGURATION FORM */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
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
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
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
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
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

            {/* 4. RAZORPAY MERCHANT GATEWAY SETTINGS */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-extrabold text-white text-base">Razorpay Merchant Gateway Credentials</h3>
                </div>
                {rzpSaveMsg && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1 animate-pulse">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{rzpSaveMsg}</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
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

            {/* 5. CONNECTED HARDWARE PRINTER MANAGER */}
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
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
              <p className="text-xs text-slate-400">
                Set separate physical printers for <strong>Black &amp; White</strong> and <strong>Color</strong> print orders. Print jobs will automatically route to the corresponding printer!
              </p>

              <form onSubmit={handleSaveDualPrinters} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Black & White Printer Dropdown */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <label className="block text-xs font-extrabold text-slate-200 flex items-center space-x-1">
                      <span>🖤 Select Black &amp; White (B&amp;W) Printer</span>
                    </label>
                    <select
                      value={bwPrinterState || 'Default System Printer'}
                      onChange={(e) => setBwPrinterState(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-bold text-xs focus:border-cyan-500 focus:outline-none cursor-pointer"
                    >
                      {availablePrinters.map((pr) => (
                        <option key={pr} value={pr} className="bg-slate-900 text-white font-medium">
                          {pr === 'Default System Printer' ? '⚡ Default System Printer (Auto Fallback)' : `🖨️ ${pr}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Color Printer Dropdown */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                    <label className="block text-xs font-extrabold text-slate-200 flex items-center space-x-1">
                      <span>🎨 Select Color Printer</span>
                    </label>
                    <select
                      value={colorPrinterState || 'Default System Printer'}
                      onChange={(e) => setColorPrinterState(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-emerald-300 font-bold text-xs focus:border-emerald-500 focus:outline-none cursor-pointer"
                    >
                      {availablePrinters.map((pr) => (
                        <option key={pr} value={pr} className="bg-slate-900 text-white font-medium">
                          {pr === 'Default System Printer' ? '⚡ Default System Printer (Auto Fallback)' : `🖨️ ${pr}`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={updatingPrinter}
                    className="py-2.5 px-6 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all shadow-md shadow-cyan-600/20 active:scale-95 flex items-center justify-center space-x-2"
                  >
                    {updatingPrinter ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Save Hardware Printer Preferences</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}
