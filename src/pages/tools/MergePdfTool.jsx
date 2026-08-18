import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
import Navbar from '../../components/Navbar';
import SeoHead from '../../components/SeoHead';
import {
  FileText,
  UploadCloud,
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
  Layers,
  Sparkles,
  CheckCircle2,
  Loader2,
  ArrowLeft,
} from 'lucide-react';

export default function MergePdfTool() {
  const [files, setFiles] = useState([]);
  const [merging, setMerging] = useState(false);
  const [mergeSuccess, setMergeSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
      setFiles((prev) => [...prev, ...newFileList]);
      setMergeSuccess(false);
    }
  };

  const removeFile = (id) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const moveFile = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= files.length) return;
    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setFiles(updated);
  };

  const handleMergePdf = async () => {
    if (files.length < 2) {
      setErrorMsg('Please select at least 2 PDF files to merge.');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    setMerging(true);
    setErrorMsg('');
    setMergeSuccess(false);

    try {
      // Create new PDF document
      const mergedPdf = await PDFDocument.create();

      for (const fileObj of files) {
        const fileArrayBuffer = await fileObj.file.arrayBuffer();
        const pdf = await PDFDocument.load(fileArrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();

      // Trigger client-side file download
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `weveprint_merged_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMergeSuccess(true);
    } catch (err) {
      console.error('PDF Merge Error:', err);
      setErrorMsg('Failed to merge PDFs. Please make sure the PDF files are not password protected.');
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SeoHead
        title="Merge PDF Online – 100% Free PDF Combiner Tool | WevePrint"
        description="Combine multiple PDF files into one document for free. Fast, secure, client-side PDF merger with zero upload limits."
        canonicalUrl="https://weveprint.netlify.app/tools/merge-pdf"
      />
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Back Link */}
        <Link
          to="/tools"
          className="inline-flex items-center space-x-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All PDF Tools</span>
        </Link>

        {/* Tool Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-orange-950/80 text-orange-400 border border-orange-800 text-xs font-bold shadow-sm">
            <Layers className="w-4 h-4 text-orange-400" />
            <span>100% Free Online Tool</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Merge PDF Files
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto">
            Combine PDFs in the order you want with the easiest PDF merger available. No registration required.
          </p>
        </div>

        {/* Upload Dropzone Card */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 text-center space-y-4">
          <label className="block cursor-pointer group">
            <div className="border-2 border-dashed border-slate-700 group-hover:border-cyan-500 rounded-2xl p-8 transition-colors bg-slate-900/40 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                <UploadCloud className="w-7 h-7" />
              </div>
              <div>
                <p className="text-base font-bold text-white">Select PDF files to merge</p>
                <p className="text-xs text-slate-400 mt-1">or drag &amp; drop PDF documents here</p>
              </div>
              <span className="inline-block px-4 py-2 rounded-xl bg-orange-500 text-white font-extrabold text-xs shadow-lg shadow-orange-500/25 group-hover:bg-orange-400 transition-colors">
                Choose PDF Files
              </span>
            </div>
            <input
              type="file"
              multiple
              accept="application/pdf,.pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs text-center font-bold">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Success Alert */}
        {mergeSuccess && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs text-center font-bold flex items-center justify-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>PDF files merged successfully! Your download has started.</span>
          </div>
        )}

        {/* Files Selected List */}
        {files.length > 0 && (
          <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-sm">
                Selected PDF Files ({files.length})
              </h3>
              <button
                onClick={() => setFiles([])}
                className="text-xs text-rose-400 hover:underline font-semibold"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-2">
              {files.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center space-x-3 truncate pr-2">
                    <span className="w-6 h-6 rounded-lg bg-orange-950 text-orange-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <FileText className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-400">{item.size} MB</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => moveFile(index, -1)}
                      disabled={index === 0}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveFile(index, 1)}
                      disabled={index === files.length - 1}
                      className="p-1 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFile(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleMergePdf}
                disabled={merging || files.length < 2}
                className="py-3 px-6 rounded-xl font-extrabold text-xs bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-white transition-all shadow-lg shadow-orange-500/25 active:scale-95 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {merging ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Merging PDFs...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Merge PDF &amp; Download</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
