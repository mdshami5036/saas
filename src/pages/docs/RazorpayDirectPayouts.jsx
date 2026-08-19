import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import SeoHead from '../../components/SeoHead';
import { CreditCard, ShieldCheck, Banknote, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RazorpayDirectPayouts() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    'headline': 'How Razorpay Integration Works in WevePrint for Direct Bank Payouts',
    'description': 'Comprehensive guide explaining how WevePrint integrates directly with shop owners Razorpay API keys for instant payouts.',
    'author': { '@type': 'Organization', 'name': 'WevePrint' },
    'publisher': { '@type': 'Organization', 'name': 'WevePrint', 'logo': 'https://weveprint.netlify.app/favicon.png' },
    'mainEntityOfPage': 'https://weveprint.netlify.app/docs/razorpay-direct-payouts',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SeoHead
        title="How Razorpay Integration Works – Direct Bank Payouts | WevePrint"
        description="Understand how WevePrint connects with your Razorpay Key ID & Key Secret so customer print payments go 100% directly to your bank account."
        canonicalUrl="https://weveprint.netlify.app/docs/razorpay-direct-payouts"
        jsonLd={jsonLd}
      />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800 text-xs font-bold">
            <CreditCard className="w-4 h-4 text-indigo-400" />
            <span>Direct Payment Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Direct Bank Payouts via Razorpay
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            No middleman fees or delayed withdrawals. 100% of customer payments land directly in your own bank account.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Your Bank Account</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Payments processed during QR printing are deposited directly into your linked bank account via your Razorpay account.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
            <CreditCard className="w-8 h-8 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Custom Merchant Keys</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enter your Razorpay <code>Key ID</code> and <code>Key Secret</code> once in your WevePrint dashboard settings.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-2">
            <Banknote className="w-8 h-8 text-amber-400" />
            <h3 className="text-base font-bold text-white">Zero Commission Traps</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              WevePrint does not hold your customer payment funds or charge hidden transaction markups.
            </p>
          </div>
        </div>

        {/* Setup Steps */}
        <div className="glass-card p-8 rounded-2xl border border-slate-800 space-y-4">
          <h3 className="text-xl font-extrabold text-white">How to Enable Your Merchant Keys in 3 Steps:</h3>
          <ol className="space-y-3 text-xs text-slate-300 list-decimal list-inside leading-relaxed">
            <li>Log into your <strong>Razorpay Dashboard</strong> (dashboard.razorpay.com) and go to Settings → API Keys.</li>
            <li>Generate your <strong>Key ID</strong> (starts with <code>rzp_live_...</code>) and copy the Secret Key.</li>
            <li>In your <strong>WevePrint Dashboard</strong>, navigate to "Razorpay Merchant Gateway Settings", paste your Key ID &amp; Key Secret, and click Save.</li>
          </ol>
        </div>

        {/* CTA */}
        <div className="glass-card p-8 rounded-2xl border border-slate-800 text-center space-y-4">
          <h3 className="text-xl font-extrabold text-white">Start Receiving Direct Payments</h3>
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/25"
          >
            <span>Configure Razorpay Keys in Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
