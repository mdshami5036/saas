import React, { useEffect } from 'react';

export default function MergePdfBottomAd() {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.warn('AdSense push error (bottom banner):', e);
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto my-6 flex justify-center overflow-hidden">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: '90px' }}
        data-ad-client="ca-pub-8836038922705746"
        data-ad-slot="5915624899"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
