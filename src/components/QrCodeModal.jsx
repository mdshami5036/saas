import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, X, Sparkles } from 'lucide-react';

export default function QrCodeModal({ cafeName, websiteUrl, onClose }) {
  const handlePrintQR = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md glass-card rounded-2xl p-6 shadow-2xl border border-slate-700 bg-slate-900 text-slate-100 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Counter Print QR</span>
        </div>

        <h3 className="text-2xl font-extrabold text-white mb-1">{cafeName}</h3>
        <p className="text-xs text-slate-400 mb-6">Scan QR code from phone to upload and print instantly</p>

        {/* QR Code Container */}
        <div className="bg-white p-6 rounded-2xl inline-block shadow-2xl border-4 border-cyan-500/30 mb-6">
          <QRCodeSVG
            value={websiteUrl}
            size={220}
            level="H"
            includeMargin={true}
          />
        </div>

        <p className="text-xs font-mono text-cyan-300 break-all mb-6 bg-slate-950 p-2 rounded-lg border border-slate-800">
          {websiteUrl}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handlePrintQR}
            className="flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-sm transition-colors shadow-md shadow-cyan-600/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print Standee</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
