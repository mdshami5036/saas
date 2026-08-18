import React, { useEffect } from 'react';

export default function MergePdfTopAd() {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn('AdSense push error (top banner):', e);
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 flex justify-center overflow-hidden">
      <ins
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
