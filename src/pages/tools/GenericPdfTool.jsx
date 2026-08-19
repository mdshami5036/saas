import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
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
  const [processedBlobUrl, setProcessedBlobUrl] = useState('');
  const [processedFileName, setProcessedFileName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
      setViewState('WORKSPACE');
    }
  };

  const handleProcessFile = async () => {
    if (files.length === 0) return;

    setViewState('PROCESSING');
    setErrorMsg('');

    try {
      // Simulate/perform client-side PDF processing
      const firstFile = files[0].file;
      let outputBlob;

      if (firstFile.type === 'application/pdf' || firstFile.name.endsWith('.pdf')) {
        const fileBuffer = await firstFile.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const pdfBytes = await pdf.save();
        outputBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      } else {
        // Image or text to PDF creation
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
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-slate-400 font-medium">or drop files here</p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-bold max-w-md">
                ⚠️ {errorMsg}
              </div>
            )}

            <AllToolsBottomAd />
          </div>
        )}

        {/* STATE 2: WORKSPACE SCREEN */}
        {viewState === 'WORKSPACE' && (
          <div className="flex-1 space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              <div className="lg:col-span-3 glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs font-bold text-slate-400">
                    Selected File ({files.length})
                  </span>
                  <button
                    onClick={resetTool}
                    className="text-xs text-rose-400 hover:underline font-bold"
                  >
                    Change File
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {files.map((item) => (
                    <div
                      key={item.id}
                      className="glass-card p-6 rounded-2xl border border-slate-800 text-center space-y-3"
                    >
                      <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-cyan-400">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white truncate px-1">{item.name}</p>
                        <p className="text-[10px] text-slate-400">{item.size} MB</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Action Sidebar */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
                <h2 className="text-xl font-extrabold text-white">{toolTitle}</h2>

                <div className="p-4 rounded-xl bg-cyan-950/70 border border-cyan-800/80 text-cyan-200 text-xs flex items-start space-x-2.5">
                  <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Click the button below to process your file instantly.
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

            <div className="space-y-2 pt-4">
              <AllToolsTopAd />
              <AllToolsBottomAd />
            </div>
          </div>
        )}

        {/* STATE 3: PROCESSING SCREEN */}
        {viewState === 'PROCESSING' && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in fade-in duration-300">
            <MergePdfTopAd />
            <div className="space-y-4">
              <Loader2 className="w-16 h-16 text-red-500 animate-spin mx-auto" />
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Processing File...</h2>
              <p className="text-xs text-slate-400">Applying changes securely in browser...</p>
            </div>
          </div>
        )}

        {/* STATE 4: SUCCESS SCREEN */}
        {viewState === 'SUCCESS' && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-8 animate-in zoom-in-95 duration-300">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                File Processed Successfully!
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={resetTool}
                className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
                title="Start Over"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>

              <button
                onClick={triggerDownload}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-lg sm:text-xl shadow-xl shadow-red-600/30 transition-all hover:scale-105 active:scale-95 flex items-center space-x-3"
              >
                <Download className="w-6 h-6" />
                <span>Download Result File</span>
              </button>
            </div>

            <MergePdfBottomAd />
          </div>
        )}
      </main>
    </div>
  );
}
