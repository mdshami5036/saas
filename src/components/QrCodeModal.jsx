import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Printer, X, Sparkles, FileText, Palette, CheckCircle2 } from 'lucide-react';

export default function QrCodeModal({ cafeName, websiteUrl, bwPrice = 2.0, colorPrice = 10.0, onClose }) {
  const handlePrintQR = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      {/* Printable Area Wrapper */}
      <div className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700 bg-slate-900 text-slate-100 text-center print:bg-white print:text-slate-900 print:border-none print:shadow-none print:p-4 print:max-w-none print:w-full">
        {/* Close Button (Hidden on Print) */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Badge (Hidden on Print) */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-extrabold mb-4 print:hidden">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Official Counter Standee Poster</span>
        </div>

        {/* Store Header */}
        <div className="space-y-1 mb-6">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase print:text-black">
            {cafeName || 'AutoPrint Cyber Center'}
          </h2>
          <p className="text-xs font-semibold text-cyan-400 tracking-wider uppercase print:text-cyan-800">
            Instant Self-Service Online Cloud Printing
          </p>
        </div>

        {/* Pricing Rate Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-center print:bg-slate-100 print:border-slate-300">
            <div className="flex items-center justify-center space-x-1.5 text-slate-400 mb-1 print:text-slate-700">
              <FileText className="w-4 h-4 text-cyan-400 print:text-slate-800" />
              <span className="text-[11px] font-bold uppercase">B&W Print</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white print:text-slate-950">
              ₹{parseFloat(bwPrice).toFixed(2)}
              <span className="text-xs font-normal text-slate-400 print:text-slate-600"> / page</span>
            </div>
          </div>

          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-center print:bg-purple-50 print:border-purple-200">
            <div className="flex items-center justify-center space-x-1.5 text-purple-400 mb-1 print:text-purple-800">
              <Palette className="w-4 h-4 text-purple-400 print:text-purple-700" />
              <span className="text-[11px] font-bold uppercase">Full Color</span>
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-purple-300 print:text-purple-950">
              ₹{parseFloat(colorPrice).toFixed(2)}
              <span className="text-xs font-normal text-purple-400/80 print:text-purple-700"> / page</span>
            </div>
          </div>
        </div>

        {/* High-Res QR Code Frame */}
        <div className="relative bg-white p-5 rounded-3xl inline-block shadow-2xl border-4 border-cyan-500/40 mb-6 print:border-2 print:border-black print:shadow-none">
          <QRCodeSVG
            value={websiteUrl || 'https://autoprint.app'}
            size={220}
            level="H"
            includeMargin={true}
          />
          <div className="mt-2 text-[11px] font-extrabold text-slate-800 uppercase tracking-wide print:text-black">
            Scan & Print Instantly
          </div>
        </div>

        {/* Customer Portal Link */}
        <p className="text-xs font-mono text-cyan-300 break-all mb-6 bg-slate-950/90 p-2.5 rounded-xl border border-slate-800 print:bg-slate-100 print:text-black print:border-slate-300">
          {websiteUrl}
        </p>

        {/* 3-Step Quick Guide */}
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 text-left mb-6 space-y-2 print:bg-slate-50 print:border-slate-300 print:text-black">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 print:text-slate-700">
            How to Print from Phone:
          </div>
          <div className="flex items-center space-x-2.5 text-xs text-slate-200 print:text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 print:text-emerald-700" />
            <span><strong>1. Scan QR Code</strong> with phone camera or UPI app</span>
          </div>
          <div className="flex items-center space-x-2.5 text-xs text-slate-200 print:text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 print:text-emerald-700" />
            <span><strong>2. Upload PDF File</strong> & select page options</span>
          </div>
          <div className="flex items-center space-x-2.5 text-xs text-slate-200 print:text-slate-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 print:text-emerald-700" />
            <span><strong>3. Pay & Collect Paper</strong> directly from the counter!</span>
          </div>
        </div>

        {/* Action Buttons (Hidden on Print) */}
        <div className="grid grid-cols-2 gap-3 print:hidden">
          <button
            onClick={handlePrintQR}
            className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs transition-all shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>Print Counter Standee</span>
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors border border-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
