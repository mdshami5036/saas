import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import SeoHead from '../../components/SeoHead';
import { QrCode, UploadCloud, CreditCard, Printer, ArrowRight } from 'lucide-react';

export default function HowQrPrintingWorks() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    'headline': 'How QR Code Document Printing Works in WevePrint',
    'description': 'A complete beginner-friendly guide to touchless QR code PDF printing for customers and print shops.',
    'author': { '@type': 'Organization', 'name': 'WevePrint' },
    'publisher': { '@type': 'Organization', 'name': 'WevePrint', 'logo': 'https://weveprint.netlify.app/favicon.png' },
    'mainEntityOfPage': 'https://weveprint.netlify.app/docs/how-qr-printing-works',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SeoHead
        title="How QR Code Printing Works – Complete Step-by-Step Guide | WevePrint"
        description="Learn how instant QR code document printing works with WevePrint. Customers scan a QR standee, upload PDFs, pay online, and documents print automatically at the shop."
        canonicalUrl="https://weveprint.netlify.app/docs/how-qr-printing-works"
        jsonLd={jsonLd}
      />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold">
            <QrCode className="w-4 h-4 text-cyan-400" />
            <span>Beginner-Friendly Guide</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            How Instant QR Document Printing Works
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
            Discover how WevePrint turns any traditional Cyber Cafe or print shop into a fully automated, touchless printing kiosk.
          </p>
        </div>

        {/* Step-by-Step Workflow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center font-extrabold border border-cyan-800">
              1
            </div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <QrCode className="w-5 h-5 text-cyan-400" />
              <span>1. Customer Scans QR Standee</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every registered shop receives a unique QR standee. Customers scan it with any smartphone camera—no mobile app download required!
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-extrabold border border-emerald-800">
              2
            </div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <UploadCloud className="w-5 h-5 text-emerald-400" />
              <span>2. Upload PDF &amp; Customization</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Customers choose their PDF, select Black &amp; White or Color, set copy count and specific page ranges with instant real-time price calculation.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center font-extrabold border border-indigo-800">
              3
            </div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <CreditCard className="w-5 h-5 text-indigo-400" />
              <span>3. Direct UPI Payment</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Payment is completed securely via UPI, GPay, PhonePe, Paytm, or Cards. Funds go directly into the Cyber Cafe’s bank account via Razorpay.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center font-extrabold border border-amber-800">
              4
            </div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Printer className="w-5 h-5 text-amber-400" />
              <span>4. Automatic Hard Copy Output</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Once payment completes, the WevePrint Agent software instantly fetches the job and commands the physical printer to print without manual intervention!
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="glass-card p-8 rounded-2xl border border-slate-800 text-center space-y-4">
          <h3 className="text-xl font-extrabold text-white">Ready to Automate Your Print Shop?</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Join hundreds of Cyber Cafes streamlining document printing with WevePrint.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-600/25 flex items-center space-x-2"
            >
              <span>Register Your Cyber Cafe Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
