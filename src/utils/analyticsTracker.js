// WevePrint Tool Activity & Usage Tracker Helper

const INITIAL_ANALYTICS = {
  'background-remover': { id: 'background-remover', name: 'Background Remover', category: 'Image Tools', count: 184, lastUsed: 'Just now' },
  'merge-pdf': { id: 'merge-pdf', name: 'Merge PDF', category: 'PDF Tools', count: 162, lastUsed: '2 mins ago' },
  'upi-qr': { id: 'upi-qr', name: 'UPI QR Code Generator', category: 'QR Tools', count: 145, lastUsed: '5 mins ago' },
  'image-compressor': { id: 'image-compressor', name: 'Image Compressor', category: 'Image Tools', count: 128, lastUsed: '10 mins ago' },
  'split-pdf': { id: 'split-pdf', name: 'Split PDF / Extract Pages', category: 'PDF Tools', count: 110, lastUsed: '15 mins ago' },
  'pdf-to-jpg': { id: 'pdf-to-jpg', name: 'PDF to JPG (300 DPI)', category: 'PDF Tools', count: 95, lastUsed: '20 mins ago' },
  'jpg-to-pdf': { id: 'jpg-to-pdf', name: 'JPG to PDF Converter', category: 'PDF Tools', count: 88, lastUsed: '25 mins ago' },
  'social-qr': { id: 'social-qr', name: 'Social Media QR Code', category: 'QR Tools', count: 76, lastUsed: '35 mins ago' },
  'emi-calculator': { id: 'emi-calculator', name: 'Loan EMI Calculator', category: 'Calculators', count: 64, lastUsed: '40 mins ago' },
  'gst-calculator': { id: 'gst-calculator', name: 'GST Tax Calculator', category: 'Calculators', count: 52, lastUsed: '1 hour ago' },
  'organize-pdf': { id: 'organize-pdf', name: 'Organize PDF Pages', category: 'PDF Tools', count: 48, lastUsed: '1 hour ago' },
  'wifi-qr': { id: 'wifi-qr', name: 'WiFi QR Code Generator', category: 'QR Tools', count: 42, lastUsed: '2 hours ago' },
  'image-watermark': { id: 'image-watermark', name: 'Image Watermark Maker', category: 'Image Tools', count: 35, lastUsed: '2 hours ago' },
  'pdf-to-word': { id: 'pdf-to-word', name: 'PDF to Word Converter', category: 'PDF Tools', count: 31, lastUsed: '3 hours ago' },
  'fd-calculator': { id: 'fd-calculator', name: 'FD Interest Calculator', category: 'Calculators', count: 18, lastUsed: '4 hours ago' },
  'rd-calculator': { id: 'rd-calculator', name: 'RD Calculator', category: 'Calculators', count: 12, lastUsed: '5 hours ago' },
  'nps-calculator': { id: 'nps-calculator', name: 'NPS Pension Calculator', category: 'Calculators', count: 8, lastUsed: '6 hours ago' },
  'ppf-calculator': { id: 'ppf-calculator', name: 'PPF Calculator', category: 'Calculators', count: 6, lastUsed: '8 hours ago' },
};

export const getToolAnalytics = () => {
  try {
    const saved = localStorage.getItem('weveprint_tool_activity');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Analytics parse error:', e);
  }
  return INITIAL_ANALYTICS;
};

export const trackToolExecution = (toolId, name, category) => {
  try {
    const analytics = getToolAnalytics();
    const existing = analytics[toolId] || { id: toolId, name: name || toolId, category: category || 'General', count: 0 };
    analytics[toolId] = {
      ...existing,
      name: name || existing.name,
      category: category || existing.category,
      count: (existing.count || 0) + 1,
      lastUsed: 'Just now',
    };
    localStorage.setItem('weveprint_tool_activity', JSON.stringify(analytics));
  } catch (e) {
    console.warn('Analytics track error:', e);
  }
};
