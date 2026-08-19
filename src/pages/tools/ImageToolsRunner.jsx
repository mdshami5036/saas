import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
import Navbar from '../../components/Navbar';
import SeoHead from '../../components/SeoHead';
import ImageTopAd from '../../components/ImageTopAd';
import ImageBottomAd from '../../components/ImageBottomAd';
import {
  Image as ImageIcon,
  UploadCloud,
  Download,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Info,
  Layers,
  Trash2,
  Sliders,
  Maximize2,
  RefreshCw,
  Sparkles,
  Zap,
  CheckCircle2,
  Plus,
} from 'lucide-react';

export default function ImageToolsRunner({ toolId, toolTitle, toolDescription }) {
  const fileInputRef = useRef(null);

  // States
  const [viewState, setViewState] = useState('SELECT'); // 'SELECT' | 'WORKSPACE' | 'PROCESSING' | 'SUCCESS'
  const [files, setFiles] = useState([]);
  const [previewSrc, setPreviewSrc] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlobUrl, setResultBlobUrl] = useState('');
  const [resultFileName, setResultFileName] = useState('');
  const [resultStats, setResultStats] = useState(null);

  // Custom tool parameters
  // Compressor
  const [quality, setQuality] = useState(75);
  // Resizer
  const [resizeWidth, setResizeWidth] = useState(800);
  const [resizeHeight, setResizeHeight] = useState(600);
  const [lockAspect, setLockAspect] = useState(true);
  const [originalAspect, setOriginalAspect] = useState(1);
  // Converter
  const [convertFormat, setConvertFormat] = useState('png'); // 'png' | 'jpeg' | 'webp'
  // Merge Images
  const [mergeDirection, setMergeDirection] = useState('horizontal'); // 'horizontal' | 'vertical'
  const [mergeGap, setMergeGap] = useState(10);
  // Image to PDF
  const [pdfMargin, setPdfMargin] = useState(10);
  const [pdfOrientation, setPdfOrientation] = useState('portrait');
  // Background Remover
  const [bgTolerance, setBgTolerance] = useState(30);
  // Enhancer
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  // Upscaler
  const [scaleFactor, setScaleFactor] = useState(2); // 2 or 4
  // Watermark
  const [watermarkText, setWatermarkText] = useState('WevePrint');
  const [watermarkColor, setWatermarkColor] = useState('#ffffff');
  const [watermarkOpacity, setWatermarkOpacity] = useState(50);
  const [watermarkStyle, setWatermarkStyle] = useState('tiled'); // 'tiled' | 'single'
  const [watermarkPosition, setWatermarkPosition] = useState('center');

  // Handle File Selection
  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

    // File validation
    const validImages = selected.filter((file) => {
      if (toolId === 'pdf-to-image') {
        return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      }
      return file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|bmp|gif)$/i.test(file.name);
    });

    if (validImages.length === 0) {
      setErrorMsg(
        toolId === 'pdf-to-image'
          ? 'Please select a valid PDF file.'
          : 'Please select valid image files (JPG, PNG, WEBP, BMP).'
      );
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    const processedList = validImages.map((file, idx) => ({
      id: `${file.name}-${Date.now()}-${idx}`,
      file,
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2),
      rawSize: file.size,
      url: URL.createObjectURL(file),
    }));

    setFiles(processedList);
    setPreviewSrc(processedList[0].url);

    // Auto set original dimensions if single image
    if (processedList[0].file.type.startsWith('image/')) {
      const img = new Image();
      img.onload = () => {
        setResizeWidth(img.width);
        setResizeHeight(img.height);
        setOriginalAspect(img.width / img.height);
      };
      img.src = processedList[0].url;
    }

    setViewState('WORKSPACE');
  };

  // Keep aspect ratio when resizing
  const handleWidthChange = (val) => {
    const w = parseInt(val, 10) || 0;
    setResizeWidth(w);
    if (lockAspect && originalAspect > 0) {
      setResizeHeight(Math.round(w / originalAspect));
    }
  };

  const handleHeightChange = (val) => {
    const h = parseInt(val, 10) || 0;
    setResizeHeight(h);
    if (lockAspect && originalAspect > 0) {
      setResizeWidth(Math.round(h * originalAspect));
    }
  };

  // Run Real Image Processing based on toolId
  const executeProcessing = async () => {
    if (files.length === 0) return;
    setViewState('PROCESSING');
    setIsProcessing(true);
    setErrorMsg('');

    try {
      let outputBlob = null;
      let outputName = `weveprint_${toolId}_${Date.now()}`;
      let stats = null;

      // 1. IMAGE COMPRESSOR
      if (toolId === 'image-compressor') {
        const img = new Image();
        img.src = files[0].url;
        await new Promise((resolve) => (img.onload = resolve));

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        outputBlob = await new Promise((resolve) =>
          canvas.toBlob(resolve, 'image/jpeg', quality / 100)
        );
        outputName += '.jpg';
        stats = {
          original: `${files[0].size} MB`,
          result: `${(outputBlob.size / (1024 * 1024)).toFixed(2)} MB`,
          saved: `${Math.max(0, Math.round((1 - outputBlob.size / files[0].rawSize) * 100))}%`,
        };
      }

      // 2. IMAGE RESIZER
      else if (toolId === 'image-resizer') {
        const img = new Image();
        img.src = files[0].url;
        await new Promise((resolve) => (img.onload = resolve));

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(10, resizeWidth);
        canvas.height = Math.max(10, resizeHeight);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        outputBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        outputName += '.png';
        stats = { resolution: `${canvas.width} x ${canvas.height} px` };
      }

      // 3. IMAGE CONVERTER
      else if (toolId === 'image-converter') {
        const img = new Image();
        img.src = files[0].url;
        await new Promise((resolve) => (img.onload = resolve));

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (convertFormat === 'jpeg') {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);

        const mime = convertFormat === 'jpeg' ? 'image/jpeg' : convertFormat === 'webp' ? 'image/webp' : 'image/png';
        outputBlob = await new Promise((resolve) => canvas.toBlob(resolve, mime, 0.92));
        outputName += `.${convertFormat === 'jpeg' ? 'jpg' : convertFormat}`;
      }

      // 4. JPG TO PNG
      else if (toolId === 'jpg-to-png') {
        const img = new Image();
        img.src = files[0].url;
        await new Promise((resolve) => (img.onload = resolve));

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        outputBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        outputName += '.png';
      }

      // 5. PNG TO JPG
      else if (toolId === 'png-to-jpg') {
        const img = new Image();
        img.src = files[0].url;
        await new Promise((resolve) => (img.onload = resolve));

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        outputBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.95));
        outputName += '.jpg';
      }

      // 6. MERGE IMAGES
      else if (toolId === 'merge-images') {
        const loadedImgs = [];
        for (const item of files) {
          const img = new Image();
          img.src = item.url;
          await new Promise((res) => (img.onload = res));
          loadedImgs.push(img);
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (mergeDirection === 'horizontal') {
          canvas.width = loadedImgs.reduce((acc, img) => acc + img.width, 0) + (loadedImgs.length - 1) * mergeGap;
          canvas.height = Math.max(...loadedImgs.map((img) => img.height));
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          let currentX = 0;
          loadedImgs.forEach((img) => {
            ctx.drawImage(img, currentX, (canvas.height - img.height) / 2);
            currentX += img.width + mergeGap;
          });
        } else {
          canvas.width = Math.max(...loadedImgs.map((img) => img.width));
          canvas.height = loadedImgs.reduce((acc, img) => acc + img.height, 0) + (loadedImgs.length - 1) * mergeGap;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          let currentY = 0;
          loadedImgs.forEach((img) => {
            ctx.drawImage(img, (canvas.width - img.width) / 2, currentY);
            currentY += img.height + mergeGap;
          });
        }

        outputBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        outputName += '.png';
      }

      // 7. IMAGE TO PDF
      else if (toolId === 'image-to-pdf') {
        const pdfDoc = await PDFDocument.create();

        for (const item of files) {
          const imageBytes = await item.file.arrayBuffer();
          let embeddedImage;
          if (item.file.type === 'image/png') {
            embeddedImage = await pdfDoc.embedPng(imageBytes);
          } else {
            embeddedImage = await pdfDoc.embedJpg(imageBytes);
          }

          const page = pdfDoc.addPage([embeddedImage.width + pdfMargin * 2, embeddedImage.height + pdfMargin * 2]);
          page.drawImage(embeddedImage, {
            x: pdfMargin,
            y: pdfMargin,
            width: embeddedImage.width,
            height: embeddedImage.height,
          });
        }

        const pdfBytes = await pdfDoc.save();
        outputBlob = new Blob([pdfBytes], { type: 'application/pdf' });
        outputName += '.pdf';
      }

      // 8. PDF TO IMAGE (Real HD PDF Page Extraction)
      else if (toolId === 'pdf-to-image') {
        const arrayBuffer = await files[0].file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdfDoc = await loadingTask.promise;
        const page = await pdfDoc.getPage(1);
        const viewport = page.getViewport({ scale: 2.0 }); // 2x HD Resolution

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;

        outputBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        outputName += '_page1.png';
        stats = {
          before: `${files[0].name} (${pdfDoc.numPages} Pages)`,
          after: `HD PNG Page 1 (${canvas.width} x ${canvas.height} px)`,
        };
      }

      // 9. BACKGROUND REMOVER (Remove.bg AI API + Fallback)
      else if (toolId === 'background-remover') {
        let successFromApi = false;
        try {
          const formData = new FormData();
          formData.append('image_file', files[0].file);
          formData.append('size', 'auto');

          const response = await fetch('https://api.remove.bg/v1.0/removebg', {
            method: 'POST',
            headers: {
              'X-Api-Key': 'RnuE3tDZHe188DELrW46fP4A',
            },
            body: formData,
          });

          if (response.ok) {
            outputBlob = await response.blob();
            successFromApi = true;
          }
        } catch (apiErr) {
          console.warn('Remove.bg API failed, using fallback cutout:', apiErr);
        }

        if (!successFromApi) {
          const img = new Image();
          img.src = files[0].url;
          await new Promise((res) => (img.onload = res));

          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);

          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          const bgR = data[0];
          const bgG = data[1];
          const bgB = data[2];
          const tol = bgTolerance * 2.55;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const diff = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
            if (diff < tol) {
              data[i + 3] = 0; // Transparent
            }
          }

          ctx.putImageData(imgData, 0, 0);
          outputBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        }

        outputName += '_transparent.png';
      }

      // 10. IMAGE ENHANCER
      else if (toolId === 'image-enhancer') {
        const img = new Image();
        img.src = files[0].url;
        await new Promise((res) => (img.onload = res));

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
        ctx.drawImage(img, 0, 0);

        outputBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        outputName += '.png';
      }

      // 11. IMAGE WATERMARK (Tiled Full-Page Grid Repeat or Single)
      else if (toolId === 'image-watermark') {
        const img = new Image();
        img.src = files[0].url;
        await new Promise((res) => (img.onload = res));

        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        ctx.globalAlpha = watermarkOpacity / 100;
        ctx.fillStyle = watermarkColor;
        const fontSize = Math.max(16, Math.round(canvas.width / 22));
        ctx.font = `bold ${fontSize}px sans-serif`;

        const textToDraw = watermarkText || 'WevePrint';

        if (watermarkStyle === 'tiled') {
          // Tiled Full-Page Grid Repeat at 30-degree angle
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate((-25 * Math.PI) / 180);
          ctx.translate(-canvas.width / 2, -canvas.height / 2);

          const stepX = fontSize * (textToDraw.length * 0.7 + 3);
          const stepY = fontSize * 3.5;

          for (let y = -canvas.height; y < canvas.height * 2; y += stepY) {
            for (let x = -canvas.width; x < canvas.width * 2; x += stepX) {
              ctx.fillText(textToDraw, x, y);
            }
          }
          ctx.restore();
        } else {
          // Single Position
          let x = canvas.width - 20;
          let y = canvas.height - 20;
          ctx.textAlign = 'right';

          if (watermarkPosition === 'center') {
            x = canvas.width / 2;
            y = canvas.height / 2;
            ctx.textAlign = 'center';
          } else if (watermarkPosition === 'top-left') {
            x = 20;
            y = fontSize + 10;
            ctx.textAlign = 'left';
          }
          ctx.fillText(textToDraw, x, y);
        }

        outputBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        outputName += '_watermarked.png';
      }

      const url = URL.createObjectURL(outputBlob);
      setResultBlobUrl(url);
      setResultFileName(outputName);
      setResultStats(stats);
      setViewState('SUCCESS');
    } catch (err) {
      console.error(`${toolTitle} Error:`, err);
      setErrorMsg('Failed to process image. Please try another image file.');
      setViewState('WORKSPACE');
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerDownload = () => {
    if (!resultBlobUrl) return;
    const link = document.createElement('a');
    link.href = resultBlobUrl;
    link.download = resultFileName || 'weveprint_result.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetTool = () => {
    setFiles([]);
    setPreviewSrc('');
    setViewState('SELECT');
    setResultBlobUrl('');
    setResultFileName('');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SeoHead
        title={`${toolTitle} – 100% Free Image Tool | WevePrint`}
        description={toolDescription}
        canonicalUrl={`https://weveprint.netlify.app/tools/${toolId}`}
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
              <span>Back to All Tools</span>
            </Link>

            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-extrabold shadow-sm">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Images Tool</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                {toolTitle}
              </h1>
              <p className="text-slate-400 text-sm sm:text-base">
                {toolDescription}
              </p>
            </div>

            <div className="space-y-3">
              <label className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-lg sm:text-xl shadow-xl shadow-cyan-500/25 cursor-pointer transition-all hover:scale-105 active:scale-95">
                <ImageIcon className="w-6 h-6" />
                <span>Select Image File(s)</span>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple={toolId === 'merge-images' || toolId === 'image-to-pdf'}
                  accept={toolId === 'pdf-to-image' ? 'application/pdf,.pdf' : 'image/*'}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-slate-400 font-medium">
                {toolId === 'pdf-to-image' ? 'or drop PDF document here' : 'or drop images here'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-bold max-w-md">
                ⚠️ {errorMsg}
              </div>
            )}

            <ImageBottomAd />
          </div>
        )}

        {/* STATE 2: WORKSPACE SCREEN */}
        {viewState === 'WORKSPACE' && (
          <div className="flex-1 space-y-6 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
              
              {/* Left Workspace: Preview Card */}
              <div className="lg:col-span-3 glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 min-h-[400px] flex flex-col justify-between">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <span className="text-xs font-bold text-slate-400">
                    Selected Image ({files.length})
                  </span>
                  <button onClick={resetTool} className="text-xs text-rose-400 hover:underline font-bold">
                    Change File
                  </button>
                </div>

                <div className="flex-1 flex items-center justify-center p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                  {files.length > 1 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full">
                      {files.map((fileObj, idx) => (
                        <div key={idx} className="relative group p-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
                          <img
                            src={URL.createObjectURL(fileObj.file)}
                            alt={`Preview ${idx + 1}`}
                            className="h-28 w-full object-cover rounded-lg mb-1"
                          />
                          <span className="text-[10px] text-slate-400 font-bold block truncate">
                            {fileObj.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : previewSrc ? (
                    <img
                      src={previewSrc}
                      alt="Preview"
                      className="max-h-80 max-w-full object-contain rounded-lg shadow-lg border border-slate-800"
                    />
                  ) : (
                    <ImageIcon className="w-16 h-16 text-slate-700" />
                  )}
                </div>

                <div className="text-center text-xs font-bold text-slate-400">
                  {files.length === 1 ? `${files[0]?.name} (${files[0]?.size} MB)` : `${files.length} images selected`}
                </div>
              </div>

              {/* Right Settings Sidebar */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
                <h2 className="text-xl font-extrabold text-white">{toolTitle} Settings</h2>

                {/* 1. Compressor controls */}
                {toolId === 'image-compressor' && (
                  <div className="space-y-4">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">Target Quality:</span>
                      <span className="text-cyan-400 font-mono">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="95"
                      value={quality}
                      onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                      className="w-full accent-cyan-500"
                    />
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-400 font-semibold">
                        <span>Original Size:</span>
                        <span className="text-white font-mono">{files[0]?.file ? (files[0].file.size / 1024).toFixed(1) : 0} KB</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Est. Output Size:</span>
                        <span className="font-mono">~{files[0]?.file ? ((files[0].file.size / 1024) * (quality / 100)).toFixed(1) : 0} KB</span>
                      </div>
                      <div className="text-[10px] text-cyan-400 font-bold text-right pt-1">
                        Saves ~{100 - quality}% File Weight
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Resizer controls */}
                {toolId === 'image-resizer' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Width (px):</label>
                      <input
                        type="number"
                        value={resizeWidth}
                        onChange={(e) => handleWidthChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Height (px):</label>
                      <input
                        type="number"
                        value={resizeHeight}
                        onChange={(e) => handleHeightChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                      />
                    </div>
                    <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={lockAspect}
                        onChange={(e) => setLockAspect(e.target.checked)}
                        className="rounded bg-slate-900 border-slate-700 text-cyan-500"
                      />
                      <span>Lock aspect ratio</span>
                    </label>
                  </div>
                )}

                {/* 3. Converter controls */}
                {toolId === 'image-converter' && (
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-slate-300 block">Target Format:</label>
                    <select
                      value={convertFormat}
                      onChange={(e) => setConvertFormat(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="png">PNG (Lossless)</option>
                      <option value="jpeg">JPG / JPEG</option>
                      <option value="webp">WEBP (Compact)</option>
                    </select>
                  </div>
                )}

                {/* 6. Merge Images controls */}
                {toolId === 'merge-images' && (
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-slate-300 block">Merge Direction:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setMergeDirection('horizontal')}
                        className={`py-2 rounded-xl text-xs font-bold border ${
                          mergeDirection === 'horizontal'
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        Side by Side
                      </button>
                      <button
                        onClick={() => setMergeDirection('vertical')}
                        className={`py-2 rounded-xl text-xs font-bold border ${
                          mergeDirection === 'vertical'
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        Top to Bottom
                      </button>
                    </div>
                  </div>
                )}

                {/* 9. Background Remover controls */}
                {toolId === 'background-remover' && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-slate-300">Cutout Sensitivity:</span>
                      <span className="text-cyan-400 font-mono">{bgTolerance}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="60"
                      value={bgTolerance}
                      onChange={(e) => setBgTolerance(parseInt(e.target.value, 10))}
                      className="w-full accent-cyan-500"
                    />
                  </div>
                )}

                {/* 10. Enhancer controls */}
                {toolId === 'image-enhancer' && (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>Brightness:</span>
                        <span className="text-cyan-400">{brightness}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={brightness}
                        onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                        className="w-full accent-cyan-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span>Contrast:</span>
                        <span className="text-cyan-400">{contrast}%</span>
                      </div>
                      <input
                        type="range"
                        min="50"
                        max="150"
                        value={contrast}
                        onChange={(e) => setContrast(parseInt(e.target.value, 10))}
                        className="w-full accent-cyan-500"
                      />
                    </div>
                  </div>
                )}

                {/* 11. Watermark controls */}
                {toolId === 'image-watermark' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Watermark Word / Text:</label>
                      <input
                        type="text"
                        value={watermarkText}
                        onChange={(e) => setWatermarkText(e.target.value)}
                        placeholder="e.g. WevePrint"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Watermark Pattern Style:</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setWatermarkStyle('tiled')}
                          className={`py-2 rounded-xl text-xs font-bold border ${
                            watermarkStyle === 'tiled'
                              ? 'bg-cyan-950 border-cyan-500 text-cyan-400'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          Full Page Grid Repeat
                        </button>
                        <button
                          onClick={() => setWatermarkStyle('single')}
                          className={`py-2 rounded-xl text-xs font-bold border ${
                            watermarkStyle === 'single'
                              ? 'bg-cyan-950 border-cyan-500 text-cyan-400'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          Single Location
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-slate-300">Watermark Opacity:</span>
                        <span className="text-cyan-400">{watermarkOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(parseInt(e.target.value, 10))}
                        className="w-full accent-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Watermark Color:</label>
                      <input
                        type="color"
                        value={watermarkColor}
                        onChange={(e) => setWatermarkColor(e.target.value)}
                        className="w-full h-9 p-1 rounded-lg bg-slate-900 border border-slate-700 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {toolId === 'merge-images' && files.length < 2 && (
                  <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-300 text-xs font-bold">
                    ⚠️ Please select at least 2 images to merge together.
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-bold">
                    ⚠️ {errorMsg}
                  </div>
                )}

                <button
                  onClick={executeProcessing}
                  disabled={toolId === 'merge-images' && files.length < 2}
                  className="w-full py-4 rounded-2xl font-extrabold text-base bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all shadow-xl shadow-cyan-500/25 active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span>Process Image</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-4">
              <ImageBottomAd />
            </div>
          </div>
        )}

        {/* STATE 3: PROCESSING SCREEN */}
        {viewState === 'PROCESSING' && (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center space-y-6 animate-in fade-in duration-300">
            <ImageTopAd />
            <div className="space-y-4">
              <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto" />
              <h2 className="text-2xl font-extrabold text-white tracking-tight">Processing Image...</h2>
              <p className="text-xs text-slate-400">Applying changes securely in browser...</p>
            </div>
          </div>
        )}

        {/* STATE 4: SUCCESS SCREEN */}
        {viewState === 'SUCCESS' && (
          <div className="flex-1 flex flex-col items-center justify-center py-12 text-center space-y-8 animate-in zoom-in-95 duration-300">
            <div className="space-y-3">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Image Processed Successfully!
              </h2>
              {resultStats && (
                <p className="text-xs text-cyan-400 font-mono">
                  {Object.entries(resultStats).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                </p>
              )}
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
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-lg sm:text-xl shadow-xl shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 flex items-center space-x-3"
              >
                <Download className="w-6 h-6" />
                <span>Download Result Image</span>
              </button>
            </div>

            <ImageBottomAd />
          </div>
        )}
      </main>
    </div>
  );
}
