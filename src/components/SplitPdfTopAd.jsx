import React, { useEffect, useState } from 'react';

export default function SplitPdfTopAd() {
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
    <div className="w-full max-w-[728px] mx-auto my-3 flex flex-col items-center justify-center overflow-hidden rounded-xl bg-slate-900/40 p-1 border border-slate-800/80 min-h-[90px]">
      <span className="text-[8px] uppercase tracking-wider text-slate-500 font-bold mb-0.5">
        Advertisement
      </span>
      <ins
        key={adKey}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', maxWidth: '728px', height: '90px', maxHeight: '90px' }}
        data-ad-client="ca-pub-8836038922705746"
        data-ad-slot="1337356682"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
