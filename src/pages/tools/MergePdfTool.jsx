import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
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
  FileArchive,
  Scissors,
  RotateCw,
  Lock,
  RefreshCw,
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

  // Handle Initial File Selection
  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const pdfFiles = selectedFiles.filter(
      (file) => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    );

    if (pdfFiles.length < selectedFiles.length) {
      setErrorMsg('Some files were skipped because they are not valid PDF documents.');
      setTimeout(() => setErrorMsg(''), 4000);
    }

    if (pdfFiles.length > 0) {
      const newFileList = pdfFiles.map((file, idx) => ({
        id: `${file.name}-${Date.now()}-${idx}`,
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2),
      }));

      setFiles((prev) => {
        const combined = [...prev, ...newFileList];
        if (combined.length > 0) {
          setViewState('WORKSPACE');
        }
        return combined;
      });
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
      setErrorMsg('Please select at least 2 PDF files to merge.');
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
      setErrorMsg('Failed to merge PDFs. Please make sure the PDF files are not password protected.');
      setViewState('WORKSPACE');
    }
  };

  // Trigger Instant Download
  const triggerDownload = () => {
    if (!mergedBlobUrl) return;
    const link = document.createElement('a');
    link.href = mergedBlobUrl;
    link.download = mergedFileName || 'weveprint_merged.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Reset tool
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
        title="Merge PDF Files – 100% Free Online PDF Merger | WevePrint"
        description="Combine PDFs in the order you want with the easiest PDF merger available. Drag & drop PDF files to combine them into one document."
        canonicalUrl="https://weveprint.netlify.app/tools/merge-pdf"
      />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-between">
        
        {/* ========================================================================= */}
        {/* STATE 1: INITIAL SELECT SCREEN (Screenshot 1) */}
        {/* ========================================================================= */}
        {viewState === 'SELECT' && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in fade-in duration-300">
            <div className="space-y-3 max-w-2xl">
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Merge PDF files
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                Combine PDFs in the order you want with the easiest PDF merger available.
              </p>
            </div>

            {/* Red/Cyan Primary Select PDF Button matching Screenshot 1 */}
            <div className="space-y-3">
              <label className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-lg sm:text-xl shadow-xl shadow-red-600/30 cursor-pointer transition-all hover:scale-105 active:scale-95">
                <span>Select PDF files</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="application/pdf,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-slate-400 font-medium">or drop PDFs here</p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-bold max-w-md">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* AD PLACEMENT 1: Bottom Banner AdSense Unit (slot 5915624899) */}
            <MergePdfBottomAd />
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATE 2: WORKSPACE & DRAG-AND-DROP CARDS (Screenshots 2 & 3) */}
        {/* ========================================================================= */}
        {viewState === 'WORKSPACE' && (
          <div className="flex-1 space-y-6 animate-in fade-in duration-300">
            
            {/* Main Grid: Left Workspace Cards + Right Sidebar Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* Left Workspace: PDF Cards Grid */}
              <div className="lg:col-span-3 glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 relative min-h-[420px]">
                
                {/* Cards Header Action Bar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs font-bold text-slate-400">
                    {files.length} PDF File(s) Selected • Drag cards to reorder
                  </span>
                  
                  {/* Floating Action Tools: Add More Files & Sort A-Z */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSortAZ}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors flex items-center space-x-1"
                      title="Sort A-Z"
                    >
                      <SortAsc className="w-4 h-4 text-cyan-400" />
                      <span>Sort A-Z</span>
                    </button>

                    <label className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-extrabold shadow-md cursor-pointer transition-transform hover:scale-105 flex items-center space-x-1">
                      <Plus className="w-4 h-4" />
                      <span>Add files</span>
                      <input
                        ref={addMoreInputRef}
                        type="file"
                        multiple
                        accept="application/pdf,.pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* PDF Cards Grid with Drag-and-Drop */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {files.map((item, index) => {
                    const isDragging = draggedIndex === index;
                    const isOver = dragOverIndex === index;
                    return (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragEnd={handleDragEnd}
                        className={`relative group glass-card p-4 rounded-2xl border transition-all cursor-grab active:cursor-grabbing text-center space-y-3 ${
                          isDragging
                            ? 'opacity-40 scale-95 border-red-500'
                            : isOver
                            ? 'border-cyan-400 bg-cyan-950/40 scale-105'
                            : 'border-slate-800 hover:border-cyan-500/60'
                        }`}
                      >
                        {/* Number Index Badge */}
                        <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-red-600 text-white font-extrabold text-[11px] flex items-center justify-center shadow-md">
                          {index + 1}
                        </div>

                        {/* Delete Card Button */}
                        <button
                          onClick={() => removeFile(item.id)}
                          className="absolute top-2 right-2 p-1 rounded-lg bg-slate-900/80 text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
                          title="Remove PDF"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* PDF Thumbnail Canvas Box */}
                        <div className="w-full h-36 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center p-3 text-cyan-400 group-hover:border-cyan-500/40 transition-colors">
                          <FileText className="w-10 h-10 mb-1" />
                          <span className="text-[10px] font-mono text-slate-400">{item.size} MB</span>
                        </div>

                        {/* PDF File Name */}
                        <p className="text-xs font-bold text-white truncate px-1" title={item.name}>
                          {item.name}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Sidebar Panel matching Screenshots 2 & 3 */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
                <h2 className="text-xl font-extrabold text-white">Merge PDF</h2>

                {/* Instruction Alert Box matching Screenshot 3 */}
                <div className="p-4 rounded-xl bg-cyan-950/70 border border-cyan-800/80 text-cyan-200 text-xs flex items-start space-x-2.5">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    To change the order of your PDFs, drag and drop the files as you want.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-bold">
                    ⚠️ {errorMsg}
                  </div>
                )}

                {/* Submit Merge PDF Button matching Screenshot 2 & 3 */}
                <button
                  onClick={handleMergePdfs}
                  disabled={files.length < 2}
                  className="w-full py-4 rounded-2xl font-extrabold text-base bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white transition-all shadow-xl shadow-red-600/30 active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span>Merge PDF Files</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <MergePdfTopAd />
              <MergePdfBottomAd />
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATE 3: MERGING PROCESSING SCREEN (Screenshot 4) */}
        {/* ========================================================================= */}
        {viewState === 'MERGING' && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in fade-in duration-300">
            <MergePdfTopAd />

            <div className="space-y-4">
              <Loader2 className="w-16 h-16 text-red-500 animate-spin mx-auto" />
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Merging PDFs...</h2>
              <p className="text-xs text-slate-400">Combining pages in specified order...</p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STATE 4: SUCCESS DOWNLOAD SCREEN (Screenshot 5) */}
        {/* ========================================================================= */}
        {viewState === 'SUCCESS' && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-8 animate-in zoom-in-95 duration-300">
            
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                PDFs have been merged!
              </h2>
            </div>

            {/* Large Red/Cyan Download Button matching Screenshot 5 */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={resetTool}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
                title="Start Over / Merge Another"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>

              <button
                onClick={triggerDownload}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-lg sm:text-xl shadow-xl shadow-red-600/30 transition-all hover:scale-105 active:scale-95 flex items-center space-x-3"
              >
                <Download className="w-6 h-6" />
                <span>Download merged PDF</span>
              </button>

              <button
                onClick={resetTool}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
                title="Clear Files"
              >
                <Trash2 className="w-6 h-6" />
              </button>
            </div>

            {/* Continue to... Recommendations Grid matching Screenshot 5 */}
            <div className="glass-card p-8 rounded-2xl border border-slate-800 max-w-3xl w-full space-y-6 text-left">
              <h3 className="text-sm font-extrabold text-slate-300 uppercase tracking-wider">Continue to...</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                  to="/tools"
                  className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center space-x-3 transition-colors group"
                >
                  <FileArchive className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-xs font-bold text-white group-hover:text-cyan-400">Compress PDF</span>
                </Link>

                <Link
                  to="/tools"
                  className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center space-x-3 transition-colors group"
                >
                  <Scissors className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="text-xs font-bold text-white group-hover:text-cyan-400">Split PDF</span>
                </Link>

                <Link
                  to="/tools"
                  className="p-4 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center space-x-3 transition-colors group"
                >
                  <Lock className="w-5 h-5 text-indigo-400 shrink-0" />
                  <span className="text-xs font-bold text-white group-hover:text-cyan-400">Protect PDF</span>
                </Link>
              </div>
            </div>

            <MergePdfBottomAd />
          </div>
        )}
      </main>
    </div>
  );
}
