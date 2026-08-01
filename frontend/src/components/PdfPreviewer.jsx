import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, FileText, Loader2 } from 'lucide-react';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfPreviewer({ file }) {
  const canvasRef = useRef(null);
  const [pdfDoc, setPdfDoc] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!file) return;

    setLoading(true);
    const fileReader = new FileReader();

    fileReader.onload = async function () {
      try {
        const typedArray = new Uint8Array(this.result);
        const doc = await pdfjsLib.getDocument(typedArray).promise;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        setCurrentPage(1);
        setLoading(false);
      } catch (err) {
        console.warn('PDF preview render warning:', err);
        setLoading(false);
      }
    };

    fileReader.readAsArrayBuffer(file);
  }, [file]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let renderTask = null;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const viewport = page.getViewport({ scale: 0.9 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err) {
        // ignore cancellation
      }
    };

    renderPage();

    return () => {
      if (renderTask) renderTask.cancel();
    };
  }, [pdfDoc, currentPage]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-950/60 rounded-xl border border-slate-800 min-h-[300px]">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
        <span className="text-sm font-medium text-slate-400">Rendering PDF Preview...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-slate-950/80 p-4 rounded-xl border border-slate-800">
      <div className="w-full flex items-center justify-between mb-3 px-2">
        <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-400">
          <FileText className="w-4 h-4" />
          <span className="truncate max-w-[200px]">{file.name}</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-slate-300 font-medium">
            Page {currentPage} of {numPages}
          </span>
          <button
            disabled={currentPage >= numPages}
            onClick={() => setCurrentPage((prev) => Math.min(numPages, prev + 1))}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative shadow-2xl rounded-lg overflow-hidden border border-slate-700 bg-white max-h-[420px] overflow-y-auto">
        <canvas ref={canvasRef} className="block max-w-full" />
      </div>
    </div>
  );
}
