import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, FileText, Loader2, Eye } from 'lucide-react';

// Configure PDF.js worker with HTTPS CDN URL
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
} catch (e) {
  console.warn('PDF.js worker setup warning:', e);
}

export default function PdfPreviewer({ file }) {
  const canvasRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [objectUrl, setObjectUrl] = useState('');

  useEffect(() => {
    if (!file) return;

    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    setLoading(true);
    setUseFallback(false);

    const fileReader = new FileReader();

    fileReader.onload = async function () {
      try {
        const typedArray = new Uint8Array(this.result);
        const loadingTask = pdfjsLib.getDocument({
          data: typedArray,
          cMapUrl: `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/cmaps/`,
          cMapPacked: true,
        });
        const doc = await loadingTask.promise;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setCurrentPage(1);
        setLoading(false);
      } catch (err) {
        console.warn('PDF.js canvas preview failed, switching to native embed fallback:', err);
        setUseFallback(true);
        setLoading(false);
      }
    };

    fileReader.onerror = () => {
      setUseFallback(true);
      setLoading(false);
    };

    fileReader.readAsArrayBuffer(file);

    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [file]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || useFallback) return;

    let renderTask = null;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        const viewport = page.getViewport({ scale: 1.2 });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err) {
        if (err?.name !== 'RenderingCancelledException') {
          console.warn('Page render warning:', err);
        }
      }
    };

    renderPage();

    return () => {
      if (renderTask) renderTask.cancel();
    };
  }, [pdfDoc, currentPage, useFallback]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-900/90 rounded-2xl border border-slate-800 min-h-[360px] shadow-2xl">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
        <span className="text-sm font-medium text-slate-300">Generating Document Preview...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-slate-900/90 p-4 rounded-2xl border border-slate-800 shadow-2xl space-y-3">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between px-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400 truncate">
          <FileText className="w-4 h-4 shrink-0 text-cyan-400" />
          <span className="truncate max-w-[180px]">{file?.name || 'Document.pdf'}</span>
        </div>

        {!useFallback && numPages > 0 && (
          <div className="flex items-center space-x-2 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 text-slate-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-200 font-bold min-w-[70px] text-center">
              Page {currentPage} of {numPages}
            </span>
            <button
              disabled={currentPage >= numPages}
              onClick={() => setCurrentPage((prev) => Math.min(numPages, prev + 1))}
              className="p-1 rounded hover:bg-slate-700 disabled:opacity-30 text-slate-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Main Preview Area */}
      <div className="w-full relative shadow-2xl rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex justify-center items-center min-h-[380px] max-h-[460px] overflow-y-auto">
        {!useFallback ? (
          <canvas ref={canvasRef} className="block max-w-full h-auto mx-auto shadow-md" />
        ) : (
          <object
            data={objectUrl}
            type="application/pdf"
            className="w-full h-[440px] rounded-lg"
          >
            <iframe
              src={objectUrl}
              className="w-full h-[440px] rounded-lg border-0"
              title="PDF Preview"
            />
          </object>
        )}
      </div>

      {/* Bottom Status */}
      <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
        <Eye className="w-3.5 h-3.5 text-cyan-400" />
        <span>Document Preview Ready</span>
      </div>
    </div>
  );
}
