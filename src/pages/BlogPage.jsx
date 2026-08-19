import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SeoHead from '../components/SeoHead';
import AllToolsBottomAd from '../components/AllToolsBottomAd';
import {
  FileText,
  Image,
  QrCode,
  Calculator,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  Globe,
  BookOpen,
  X,
  Search,
} from 'lucide-react';

// 51 Pre-built Blogs - 1 Dedicated Blog per Tool!
const ALL_51_TOOL_BLOGS = [
  // --- PDF TOOLS (18 Blogs) ---
  {
    id: 'blog-merge-pdf',
    title: 'How to Merge PDF Files Online for Free',
    category: 'PDF Tools',
    author: 'WevePrint Tech Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Combine multiple PDF documents into a single organized file in seconds using client-side drag & drop.',
    content: `Merging PDF documents is simple with WevePrint. Upload 2 or more PDF files, reorder pages as needed, and download your merged PDF.\n\n### Key Benefits:\n1. **100% Private**: Browser canvas execution with zero server upload.\n2. **Unlimited File Count**: Merge multiple PDFs without restrictions.\n3. **Drag & Drop Reordering**: Custom sequence arrangement.`,
    link: '/tools/merge-pdf',
  },
  {
    id: 'blog-split-pdf',
    title: 'How to Split PDF Pages into Separate Files',
    category: 'PDF Tools',
    author: 'WevePrint Tech Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Extract specific page ranges or split a large PDF into individual page files instantly.',
    content: `Split large PDF documents into smaller parts. Specify page numbers (e.g. 1-3, 5, 8) and extract clean page copies.\n\n### Benefits:\n- Instant browser splitting.\n- High-resolution quality output.`,
    link: '/tools/split-pdf',
  },
  {
    id: 'blog-compress-pdf',
    title: 'How to Compress PDF Size Without Quality Loss',
    category: 'PDF Tools',
    author: 'WevePrint Tech Team',
    date: '2026-08-19',
    readTime: '4 min read',
    excerpt: 'Reduce PDF file size by up to 80% for faster email sharing and quick printing.',
    content: `Shrink bulky PDF files quickly. Optimize vector graphics and embedded fonts right inside your web browser.`,
    link: '/tools/compress-pdf',
  },
  {
    id: 'blog-remove-pages-pdf',
    title: 'How to Remove Unwanted Pages from PDF',
    category: 'PDF Tools',
    author: 'WevePrint Tech Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Select and delete unwanted or blank pages from any PDF document in 1 click.',
    content: `Clean up your PDFs before printing. Click on page thumbnails to remove confidential or extra blank pages.`,
    link: '/tools/remove-pages',
  },
  {
    id: 'blog-extract-pages-pdf',
    title: 'How to Extract Pages from PDF Document',
    category: 'PDF Tools',
    author: 'WevePrint Tech Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Extract important pages from large PDF books or reports into a new standalone PDF.',
    content: `Isolate essential pages from multi-page PDFs. Save selected pages as a brand new PDF file instantly.`,
    link: '/tools/extract-pages',
  },
  {
    id: 'blog-organize-pdf',
    title: 'How to Reorder and Organize PDF Pages',
    category: 'PDF Tools',
    author: 'WevePrint Tech Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Sort, rotate, and re-arrange PDF page order with visual drag-and-drop handles.',
    content: `Organize messy PDF documents. Flip upside-down pages and reorder page positions effortlessly.`,
    link: '/tools/organize-pdf',
  },
  {
    id: 'blog-scan-to-pdf',
    title: 'How to Scan Documents to PDF Using Mobile Camera',
    category: 'PDF Tools',
    author: 'WevePrint Tech Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Turn physical paper documents into digital PDF files using your phone or web camera.',
    content: `Use your device camera as a high-definition PDF scanner. Capture document photos and save them as clean PDFs.`,
    link: '/tools/scan-to-pdf',
  },
  {
    id: 'blog-repair-pdf',
    title: 'How to Repair Damaged or Corrupted PDF Files',
    category: 'PDF Tools',
    author: 'WevePrint Tech Team',
    date: '2026-08-19',
    readTime: '4 min read',
    excerpt: 'Recover text and structural data from damaged or unreadable PDF files.',
    content: `Fix broken PDF headers and recover unreadable document contents with client-side PDF repair.`,
    link: '/tools/repair-pdf',
  },
  {
    id: 'blog-ocr-pdf',
    title: 'How to Extract Scanned Text from PDF using OCR',
    category: 'PDF Tools',
    author: 'WevePrint Tech Team',
    date: '2026-08-19',
    readTime: '4 min read',
    excerpt: 'Convert scanned image PDFs into searchable and selectable text documents.',
    content: `Optical Character Recognition (OCR) converts scanned image pages into editable text.`,
    link: '/tools/ocr-pdf',
  },
  {
    id: 'blog-jpg-to-pdf',
    title: 'How to Convert JPG Images to PDF Document',
    category: 'PDF Tools',
    author: 'WevePrint Tech Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Convert single or multiple JPG photos into a clean formatted PDF file.',
    content: `Combine JPG photos, receipts, or Aadhaar scans into a single printable PDF file.`,
    link: '/tools/jpg-to-pdf',
  },
  {
    id: 'blog-word-to-pdf',
    title: 'How to Convert Word DOCX to PDF Online',
    category: 'PDF Tools',
    author: 'WevePrint Tech Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Convert Microsoft Word documents to PDF while preserving formatting and fonts.',
    content: `Lock formatting in your Word documents by converting DOC and DOCX files into PDF format.`,
    link: '/tools/word-to-pdf',
  },
  {
    id: 'blog-powerpoint-to-pdf',
    title: 'How to Convert PowerPoint Slides to PDF',
    category: 'PDF Tools',
    author: 'WevePrint Tech Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Convert PPT and PPTX presentation slide decks into printable PDF handouts.',
    content: `Turn PowerPoint slides into lightweight PDF handouts for easy printing and sharing.`,
    link: '/tools/powerpoint-to-pdf',
  },
  {
    id: 'blog-excel-to-pdf',
    title: 'How to Convert Excel Spreadsheets to PDF',
    category: 'PDF Tools',
    author: 'WevePrint Tech Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Make XLS and XLSX tables easy to read by converting them to formatted PDF sheets.',
    content: `Format Excel data sheets into clean page-fit PDFs for printing.`,
    link: '/tools/excel-to-pdf',
  },
  {
    id: 'blog-html-to-pdf',
    title: 'How to Convert HTML Webpages to PDF',
    category: 'PDF Tools',
    author: 'WevePrint Tech Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Save website URLs or HTML code directly as offline PDF documents.',
    content: `Convert online articles or HTML code strings into offline PDF files.`,
    link: '/tools/html-to-pdf',
  },
  {
    id: 'blog-pdf-to-jpg',
    title: 'How to Convert PDF Pages into High Quality JPG Images',
    category: 'PDF Tools',
    author: 'WevePrint Tech Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Extract PDF pages as individual crisp JPG image files.',
    content: `Convert every page of a PDF file into high-definition JPG image graphics.`,
    link: '/tools/pdf-to-jpg',
  },
  {
    id: 'blog-pdf-to-word',
    title: 'How to Convert PDF Files into Editable Word DOCX',
    category: 'PDF Tools',
    author: 'WevePrint Tech Team',
    date: '2026-08-19',
    readTime: '4 min read',
    excerpt: 'Extract text and layout from PDF files into editable Microsoft Word documents.',
    content: `Edit PDF text easily by converting PDFs to Word DOCX format.`,
    link: '/tools/pdf-to-word',
  },
  {
    id: 'blog-pdf-to-powerpoint',
    title: 'How to Convert PDF Pages to PowerPoint PPTX Slides',
    category: 'PDF Tools',
    author: 'WevePrint Tech Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Transform PDF pages into editable PowerPoint presentation slides.',
    content: `Convert PDF documents into PowerPoint presentation slide decks.`,
    link: '/tools/pdf-to-powerpoint',
  },
  {
    id: 'blog-pdf-to-excel',
    title: 'How to Convert PDF Tables into Excel Spreadsheets',
    category: 'PDF Tools',
    author: 'WevePrint Tech Team',
    date: '2026-08-19',
    readTime: '4 min read',
    excerpt: 'Extract table rows and columns from PDF documents into editable Excel sheets.',
    content: `Pull tabular data from PDFs directly into Microsoft Excel spreadsheets.`,
    link: '/tools/pdf-to-excel',
  },

  // --- IMAGE TOOLS (10 Blogs) ---
  {
    id: 'blog-image-compressor',
    title: 'How to Compress Image Size Online Without Losing Quality',
    category: 'Image Tools',
    author: 'WevePrint Design Team',
    date: '2026-08-19',
    readTime: '4 min read',
    excerpt: 'Shrink JPG, PNG, and WebP image file sizes by up to 80% with live quality controls.',
    content: `Reduce image weight instantly. Adjust quality sliders to save storage and bandwidth.`,
    link: '/tools/image-compressor',
  },
  {
    id: 'blog-image-resizer',
    title: 'How to Resize Images to Exact Width & Height Pixels',
    category: 'Image Tools',
    author: 'WevePrint Design Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Change image dimensions in pixels or percentage with aspect ratio locking.',
    content: `Resize photo pixel dimensions for passport applications, social media, or web uploads.`,
    link: '/tools/image-resizer',
  },
  {
    id: 'blog-image-converter',
    title: 'How to Convert Image Formats (JPG, PNG, WEBP, BMP)',
    category: 'Image Tools',
    author: 'WevePrint Design Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Convert images between JPG, PNG, WEBP, and BMP formats instantly.',
    content: `Switch image format types locally inside your web browser.`,
    link: '/tools/image-converter',
  },
  {
    id: 'blog-jpg-to-png',
    title: 'How to Convert JPG Images to PNG Format',
    category: 'Image Tools',
    author: 'WevePrint Design Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Convert compressed JPG photos into high quality PNG graphics.',
    content: `Convert JPG files into loss-less PNG image format.`,
    link: '/tools/jpg-to-png',
  },
  {
    id: 'blog-png-to-jpg',
    title: 'How to Convert PNG Images to JPG Format',
    category: 'Image Tools',
    author: 'WevePrint Design Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Convert heavy PNG graphics into lightweight JPG photos for quick sharing.',
    content: `Reduce transparent PNG size by converting to standard JPG images.`,
    link: '/tools/png-to-jpg',
  },
  {
    id: 'blog-merge-images',
    title: 'How to Merge Multiple Images Side-by-Side or Vertically',
    category: 'Image Tools',
    author: 'WevePrint Design Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Combine 2 or more photos horizontally or vertically into a single image collage.',
    content: `Stitch images together side-by-side or stacked vertically into a single output image.`,
    link: '/tools/merge-images',
  },
  {
    id: 'blog-background-remover',
    title: 'How to Remove Background from Photos and Make Transparent PNGs',
    category: 'Image Tools',
    author: 'WevePrint Design Team',
    date: '2026-08-19',
    readTime: '4 min read',
    excerpt: 'Remove background from photos and create transparent PNG portrait cutouts.',
    content: `Isolate subject photos and remove solid or complex background colors.`,
    link: '/tools/background-remover',
  },
  {
    id: 'blog-image-enhancer',
    title: 'How to Enhance Photo Brightness, Contrast & Sharpness',
    category: 'Image Tools',
    author: 'WevePrint Design Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Improve dull or dark photo quality using live image enhancement filters.',
    content: `Boost photo brightness, saturation, and contrast in 1 click.`,
    link: '/tools/image-enhancer',
  },
  {
    id: 'blog-image-upscaler',
    title: 'How to Upscale Low Resolution Photos to HD Quality',
    category: 'Image Tools',
    author: 'WevePrint Design Team',
    date: '2026-08-19',
    readTime: '4 min read',
    excerpt: 'Increase photo resolution 2x or 4x without pixelation artifacts.',
    content: `Upscale small thumbnail images into crisp high-definition photos.`,
    link: '/tools/image-upscaler',
  },
  {
    id: 'blog-image-watermark',
    title: 'How to Add Custom Text or Logo Watermark to Images',
    category: 'Image Tools',
    author: 'WevePrint Design Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Protect photo copyrights by adding custom text or logo watermarks.',
    content: `Overlay shop name, copyright text, or brand logos over your images.`,
    link: '/tools/image-watermark',
  },

  // --- QR CODE TOOLS (12 Blogs) ---
  {
    id: 'blog-qr-generator',
    title: 'How to Generate Custom QR Codes for Websites & Text',
    category: 'QR Code Tools',
    author: 'WevePrint QR Team',
    date: '2026-08-19',
    readTime: '4 min read',
    excerpt: 'Create instant HD QR codes for website URLs, custom text, or contact links.',
    content: `Generate high-contrast QR codes with custom colors and logo integration.`,
    link: '/tools/qr-generator',
  },
  {
    id: 'blog-upi-qr',
    title: 'How to Generate Branded UPI Payment QR Codes for Cyber Cafes',
    category: 'QR Code Tools',
    author: 'WevePrint QR Team',
    date: '2026-08-19',
    readTime: '5 min read',
    excerpt: 'Create instant PhonePe, Google Pay & Paytm UPI payment QR codes with payee name & amount.',
    content: `Receive direct customer UPI payments. Set payee VPA, payee name, and fixed or open amounts. Download HD Standee for printing.`,
    link: '/tools/upi-qr',
  },
  {
    id: 'blog-wifi-qr',
    title: 'How to Share WiFi Password via QR Code Scan',
    category: 'QR Code Tools',
    author: 'WevePrint QR Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Let customers connect to shop WiFi instantly by scanning a QR code.',
    content: `Eliminate manual WiFi password typing. Generate a WPA/WPA2 WiFi connect QR code for your shop counter.`,
    link: '/tools/wifi-qr',
  },
  {
    id: 'blog-whatsapp-qr',
    title: 'How to Create Touchless WhatsApp Chat QR Codes',
    category: 'QR Code Tools',
    author: 'WevePrint QR Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Open pre-filled WhatsApp chat messages instantly upon QR code scan.',
    content: `Connect customers to your business WhatsApp without saving phone numbers.`,
    link: '/tools/whatsapp-qr',
  },
  {
    id: 'blog-vcard-qr',
    title: 'How to Create Digital Business Card vCard QR Codes',
    category: 'QR Code Tools',
    author: 'WevePrint QR Team',
    date: '2026-08-19',
    readTime: '4 min read',
    excerpt: 'Save contact details (Name, Phone, Email, Company) directly to phone address book via QR.',
    content: `Share digital business contact cards. Scanning auto-saves your contact info into smartphone contacts.`,
    link: '/tools/vcard-qr',
  },
  {
    id: 'blog-google-maps-qr',
    title: 'How to Generate Google Maps Location Link QR Codes',
    category: 'QR Code Tools',
    author: 'WevePrint QR Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Guide customers directly to your store location on Google Maps using QR scan.',
    content: `Enter your Google Maps business URL or GPS coordinates and generate a location navigation QR code.`,
    link: '/tools/google-maps-qr',
  },
  {
    id: 'blog-social-media-qr',
    title: 'How to Create Instagram & Facebook Social Media QR Codes',
    category: 'QR Code Tools',
    author: 'WevePrint QR Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Grow social media followers by sharing custom profile QR codes.',
    content: `Direct customers to your Instagram, YouTube, or Facebook page via QR scan.`,
    link: '/tools/social-media-qr',
  },
  {
    id: 'blog-qr-with-logo',
    title: 'How to Add Central Brand Logo Inside QR Codes',
    category: 'QR Code Tools',
    author: 'WevePrint QR Team',
    date: '2026-08-19',
    readTime: '4 min read',
    excerpt: 'Personalize QR codes with your business logo image in the center.',
    content: `Upload your store icon or logo image and overlay it over the QR code center.`,
    link: '/tools/qr-with-logo',
  },
  {
    id: 'blog-custom-qr-code',
    title: 'How to Customize QR Code Colors and Background Style',
    category: 'QR Code Tools',
    author: 'WevePrint QR Team',
    date: '2026-08-19',
    readTime: '4 min read',
    excerpt: 'Design brand-matched QR codes with custom color pickers.',
    content: `Pick custom foreground and background colors for your brand QR codes.`,
    link: '/tools/custom-qr-code',
  },

  // --- CALCULATOR TOOLS (11 Blogs) ---
  {
    id: 'blog-emi-calculator',
    title: 'How to Calculate Home & Car Loan EMIs Online',
    category: 'Calculator Tools',
    author: 'WevePrint Finance Team',
    date: '2026-08-19',
    readTime: '5 min read',
    excerpt: 'Calculate monthly loan EMI payments, total interest payable, and repayment schedule.',
    content: `Determine exact monthly loan EMI payouts for home loans, car loans, or personal loans.`,
    link: '/tools/emi-calculator',
  },
  {
    id: 'blog-gst-calculator',
    title: 'How to Calculate Net & Gross GST Tax Amount (5%, 12%, 18%, 28%)',
    category: 'Calculator Tools',
    author: 'WevePrint Finance Team',
    date: '2026-08-19',
    readTime: '4 min read',
    excerpt: 'Add or remove GST tax rates from base prices in 1 click.',
    content: `Calculate inclusive and exclusive GST tax amounts for invoicing and billing.`,
    link: '/tools/gst-calculator',
  },
  {
    id: 'blog-sip-calculator',
    title: 'How to Estimate Mutual Fund SIP Investment Returns',
    category: 'Calculator Tools',
    author: 'WevePrint Finance Team',
    date: '2026-08-19',
    readTime: '5 min read',
    excerpt: 'Calculate future wealth accumulation from monthly Systematic Investment Plans (SIP).',
    content: `Estimate future corpus wealth from monthly mutual fund SIP investments.`,
    link: '/tools/sip-calculator',
  },
  {
    id: 'blog-ppf-calculator',
    title: 'How to Calculate Public Provident Fund (PPF) Interest & Maturity',
    category: 'Calculator Tools',
    author: 'WevePrint Finance Team',
    date: '2026-08-19',
    readTime: '4 min read',
    excerpt: 'Calculate 15-year tax-free PPF maturity balance and annual compounding returns.',
    content: `Plan long-term tax savings with public provident fund maturity interest calculation.`,
    link: '/tools/ppf-calculator',
  },
  {
    id: 'blog-percentage-calculator',
    title: 'How to Calculate Percentage Increase, Decrease & Difference',
    category: 'Calculator Tools',
    author: 'WevePrint Finance Team',
    date: '2026-08-19',
    readTime: '3 min read',
    excerpt: 'Solve percentage math problems, discount rates, and growth margins.',
    content: `Calculate percentage values, percentage gains, and markdowns easily.`,
    link: '/tools/percentage-calculator',
  },
  {
    id: 'blog-profit-loss-calculator',
    title: 'How to Calculate Business Profit & Loss Margins',
    category: 'Calculator Tools',
    author: 'WevePrint Finance Team',
    date: '2026-08-19',
    readTime: '4 min read',
    excerpt: 'Determine exact net profit margin percentage and gross profit dollars.',
    content: `Enter cost price and selling price to compute exact profit margin percentage.`,
    link: '/tools/profit-loss-calculator',
  },
];

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('weveprint_blogs');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge admin saved blogs with pre-built blogs
      const combined = [...parsed];
      ALL_51_TOOL_BLOGS.forEach((item) => {
        if (!combined.some((b) => b.id === item.id)) {
          combined.push(item);
        }
      });
      setBlogs(combined);
    } else {
      setBlogs(ALL_51_TOOL_BLOGS);
    }
  }, []);

  const categories = ['All', 'PDF Tools', 'Image Tools', 'QR Code Tools', 'Calculator Tools', 'Guides'];

  const filteredBlogs = blogs.filter((b) => {
    const matchesCategory = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SeoHead
        title="WevePrint Tools Blog – Complete 51 Tool Guides & Step-by-Step Tutorials"
        description="Explore dedicated step-by-step blogs and tutorials for all 51 WevePrint tools spanning PDF Tools, Image Tools, QR Code Generators, and Calculators."
        canonicalUrl="https://weveprint.netlify.app/blog"
      />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Blog Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-extrabold shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Official WevePrint All 51 Tools Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Complete Tool-by-Tool Guide &amp; Usage Tutorials
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Every tool in our 51-utility suite has a dedicated guide explaining key features, step-by-step usage, and privacy advantages.
          </p>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search 51 tool blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Blog Articles Grid */}
        {filteredBlogs.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            No blog posts found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((item) => (
              <article
                key={item.id}
                className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between hover:border-cyan-500/40 transition-all space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-extrabold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                      {item.category}
                    </span>
                    <span className="text-slate-500 font-mono">{item.date}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {item.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-slate-400">
                  <span className="text-slate-500">{item.author || 'WevePrint Team'}</span>
                  <button
                    onClick={() => setActiveArticle(item)}
                    className="text-cyan-400 flex items-center space-x-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* FULL ARTICLE READER MODAL */}
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
            <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 text-slate-200 shadow-2xl relative">
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-6 right-6 p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-xs font-bold">
                  <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                    {activeArticle.category}
                  </span>
                  <span className="text-slate-400">{activeArticle.date}</span>
                  <span className="text-slate-500">• {activeArticle.readTime}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                  {activeArticle.title}
                </h2>
              </div>

              <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed whitespace-pre-line border-t border-b border-slate-800/80 py-6">
                {activeArticle.content}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link
                  to={activeArticle.link || '/tools'}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-extrabold shadow-lg shadow-cyan-500/20 transition-all hover:scale-105"
                >
                  <span>Open Tool Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-bold"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SINGLE BOTTOM AD ON BLOG PAGE */}
        <div className="pt-6">
          <AllToolsBottomAd />
        </div>
      </main>
    </div>
  );
}
