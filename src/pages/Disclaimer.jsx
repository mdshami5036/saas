import React from 'react';
import SeoHead from '../components/SeoHead';
import Navbar from '../components/Navbar';
import { AlertCircle, FileText, ShieldAlert, Mail } from 'lucide-react';

export default function Disclaimer() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      <SeoHead
        title="Disclaimer – wevePrint Online Printing Service"
        description="Read the official Disclaimer for wevePrint online document printing platform."
        canonicalUrl="https://weveprint.netlify.app/disclaimer"
      />
      {/* Background Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="anim-glow-orb absolute -top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-radial from-amber-600/20 to-transparent" />
        <div className="anim-glow-orb absolute top-1/3 -right-20 w-[550px] h-[550px] rounded-full bg-gradient-radial from-cyan-600/15 to-transparent" />
      </div>

      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-extrabold uppercase tracking-wider">
            Legal Statement
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Disclaimer
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Last Updated: August 2026
          </p>
        </div>

        {/* Policy Content */}
        <div className="glass-card p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8 text-xs sm:text-sm leading-relaxed text-slate-300">
          
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-cyan-400" />
              <span>1. General Platform Information</span>
            </h2>
            <p>
              The information and services provided on <strong>WevePrint</strong> (developed & directed by Md Shami Ahmad) are intended for cloud print workflow automation between Cyber Cafe merchants and print customers. While we strive to maintain 99.9% platform availability, all services are provided on an "as-is" and "as-available" basis without warranties of any kind.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-amber-400" />
              <span>2. User Content & Document Disclaimer</span>
            </h2>
            <p>
              WevePrint operates strictly as an automated technical conduit for file transmission to local printers:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>Users are solely responsible for the authenticity, legality, and copyright compliance of any PDF documents uploaded for printing.</li>
              <li>WevePrint does not monitor, verify, edit, or endorse the contents of user-submitted print files.</li>
              <li>Any printing of counterfeit currency, forged identity documents, copyrighted materials, or illegal content is strictly forbidden and subject to law enforcement reporting by local shop owners.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>3. Limitation of Liability & Third-Party Services</span>
            </h2>
            <p>
              Under no circumstances shall WevePrint or its founder be held liable for:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>Hardware failures, paper jams, ink depletion, or mechanical faults occurring at individual merchant Cyber Cafe printers.</li>
              <li>Interruptions, delays, or payment processing errors caused by third-party UPI banking servers or Razorpay payment gateways.</li>
              <li>Data loss resulting from uncollected physical printouts left unattended at public shop counters.</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white">4. Contact & Inquiries</h2>
            <p>
              If you have any questions regarding this Disclaimer or platform policies, please contact us at:
            </p>
            <a
              href="mailto:weve.cyber@gmail.com"
              className="inline-flex items-center space-x-2 text-cyan-400 font-extrabold hover:underline"
            >
              <Mail className="w-4 h-4" />
              <span>weve.cyber@gmail.com</span>
            </a>
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} WevePrint. All Rights Reserved.
      </footer>
    </div>
  );
}
