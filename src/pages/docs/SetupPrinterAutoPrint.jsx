import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import SeoHead from '../../components/SeoHead';
import { Printer, Download, CheckCircle2, Settings, ArrowRight, Laptop } from 'lucide-react';

export default function SetupPrinterAutoPrint() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    'headline': 'How to Set Up Your Printer for Automatic Silent Printing in WevePrint',
    'description': 'Step-by-step setup guide for connecting Windows printers to WevePrint background agent software.',
    'author': { '@type': 'Organization', 'name': 'WevePrint' },
    'publisher': { '@type': 'Organization', 'name': 'WevePrint', 'logo': 'https://weveprint.netlify.app/favicon.png' },
    'mainEntityOfPage': 'https://weveprint.netlify.app/docs/setup-printer-auto-print',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SeoHead
        title="How to Set Up Your Printer for Auto Print – WevePrint Setup Guide"
        description="Learn how to install the WevePrint Windows Agent and configure automatic silent printing for Black & White and Color USB/Network printers."
        canonicalUrl="https://weveprint.netlify.app/docs/setup-printer-auto-print"
        jsonLd={jsonLd}
      />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-bold">
            <Printer className="w-4 h-4 text-emerald-400" />
            <span>Hardware Setup Guide</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            How to Set Up Your Printer for Auto Print
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Connect any USB or Network printer to WevePrint in less than 2 minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800 shrink-0">
              <Download className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Step 1: Download WevePrint Windows Agent</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Log into your Cyber Cafe Dashboard and click "Download WevePrint Agent". The agent is a lightweight background application designed for Windows 10 &amp; 11.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800 shrink-0">
              <Laptop className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Step 2: Enter Your Unique Token</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Copy your unique Print Agent Token (e.g. <code>ag_tenant_...</code>) from your dashboard and paste it into the agent setup screen.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800 shrink-0">
              <Settings className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Step 3: Select B&amp;W &amp; Color Hardware Printers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                In your dashboard under "Connected Hardware Printer Manager", select which physical printer handles Black &amp; White jobs and which handles Color jobs.
              </p>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-start space-x-4">
            <div className="p-3 rounded-xl bg-amber-950 text-amber-400 border border-amber-800 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Step 4: Automatic Background Output</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                That's it! As soon as a customer pays online, the document automatically prints out from your chosen printer instantly without clicking anything!
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="glass-card p-8 rounded-2xl border border-slate-800 text-center space-y-4">
          <h3 className="text-xl font-extrabold text-white">Connect Your Shop Printer Today</h3>
          <Link
            to="/login"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/25"
          >
            <span>Log In to Cafe Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
