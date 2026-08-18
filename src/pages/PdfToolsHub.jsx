import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SeoHead from '../components/SeoHead';
import {
  Layers,
  Scissors,
  FileArchive,
  FileText,
  Presentation,
  Image,
  Lock,
  Sparkles,
  ArrowRight,
  Wrench,
  CheckCircle2,
} from 'lucide-react';

export default function PdfToolsHub() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = [
    'All',
    'Workflows',
    'Organize PDF',
    'Optimize PDF',
    'Convert PDF',
    'Edit PDF',
    'PDF Security',
  ];

  const tools = [
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
      badge: 'POPULAR',
      link: '/tools/merge-pdf',
    },
    {
      id: 'compress-pdf',
      title: 'Compress PDF',
      description: 'Reduce file size while optimizing for maximal PDF quality.',
      category: 'Optimize PDF',
      icon: FileArchive,
      iconBg: 'bg-gradient-to-tr from-emerald-500 to-teal-500',
      badge: 'FREE',
      link: '/tools/merge-pdf',
    },
    {
      id: 'pdf-to-word',
      title: 'PDF to Word',
      description: 'Easily convert your PDF files into easy to edit DOC and DOCX documents.',
      category: 'Convert PDF',
      icon: FileText,
      iconBg: 'bg-gradient-to-tr from-blue-500 to-cyan-500',
      badge: 'CONVERT',
      link: '/tools/merge-pdf',
    },
    {
      id: 'pdf-to-powerpoint',
      title: 'PDF to PowerPoint',
      description: 'Turn your PDF files into easy to edit PPT and PPTX slideshows.',
      category: 'Convert PDF',
      icon: Presentation,
      iconBg: 'bg-gradient-to-tr from-amber-500 to-orange-500',
      badge: 'CONVERT',
      link: '/tools/merge-pdf',
    },
    {
      id: 'image-to-pdf',
      title: 'JPG / Image to PDF',
      description: 'Convert JPG, PNG, and WebP images into high quality PDFs in seconds.',
      category: 'Convert PDF',
      icon: Image,
      iconBg: 'bg-gradient-to-tr from-indigo-500 to-purple-500',
      badge: 'NEW',
      link: '/tools/merge-pdf',
    },
  ];

  const filteredTools = activeCategory === 'All'
    ? tools
    : tools.filter((tool) => tool.category === activeCategory || activeCategory === 'Workflows');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SeoHead
        title="Free PDF Tools Online – Merge, Split, Compress & Convert | WevePrint"
        description="Every tool you need to work with PDFs in one place. All are 100% FREE and easy to use! Merge, split, compress, and convert PDFs instantly."
        canonicalUrl="https://weveprint.netlify.app/tools"
      />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header Section matching uploaded UI */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Every tool you need to work with PDFs in one place
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            Every tool you need to use PDFs, at your fingertips. All are 100% FREE and easy to use! Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks.
          </p>
        </div>

        {/* Category Filter Tabs (matching uploaded UI design) */}
        <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-slate-100 text-slate-950 shadow-md shadow-slate-100/10'
                  : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tools Cards Grid matching exact card UI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {filteredTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.id}
                to={tool.link}
                className="glass-card p-6 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between group space-y-4"
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
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
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
      </main>
    </div>
  );
}
