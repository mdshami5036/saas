import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

import Navbar from '../../components/Navbar';
import SeoHead from '../../components/SeoHead';
import MergePdfBottomAd from '../../components/MergePdfBottomAd';
import MergePdfTopAd from '../../components/MergePdfTopAd';
import {
  FileText,
  UploadCloud,
  Plus,
  Trash2,
  Download,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Info,
  SortAsc,
  Layers,
  GripVertical,
  CheckCircle2,
} from 'lucide-react';

export default function MergePdfTool() {
  const fileInputRef = useRef(null);
  const addMoreInputRef = useRef(null);

  // State: 'SELECT' | 'WORKSPACE' | 'MERGING' | 'SUCCESS'
  const [viewState, setViewState] = useState('SELECT');
  const [files, setFiles] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [mergedBlobUrl, setMergedBlobUrl] = useState('');
  const [mergedFileName, setMergedFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoadingPreviews, setIsLoadingPreviews] = useState(false);

  // Extract cover thumbnail & page count for a PDF file
  const loadPdfMetadata = async (fileObj) => {
    try {
      const arrayBuffer = await fileObj.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;

      // Render Page 1 Cover Thumbnail
      const page = await pdfDoc.getPage(1);
      const viewport = page.getViewport({ scale: 1.5 });
      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      await page.render({ canvasContext: ctx, viewport }).promise;
      const coverUrl = canvas.toDataURL('image/png');

      return { numPages, coverUrl };
    } catch (err) {
      console.warn('Failed to render PDF thumbnail:', err);
      return { numPages: 1, coverUrl: '' };
    }
  };

  // Handle Initial & Add More File Selection
  const handleFileSelect = async (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const pdfFiles = selectedFiles.filter(
      (file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfFiles.length < selectedFiles.length) {
      setErrorMsg('Some non-PDF files were skipped.');
      setTimeout(() => setErrorMsg(''), 4000);
    }

    if (pdfFiles.length > 0) {
      setIsLoadingPreviews(true);
      const newFileList = [];

      for (let idx = 0; idx < pdfFiles.length; idx++) {
        const file = pdfFiles[idx];
        const meta = await loadPdfMetadata(file);
        newFileList.push({
          id: `${file.name}-${Date.now()}-${idx}-${Math.random()}`,
          file,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2),
          numPages: meta.numPages,
          coverUrl: meta.coverUrl,
        });
      }

      setFiles((prev) => {
        const combined = [...prev, ...newFileList];
        if (combined.length > 0) {
          setViewState('WORKSPACE');
        }
        return combined;
      });
      setIsLoadingPreviews(false);
    }
  };

  // Drag and Drop re-ordering handlers
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

    const updatedFiles = [...files];
    const draggedItem = updatedFiles[draggedIndex];
    updatedFiles.splice(draggedIndex, 1);
    updatedFiles.splice(dropIndex, 0, draggedItem);

    setFiles(updatedFiles);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Sort Files A-Z
  const handleSortAZ = () => {
    const sorted = [...files].sort((a, b) => a.name.localeCompare(b.name));
    setFiles(sorted);
  };

  // Move single item left / right
  const moveItem = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= files.length) return;
    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFiles(updated);
  };

  // Remove single file
  const removeFile = (id) => {
    const updated = files.filter((item) => item.id !== id);
    setFiles(updated);
    if (updated.length === 0) {
      setViewState('SELECT');
    }
  };

  // Execute Merge PDF Operation
  const handleMergePdf = async () => {
    if (files.length < 2) {
      setErrorMsg('Please select at least 2 PDF files to merge together.');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    setViewState('MERGING');
    setErrorMsg('');

    try {
      const mergedPdf = await PDFDocument.create();

      for (const fileObj of files) {
        const fileArrayBuffer = await fileObj.file.arrayBuffer();
        const pdf = await PDFDocument.load(fileArrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const downloadUrl = URL.createObjectURL(blob);
      const outputName = `weveprint_merged_${Date.now()}.pdf`;

      setMergedBlobUrl(downloadUrl);
      setMergedFileName(outputName);
      setViewState('SUCCESS');
    } catch (err) {
      console.error('PDF Merge Error:', err);
      setErrorMsg('Failed to merge PDFs. Please ensure the PDF files are valid and not password protected.');
      setViewState('WORKSPACE');
    }
  };

  const triggerDownload = () => {
    if (!mergedBlobUrl) return;
    const link = document.createElement('a');
    link.href = mergedBlobUrl;
    link.download = mergedFileName || 'weveprint_merged.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    setFiles([]);
    setViewState('SELECT');
    setMergedBlobUrl('');
    setMergedFileName('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SeoHead
        title="Merge PDF Files Online – 100% Free PDF Merger | WevePrint"
        description="Combine PDF files in the order you want with the easiest PDF merger available. 100% free, fast, and secure."
        canonicalUrl="https://weveprint.netlify.app/tools/merge-pdf"
      />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-between">
        
        {/* STATE 1: INITIAL SELECT SCREEN */}
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
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/80 text-red-400 text-xs font-bold">
                <Layers className="w-3.5 h-3.5" />
                <span>PDF Organizer &amp; Merger</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Merge PDF files
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                Combine PDF files in the order you want with real-time page previews. Drag &amp; drop to reorder!
              </p>
            </div>

            <div className="space-y-3">
              <label className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-lg sm:text-xl shadow-xl shadow-red-600/30 cursor-pointer transition-all hover:scale-105 active:scale-95">
                <span>Select PDF files</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-slate-500 font-medium">or drop PDFs here</p>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold max-w-md">
                {errorMsg}
              </div>
            )}
          </div>
        )}

        {/* STATE 2: INTERACTIVE WORKSPACE (Drag & Drop Reordering + Live Previews) */}
        {viewState === 'WORKSPACE' && (
          <div className="flex-1 flex flex-col space-y-6 animate-in fade-in duration-300">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 glass-card p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center space-x-3">
                <Link
                  to="/tools"
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <div>
                  <h2 className="text-base font-extrabold text-white flex items-center space-x-2">
                    <span>Merge PDFs</span>
                    <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono">
                      {files.length} {files.length === 1 ? 'file' : 'files'} selected
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Drag and drop cards to change sequence order
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handleSortAZ}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs font-bold hover:bg-slate-800 flex items-center space-x-1.5"
                  title="Sort A to Z"
                >
                  <SortAsc className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Sort A-Z</span>
                </button>

                <label className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold hover:bg-slate-800 cursor-pointer flex items-center space-x-1.5">
                  <Plus className="w-3.5 h-3.5 text-red-400" />
                  <span>Add More PDFs</span>
                  <input
                    ref={addMoreInputRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>

                {/* Merge Action Button */}
                <button
                  onClick={handleMergePdf}
                  disabled={files.length < 2 || isLoadingPreviews}
                  className={`px-6 py-2.5 rounded-xl font-extrabold text-xs flex items-center space-x-2 shadow-lg transition-all ${
                    files.length >= 2 && !isLoadingPreviews
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-red-600/30 scale-105'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <span>Merge PDF</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {isLoadingPreviews && (
              <div className="flex items-center justify-center space-x-2 text-cyan-400 font-bold text-xs py-4">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading HD PDF Page Previews...</span>
              </div>
            )}

            {files.length < 2 && !isLoadingPreviews && (
              <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-800/80 text-amber-300 text-xs font-bold text-center">
                ⚠️ Select at least 2 PDF files to activate the Merge PDF button.
              </div>
            )}

            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold text-center">
                {errorMsg}
              </div>
            )}

            {/* Grid of PDF Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {files.map((fileObj, index) => (
                <div
                  key={fileObj.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`relative group glass-card p-3 rounded-2xl border transition-all cursor-move flex flex-col justify-between space-y-3 ${
                    draggedIndex === index
                      ? 'opacity-40 border-dashed border-red-500 scale-95'
                      : dragOverIndex === index
                      ? 'border-red-500 bg-red-950/40 ring-2 ring-red-500/50'
                      : 'border-slate-800 hover:border-slate-700 hover:shadow-xl'
                  }`}
                >
                  {/* Card Header Badge */}
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-slate-900 border border-slate-700 text-white font-mono font-bold text-[10px] flex items-center justify-center">
                      #{index + 1}
                    </span>
                    <button
                      onClick={() => removeFile(fileObj.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors"
                      title="Remove PDF"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Real-time PDF Cover Preview */}
                  <div className="h-40 w-full rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center relative">
                    {fileObj.coverUrl ? (
                      <img
                        src={fileObj.coverUrl}
                        alt={`Preview of ${fileObj.name}`}
                        className="h-full w-full object-contain p-1"
                      />
                    ) : (
                      <FileText className="w-12 h-12 text-slate-700" />
                    )}
                    <span className="absolute bottom-1 right-1 px-2 py-0.5 rounded-md bg-slate-950/90 text-cyan-400 border border-cyan-800/80 text-[10px] font-extrabold font-mono">
                      {fileObj.numPages} {fileObj.numPages === 1 ? 'Page' : 'Pages'}
                    </span>
                  </div>

                  {/* Details & Move Controls */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-white truncate" title={fileObj.name}>
                      {fileObj.name}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{fileObj.size} MB</span>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => moveItem(index, -1)}
                          disabled={index === 0}
                          className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30"
                        >
                          ‹
                        </button>
                        <button
                          onClick={() => moveItem(index, 1)}
                          disabled={index === files.length - 1}
                          className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-30"
                        >
                          ›
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Ad in Workspace mode */}
            <div className="pt-6">
              <MergePdfBottomAd />
            </div>
          </div>
        )}

        {/* STATE 3: MERGING IN PROGRESS */}
        {viewState === 'MERGING' && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 space-y-6 text-center animate-in fade-in duration-300">
            <Loader2 className="w-14 h-14 text-red-500 animate-spin" />
            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white">Merging your PDF files...</h2>
              <p className="text-xs text-slate-400">Compiling all PDF pages into a single document</p>
            </div>
          </div>
        )}

        {/* STATE 4: SUCCESS & DOWNLOAD SCREEN */}
        {viewState === 'SUCCESS' && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in fade-in duration-300">
            <MergePdfTopAd />

            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl sm:text-3xl font-black text-white">PDFs Merged Successfully!</h2>
              <p className="text-xs text-slate-400 font-mono truncate">{mergedFileName}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={triggerDownload}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-lg shadow-xl shadow-emerald-500/30 flex items-center space-x-3 transition-all hover:scale-105 active:scale-95"
              >
                <Download className="w-5 h-5" />
                <span>Download Merged PDF</span>
              </button>

              <button
                onClick={resetTool}
                className="px-6 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-800"
              >
                Merge another PDF
              </button>
            </div>

            <div className="pt-6 w-full">
              <MergePdfBottomAd />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
