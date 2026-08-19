import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

import Navbar from '../../components/Navbar';
import SeoHead from '../../components/SeoHead';
import SplitPdfTopAd from '../../components/SplitPdfTopAd';
import SplitPdfBottomAd from '../../components/SplitPdfBottomAd';
import {
  Scissors,
  UploadCloud,
  Download,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Check,
  CheckSquare,
  Square,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

export default function SplitPdfTool({ isExtractMode = false }) {
  const fileInputRef = useRef(null);

  // State: 'SELECT' | 'WORKSPACE' | 'PROCESSING' | 'SUCCESS'
  const [viewState, setViewState] = useState('SELECT');
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]); // [{ pageNumber: 1, dataUrl: '...', selected: true }]
  const [pageRangeText, setPageRangeText] = useState('1');
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [downloadFileName, setDownloadFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Render HD thumbnails for EVERY SINGLE PAGE of the PDF
  const loadPdfPages = async (fileObj) => {
    setIsLoadingPages(true);
    setErrorMsg('');

    try {
      const arrayBuffer = await fileObj.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      const totalPages = pdfDoc.numPages;
      const extractedPages = [];

      for (let i = 1; i <= totalPages; i++) {
        const page = await pdfDoc.getPage(i);
        const viewport = page.getViewport({ scale: 0.75 }); // Sharp HD thumbnail
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;

        extractedPages.push({
          pageNumber: i,
          dataUrl: canvas.toDataURL('image/png'),
          selected: true, // Selected by default
        });
      }

      setPages(extractedPages);
      setPageRangeText(`1-${totalPages}`);
      setViewState('WORKSPACE');
    } catch (err) {
      console.error('Error loading PDF pages:', err);
      setErrorMsg('Failed to load PDF pages. Please make sure the PDF file is unencrypted.');
    } finally {
      setIsLoadingPages(false);
    }
  };

  const handleFileSelect = (e) => {
    const selected = e.target.files?.[0];
    if (selected && (selected.type === 'application/pdf' || selected.name.endsWith('.pdf'))) {
      setFile({
        file: selected,
        name: selected.name,
        size: (selected.size / (1024 * 1024)).toFixed(2),
      });
      loadPdfPages(selected);
    } else {
      setErrorMsg('Please select a valid PDF document.');
      setTimeout(() => setErrorMsg(''), 4000);
    }
  };

  // Toggle single page checkmark selection
  const togglePageSelection = (pageNumber) => {
    setPages((prev) => {
      const updated = prev.map((p) =>
        p.pageNumber === pageNumber ? { ...p, selected: !p.selected } : p
      );
      // Sync Range Text input
      const selectedNums = updated.filter((p) => p.selected).map((p) => p.pageNumber);
      setPageRangeText(selectedNums.join(', '));
      return updated;
    });
  };

  // Select All / Deselect All
  const handleSelectAll = (select) => {
    setPages((prev) => {
      const updated = prev.map((p) => ({ ...p, selected: select }));
      if (select) {
        setPageRangeText(`1-${updated.length}`);
      } else {
        setPageRangeText('');
      }
      return updated;
    });
  };

  // Handle manual page range text change e.g. "1-3, 5"
  const handleRangeTextChange = (text) => {
    setPageRangeText(text);
    const selectedSet = new Set();

    const parts = text.split(',');
    parts.forEach((part) => {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map((n) => parseInt(n.trim(), 10));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
            selectedSet.add(i);
          }
        }
      } else {
        const num = parseInt(trimmed, 10);
        if (!isNaN(num)) selectedSet.add(num);
      }
    });

    setPages((prev) =>
      prev.map((p) => ({ ...p, selected: selectedSet.has(p.pageNumber) }))
    );
  };

  // Execute Split / Extract PDF Operation
  const handleSplitPdf = async () => {
    const selectedPages = pages.filter((p) => p.selected);
    if (selectedPages.length === 0) {
      setErrorMsg('Please tick/check at least 1 page to split.');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    setViewState('PROCESSING');
    setErrorMsg('');

    try {
      const fileBuffer = await file.file.arrayBuffer();
      const srcPdf = await PDFDocument.load(fileBuffer);
      const newPdf = await PDFDocument.create();

      const pageIndices = selectedPages.map((p) => p.pageNumber - 1);
      const copiedPages = await newPdf.copyPages(srcPdf, pageIndices);
      copiedPages.forEach((p) => newPdf.addPage(p));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const outputName = `weveprint_${isExtractMode ? 'extracted' : 'split'}_${Date.now()}.pdf`;

      setDownloadUrl(url);
      setDownloadFileName(outputName);
      setViewState('SUCCESS');
    } catch (err) {
      console.error('Split Error:', err);
      setErrorMsg('Failed to process PDF pages. Please try another PDF.');
      setViewState('WORKSPACE');
    }
  };

  const triggerDownload = () => {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = downloadFileName || 'weveprint_split.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    setFile(null);
    setPages([]);
    setViewState('SELECT');
    setDownloadUrl('');
    setErrorMsg('');
  };

  const selectedCount = pages.filter((p) => p.selected).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SeoHead
        title={`${isExtractMode ? 'Extract Pages from PDF' : 'Split PDF File'} Online – 100% Free | WevePrint`}
        description="Split PDF pages or extract selected pages from your PDF with real-time page previews."
        canonicalUrl={`https://weveprint.netlify.app/tools/${isExtractMode ? 'extract-pages' : 'split-pdf'}`}
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
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-800/80 text-orange-400 text-xs font-bold">
                <Scissors className="w-3.5 h-3.5" />
                <span>PDF Page Extractor &amp; Splitter</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {isExtractMode ? 'Extract Pages from PDF' : 'Split PDF File'}
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                Upload your PDF to see live previews of every page. Tick/check only the pages you want to download!
              </p>
            </div>

            <div className="space-y-3">
              <label className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-extrabold text-lg sm:text-xl shadow-xl shadow-orange-600/30 cursor-pointer transition-all hover:scale-105 active:scale-95">
                <span>Select PDF File</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-slate-500 font-medium">or drop PDF here</p>
            </div>

            {isLoadingPages && (
              <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Rendering Real-Time Page Previews...</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold max-w-md">
                {errorMsg}
              </div>
            )}
          </div>
        )}

        {/* STATE 2: INTERACTIVE WORKSPACE (Real-Time Previews of EVERY Page with Checkboxes) */}
        {viewState === 'WORKSPACE' && (
          <div className="flex-1 flex flex-col space-y-6 animate-in fade-in duration-300">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-3">
                <button
                  onClick={resetTool}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center space-x-2">
                    <span className="truncate max-w-[200px] sm:max-w-xs">{file?.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono font-bold">
                      {selectedCount} of {pages.length} Pages Checked
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Tickmark the pages you want to extract into your new PDF
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Select All / Deselect All */}
                <button
                  onClick={() => handleSelectAll(true)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800 flex items-center space-x-1"
                >
                  <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Select All</span>
                </button>
                <button
                  onClick={() => handleSelectAll(false)}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800 flex items-center space-x-1"
                >
                  <Square className="w-3.5 h-3.5 text-slate-400" />
                  <span>Deselect All</span>
                </button>

                {/* Page Range Input */}
                <div className="flex items-center space-x-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Range:</span>
                  <input
                    type="text"
                    value={pageRangeText}
                    onChange={(e) => handleRangeTextChange(e.target.value)}
                    placeholder="e.g. 1-3, 5"
                    className="w-24 bg-transparent text-white font-mono text-xs font-bold focus:outline-none"
                  />
                </div>

                {/* Process Button */}
                <button
                  onClick={handleSplitPdf}
                  disabled={selectedCount === 0}
                  className={`px-6 py-2.5 rounded-xl font-extrabold text-xs flex items-center space-x-2 shadow-lg transition-all ${
                    selectedCount > 0
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white shadow-orange-600/30 scale-105'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <span>{isExtractMode ? 'Extract PDF' : 'Split PDF'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold text-center">
                {errorMsg}
              </div>
            )}

            {/* Grid of ALL PDF Page Thumbnails with Interactive Checkboxes */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {pages.map((p) => (
                <div
                  key={p.pageNumber}
                  onClick={() => togglePageSelection(p.pageNumber)}
                  className={`relative group glass-card p-2.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 ${
                    p.selected
                      ? 'border-cyan-500 bg-cyan-950/30 ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-500/10'
                      : 'border-slate-800 opacity-60 hover:opacity-100 hover:border-slate-700'
                  }`}
                >
                  {/* Top Checkmark Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      Page {p.pageNumber}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        p.selected
                          ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-md'
                          : 'bg-slate-900 border-slate-700 text-transparent'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>

                  {/* High-Definition Page Canvas Image Preview */}
                  <div className="h-48 w-full rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
                    <img
                      src={p.dataUrl}
                      alt={`Page ${p.pageNumber} Preview`}
                      className="h-full w-full object-contain p-1"
                    />
                  </div>

                  <div className="text-center">
                    <span
                      className={`text-[10px] font-bold block ${
                        p.selected ? 'text-cyan-400' : 'text-slate-500'
                      }`}
                    >
                      {p.selected ? '✓ CHECKED' : 'UNCHECKED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Ad in Workspace */}
            <div className="pt-6">
              <SplitPdfBottomAd />
            </div>
          </div>
        )}

        {/* STATE 3: PROCESSING */}
        {viewState === 'PROCESSING' && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-6 text-center animate-in fade-in duration-300">
            <Loader2 className="w-14 h-14 text-orange-500 animate-spin" />
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white">
                {isExtractMode ? 'Extracting selected PDF pages...' : 'Splitting PDF document...'}
              </h2>
              <p className="text-xs text-slate-400">Compiling checked pages into output PDF</p>
            </div>
          </div>
        )}

        {/* STATE 4: SUCCESS SCREEN */}
        {viewState === 'SUCCESS' && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in fade-in duration-300">
            <SplitPdfTopAd />

            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl sm:text-3xl font-black text-white">PDF Split Successfully!</h2>
              <p className="text-xs text-slate-400 font-mono truncate">{downloadFileName}</p>
              <p className="text-xs text-cyan-400 font-bold">
                {selectedCount} Pages Extracted &amp; Compiled
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={triggerDownload}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-lg shadow-xl shadow-emerald-500/30 flex items-center space-x-3 transition-all hover:scale-105 active:scale-95"
              >
                <Download className="w-5 h-5" />
                <span>Download Split PDF</span>
              </button>

              <button
                onClick={resetTool}
                className="px-6 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-800"
              >
                Split another PDF
              </button>
            </div>

            <div className="pt-6 w-full">
              <SplitPdfBottomAd />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
