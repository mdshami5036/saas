import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
import Navbar from '../../components/Navbar';
import SeoHead from '../../components/SeoHead';
import MergePdfBottomAd from '../../components/MergePdfBottomAd';
import MergePdfTopAd from '../../components/MergePdfTopAd';
import {
  Scissors,
  UploadCloud,
  Download,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Info,
  CheckCircle2,
  Layers,
  Trash2,
} from 'lucide-react';

export default function SplitPdfTool() {
  const fileInputRef = useRef(null);

  // State: 'SELECT' | 'WORKSPACE' | 'PROCESSING' | 'SUCCESS'
  const [viewState, setViewState] = useState('SELECT');
  const [file, setFile] = useState(null);
  const [splitMode, setSplitMode] = useState('RANGE'); // 'RANGE' | 'PAGES'
  const [pageRange, setPageRange] = useState('1-2');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (selected && (selected.type === 'application/pdf' || selected.name.endsWith('.pdf'))) {
      setFile({
        file: selected,
        name: selected.name,
        size: (selected.size / (1024 * 1024)).toFixed(2),
      });
      setViewState('WORKSPACE');
    } else {
      setErrorMsg('Please select a valid PDF document.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const handleSplitPdf = async () => {
    if (!file) return;

    setViewState('PROCESSING');
    setErrorMsg('');

    try {
      const fileBuffer = await file.file.arrayBuffer();
      const srcPdf = await PDFDocument.load(fileBuffer);
      const newPdf = await PDFDocument.create();
      const totalPages = srcPdf.getPageCount();

      // Parse range e.g. 1-2
      let pagesToCopy = [0];
      if (pageRange.includes('-')) {
        const [start, end] = pageRange.split('-').map((num) => parseInt(num.trim(), 10));
        if (!isNaN(start) && !isNaN(end)) {
          const s = Math.max(1, Math.min(start, totalPages)) - 1;
          const e = Math.max(1, Math.min(end, totalPages)) - 1;
          pagesToCopy = [];
          for (let i = s; i <= e; i++) pagesToCopy.push(i);
        }
      } else {
        const pageNum = parseInt(pageRange.trim(), 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
          pagesToCopy = [pageNum - 1];
        }
      }

      const copiedPages = await newPdf.copyPages(srcPdf, pagesToCopy);
      copiedPages.forEach((p) => newPdf.addPage(p));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setViewState('SUCCESS');
    } catch (err) {
      console.error('Split Error:', err);
      setErrorMsg('Failed to split PDF. Please verify page numbers.');
      setViewState('WORKSPACE');
    }
  };

  const triggerDownload = () => {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `weveprint_split_${file?.name || 'document.pdf'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    setFile(null);
    setViewState('SELECT');
    setDownloadUrl('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SeoHead
        title="Split PDF Online – 100% Free PDF Splitter | WevePrint"
        description="Separate one page or a whole set for easy conversion into independent PDF files."
        canonicalUrl="https://weveprint.netlify.app/tools/split-pdf"
      />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-between">
        
        {/* STATE 1: SELECT SCREEN */}
        {viewState === 'SELECT' && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in fade-in duration-300">
            <Link
              to="/tools"
              className="inline-flex items-center space-x-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors self-start"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All PDF Tools</span>
            </Link>

            <div className="space-y-3 max-w-2xl">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Split PDF file
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                Separate one page or a whole set for easy conversion into independent PDF files.
              </p>
            </div>

            <div className="space-y-3">
              <label className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-lg sm:text-xl shadow-xl shadow-red-600/30 cursor-pointer transition-all hover:scale-105 active:scale-95">
                <span>Select PDF file</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-slate-400 font-medium">or drop PDF here</p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-bold max-w-md">
                ⚠️ {errorMsg}
              </div>
            )}

            <MergePdfBottomAd />
          </div>
        )}

        {/* STATE 2: WORKSPACE SCREEN */}
        {viewState === 'WORKSPACE' && (
          <div className="flex-1 space-y-6 animate-in fade-in duration-300">
            <MergePdfTopAd />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              <div className="lg:col-span-3 glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs font-bold text-slate-400">Selected PDF Document</span>
                  <button onClick={resetTool} className="text-xs text-rose-400 hover:underline font-bold">
                    Change PDF
                  </button>
                </div>

                <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center space-x-4">
                  <div className="w-14 h-14 rounded-2xl bg-red-950 text-red-400 flex items-center justify-center shrink-0">
                    <Scissors className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{file?.name}</h3>
                    <p className="text-xs text-slate-400">{file?.size} MB</p>
                  </div>
                </div>
              </div>

              {/* Right Action Sidebar Panel */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
                <h2 className="text-xl font-extrabold text-white">Split PDF Settings</h2>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-300 block">Page Range to Extract:</label>
                  <input
                    type="text"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder="e.g. 1-3 or 2"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs focus:outline-none focus:border-red-500"
                  />
                  <p className="text-[10px] text-slate-400">Enter page numbers e.g. 1-2 to extract pages 1 and 2.</p>
                </div>

                <button
                  onClick={handleSplitPdf}
                  className="w-full py-4 rounded-2xl font-extrabold text-base bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white transition-all shadow-xl shadow-red-600/30 active:scale-95 flex items-center justify-center space-x-2"
                >
                  <span>Split PDF</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STATE 3: PROCESSING SCREEN */}
        {viewState === 'PROCESSING' && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in fade-in duration-300">
            <MergePdfTopAd />
            <div className="space-y-4">
              <Loader2 className="w-16 h-16 text-red-500 animate-spin mx-auto" />
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Splitting PDF...</h2>
            </div>
          </div>
        )}

        {/* STATE 4: SUCCESS SCREEN */}
        {viewState === 'SUCCESS' && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-8 animate-in zoom-in-95 duration-300">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              PDF has been split!
            </h2>

            <div className="flex items-center justify-center space-x-4">
              <button onClick={resetTool} className="p-3 rounded-2xl bg-slate-900 border border-slate-700 text-slate-300">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button
                onClick={triggerDownload}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-lg shadow-xl shadow-red-600/30 flex items-center space-x-3"
              >
                <Download className="w-6 h-6" />
                <span>Download Split PDF</span>
              </button>
            </div>

            <MergePdfBottomAd />
          </div>
        )}
      </main>
    </div>
  );
}
