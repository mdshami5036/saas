import React, { useEffect, useState } from 'react';

export default function QrBottomAd() {
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
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center my-4 overflow-hidden rounded-xl bg-slate-900/40 p-2 border border-slate-800/80 max-h-[120px]">
      <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold mb-1">
        Advertisement
      </span>
      <ins
        key={adKey}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', maxHeight: '90px' }}
        data-ad-client="ca-pub-8836038922705746"
        data-ad-slot="4689795831"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
