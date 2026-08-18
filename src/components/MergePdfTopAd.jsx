import React, { useEffect, useState } from 'react';

export default function MergePdfTopAd() {
  const [adKey, setAdKey] = useState(0);

  useEffect(() => {
    // Initial AdSense push
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn('AdSense push error (top banner):', e);
    }

    // Auto-refresh ad every 5 seconds (5000 ms)
    const interval = setInterval(() => {
      setAdKey((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (adKey > 0) {
      try {
        if (window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (e) {
        console.warn('AdSense refresh push error (top banner):', e);
      }
    }
  }, [adKey]);

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 flex justify-center overflow-hidden">
      <ins
        key={adKey}
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: '90px' }}
        data-ad-client="ca-pub-8836038922705746"
        data-ad-slot="1600975362"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
