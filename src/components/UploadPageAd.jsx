import React, { useEffect, useState } from 'react';

export default function UploadPageAd() {
  const [adKey, setAdKey] = useState(0);

  // Auto-refresh ad unit every 5 seconds (5000ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setAdKey((prevKey) => prevKey + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Re-trigger AdSense push whenever adKey updates
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.warn('AdSense refresh notice:', err);
    }
  }, [adKey]);

  return (
    <div className="mt-auto w-full max-w-4xl mx-auto pt-8 pb-6 px-4 flex flex-col items-center justify-center relative z-10 overflow-hidden">
      <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1.5 font-semibold flex items-center gap-1.5">
        <span>Advertisement</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Auto-refreshing every 5s" />
      </div>
      <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5 flex justify-center items-center overflow-hidden shadow-inner min-h-[110px]">
        <ins
          key={adKey}
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', minHeight: '90px' }}
          data-ad-format="fluid"
          data-ad-layout-key="-fb+5w+4e-db+86"
          data-ad-client="ca-pub-8836038922705746"
          data-ad-slot="5223390130"
        />
      </div>
    </div>
  );
}
