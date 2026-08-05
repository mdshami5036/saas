import React from 'react';
import Navbar from '../components/Navbar';
import { ShieldCheck, Lock, FileText, Trash2, Mail } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-extrabold uppercase tracking-wider">
            Legal & Security
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Last Updated: August 2026
          </p>
        </div>

        {/* Policy Content */}
        <div className="glass-card p-6 sm:p-10 rounded-3xl border border-slate-800 space-y-8 text-xs sm:text-sm leading-relaxed text-slate-300">
          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <span>1. Overview & Commitment</span>
            </h2>
            <p>
              At <strong>WevePrint</strong>, we prioritize the privacy and confidentiality of both our Cyber Cafe merchants and end-user print customers. This Privacy Policy outlines how information is collected, processed, and protected across our platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <Trash2 className="w-5 h-5 text-emerald-400" />
              <span>2. PDF Document Security & Automatic Deletion</span>
            </h2>
            <p>
              When a customer uploads a PDF file for printing:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>Documents are transmitted over secure, SSL-encrypted channels directly to the print queue.</li>
              <li>Files are accessible solely for the purpose of executing the print job requested by the user.</li>
              <li><strong className="text-emerald-400">Automatic File Deletion:</strong> Printed documents are automatically deleted from server memory and local agent caches immediately after successful completion.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <Lock className="w-5 h-5 text-indigo-400" />
              <span>3. Payment Gateway & Transaction Security</span>
            </h2>
            <p>
              All online payments are processed through Razorpay (UPI, Credit/Debit Cards, Netbanking). WevePrint does not store your credit card numbers, CVVs, or UPI PINs. Transactions are encrypted end-to-end according to PCI-DSS standards.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-400" />
              <span>4. Information Collected</span>
            </h2>
            <p>
              We collect minimal operational data necessary to facilitate print services:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
              <li>Merchant Account details (Shop name, email, phone number, print pricing).</li>
              <li>Customer contact information (optional phone number/name provided during checkout for status tracking).</li>
            </ul>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-bold text-white">5. Contact Our Privacy Officer</h2>
            <p>
              If you have any questions or privacy concerns regarding WevePrint, please contact us at:
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
