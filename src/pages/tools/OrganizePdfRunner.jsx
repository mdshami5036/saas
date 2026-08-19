import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PDFDocument, degrees } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

import Navbar from '../../components/Navbar';
import SeoHead from '../../components/SeoHead';
import AllToolsTopAd from '../../components/AllToolsTopAd';
import AllToolsBottomAd from '../../components/AllToolsBottomAd';
import {
  Layers,
  UploadCloud,
  Download,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Trash2,
  RotateCw,
  ArrowLeftRight,
  CheckCircle2,
  GripVertical,
} from 'lucide-react';

export default function OrganizePdfRunner() {
  const fileInputRef = useRef(null);

  // State: 'SELECT' | 'WORKSPACE' | 'PROCESSING' | 'SUCCESS'
  const [viewState, setViewState] = useState('SELECT');
  const [file, setFile] = useState(null);
  const [pages, setPages] = useState([]); // [{ id, pageIndex, dataUrl, rotation }]
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [downloadFileName, setDownloadFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Extract HD preview for every single page
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
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        await page.render({ canvasContext: ctx, viewport }).promise;

        extractedPages.push({
          id: `p-${i}-${Date.now()}-${Math.random()}`,
          originalIndex: i - 1, // 0-based index in original PDF
          pageNumber: i,
          dataUrl: canvas.toDataURL('image/png'),
          rotation: 0, // 0, 90, 180, 270
        });
      }

      setPages(extractedPages);
      setViewState('WORKSPACE');
    } catch (err) {
      console.error('Error loading PDF pages:', err);
      setErrorMsg('Failed to load PDF pages. Please verify the PDF file is unencrypted.');
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

  // Drag and drop page reordering
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const updated = [...pages];
    const item = updated[draggedIndex];
    updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, item);

    setPages(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Move page left / right
  const movePage = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= pages.length) return;
    const updated = [...pages];
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setPages(updated);
  };

  // Rotate single page 90 degrees
  const rotatePage = (index) => {
    setPages((prev) =>
      prev.map((p, idx) =>
        idx === index ? { ...p, rotation: (p.rotation + 90) % 360 } : p
      )
    );
  };

  // Delete single page
  const deletePage = (index) => {
    const updated = pages.filter((_, idx) => idx !== index);
    setPages(updated);
    if (updated.length === 0) {
      setViewState('SELECT');
    }
  };

  // Execute Organize PDF Operation
  const handleOrganizePdf = async () => {
    if (pages.length === 0) {
      setErrorMsg('No pages left to organize.');
      return;
    }

    setViewState('PROCESSING');
    setErrorMsg('');

    try {
      const fileBuffer = await file.file.arrayBuffer();
      const srcPdf = await PDFDocument.load(fileBuffer);
      const newPdf = await PDFDocument.create();

      for (const pageObj of pages) {
        const [copiedPage] = await newPdf.copyPages(srcPdf, [pageObj.originalIndex]);
        if (pageObj.rotation > 0) {
          copiedPage.setRotation(degrees(pageObj.rotation));
        }
        newPdf.addPage(copiedPage);
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const outputName = `weveprint_organized_${Date.now()}.pdf`;

      setDownloadUrl(url);
      setDownloadFileName(outputName);
      setViewState('SUCCESS');
    } catch (err) {
      console.error('Organize Error:', err);
      setErrorMsg('Failed to organize PDF pages.');
      setViewState('WORKSPACE');
    }
  };

  const triggerDownload = () => {
    if (!downloadUrl) return;
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = downloadFileName || 'weveprint_organized.pdf';
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SeoHead
        title="Organize PDF Pages Online – Reorder, Delete & Rotate PDF | WevePrint"
        description="Sort, re-order, rotate or delete pages inside your PDF document with real-time drag and drop."
        canonicalUrl="https://weveprint.netlify.app/tools/organize-pdf"
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
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 text-xs font-bold">
                <Layers className="w-3.5 h-3.5" />
                <span>PDF Page Organizer</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Organize PDF Pages
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                Upload your PDF to see live previews of every page. Drag &amp; drop to reorder, rotate or delete pages!
              </p>
            </div>

            <div className="space-y-3">
              <label className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-lg sm:text-xl shadow-xl shadow-cyan-600/30 cursor-pointer transition-all hover:scale-105 active:scale-95">
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

        {/* STATE 2: INTERACTIVE WORKSPACE (Drag & Drop Page Cards) */}
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
                      {pages.length} Pages
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Drag and drop page cards to reorder sequence, or use rotate/delete controls
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleOrganizePdf}
                  disabled={pages.length === 0}
                  className="px-6 py-2.5 rounded-xl font-extrabold text-xs flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-600/30 scale-105 transition-all"
                >
                  <span>Organize PDF</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold text-center">
                {errorMsg}
              </div>
            )}

            {/* Grid of ALL PDF Page Thumbnails for Re-ordering */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {pages.map((p, index) => (
                <div
                  key={p.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`relative group glass-card p-3 rounded-2xl border transition-all cursor-move flex flex-col justify-between space-y-3 ${
                    draggedIndex === index
                      ? 'opacity-40 border-dashed border-cyan-500 scale-95'
                      : dragOverIndex === index
                      ? 'border-cyan-500 bg-cyan-950/40 ring-2 ring-cyan-500/50'
                      : 'border-slate-800 hover:border-slate-700 hover:shadow-xl'
                  }`}
                >
                  {/* Card Header & Actions */}
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => rotatePage(index)}
                        className="p-1 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-900 transition-colors"
                        title="Rotate 90°"
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deletePage(index)}
                        className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors"
                        title="Delete Page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* High-Definition Page Canvas Image Preview with Rotation */}
                  <div className="h-44 w-full rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center relative">
                    <img
                      src={p.dataUrl}
                      alt={`Page ${index + 1}`}
                      className="h-full w-full object-contain p-1 transition-transform duration-300"
                      style={{ transform: `rotate(${p.rotation}deg)` }}
                    />
                    {p.rotation > 0 && (
                      <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[9px] font-mono font-bold border border-cyan-800">
                        {p.rotation}°
                      </span>
                    )}
                  </div>

                  {/* Move Left / Right Buttons */}
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-slate-400 font-bold">Orig P.{p.pageNumber}</span>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => movePage(index, -1)}
                        disabled={index === 0}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 font-bold"
                      >
                        ‹
                      </button>
                      <button
                        onClick={() => movePage(index, 1)}
                        disabled={index === pages.length - 1}
                        className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30 font-bold"
                      >
                        ›
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Ad in Workspace */}
            <div className="pt-6">
              <AllToolsBottomAd />
            </div>
          </div>
        )}

        {/* STATE 3: PROCESSING */}
        {viewState === 'PROCESSING' && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-6 text-center animate-in fade-in duration-300">
            <Loader2 className="w-14 h-14 text-cyan-500 animate-spin" />
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white">Organizing your PDF document...</h2>
              <p className="text-xs text-slate-400">Reordering pages according to your sequence</p>
            </div>
          </div>
        )}

        {/* STATE 4: SUCCESS SCREEN */}
        {viewState === 'SUCCESS' && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in fade-in duration-300">
            <AllToolsTopAd />

            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl sm:text-3xl font-black text-white">PDF Organized Successfully!</h2>
              <p className="text-xs text-slate-400 font-mono truncate">{downloadFileName}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={triggerDownload}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-lg shadow-xl shadow-emerald-500/30 flex items-center space-x-3 transition-all hover:scale-105 active:scale-95"
              >
                <Download className="w-5 h-5" />
                <span>Download Organized PDF</span>
              </button>

              <button
                onClick={resetTool}
                className="px-6 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-800"
              >
                Organize another PDF
              </button>
            </div>

            <div className="pt-6 w-full">
              <AllToolsBottomAd />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
