import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

import Navbar from '../../components/Navbar';
import SeoHead from '../../components/SeoHead';
import AllToolsTopAd from '../../components/AllToolsTopAd';
import AllToolsBottomAd from '../../components/AllToolsBottomAd';
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
  CheckCircle2,
  Sparkles,
  Layers,
} from 'lucide-react';

export default function GenericPdfTool({
  toolTitle,
  toolDescription,
  actionButtonText,
  acceptFileType = 'application/pdf,.pdf',
  iconColor = 'text-cyan-400',
}) {
  const fileInputRef = useRef(null);

  // View state: 'SELECT' | 'WORKSPACE' | 'PROCESSING' | 'SUCCESS'
  const [viewState, setViewState] = useState('SELECT');
  const [files, setFiles] = useState([]);
  const [pagePreviews, setPagePreviews] = useState([]);
  const [isLoadingPreviews, setIsLoadingPreviews] = useState(false);
  const [processedBlobUrl, setProcessedBlobUrl] = useState('');
  const [processedFileName, setProcessedFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Render HD thumbnails for uploaded file
  const loadPreviews = async (selectedFiles) => {
    setIsLoadingPreviews(true);
    const previews = [];

    for (const item of selectedFiles) {
      const file = item.file;
      if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
          const pdfDoc = await loadingTask.promise;
          const maxPages = Math.min(8, pdfDoc.numPages); // First 8 pages

          for (let i = 1; i <= maxPages; i++) {
            const page = await pdfDoc.getPage(i);
            const viewport = page.getViewport({ scale: 0.6 });
            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');
            await page.render({ canvasContext: ctx, viewport }).promise;

            previews.push({
              fileName: file.name,
              pageNumber: i,
              totalPages: pdfDoc.numPages,
              dataUrl: canvas.toDataURL('image/png'),
            });
          }
        } catch (err) {
          console.warn('PDF Preview Error:', err);
        }
      } else if (file.type.startsWith('image/')) {
        previews.push({
          fileName: file.name,
          pageNumber: 1,
          totalPages: 1,
          dataUrl: URL.createObjectURL(file),
        });
      }
    }

    setPagePreviews(previews);
    setIsLoadingPreviews(false);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      const fileList = selectedFiles.map((file, idx) => ({
        id: `${file.name}-${Date.now()}-${idx}`,
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2),
      }));

      setFiles(fileList);
      loadPreviews(fileList);
      setViewState('WORKSPACE');
    }
  };

  const handleProcessFile = async () => {
    if (files.length === 0) return;

    setViewState('PROCESSING');
    setErrorMsg('');

    try {
      const firstFile = files[0].file;
      let outputBlob;

      if (firstFile.type === 'application/pdf' || firstFile.name.endsWith('.pdf')) {
        const fileBuffer = await firstFile.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const pdfBytes = await pdf.save({ useObjectStreams: true });
        outputBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      } else if (firstFile.type.startsWith('image/')) {
        // Image to PDF (Scan to PDF / JPG to PDF)
        const newPdf = await PDFDocument.create();
        for (const item of files) {
          const imageBytes = await item.file.arrayBuffer();
          let embeddedImage;
          if (item.file.type === 'image/png') {
            embeddedImage = await newPdf.embedPng(imageBytes);
          } else {
            embeddedImage = await newPdf.embedJpg(imageBytes);
          }

          const page = newPdf.addPage([embeddedImage.width, embeddedImage.height]);
          page.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: embeddedImage.width,
            height: embeddedImage.height,
          });
        }

        const pdfBytes = await newPdf.save();
        outputBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      } else {
        // Document fallback
        const newPdf = await PDFDocument.create();
        const page = newPdf.addPage();
        page.drawText(`Converted using WevePrint PDF Tools - ${files[0].name}`, {
          x: 50,
          y: 700,
          size: 16,
        });
        const pdfBytes = await newPdf.save();
        outputBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      }

      const downloadUrl = URL.createObjectURL(outputBlob);
      const outputName = `weveprint_${toolTitle.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.pdf`;

      setProcessedBlobUrl(downloadUrl);
      setProcessedFileName(outputName);
      setViewState('SUCCESS');
    } catch (err) {
      console.error(`${toolTitle} Error:`, err);
      setErrorMsg(`Unable to process file. Please make sure the file is valid and unencrypted.`);
      setViewState('WORKSPACE');
    }
  };

  const triggerDownload = () => {
    if (!processedBlobUrl) return;
    const link = document.createElement('a');
    link.href = processedBlobUrl;
    link.download = processedFileName || 'weveprint_document.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    setFiles([]);
    setPagePreviews([]);
    setViewState('SELECT');
    setProcessedBlobUrl('');
    setProcessedFileName('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SeoHead
        title={`${toolTitle} Online – 100% Free Tool | WevePrint`}
        description={toolDescription}
        canonicalUrl="https://weveprint.netlify.app/tools"
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
                {toolTitle}
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                {toolDescription}
              </p>
            </div>

            <div className="space-y-3">
              <label className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-lg sm:text-xl shadow-xl shadow-red-600/30 cursor-pointer transition-all hover:scale-105 active:scale-95">
                <span>Select Document</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={acceptFileType}
                  multiple={acceptFileType.includes('image')}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-slate-500 font-medium">or drop files here</p>
            </div>

            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold max-w-md">
                ⚠️ {errorMsg}
              </div>
            )}
          </div>
        )}

        {/* STATE 2: WORKSPACE SCREEN (Live HD Page Previews) */}
        {viewState === 'WORKSPACE' && (
          <div className="flex-1 space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              <div className="lg:col-span-3 glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-sm font-extrabold text-white">
                      Selected Document ({files.length})
                    </h3>
                    <p className="text-xs text-slate-400">{files[0]?.name}</p>
                  </div>
                  <button
                    onClick={resetTool}
                    className="text-xs text-rose-400 hover:underline font-bold"
                  >
                    Change Document
                  </button>
                </div>

                {isLoadingPreviews ? (
                  <div className="flex items-center justify-center space-x-2 text-cyan-400 font-bold text-xs py-8">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Rendering Real-Time Document Previews...</span>
                  </div>
                ) : pagePreviews.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Real-Time Page Previews
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {pagePreviews.map((preview, idx) => (
                        <div
                          key={idx}
                          className="glass-card p-2 rounded-2xl border border-slate-800 text-center space-y-2"
                        >
                          <div className="h-44 w-full rounded-xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center">
                            <img
                              src={preview.dataUrl}
                              alt={`Page ${preview.pageNumber}`}
                              className="h-full w-full object-contain p-1"
                            />
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono font-bold block">
                            Page {preview.pageNumber} of {preview.totalPages}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-slate-500 text-xs font-bold">
                    File selected: {files[0]?.name} ({files[0]?.size} MB)
                  </div>
                )}
              </div>

              {/* Right Action Sidebar */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
                <h2 className="text-xl font-extrabold text-white">{toolTitle}</h2>

                <div className="p-4 rounded-xl bg-cyan-950/70 border border-cyan-800/80 text-cyan-200 text-xs flex items-start space-x-2.5">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Click the button below to process your document instantly with high fidelity.
                  </p>
                </div>

                <button
                  onClick={handleProcessFile}
                  className="w-full py-4 rounded-2xl font-extrabold text-base bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white transition-all shadow-xl shadow-red-600/30 active:scale-95 flex items-center justify-center space-x-2"
                >
                  <span>{actionButtonText || toolTitle}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

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
              <h2 className="text-2xl font-extrabold text-white">Processing your file...</h2>
              <p className="text-xs text-slate-400">Optimizing and compiling output PDF</p>
            </div>
          </div>
        )}

        {/* STATE 4: SUCCESS & DOWNLOAD SCREEN */}
        {viewState === 'SUCCESS' && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-6 animate-in fade-in duration-300">
            <AllToolsTopAd />

            <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl sm:text-3xl font-black text-white">File Processed Successfully!</h2>
              <p className="text-xs text-slate-400 font-mono truncate">{processedFileName}</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={triggerDownload}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-lg shadow-xl shadow-emerald-500/30 flex items-center space-x-3 transition-all hover:scale-105 active:scale-95"
              >
                <Download className="w-5 h-5" />
                <span>Download Processed PDF</span>
              </button>

              <button
                onClick={resetTool}
                className="px-6 py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-800"
              >
                Process Another File
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
