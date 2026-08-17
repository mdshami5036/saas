import React from 'react';
import SeoHead from '../components/SeoHead';
import Navbar from '../components/Navbar';
import { Scale, CheckCircle2, AlertTriangle, FileCheck, Mail } from 'lucide-react';

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative overflow-hidden">
      <SeoHead
        title="Terms & Conditions – wevePrint Online Printing"
        description="Review the Terms & Conditions governing the use of wevePrint online printing service platform."
        canonicalUrl="https://weveprint.netlify.app/terms-conditions"
      />
      {/* Background Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="anim-glow-orb absolute -top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-radial from-indigo-600/20 to-transparent" />
        <div className="anim-glow-orb absolute top-1/3 -right-20 w-[550px] h-[550px] rounded-full bg-gradient-radial from-blue-600/15 to-transparent" />
      </div>

      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-extrabold uppercase tracking-wider">
            Terms of Service
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Last Updated: August 2026
          </p>
        </div>

        {/* Policy Content */}
        <div className="glass-card p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8 text-xs sm:text-sm leading-relaxed text-slate-300">
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <Scale className="w-5 h-5 text-cyan-400" />
              <span>1. Agreement to Terms</span>
            </h2>
            <p>
              By accessing or using <strong>WevePrint</strong> (operated by Md Shami Ahmad), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our cloud print services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <span>2. Acceptable Use & Content Policy</span>
            </h2>
            <p>
              Users are strictly prohibited from uploading or printing materials that are illegal, counterfeit, fraudulent, obscene, or infringe upon third-party intellectual property or copyright laws. Cyber Cafe owners reserve the right to report unlawful print requests to relevant authorities.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-400" />
              <span>3. Payments, Pricing & Refunds</span>
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>Print rates per page (B&W and Color) are configured independently by each Cyber Cafe merchant.</li>
              <li>Payments are processed instantly via Razorpay online UPI/Card gateways before print job dispatch.</li>
              <li>Refund requests due to printer hardware failures or paper jams should be addressed directly at the merchant counter or via support at <strong className="text-cyan-400">weve.cyber@gmail.com</strong>.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>4. Merchant Responsibilities</span>
            </h2>
            <p>
              Cyber Cafe merchants agree to keep their local PrintAgent application running during business hours and maintain active paper & ink supplies for incoming customer orders.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white">5. Support Contact</h2>
            <p>
              For legal or terms inquiries, please write to us at:
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
