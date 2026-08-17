import React, { useEffect, useRef } from 'react';

export default function UploadPageAd() {
  const adPushedRef = useRef(false);

  useEffect(() => {
    try {
      if (!adPushedRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adPushedRef.current = true;
      }
    } catch (err) {
      console.warn('AdSense script error:', err);
    }
  }, []);

  return (
    <div className="mt-auto w-full max-w-4xl mx-auto pt-8 pb-6 px-4 flex flex-col items-center justify-center relative z-10 overflow-hidden">
      <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1.5 font-semibold">
        Advertisement
      </div>
      <div className="w-full bg-slate-900/60 border border-slate-800/80 rounded-xl p-2.5 flex justify-center items-center overflow-hidden shadow-inner">
        <ins
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
