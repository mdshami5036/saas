import React, { useEffect, useState } from 'react';
import { CheckCircle2, Clock, Printer, AlertTriangle, Sparkles, X } from 'lucide-react';
import { io } from 'socket.io-client';

export default function PrintStatusTracker({ jobId, cafeName, onClose }) {
  const [status, setStatus] = useState('SENT_TO_AGENT');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!jobId) return;

    const socket = io('/', {
      transports: ['websocket', 'polling'],
    });

    socket.on('connect', () => {
      socket.emit('subscribe:job', { jobId });
    });

    socket.on('job:status_changed', (data) => {
      if (data.jobId === jobId) {
        setStatus(data.status);
        if (data.errorMessage) {
          setErrorMessage(data.errorMessage);
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [jobId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-card rounded-2xl p-6 shadow-2xl border border-slate-700 bg-slate-900 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
            <Printer className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">Live Print Tracker</h3>
            <p className="text-xs text-slate-400">Order #{jobId.substring(0, 8)} • {cafeName}</p>
          </div>
        </div>

        {/* Status Stepper */}
        <div className="space-y-4 my-6">
          {/* Step 1 */}
          <div className="flex items-start space-x-3">
            <div className="mt-0.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Payment Verified</p>
              <p className="text-xs text-slate-400">Razorpay payment completed successfully</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start space-x-3">
            <div className="mt-0.5">
              {['SENT_TO_AGENT', 'PRINTING', 'COMPLETED'].includes(status) ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <Clock className="w-5 h-5 text-cyan-400 animate-spin" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">Dispatched to Windows PrintAgent</p>
              <p className="text-xs text-slate-400">Sent to Cyber Cafe laptop agent</p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start space-x-3">
            <div className="mt-0.5">
              {status === 'COMPLETED' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : status === 'PRINTING' ? (
                <Printer className="w-5 h-5 text-cyan-400 animate-bounce" />
              ) : status === 'PRINTER_OFFLINE' ? (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              ) : (
                <Clock className="w-5 h-5 text-slate-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                {status === 'COMPLETED'
                  ? 'Printed Successfully'
                  : status === 'PRINTER_OFFLINE'
                  ? 'Printer Offline (Queued & Retrying)'
                  : 'Printing on Windows Printer'}
              </p>
              <p className="text-xs text-slate-400">
                {status === 'COMPLETED'
                  ? 'Please collect your printed pages from the counter.'
                  : status === 'PRINTER_OFFLINE'
                  ? 'The printer is currently offline. Your job is safe in queue.'
                  : 'Sending pages silently to laptop printer...'}
              </p>
            </div>
          </div>
        </div>

        {status === 'COMPLETED' && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-center">
            <Sparkles className="w-6 h-6 mx-auto mb-2 text-emerald-400" />
            <p className="font-bold text-sm">Print Complete!</p>
            <p className="text-xs text-emerald-400/80 mt-1">
              Your document has printed at {cafeName}. Please collect it now.
            </p>
          </div>
        )}

        {status === 'FAILED' && (
          <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-center">
            <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-rose-400" />
            <p className="font-bold text-sm">Printing Issue</p>
            <p className="text-xs text-rose-400/80 mt-1">
              {errorMessage || 'Failed to print on the target printer. Please ask cafe owner.'}
            </p>
          </div>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 rounded-xl font-bold text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
        >
          Close Tracker
        </button>
      </div>
    </div>
  );
}
