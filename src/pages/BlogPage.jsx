import React from 'react';
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
  Lock,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Globe,
  Cpu,
} from 'lucide-react';

export default function BlogPage() {
  const articles = [
    {
      id: 'privacy-first-client-side-tools',
      title: 'Why Client-Side Browser Processing is the Future of Online PDF & Image Tools',
      date: 'August 19, 2026',
      author: 'WevePrint Engineering Team',
      category: 'Privacy & Tech',
      readTime: '4 min read',
      excerpt:
        'Discover how WevePrint processes your PDFs, Images, QR codes, and Financial Calculations 100% locally inside your web browser — guaranteeing zero data leakage and maximum speed.',
    },
    {
      id: 'weveprint-vs-ilovepdf-smallpdf',
      title: 'WevePrint vs iLovePDF & Smallpdf: Speed, Security & Privacy Comparison',
      date: 'August 18, 2026',
      author: 'WevePrint Product Team',
      category: 'Comparison',
      readTime: '5 min read',
      excerpt:
        'A comprehensive benchmark comparing WevePrint with legacy online file tools. Learn why local HTML5 Canvas and WASM execution beats cloud uploads every single time.',
    },
    {
      id: 'ultimate-qr-code-guide',
      title: 'The Ultimate Guide to Custom QR Codes for Businesses & Cyber Cafes',
      date: 'August 17, 2026',
      author: 'Growth & Business',
      category: 'Guides',
      readTime: '6 min read',
      excerpt:
        'How to generate WiFi, UPI payment, WhatsApp, and vCard QR codes with custom logos for instant touchless customer printing and payments.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SeoHead
        title="WevePrint Blog – High Performance PDF, Image, QR & Calculator Tools"
        description="Learn how WevePrint provides 100% private, client-side PDF tools, Image resizers, QR generators and calculators right inside your web browser."
        canonicalUrl="https://weveprint.netlify.app/blog"
      />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Blog Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-extrabold shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>WevePrint Tech &amp; Tools Insights</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            How WevePrint Empowers Millions with Fast, Private Browser Tools
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            In-depth technical guides, feature breakdowns, privacy architecture, and comparisons detailing why WevePrint is India's premier client-side web tools platform.
          </p>
        </div>

        {/* Featured Key Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-white">100% Zero-Server Upload Privacy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlike traditional converters that upload confidential documents to remote cloud servers, WevePrint executes all conversions, merges, and calculations locally on your CPU using HTML5 Canvas &amp; WebAssembly.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-white">Instant 10x Processing Speed</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Eliminate bandwidth wait times and file size limits! Your browser converts and processes files at native system speed without waiting for network file uploads or downloads.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-950 text-purple-400 border border-purple-800 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-base font-extrabold text-white">Comprehensive 4-in-1 Tool Suite</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Access 50+ specialized utilities spanning PDF Tools (Merge, Split, Extract), Image Tools (Compressor, Resizer, BG Remover), QR Code Tools (UPI, WiFi, Logo QR), and Financial Calculators (EMI, GST, SIP, PPF).
            </p>
          </div>
        </div>

        {/* Blog Articles Grid */}
        <div className="space-y-6 pt-6 border-t border-slate-800">
          <h2 className="text-2xl font-extrabold text-white">Latest Technical Articles &amp; Guides</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((item) => (
              <article
                key={item.id}
                className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 transition-all space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-extrabold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                      {item.category}
                    </span>
                    <span className="text-slate-500 font-mono">{item.readTime}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span>{item.author}</span>
                  <span className="text-cyan-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="glass-card p-8 sm:p-12 rounded-3xl border border-slate-800 text-center space-y-6 bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Experience the Fast, Private WevePrint Tools Suite?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            100% Free, no account registration required. Process your documents, images, QR codes, and calculations with total privacy.
          </p>
          <Link
            to="/tools"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-base shadow-xl shadow-cyan-500/25 transition-all hover:scale-105"
          >
            <span>Explore All 50+ Free Web Tools</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    </div>
  );
}
