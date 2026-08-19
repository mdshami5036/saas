import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import {
  ShieldCheck,
  Store,
  Printer,
  IndianRupee,
  Laptop,
  Power,
  RefreshCw,
  Loader2,
  FileText,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  BookOpen,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

// Default pre-built blogs for every tool category
const INITIAL_BLOGS = [
  {
    id: 'blog-pdf-merge-guide',
    title: 'How to Merge Multiple PDF Files Online for Free with WevePrint',
    category: 'PDF Tools',
    author: 'Super Admin',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Step-by-step guide to combining PDF documents in any custom order using HTML5 Drag & Drop client-side merger.',
    content: `Merging PDF documents is one of the most common tasks for students, office professionals, and cyber cafe users. With WevePrint PDF Merger, you can combine multiple PDF files into one clean document in seconds.\n\n### Why Choose WevePrint PDF Merger?\n1. **100% Client-Side Privacy**: Your files are processed inside your browser canvas. No server upload required!\n2. **Drag & Drop Reordering**: Easily re-arrange your PDF pages with drag & drop handles.\n3. **No File Size Limit**: Merge large PDF files without speed throttling.`,
    link: '/tools/merge-pdf',
  },
  {
    id: 'blog-image-compressor-guide',
    title: 'Top Ways to Compress JPG and PNG Images Without Losing Quality',
    category: 'Image Tools',
    author: 'Super Admin',
    date: '2026-08-19',
    readTime: '4 min read',
    excerpt: 'Learn how WevePrint Image Compressor reduces image file size by up to 80% with live quality controls.',
    content: `Large images slow down websites and take up valuable storage. Using WevePrint Image Compressor, you can shrink image file sizes instantly while maintaining high visual crispness.\n\n### Key Features:\n- Live quality slider (10% to 95% compression).\n- Real-time size comparison (MB saved).\n- 100% Free & Browser-based processing.`,
    link: '/tools/image-compressor',
  },
  {
    id: 'blog-upi-qr-generator',
    title: 'How to Generate Branded UPI & WhatsApp QR Codes for Cyber Cafes',
    category: 'QR Code Tools',
    author: 'Super Admin',
    date: '2026-08-19',
    readTime: '5 min read',
    excerpt: 'Create instant UPI payment QR codes and WhatsApp touchless chat QRs with custom logo integration.',
    content: `Modern Indian businesses and Cyber Cafes need fast, contactless payment and printing workflows. WevePrint QR Tools let you create instant UPI payment QRs (PhonePe, Paytm, Google Pay, BHIM) and custom logo QR codes in seconds.\n\n### Benefits for Business:\n- Instant direct payouts to your UPI VPA.\n- PNG & SVG HD downloads + Print standee feature.\n- Zero database logging for complete customer privacy.`,
    link: '/tools/upi-qr',
  },
  {
    id: 'blog-emi-calculator-guide',
    title: 'Complete Financial Guide: Loan EMI, GST & Mutual Fund SIP Calculators',
    category: 'Calculator Tools',
    author: 'Super Admin',
    date: '2026-08-19',
    readTime: '5 min read',
    excerpt: 'Calculate exact loan EMIs, GST tax breakdowns, and SIP mutual fund wealth growth locally.',
    content: `Financial planning made simple! WevePrint Calculator suite features 15 precise financial and math tools including EMI, GST, Simple & Compound Interest, SIP, SWP, and PPF calculators.\n\n### Features:\n- Instant mathematical formulas & detailed breakdowns.\n- 100% Client-side privacy.`,
    link: '/tools/emi-calculator',
  },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active admin tab: 'OVERVIEW' | 'CAFES' | 'BLOGS'
  const [activeTab, setActiveTab] = useState('OVERVIEW');

  // Login form state
  const [email, setEmail] = useState('7762839216');
  const [password, setPassword] = useState('Mdshami@5036');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Blog Management State
  const [blogs, setBlogs] = useState(() => {
    const saved = localStorage.getItem('weveprint_blogs');
    return saved ? JSON.parse(saved) : INITIAL_BLOGS;
  });

  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('PDF Tools');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogLink, setBlogLink] = useState('/tools');
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [blogMsg, setBlogMsg] = useState('');

  // Save blogs to localStorage when updated
  useEffect(() => {
    localStorage.setItem('weveprint_blogs', JSON.stringify(blogs));
  }, [blogs]);

  const fetchAdminData = async () => {
    const adminToken = localStorage.getItem('admin_token');
    if (!adminToken) {
      setIsLoggedIn(false);
      setLoading(false);
      return;
    }

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
        localStorage.removeItem('admin_token');
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
    setIsSubmitting(true);
    setLoginError('');

    try {
      const res = await api.post('/admin/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('admin_token', res.data.token);
        await fetchAdminData();
      } else {
        setLoginError(res.data.error || 'Invalid Admin ID or Password');
      }
    } catch (err) {
      setLoginError(err.response?.data?.error || err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
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

  // Blog Handlers
  const handleSaveBlog = (e) => {
    e.preventDefault();
    if (!blogTitle || !blogContent) return;

    if (editingBlogId) {
      const updated = blogs.map((b) =>
        b.id === editingBlogId
          ? {
              ...b,
              title: blogTitle,
              category: blogCategory,
              excerpt: blogExcerpt,
              content: blogContent,
              link: blogLink,
            }
          : b
      );
      setBlogs(updated);
      setBlogMsg('Blog post updated successfully!');
    } else {
      const newPost = {
        id: `blog-${Date.now()}`,
        title: blogTitle,
        category: blogCategory,
        author: 'Super Admin',
        date: new Date().toISOString().split('T')[0],
        readTime: '4 min read',
        excerpt: blogExcerpt || blogTitle,
        content: blogContent,
        link: blogLink,
      };
      setBlogs([newPost, ...blogs]);
      setBlogMsg('New Blog post published live!');
    }

    setBlogTitle('');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogLink('/tools');
    setEditingBlogId(null);
    setTimeout(() => setBlogMsg(''), 4000);
  };

  const handleEditBlog = (post) => {
    setEditingBlogId(post.id);
    setBlogTitle(post.title);
    setBlogCategory(post.category);
    setBlogExcerpt(post.excerpt);
    setBlogContent(post.content);
    setBlogLink(post.link || '/tools');
  };

  const handleDeleteBlog = (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      setBlogs(blogs.filter((b) => b.id !== id));
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md glass-card rounded-2xl p-8 border border-slate-800 shadow-2xl space-y-6">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-3 border border-amber-500/20 shadow-lg shadow-amber-500/10">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">Super Admin Portal</h2>
              <p className="text-xs text-slate-400 mt-1">Platform management &amp; Cyber Cafe controls</p>
            </div>

            {loginError && (
              <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-bold text-center">
                ⚠️ {loginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Admin ID / Phone / Email</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 7762839216"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Admin Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-amber-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-extrabold text-sm bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg shadow-amber-500/25 transition-all active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Verifying Admin Credentials...</span>
                  </>
                ) : (
                  <span>Sign In as Super Admin</span>
                )}
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar isAdmin={true} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Platform Super Admin</h1>
            <p className="text-xs text-slate-400">Monitor Cyber Cafes, manage Blog articles &amp; platform metrics</p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                activeTab === 'OVERVIEW'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              Overview &amp; Cafes
            </button>
            <button
              onClick={() => setActiveTab('BLOGS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 ${
                activeTab === 'BLOGS'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Blog Manager ({blogs.length})</span>
            </button>
            <button onClick={fetchAdminData} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300">
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & CAFES */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8 animate-in fade-in duration-300">
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

            {/* Cyber Cafes Directory Table */}
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
          </div>
        )}

        {/* TAB 2: BLOG & CONTENT MANAGER */}
        {activeTab === 'BLOGS' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            
            {/* Create/Edit Blog Form */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="text-xl font-extrabold text-white flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-amber-400" />
                  <span>{editingBlogId ? 'Edit Blog Article' : 'Publish New Blog Article'}</span>
                </h3>
                {editingBlogId && (
                  <button
                    onClick={() => {
                      setEditingBlogId(null);
                      setBlogTitle('');
                      setBlogContent('');
                    }}
                    className="text-xs text-rose-400 hover:underline font-bold"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              {blogMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-bold">
                  ✅ {blogMsg}
                </div>
              )}

              <form onSubmit={handleSaveBlog} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-300 block mb-1">Blog Title:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. How to Convert JPG to PDF for Free"
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Category:</label>
                    <select
                      value={blogCategory}
                      onChange={(e) => setBlogCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:border-amber-500 focus:outline-none"
                    >
                      <option value="PDF Tools">PDF Tools</option>
                      <option value="Image Tools">Image Tools</option>
                      <option value="QR Code Tools">QR Code Tools</option>
                      <option value="Calculator Tools">Calculator Tools</option>
                      <option value="Guides">General Guides</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-300 block mb-1">Short Excerpt / Summary:</label>
                    <input
                      type="text"
                      placeholder="Brief overview of what this blog post covers..."
                      value={blogExcerpt}
                      onChange={(e) => setBlogExcerpt(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Target Tool Link:</label>
                    <input
                      type="text"
                      placeholder="e.g. /tools/merge-pdf"
                      value={blogLink}
                      onChange={(e) => setBlogLink(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Blog Article Content (Markdown supported):</label>
                  <textarea
                    rows={6}
                    required
                    placeholder="Write detailed guide content, steps, features, and advantages..."
                    value={blogContent}
                    onChange={(e) => setBlogContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-extrabold text-xs bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-lg shadow-amber-500/20 transition-all flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingBlogId ? 'Update Blog Post' : 'Publish Blog Post Live'}</span>
                </button>
              </form>
            </div>

            {/* Published Blogs List */}
            <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
              <h3 className="text-lg font-extrabold text-white">Live Published Blog Articles ({blogs.length})</h3>

              <div className="divide-y divide-slate-800/80">
                {blogs.map((item) => (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                          {item.category}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">{item.date}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{item.excerpt}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => handleEditBlog(item)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold flex items-center space-x-1"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-950 hover:bg-rose-900 text-rose-300 text-xs font-bold flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
