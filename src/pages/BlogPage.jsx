import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SeoHead from '../components/SeoHead';
import {
  FileText,
  Image,
  QrCode,
  Calculator,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  Globe,
  BookOpen,
  X,
  Search,
} from 'lucide-react';

const INITIAL_BLOGS = [
  {
    id: 'blog-pdf-merge-guide',
    title: 'How to Merge Multiple PDF Files Online for Free with WevePrint',
    category: 'PDF Tools',
    author: 'WevePrint Tech Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Step-by-step guide to combining PDF documents in any custom order using HTML5 Drag & Drop client-side merger.',
    content: `Merging PDF documents is one of the most common tasks for students, office professionals, and cyber cafe users. With WevePrint PDF Merger, you can combine multiple PDF files into one clean document in seconds.\n\n### Why Choose WevePrint PDF Merger?\n1. **100% Client-Side Privacy**: Your files are processed inside your browser canvas. No server upload required!\n2. **Drag & Drop Reordering**: Easily re-arrange your PDF pages with drag & drop handles.\n3. **No File Size Limit**: Merge large PDF files without speed throttling.\n\n### Step-by-Step Instructions:\n1. Select two or more PDF files from your computer or phone.\n2. Re-arrange pages in your desired sequence.\n3. Click **Merge PDF** and download your combined file instantly!`,
    link: '/tools/merge-pdf',
  },
  {
    id: 'blog-image-compressor-guide',
    title: 'Top Ways to Compress JPG and PNG Images Without Losing Quality',
    category: 'Image Tools',
    author: 'WevePrint Design Team',
    date: '2026-08-19',
    readTime: '4 min read',
    excerpt: 'Learn how WevePrint Image Compressor reduces image file size by up to 80% with live quality controls.',
    content: `Large images slow down websites and take up valuable storage. Using WevePrint Image Compressor, you can shrink image file sizes instantly while maintaining high visual crispness.\n\n### Key Advantages:\n- Live quality slider (10% to 95% compression).\n- Real-time size comparison (KB / MB saved).\n- 100% Free & Browser-based processing.`,
    link: '/tools/image-compressor',
  },
  {
    id: 'blog-upi-qr-generator',
    title: 'How to Generate Branded UPI & WhatsApp QR Codes for Cyber Cafes',
    category: 'QR Code Tools',
    author: 'WevePrint Growth Team',
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
    author: 'WevePrint Finance Team',
    date: '2026-08-19',
    readTime: '5 min read',
    excerpt: 'Calculate exact loan EMIs, GST tax breakdowns, and SIP mutual fund wealth growth locally.',
    content: `Financial planning made simple! WevePrint Calculator suite features 15 precise financial and math tools including EMI, GST, Simple & Compound Interest, SIP, SWP, and PPF calculators.\n\n### Features:\n- Instant mathematical formulas & detailed breakdowns.\n- 100% Client-side privacy.`,
    link: '/tools/emi-calculator',
  },
];

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('weveprint_blogs');
    if (saved) {
      setBlogs(JSON.parse(saved));
    } else {
      setBlogs(INITIAL_BLOGS);
    }
  }, []);

  const categories = ['All', 'PDF Tools', 'Image Tools', 'QR Code Tools', 'Calculator Tools', 'Guides'];

  const filteredBlogs = blogs.filter((b) => {
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SeoHead
        title="WevePrint Blog – Complete Guides for PDF, Image, QR & Calculator Tools"
        description="Explore in-depth technical blogs and step-by-step guides detailing how WevePrint tools process files 100% locally with maximum privacy."
        canonicalUrl="https://weveprint.netlify.app/blog"
      />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Blog Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-extrabold shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>WevePrint Official Blog &amp; Tool Guides</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Knowledge Hub for Fast, Private Web Tools
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Step-by-step tutorials, feature guides, and technical insights on using 50+ free client-side PDF, Image, QR Code, and Calculator utilities.
          </p>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-800">
          {/* Category Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search blog articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Blog Articles Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            No blog posts found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((item) => (
              <article
                key={item.id}
                className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 transition-all space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-extrabold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                      {item.category}
                    </span>
                    <span className="text-slate-500 font-mono">{item.date}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {item.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span className="text-slate-500">{item.author || 'WevePrint Team'}</span>
                  <button
                    onClick={() => setActiveArticle(item)}
                    className="text-cyan-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* FULL ARTICLE READER MODAL */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 text-slate-200 shadow-2xl relative">
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-xs font-bold">
                  <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {activeArticle.category}
                  </span>
                  <span className="text-slate-400">{activeArticle.date}</span>
                  <span className="text-slate-500">• {activeArticle.readTime}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                  {activeArticle.title}
                </h2>
              </div>

              <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed whitespace-pre-line border-t border-b border-slate-800/80 py-6">
                {activeArticle.content}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link
                  to={activeArticle.link || '/tools'}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-extrabold shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
                >
                  <span>Open Related Tool</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-bold"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
