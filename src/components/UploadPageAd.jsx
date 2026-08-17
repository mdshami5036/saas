import React, { useEffect, useRef } from 'react';

export default function UploadPageAd() {
  const adInitializedRef = useRef(false);

  useEffect(() => {
    // Single initialization on mount to avoid duplicate push calls or errors
    if (!adInitializedRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adInitializedRef.current = true;
      } catch (err) {
        console.warn('Google AdSense initialization notice:', err);
      }
    }
  }, []);

  return (
    <div className="w-full max-w-[1000px] mx-auto my-5 px-3 flex flex-col items-center justify-center overflow-hidden">
      {/* WevePrint Upload Bottom Banner */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-8836038922705746"
        data-ad-slot="2096136095"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
