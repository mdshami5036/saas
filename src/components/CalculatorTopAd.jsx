import React, { useEffect, useState } from 'react';

export default function CalculatorTopAd() {
  const [adKey, setAdKey] = useState(0);

  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense Error:', err);
    }

    const interval = setInterval(() => {
      setAdKey((prevKey) => prevKey + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, [adKey]);

  return (
    <div className="w-full flex flex-col items-center justify-center my-4 overflow-hidden rounded-xl bg-slate-900/40 p-2 border border-slate-800/80 min-h-[90px]">
      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-1">
        Advertisement
      </span>
      <ins
        key={adKey}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-8836038922705746"
        data-ad-slot="7118161391"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
