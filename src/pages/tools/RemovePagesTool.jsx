import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
import Navbar from '../../components/Navbar';
import SeoHead from '../../components/SeoHead';
import RemovePagesTopAd from '../../components/RemovePagesTopAd';
import RemovePagesBottomAd from '../../components/RemovePagesBottomAd';
import {
  Trash2,
  UploadCloud,
  Download,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Info,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export default function RemovePagesTool() {
  const fileInputRef = useRef(null);

  // State: 'SELECT' | 'WORKSPACE' | 'PROCESSING' | 'SUCCESS'
  const [viewState, setViewState] = useState('SELECT');
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [removedPages, setRemovedPages] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileSelect = async (e) => {
    const selected = e.target.files?.[0];
    if (selected && (selected.type === 'application/pdf' || selected.name.endsWith('.pdf'))) {
      try {
        const buffer = await selected.arrayBuffer();
        const pdf = await PDFDocument.load(buffer);
        const count = pdf.getPageCount();

        setFile({
          file: selected,
          name: selected.name,
          size: (selected.size / (1024 * 1024)).toFixed(2),
        });
        setPageCount(count);
        setRemovedPages([]);
        setViewState('WORKSPACE');
      } catch (err) {
        console.error('PDF Read Error:', err);
        setErrorMsg('Unable to read PDF file pages.');
      }
    } else {
      setErrorMsg('Please select a valid PDF document.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  const togglePageRemove = (pageNum) => {
    setRemovedPages((prev) =>
      prev.includes(pageNum) ? prev.filter((p) => p !== pageNum) : [...prev, pageNum]
    );
  };

  const handleRemovePages = async () => {
    if (!file) return;
    if (removedPages.length >= pageCount) {
      setErrorMsg('You cannot remove all pages from the PDF document.');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    setViewState('PROCESSING');
    setErrorMsg('');

    try {
      const buffer = await file.file.arrayBuffer();
      const srcPdf = await PDFDocument.load(buffer);
      const newPdf = await PDFDocument.create();

      const pagesToKeep = [];
      for (let i = 1; i <= pageCount; i++) {
        if (!removedPages.includes(i)) {
          pagesToKeep.push(i - 1);
        }
      }

      const copied = await newPdf.copyPages(srcPdf, pagesToKeep);
      copied.forEach((p) => newPdf.addPage(p));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      setDownloadUrl(url);
      setViewState('SUCCESS');
    } catch (err) {
      console.error('Remove pages error:', err);
      setErrorMsg('Failed to remove pages. Please try again.');
      setViewState('WORKSPACE');
    }
  };

  const triggerDownload = () => {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `weveprint_removed_${file?.name || 'document.pdf'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    setFile(null);
    setPageCount(0);
    setRemovedPages([]);
    setViewState('SELECT');
    setDownloadUrl('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SeoHead
        title="Remove Pages from PDF – 100% Free Tool | WevePrint"
        description="Delete unwanted pages from your PDF file with interactive selection."
        canonicalUrl="https://weveprint.netlify.app/tools/remove-pages"
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
                Remove pages from PDF
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                Delete unwanted pages from your PDF document. Select pages to remove them.
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

            <RemovePagesBottomAd />
          </div>
        )}

        {/* STATE 2: WORKSPACE SCREEN */}
        {viewState === 'WORKSPACE' && (
          <div className="flex-1 space-y-6 animate-in fade-in duration-300">
            <RemovePagesTopAd />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* Left Workspace: Interactive Page Thumbnails */}
              <div className="lg:col-span-3 glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs font-bold text-slate-400">
                    Total Pages ({pageCount}) • Click pages to mark for deletion
                  </span>
                  <button onClick={resetTool} className="text-xs text-rose-400 hover:underline font-bold">
                    Change PDF
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNum) => {
                    const isRemoved = removedPages.includes(pageNum);
                    return (
                      <button
                        key={pageNum}
                        onClick={() => togglePageRemove(pageNum)}
                        className={`relative glass-card p-4 rounded-2xl border transition-all text-center space-y-2 group ${
                          isRemoved
                            ? 'border-rose-600 bg-rose-950/40 opacity-50 scale-95'
                            : 'border-slate-800 hover:border-cyan-500/60'
                        }`}
                      >
                        <div className="w-full h-28 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-white">
                          <FileText className="w-8 h-8" />
                        </div>
                        <div className="flex items-center justify-between px-1">
                          <span className="text-xs font-bold text-slate-300">Page {pageNum}</span>
                          {isRemoved ? (
                            <Trash2 className="w-4 h-4 text-rose-400" />
                          ) : (
                            <span className="text-[10px] text-slate-500">Keep</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Action Sidebar */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
                <h2 className="text-xl font-extrabold text-white">Remove Pages</h2>

                <div className="p-4 rounded-xl bg-cyan-950/70 border border-cyan-800/80 text-cyan-200 text-xs flex items-start space-x-2.5">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Selected pages to remove: <strong className="text-rose-400">{removedPages.length}</strong> of {pageCount}
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-bold">
                    ⚠️ {errorMsg}
                  </div>
                )}

                <button
                  onClick={handleRemovePages}
                  disabled={removedPages.length === 0}
                  className="w-full py-4 rounded-2xl font-extrabold text-base bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white transition-all shadow-xl shadow-red-600/30 active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Remove Pages</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STATE 3: PROCESSING SCREEN */}
        {viewState === 'PROCESSING' && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in fade-in duration-300">
            <RemovePagesTopAd />
            <div className="space-y-4">
              <Loader2 className="w-16 h-16 text-red-500 animate-spin mx-auto" />
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Removing Pages...</h2>
            </div>
          </div>
        )}

        {/* STATE 4: SUCCESS SCREEN */}
        {viewState === 'SUCCESS' && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-8 animate-in zoom-in-95 duration-300">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Pages removed successfully!
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
                <span>Download PDF</span>
              </button>
            </div>

            <RemovePagesBottomAd />
          </div>
        )}
      </main>
    </div>
  );
}
