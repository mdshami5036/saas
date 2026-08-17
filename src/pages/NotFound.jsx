import React from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/SeoHead';
import Navbar from '../components/Navbar';
import { Printer, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans">
      <SeoHead
        title="Page Not Found (404) – wevePrint"
        description="The page you are looking for does not exist on wevePrint. Return to homepage to print documents online easily."
        canonicalUrl="https://weveprint.netlify.app/404"
      />
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16">
        <div className="w-20 h-20 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 border border-cyan-500/20">
          <Printer className="w-10 h-10 animate-bounce" />
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
          404 – Page Not Found
        </h1>
        
        <p className="text-slate-400 max-w-md mb-8 text-base md:text-lg">
          Oops! The page you are trying to access does not exist or has been moved. Return to wevePrint online printing homepage.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Homepage
        </Link>
      </main>

      <footer className="py-6 border-t border-slate-800/80 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} wevePrint. All rights reserved. Online Printing & Document Print Service.
      </footer>
    </div>
  );
}
