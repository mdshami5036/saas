import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Printer, ShieldCheck, Zap, UserCheck, Code2, Mail, Award, Users } from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      {/* Background Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="anim-glow-orb absolute -top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-radial from-blue-600/20 to-transparent" />
        <div className="anim-glow-orb absolute top-1/3 -right-20 w-[550px] h-[550px] rounded-full bg-gradient-radial from-purple-600/15 to-transparent" />
      </div>

      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-12 space-y-12 relative z-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-extrabold uppercase tracking-wider">
            About WevePrint
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Revolutionizing Cloud Printing in India
          </h1>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            WevePrint is a next-generation self-service instant cloud printing platform designed for Cyber Cafes, Xerox Shops & Photostat Counters.
          </p>
        </div>

        {/* Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Instant Self-Service</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customers scan counter QR, upload PDF files directly from their phones, pay online via UPI, and collect prints in 30 seconds.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">100% Privacy First</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              No WhatsApp file sharing required. Documents are encrypted during transmission and automatically deleted immediately after printing.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Empowering Shops</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Eliminating manual labor, cash change hassles, and WhatsApp clutter so shop owners can serve 10x more customers effortlessly.
            </p>
          </div>
        </div>

        {/* Leadership & Credits */}
        <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
          <h2 className="text-2xl font-black text-white text-center">Leadership & Founders</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center border border-cyan-500/20 shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Director & Founder</span>
                <span className="text-base font-black text-white">Md Shami Ahmad</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 shrink-0">
                <Code2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Lead Developer</span>
                <span className="text-base font-black text-white">Md Shami Ahmad</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Strip */}
        <div className="text-center space-y-3 pt-4">
          <p className="text-xs text-slate-400">Have questions or want to partner with us?</p>
          <a
            href="mailto:weve.cyber@gmail.com"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 transition-all"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Us: weve.cyber@gmail.com</span>
          </a>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} WevePrint. All Rights Reserved.
      </footer>
    </div>
  );
}
