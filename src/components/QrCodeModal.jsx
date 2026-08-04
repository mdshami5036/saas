import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Upload, ShieldCheck, Zap, Headphones, Printer,
  Smartphone, CreditCard, Globe, X, IndianRupee,
  CheckCircle2, Wifi
} from 'lucide-react';

export default function QrCodeModal({ cafeName, websiteUrl, bwPrice = 2.0, colorPrice = 10.0, onClose }) {

  const [glowPhase, setGlowPhase] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setGlowPhase(p => (p + 1) % 3), 1200);
    return () => clearInterval(t);
  }, []);

  const handlePrint = () => window.print();

  const steps = [
    { icon: <Smartphone className="w-7 h-7" />, label: 'Scan QR Code', sub: 'with phone camera or UPI app', color: '#0EA5E9' },
    { icon: <Upload className="w-7 h-7" />, label: 'Upload PDF File', sub: '& select page options', color: '#7C3AED' },
    { icon: <IndianRupee className="w-7 h-7" />, label: 'Pay Securely', sub: 'via UPI / Card / Netbanking', color: '#10B981' },
    { icon: <Printer className="w-7 h-7" />, label: 'Collect Print', sub: 'from the counter instantly!', color: '#F59E0B' },
  ];

  const leftFeatures = [
    { icon: <Upload className="w-8 h-8" />, label: 'UPLOAD', sub: 'PDF FILE', color: '#0EA5E9' },
    { icon: <ShieldCheck className="w-8 h-8" />, label: 'SECURE', sub: 'PAYMENT', color: '#10B981' },
    { icon: <Zap className="w-8 h-8" />, label: 'INSTANT', sub: 'PRINT', color: '#F59E0B' },
  ];

  const rightFeatures = [
    { icon: <CheckCircle2 className="w-8 h-8" />, label: 'SAFE &', sub: 'RELIABLE', color: '#7C3AED' },
    { icon: <IndianRupee className="w-8 h-8" />, label: 'POWERED BY', sub: 'RAZORPAY', color: '#10B981' },
    { icon: <Headphones className="w-8 h-8" />, label: '24×7', sub: 'SUPPORT', color: '#0EA5E9' },
  ];

  return (
    <>
      {/* ── PRINT STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        @keyframes qrPulse {
          0%,100% { box-shadow: 0 0 18px 4px #7C3AED88, 0 0 40px 8px #0EA5E944; }
          50%      { box-shadow: 0 0 36px 10px #0EA5E9cc, 0 0 60px 16px #7C3AED66; }
        }
        @keyframes gradientMove {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes floatUp {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-6px); }
        }
        @keyframes borderGlow {
          0%,100% { border-color: #0EA5E9; }
          50%      { border-color: #7C3AED; }
        }
        .standee-wrap { font-family: 'Inter', sans-serif; }
        .qr-pulse { animation: qrPulse 2s ease-in-out infinite; }
        .float-anim { animation: floatUp 3s ease-in-out infinite; }
        .border-glow { animation: borderGlow 2s ease-in-out infinite; }
        .grad-bg {
          background: linear-gradient(135deg, #081423 0%, #0d1f3c 40%, #12103a 70%, #081423 100%);
          background-size: 300% 300%;
          animation: gradientMove 8s ease infinite;
        }
        @media print {
          body * { visibility: hidden !important; }
          .print-standee, .print-standee * { visibility: visible !important; }
          .print-standee { position: fixed !important; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 9999; }
          .print-hide { display: none !important; }
        }
      `}</style>

      {/* ── OVERLAY ── */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/80 backdrop-blur-md overflow-y-auto print-hide">

        {/* Close */}
        <button
          onClick={onClose}
          className="fixed top-4 right-4 z-[60] p-2 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition-all print-hide"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Action Buttons */}
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] flex gap-3 print-hide">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold text-sm text-white shadow-2xl transition-all hover:scale-105 active:scale-95"
            style={{ background: 'linear-gradient(135deg,#0EA5E9,#7C3AED)' }}
          >
            <Printer className="w-4 h-4" />
            Print A4 Standee
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-sm transition-all"
          >
            Close
          </button>
        </div>

        {/* ── STANDEE CARD ── */}
        <div
          className="print-standee standee-wrap grad-bg relative w-full overflow-hidden rounded-[28px] border-2 border-glow"
          style={{
            maxWidth: 520,
            minHeight: 820,
            padding: '28px 20px 100px',
            boxShadow: '0 0 80px 20px #0EA5E920, 0 0 0 1px #ffffff10 inset',
          }}
        >
          {/* BG decorative blobs */}
          <div style={{ position:'absolute', top:-80, left:-80, width:260, height:260, borderRadius:'50%', background:'radial-gradient(circle,#7C3AED44 0%,transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:60, right:-60, width:220, height:220, borderRadius:'50%', background:'radial-gradient(circle,#0EA5E944 0%,transparent 70%)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', top:'40%', left:-40, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle,#10B98122 0%,transparent 70%)', pointerEvents:'none' }} />

          {/* ── HEADER ── */}
          <div className="text-center mb-5 relative">
            {/* Logo / Icon */}
            <div className="float-anim inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-3"
              style={{ background:'linear-gradient(135deg,#0EA5E9,#7C3AED)', boxShadow:'0 8px 32px #7C3AED66' }}>
              <Printer className="w-8 h-8 text-white" />
            </div>

            <h1 className="font-black uppercase tracking-widest text-white"
              style={{ fontSize: 26, letterSpacing: '0.12em', textShadow:'0 0 30px #0EA5E9cc, 0 2px 8px #0003' }}>
              {cafeName || 'AutoPrint Center'}
            </h1>

            {/* Divider line with dots */}
            <div className="flex items-center gap-2 justify-center my-2">
              <div style={{ height:1, width:60, background:'linear-gradient(90deg,transparent,#0EA5E9)' }} />
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase"
                style={{ color:'#0EA5E9', textShadow:'0 0 10px #0EA5E9' }}>
                Instant Self-Service Online Cloud Printing
              </span>
              <div style={{ height:1, width:60, background:'linear-gradient(90deg,#0EA5E9,transparent)' }} />
            </div>
          </div>

          {/* ── PRICING CARDS ── */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {/* B&W */}
            <div className="rounded-2xl p-3 flex items-center gap-3 border"
              style={{ background:'linear-gradient(135deg,#0EA5E915,#081423)', borderColor:'#0EA5E955',
                boxShadow:'0 0 20px #0EA5E922' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background:'linear-gradient(135deg,#0EA5E9,#0369A1)' }}>
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">B&amp;W Print</div>
                <div className="font-black text-white" style={{ fontSize:20, lineHeight:1 }}>
                  ₹{parseFloat(bwPrice).toFixed(2)}
                  <span className="text-[11px] font-normal text-slate-400"> /page</span>
                </div>
              </div>
            </div>

            {/* Color */}
            <div className="rounded-2xl p-3 flex items-center gap-3 border"
              style={{ background:'linear-gradient(135deg,#7C3AED15,#081423)', borderColor:'#7C3AED55',
                boxShadow:'0 0 20px #7C3AED22' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{ background:'linear-gradient(135deg,#7C3AED,#5B21B6)' }}>
                <Wifi className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Color</div>
                <div className="font-black text-white" style={{ fontSize:20, lineHeight:1 }}>
                  ₹{parseFloat(colorPrice).toFixed(2)}
                  <span className="text-[11px] font-normal text-slate-400"> /page</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── MIDDLE: FEATURES + QR + FEATURES ── */}
          <div className="flex items-center gap-3 mb-5">

            {/* Left Features */}
            <div className="flex flex-col gap-3 w-[90px] shrink-0">
              {leftFeatures.map((f, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1 p-2 rounded-2xl border"
                  style={{ background:'#ffffff08', borderColor: f.color + '44', boxShadow:`0 0 12px ${f.color}22` }}>
                  <div style={{ color: f.color, filter:`drop-shadow(0 0 6px ${f.color})` }}>{f.icon}</div>
                  <div className="text-[10px] font-extrabold" style={{ color: f.color }}>{f.label}</div>
                  <div className="text-[9px] text-slate-400 font-semibold">{f.sub}</div>
                </div>
              ))}
            </div>

            {/* QR CODE */}
            <div className="flex-1 flex flex-col items-center">
              {/* QR Glow Frame */}
              <div className="qr-pulse rounded-3xl p-4 border-2 mb-3"
                style={{ background:'rgba(255,255,255,0.97)', borderColor:'#7C3AED', position:'relative' }}>
                <QRCodeSVG
                  value={websiteUrl || 'https://autoprint.app'}
                  size={170}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: '',
                    height: 0,
                    width: 0,
                    excavate: false,
                  }}
                />
                {/* Center logo on QR */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background:'linear-gradient(135deg,#0EA5E9,#7C3AED)', boxShadow:'0 2px 12px #7C3AED88' }}>
                    <Printer className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>

              {/* SCAN CTA Button */}
              <div className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl font-extrabold text-white text-[11px] tracking-wider uppercase"
                style={{ background:'linear-gradient(135deg,#7C3AED,#0EA5E9)', boxShadow:'0 4px 20px #7C3AED66',
                  letterSpacing:'0.1em' }}>
                <Smartphone className="w-4 h-4" />
                Scan &amp; Print Instantly
              </div>
            </div>

            {/* Right Features */}
            <div className="flex flex-col gap-3 w-[90px] shrink-0">
              {rightFeatures.map((f, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1 p-2 rounded-2xl border"
                  style={{ background:'#ffffff08', borderColor: f.color + '44', boxShadow:`0 0 12px ${f.color}22` }}>
                  <div style={{ color: f.color, filter:`drop-shadow(0 0 6px ${f.color})` }}>{f.icon}</div>
                  <div className="text-[10px] font-extrabold" style={{ color: f.color }}>{f.label}</div>
                  <div className="text-[9px] text-slate-400 font-semibold">{f.sub}</div>
                </div>
              ))}
            </div>

          </div>

          {/* ── HOW TO PRINT ── */}
          <div className="rounded-2xl p-4 mb-5 border"
            style={{ background:'linear-gradient(135deg,#0EA5E910,#7C3AED08)', borderColor:'#0EA5E933' }}>

            {/* Section heading */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div style={{ height:1, flex:1, background:'linear-gradient(90deg,transparent,#0EA5E9)' }} />
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white"
                style={{ textShadow:'0 0 12px #0EA5E9' }}>
                How To Print From Phone
              </span>
              <div style={{ height:1, flex:1, background:'linear-gradient(90deg,#0EA5E9,transparent)' }} />
            </div>

            {/* Steps */}
            <div className="flex items-start justify-between gap-1">
              {steps.map((s, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center text-center gap-1.5" style={{ flex:1 }}>
                    {/* Step number */}
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white mb-0.5"
                      style={{ background: s.color, boxShadow:`0 0 8px ${s.color}99` }}>
                      {i + 1}
                    </div>
                    {/* Icon box */}
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center border"
                      style={{ background: s.color + '18', borderColor: s.color + '55',
                        boxShadow:`0 0 12px ${s.color}33`, color: s.color }}>
                      {s.icon}
                    </div>
                    <div className="text-[9px] font-extrabold text-white leading-tight">{s.label}</div>
                    <div className="text-[8px] text-slate-400 leading-tight">{s.sub}</div>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="text-slate-500 font-black text-lg mt-8 shrink-0">→</div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ── BOTTOM FOOTER STRIP ── */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="flex flex-col items-center gap-1 p-2 rounded-2xl border text-center"
              style={{ background:'#10B98110', borderColor:'#10B98155' }}>
              <CheckCircle2 className="w-5 h-5" style={{ color:'#10B981' }} />
              <div className="text-[9px] font-extrabold" style={{ color:'#10B981' }}>NO APP REQUIRED</div>
              <div className="text-[8px] text-slate-400">100% Web Based</div>
            </div>

            <div className="flex flex-col items-center gap-1 p-2 rounded-2xl border text-center"
              style={{ background:'#0EA5E910', borderColor:'#0EA5E955' }}>
              <Globe className="w-5 h-5" style={{ color:'#0EA5E9' }} />
              <div className="text-[9px] font-extrabold" style={{ color:'#0EA5E9' }}>YOUR LINK</div>
              <div className="text-[8px] text-slate-400 break-all leading-tight" style={{ wordBreak:'break-all' }}>
                {(websiteUrl || '').replace('https://', '').slice(0, 32)}...
              </div>
            </div>

            <div className="flex flex-col items-center gap-1 p-2 rounded-2xl border text-center"
              style={{ background:'#F59E0B10', borderColor:'#F59E0B55' }}>
              <Zap className="w-5 h-5" style={{ color:'#F59E0B' }} />
              <div className="text-[9px] font-extrabold" style={{ color:'#F59E0B' }}>FAST &amp; EASY</div>
              <div className="text-[8px] text-slate-400">Print in 30 Seconds</div>
            </div>
          </div>

          {/* Thank You */}
          <div className="text-center">
            <span className="text-[11px] font-semibold" style={{ color:'#94A3B8' }}>
              💗 Thank You! &nbsp;We Appreciate Your Trust. 💗
            </span>
            <div className="text-[9px] text-slate-600 mt-1">Powered by AutoPrint SaaS</div>
          </div>

        </div>
      </div>
    </>
  );
}
