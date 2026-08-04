import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Printer, AlertTriangle, Sparkles, X, ShieldCheck } from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../services/api';

export default function PrintStatusTracker({ jobId, cafeName, onClose }) {
  const [status, setStatus] = useState('SENT_TO_AGENT');
  const [errorMessage, setErrorMessage] = useState('');
  const [printerName, setPrinterName] = useState('');

  useEffect(() => {
    if (!jobId) return;

    // 1. HTTP Polling Fallback (Guaranteed to work across all networks/proxies)
    const fetchStatus = async () => {
      try {
        const res = await api.get(`/public/jobs/${jobId}/status`);
        if (res.data && res.data.success && res.data.job) {
          setStatus(res.data.job.status);
          if (res.data.job.errorMessage) setErrorMessage(res.data.job.errorMessage);
          if (res.data.job.printerName) setPrinterName(res.data.job.printerName);
        }
      } catch (err) {
        console.warn('Status poll warning:', err.message);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 1500);

    // 2. Real-Time Socket.IO Listener
    let socket = null;
    try {
      const socketUrl = import.meta.env.VITE_API_BASE_URL
        ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/v1\/?$/, '')
        : window.location.origin;

      socket = io(socketUrl, {
        transports: ['websocket', 'polling'],
        timeout: 5000,
      });

      socket.on('connect', () => {
        socket.emit('subscribe:job', { jobId });
      });

      socket.on('job:status_changed', (data) => {
        if (data.jobId === jobId) {
          setStatus(data.status);
          if (data.errorMessage) setErrorMessage(data.errorMessage);
          if (data.printerName) setPrinterName(data.printerName);
        }
      });
    } catch (e) {
      console.warn('Socket connection error, relying on HTTP polling fallback:', e);
    }

    return () => {
      clearInterval(interval);
      if (socket) socket.disconnect();
    };
  }, [jobId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-card rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-700 bg-slate-900 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6 border-b border-slate-800 pb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shrink-0">
            <Printer className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white">Live Print Tracking</h3>
            <p className="text-xs text-slate-400">
              Order #{jobId.substring(0, 8)} • <span className="text-cyan-400 font-semibold">{cafeName || 'Cyber Cafe'}</span>
            </p>
          </div>
        </div>

        {/* Status Stepper */}
        <div className="space-y-5 my-6">
          {/* Step 1: Payment Verification */}
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white flex items-center">
                <span>Payment Verified</span>
                <span className="ml-2 text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Razorpay SHA256 Valid
                </span>
              </p>
              <p className="text-[11px] text-slate-400">Payment successfully verified & secured</p>
            </div>
          </div>

          {/* Step 2: Dispatched to Agent */}
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 shrink-0">
              {['SENT_TO_AGENT', 'PRINTING', 'COMPLETED'].includes(status) ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Clock className="w-5 h-5 text-cyan-400 animate-spin" />
              )}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">Dispatched to Cafe Laptop PrintAgent</p>
              <p className="text-[11px] text-slate-400">Sent to laptop agent via encrypted queue</p>
            </div>
          </div>

          {/* Step 3: Printing Progress */}
          <div className="flex items-start space-x-3">
            <div className="mt-0.5 shrink-0">
              {status === 'COMPLETED' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : status === 'PRINTING' ? (
                <Printer className="w-5 h-5 text-cyan-400 animate-bounce" />
              ) : status === 'PRINTER_OFFLINE' ? (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              ) : (
                <Clock className="w-5 h-5 text-slate-500" />
              )}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">
                {status === 'COMPLETED'
                  ? 'Printed Successfully'
                  : status === 'PRINTING'
                  ? 'Printing Pages on Laptop Printer...'
                  : status === 'PRINTER_OFFLINE'
                  ? 'Printer Offline (Job Safe in Queue)'
                  : 'Awaiting Printer Spooling...'}
              </p>
              <p className="text-[11px] text-slate-400">
                {status === 'COMPLETED'
                  ? `Completed on ${printerName || 'Laptop Printer'}. Please collect your paper now!`
                  : status === 'PRINTING'
                  ? 'Hardware spooler active. Paper is coming out of the printer!'
                  : 'Silent spooler command sent to printer.'}
              </p>
            </div>
          </div>
        </div>

        {/* Completion Banner */}
        {status === 'COMPLETED' && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/80 to-teal-950/80 border border-emerald-700/60 text-emerald-200 text-center space-y-1 shadow-lg animate-in zoom-in-95 duration-300">
            <Sparkles className="w-7 h-7 mx-auto text-emerald-400 animate-pulse" />
            <p className="font-extrabold text-sm text-white">🎉 Document Printed Successfully!</p>
            <p className="text-xs text-emerald-300/90">
              Your paper print is ready at <strong className="text-white">{cafeName}</strong> counter.
            </p>
          </div>
        )}

        {/* Error Banner */}
        {status === 'FAILED' && (
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-200 text-center space-y-1">
            <AlertTriangle className="w-6 h-6 mx-auto text-rose-400" />
            <p className="font-bold text-sm text-white">Printing Issue Detected</p>
            <p className="text-xs text-rose-300/90">
              {errorMessage || 'Unable to print. Please ask the cafe owner to check paper/ink.'}
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-white transition-all active:scale-95"
        >
          {status === 'COMPLETED' ? 'Done & Close' : 'Close Tracker'}
        </button>
      </div>
    </div>
  );
}
