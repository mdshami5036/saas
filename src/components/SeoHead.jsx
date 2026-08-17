import React, { useEffect } from 'react';

export default function SeoHead({
  title = 'wevePrint – Online Printing & Document Print Service',
  description = 'wevePrint makes online document printing simple and convenient. Upload your documents, choose your printing requirements, and place your print order easily from mobile or desktop.',
  canonicalUrl = 'https://weveprint.netlify.app/',
  ogImage = 'https://weveprint.netlify.app/favicon.png',
  ogType = 'website',
  noindex = false,
  jsonLd = null,
}) {
  useEffect(() => {
    // Update Document Title
    document.title = title;

    // Helper to update or create meta tag
    const updateMeta = (selector, attribute, value, content) => {
      let element = document.querySelector(`meta[${selector}="${value}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(selector, value);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Update Description
    updateMeta('name', 'description', description);

    // Update Robots Meta Tag
    const robotsContent = noindex
      ? 'noindex, nofollow, noarchive'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
    updateMeta('name', 'robots', robotsContent);

    // Update Open Graph Tags
    updateMeta('property', 'og:title', title);
    updateMeta('property', 'og:description', description);
    updateMeta('property', 'og:url', canonicalUrl);
    updateMeta('property', 'og:image', ogImage);
    updateMeta('property', 'og:type', ogType);
    updateMeta('property', 'og:site_name', 'wevePrint');

    // Update Twitter Tags
    updateMeta('name', 'twitter:card', 'summary_large_image');
    updateMeta('name', 'twitter:title', title);
    updateMeta('name', 'twitter:description', description);
    updateMeta('name', 'twitter:image', ogImage);

    // Update Canonical URL
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', canonicalUrl);

    // Optional dynamic JSON-LD injection
    let jsonLdScript = document.getElementById('dynamic-jsonld');
    if (jsonLd) {
      if (!jsonLdScript) {
        jsonLdScript = document.createElement('script');
        jsonLdScript.id = 'dynamic-jsonld';
        jsonLdScript.type = 'application/ld+json';
        document.head.appendChild(jsonLdScript);
      }
      jsonLdScript.textContent = JSON.stringify(jsonLd);
    } else if (jsonLdScript) {
      jsonLdScript.remove();
    }
  }, [title, description, canonicalUrl, ogImage, ogType, noindex, jsonLd]);

  return null;
}
