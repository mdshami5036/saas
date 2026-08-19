import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SeoHead from '../components/SeoHead';
import {
  Layers,
  Scissors,
  Trash2,
  FileDigit,
  ArrowUpDown,
  Camera,
  FileArchive,
  Wrench,
  Eye,
  Image,
  FileText,
  Presentation,
  Sheet,
  Code2,
  FileImage,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function PdfToolsHub() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All',
    'Images',
    'Organize PDF',
    'Optimize PDF',
    'Convert to PDF',
    'Convert from PDF',
  ];

  const toolsSectionData = [
    {
      categoryGroup: 'IMAGES',
      tools: [
        {
          id: 'image-compressor',
          title: 'Image Compressor',
          description: 'Reduce image file size while keeping high visual quality.',
          category: 'Images',
          icon: FileArchive,
          iconBg: 'bg-gradient-to-tr from-cyan-500 to-blue-600',
          badge: 'POPULAR',
          link: '/tools/image-compressor',
        },
        {
          id: 'image-resizer',
          title: 'Image Resizer',
          description: 'Resize image dimensions (width & height) with aspect ratio control.',
          category: 'Images',
          icon: Scissors,
          iconBg: 'bg-gradient-to-tr from-teal-500 to-emerald-600',
          badge: 'FREE',
          link: '/tools/image-resizer',
        },
        {
          id: 'image-converter',
          title: 'Image Converter',
          description: 'Convert images between JPG, PNG, WEBP, and BMP formats.',
          category: 'Images',
          icon: Image,
          iconBg: 'bg-gradient-to-tr from-blue-500 to-indigo-600',
          badge: 'FREE',
          link: '/tools/image-converter',
        },
        {
          id: 'jpg-to-png',
          title: 'JPG to PNG',
          description: 'Convert JPG images into transparent lossless PNG format.',
          category: 'Images',
          icon: FileImage,
          iconBg: 'bg-gradient-to-tr from-indigo-500 to-purple-600',
          badge: 'FREE',
          link: '/tools/jpg-to-png',
        },
        {
          id: 'png-to-jpg',
          title: 'PNG to JPG',
          description: 'Convert PNG images into high-quality JPG files.',
          category: 'Images',
          icon: FileImage,
          iconBg: 'bg-gradient-to-tr from-purple-500 to-pink-600',
          badge: 'FREE',
          link: '/tools/png-to-jpg',
        },
        {
          id: 'merge-images',
          title: 'Merge Images',
          description: 'Combine multiple images horizontally or vertically into one image.',
          category: 'Images',
          icon: Layers,
          iconBg: 'bg-gradient-to-tr from-amber-500 to-orange-600',
          badge: 'NEW',
          link: '/tools/merge-images',
        },
        {
          id: 'image-to-pdf',
          title: 'Image to PDF',
          description: 'Convert one or multiple images into a clean PDF document.',
          category: 'Images',
          icon: FileText,
          iconBg: 'bg-gradient-to-tr from-emerald-500 to-teal-600',
          badge: 'POPULAR',
          link: '/tools/image-to-pdf',
        },
        {
          id: 'pdf-to-image',
          title: 'PDF to Image',
          description: 'Convert PDF document pages into high resolution PNG/JPG images.',
          category: 'Images',
          icon: FileImage,
          iconBg: 'bg-gradient-to-tr from-rose-500 to-red-600',
          badge: 'NEW',
          link: '/tools/pdf-to-image',
        },
        {
          id: 'background-remover',
          title: 'Background Remover',
          description: 'Remove background from images and make transparent PNG cutouts.',
          category: 'Images',
          icon: Sparkles,
          iconBg: 'bg-gradient-to-tr from-pink-500 to-rose-600',
          badge: 'AI',
          link: '/tools/background-remover',
        },
        {
          id: 'image-enhancer',
          title: 'Image Enhancer',
          description: 'Improve brightness, contrast, and clarity of your photos.',
          category: 'Images',
          icon: Sparkles,
          iconBg: 'bg-gradient-to-tr from-yellow-500 to-amber-600',
          badge: 'FREE',
          link: '/tools/image-enhancer',
        },
        {
          id: 'image-upscaler',
          title: 'Image Upscaler',
          description: 'Upscale low-resolution images 2x or 4x without losing quality.',
          category: 'Images',
          icon: Sparkles,
          iconBg: 'bg-gradient-to-tr from-cyan-400 to-blue-600',
          badge: 'HD',
          link: '/tools/image-upscaler',
        },
        {
          id: 'image-watermark',
          title: 'Image Watermark',
          description: 'Add custom text or logo watermarks onto your photos for protection.',
          category: 'Images',
          icon: Layers,
          iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-700',
          badge: 'FREE',
          link: '/tools/image-watermark',
        },
      ],
    },
    {
      categoryGroup: 'ORGANIZE PDF',
      tools: [
        {
          id: 'merge-pdf',
          title: 'Merge PDF',
          description: 'Combine PDFs in the order you want with the easiest PDF merger available.',
          category: 'Organize PDF',
          icon: Layers,
          iconBg: 'bg-gradient-to-tr from-orange-500 to-amber-500',
          badge: 'ACTIVE',
          link: '/tools/merge-pdf',
        },
        {
          id: 'split-pdf',
          title: 'Split PDF',
          description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
          category: 'Organize PDF',
          icon: Scissors,
          iconBg: 'bg-gradient-to-tr from-red-500 to-orange-500',
          badge: 'FREE',
          link: '/tools/split-pdf',
        },
        {
          id: 'remove-pages',
          title: 'Remove pages',
          description: 'Delete unwanted pages from your PDF file with interactive selection.',
          category: 'Organize PDF',
          icon: Trash2,
          iconBg: 'bg-gradient-to-tr from-rose-500 to-red-600',
          badge: 'NEW',
          link: '/tools/remove-pages',
        },
        {
          id: 'extract-pages',
          title: 'Extract pages',
          description: 'Extract specific pages from your PDF and create a new separate document.',
          category: 'Organize PDF',
          icon: FileDigit,
          iconBg: 'bg-gradient-to-tr from-amber-500 to-orange-600',
          badge: 'FREE',
          link: '/tools/extract-pages',
        },
        {
          id: 'organize-pdf',
          title: 'Organize PDF',
          description: 'Sort, re-order, rotate or delete pages inside your PDF document.',
          category: 'Organize PDF',
          icon: ArrowUpDown,
          iconBg: 'bg-gradient-to-tr from-teal-500 to-emerald-600',
          badge: 'POPULAR',
          link: '/tools/organize-pdf',
        },
        {
          id: 'scan-to-pdf',
          title: 'Scan to PDF',
          description: 'Capture document scans using mobile camera or images into PDF.',
          category: 'Organize PDF',
          icon: Camera,
          iconBg: 'bg-gradient-to-tr from-blue-500 to-indigo-600',
          badge: 'NEW',
          link: '/tools/scan-to-pdf',
        },
      ],
    },
    {
      categoryGroup: 'OPTIMIZE PDF',
      tools: [
        {
          id: 'compress-pdf',
          title: 'Compress PDF',
          description: 'Reduce file size while optimizing for maximal PDF quality.',
          category: 'Optimize PDF',
          icon: FileArchive,
          iconBg: 'bg-gradient-to-tr from-emerald-500 to-teal-500',
          badge: 'ACTIVE',
          link: '/tools/compress-pdf',
        },
        {
          id: 'repair-pdf',
          title: 'Repair PDF',
          description: 'Fix damaged or corrupted PDF files and recover unreadable data.',
          category: 'Optimize PDF',
          icon: Wrench,
          iconBg: 'bg-gradient-to-tr from-lime-500 to-emerald-600',
          badge: 'FREE',
          link: '/tools/repair-pdf',
        },
        {
          id: 'ocr-pdf',
          title: 'OCR PDF',
          description: 'Convert scanned PDF documents and images into searchable text.',
          category: 'Optimize PDF',
          icon: Eye,
          iconBg: 'bg-gradient-to-tr from-cyan-500 to-blue-600',
          badge: 'PRO',
          link: '/tools/ocr-pdf',
        },
      ],
    },
    {
      categoryGroup: 'CONVERT TO PDF',
      tools: [
        {
          id: 'jpg-to-pdf',
          title: 'JPG to PDF',
          description: 'Convert JPG, PNG, and WebP images into high quality PDFs in seconds.',
          category: 'Convert to PDF',
          icon: Image,
          iconBg: 'bg-gradient-to-tr from-amber-500 to-orange-500',
          badge: 'ACTIVE',
          link: '/tools/jpg-to-pdf',
        },
        {
          id: 'word-to-pdf',
          title: 'WORD to PDF',
          description: 'Make DOC and DOCX files easy to read by converting them to PDF.',
          category: 'Convert to PDF',
          icon: FileText,
          iconBg: 'bg-gradient-to-tr from-blue-600 to-indigo-600',
          badge: 'FREE',
          link: '/tools/word-to-pdf',
        },
        {
          id: 'powerpoint-to-pdf',
          title: 'POWERPOINT to PDF',
          description: 'Make PPT and PPTX slideshows easy to view by converting to PDF.',
          category: 'Convert to PDF',
          icon: Presentation,
          iconBg: 'bg-gradient-to-tr from-orange-600 to-red-600',
          badge: 'FREE',
          link: '/tools/powerpoint-to-pdf',
        },
        {
          id: 'excel-to-pdf',
          title: 'EXCEL to PDF',
          description: 'Make EXCEL spreadsheets easy to read by converting them to PDF.',
          category: 'Convert to PDF',
          icon: Sheet,
          iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-700',
          badge: 'FREE',
          link: '/tools/excel-to-pdf',
        },
        {
          id: 'html-to-pdf',
          title: 'HTML to PDF',
          description: 'Convert web pages or HTML code directly into PDF documents.',
          category: 'Convert to PDF',
          icon: Code2,
          iconBg: 'bg-gradient-to-tr from-yellow-500 to-amber-600',
          badge: 'NEW',
          link: '/tools/html-to-pdf',
        },
      ],
    },
    {
      categoryGroup: 'CONVERT FROM PDF',
      tools: [
        {
          id: 'pdf-to-jpg',
          title: 'PDF to JPG',
          description: 'Extract all images or convert each PDF page into high quality JPGs.',
          category: 'Convert from PDF',
          icon: FileImage,
          iconBg: 'bg-gradient-to-tr from-yellow-500 to-amber-500',
          badge: 'ACTIVE',
          link: '/tools/pdf-to-jpg',
        },
        {
          id: 'pdf-to-word',
          title: 'PDF to WORD',
          description: 'Easily convert your PDF files into easy to edit DOC and DOCX documents.',
          category: 'Convert from PDF',
          icon: FileText,
          iconBg: 'bg-gradient-to-tr from-blue-500 to-cyan-500',
          badge: 'POPULAR',
          link: '/tools/pdf-to-word',
        },
        {
          id: 'pdf-to-powerpoint',
          title: 'PDF to POWERPOINT',
          description: 'Turn your PDF files into easy to edit PPT and PPTX presentation slides.',
          category: 'Convert from PDF',
          icon: Presentation,
          iconBg: 'bg-gradient-to-tr from-amber-500 to-orange-500',
          badge: 'FREE',
          link: '/tools/pdf-to-powerpoint',
        },
        {
          id: 'pdf-to-excel',
          title: 'PDF to EXCEL',
          description: 'Pull data straight from PDFs into Excel spreadsheets in a few seconds.',
          category: 'Convert from PDF',
          icon: Sheet,
          iconBg: 'bg-gradient-to-tr from-emerald-500 to-green-600',
          badge: 'FREE',
          link: '/tools/pdf-to-excel',
        },
        {
          id: 'pdf-to-pdfa',
          title: 'PDF to PDF/A',
          description: 'Convert PDF documents to ISO-standardized PDF/A for long-term archiving.',
          category: 'Convert from PDF',
          icon: FileDigit,
          iconBg: 'bg-gradient-to-tr from-indigo-500 to-purple-600',
          badge: 'NEW',
          link: '/tools/pdf-to-pdfa',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SeoHead
        title="Every tool you need to work with PDFs in one place | WevePrint"
        description="All-in-one free online PDF suite: Merge PDF, Split PDF, Compress PDF, JPG to PDF, PDF to Word and more. 100% Free & Fast."
        canonicalUrl="https://weveprint.netlify.app/tools"
      />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Main Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-extrabold shadow-sm">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>100% Free Online PDF Suite</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Every tool you need to work with PDFs in one place
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold transition-all ${
                activeCategory === cat
                  ? 'bg-slate-100 text-slate-950 shadow-lg shadow-slate-100/10 scale-105'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 4 Grouped Sections matching the user screenshot */}
        <div className="space-y-12 pt-4">
          {toolsSectionData.map((group) => {
            const filteredGroupTools = activeCategory === 'All'
              ? group.tools
              : group.tools.filter((t) => t.category === activeCategory);

            if (filteredGroupTools.length === 0) return null;

            return (
              <div key={group.categoryGroup} className="space-y-6">
                <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
                  <h2 className="text-base sm:text-lg font-black text-slate-300 tracking-wider uppercase flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-400 inline-block"></span>
                    <span>{group.categoryGroup}</span>
                  </h2>
                  <span className="text-xs text-slate-500 font-mono font-bold">
                    {filteredGroupTools.length} Tools Available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGroupTools.map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <Link
                        key={tool.id}
                        to={tool.link}
                        className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group space-y-4 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className={`w-12 h-12 rounded-2xl ${tool.iconBg} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
                              {tool.badge}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors">
                              {tool.title}
                            </h3>
                            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                              {tool.description}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">
                          <span>Use Tool Free</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
