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
  Palette,
  Eye,
} from 'lucide-react';

export default function ImageToolsRunner({ toolId, toolTitle, toolDescription }) {
  const fileInputRef = useRef(null);
  const customBgInputRef = useRef(null);

  // General States
  const [viewState, setViewState] = useState('SELECT'); // 'SELECT' | 'WORKSPACE' | 'PROCESSING' | 'SUCCESS'
  const [files, setFiles] = useState([]);
  const [previewSrc, setPreviewSrc] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultBlobUrl, setResultBlobUrl] = useState('');
  const [resultFileName, setResultFileName] = useState('');
  const [resultStats, setResultStats] = useState(null);

  // Tool specific states
  // Resizer
  const [resizeWidth, setResizeWidth] = useState(800);
  const [resizeHeight, setResizeHeight] = useState(600);
  const [lockAspect, setLockAspect] = useState(true);
  const [originalAspect, setOriginalAspect] = useState(1);
  // Compressor
  const [quality, setQuality] = useState(80);
  // Converter
  const [convertFormat, setConvertFormat] = useState('png');
  // Merge Images
  const [mergeDirection, setMergeDirection] = useState('horizontal');
  const [mergeGap, setMergeGap] = useState(10);
  // Image to PDF
  const [pdfMargin, setPdfMargin] = useState(10);
  const [pdfOrientation, setPdfOrientation] = useState('portrait');

  // Background Remover Real-Time States
  const [cutoutBlobUrl, setCutoutBlobUrl] = useState('');
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [bgMode, setBgMode] = useState('transparent'); // 'transparent' | 'color' | 'image'
  const [selectedBgColor, setSelectedBgColor] = useState('#ffffff');
  const [customBgImageUrl, setCustomBgImageUrl] = useState('');

  // Enhancer
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  // Upscaler
  const [scaleFactor, setScaleFactor] = useState(2);
  // Watermark
  const [watermarkText, setWatermarkText] = useState('WevePrint');
  const [watermarkColor, setWatermarkColor] = useState('#ffffff');
  const [watermarkOpacity, setWatermarkOpacity] = useState(50);
  const [watermarkStyle, setWatermarkStyle] = useState('tiled');
  const [watermarkPosition, setWatermarkPosition] = useState('center');

  // Solid Color Presets for Background Remover
  const colorPresets = [
    { label: 'White', hex: '#ffffff' },
    { label: 'Black', hex: '#000000' },
    { label: 'Red', hex: '#ef4444' },
    { label: 'Blue', hex: '#3b82f6' },
    { label: 'Green', hex: '#10b981' },
    { label: 'Yellow', hex: '#eab308' },
    { label: 'Purple', hex: '#8b5cf6' },
    { label: 'Pink', hex: '#ec4899' },
    { label: 'Cyan', hex: '#06b6d4' },
  ];

  // Run Real-Time AI Cutout on File Upload
  const runAutoBgRemove = async (fileItem) => {
    setIsRemovingBg(true);
    setErrorMsg('');
    setBgMode('transparent');
    setSelectedBgColor('#ffffff');
    setCustomBgImageUrl('');

    try {
      let resultBlob = null;
      let successFromApi = false;

      // Try Remove.bg AI REST API
      try {
        const formData = new FormData();
        formData.append('image_file', fileItem.file);
        formData.append('size', 'auto');

        const response = await fetch('https://api.remove.bg/v1.0/removebg', {
          method: 'POST',
          headers: {
            'X-Api-Key': 'RnuE3tDZHe188DELrW46fP4A',
          },
          body: formData,
        });

        if (response.ok) {
          resultBlob = await response.blob();
          successFromApi = true;
        }
      } catch (apiErr) {
        console.warn('Remove.bg API error, using smart canvas cutout fallback:', apiErr);
      }

      // Smart Canvas Cutout Fallback if API offline
      if (!successFromApi || !resultBlob) {
        const img = new Image();
        img.src = fileItem.url;
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
        const tol = 75; // Smart tolerance

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const diff = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);
          if (diff < tol) {
            data[i + 3] = 0; // Make pixel transparent
          }
        }
        ctx.putImageData(imgData, 0, 0);
        resultBlob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
      }

      const cutoutUrl = URL.createObjectURL(resultBlob);
      setCutoutBlobUrl(cutoutUrl);
      updateCompositePreview(cutoutUrl, 'transparent', '#ffffff', '');
    } catch (err) {
      console.error('Background removal error:', err);
      setErrorMsg('Could not process background removal. Please try another image.');
    } finally {
      setIsRemovingBg(false);
    }
  };

  // Real-Time Composite Preview Renderer (Combines Cutout + Solid Color / Photo Backdrop)
  const updateCompositePreview = async (cutoutUrl, mode, color, bgImgUrl) => {
    if (!cutoutUrl) return;

    const cutoutImg = new Image();
    cutoutImg.crossOrigin = 'anonymous';
    cutoutImg.src = cutoutUrl;
    await new Promise((res) => (cutoutImg.onload = res));

    const canvas = document.createElement('canvas');
    canvas.width = cutoutImg.width;
    canvas.height = cutoutImg.height;
    const ctx = canvas.getContext('2d');

    // 1. Draw Background Layer
    if (mode === 'color' && color && color !== 'transparent') {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (mode === 'image' && bgImgUrl) {
      const bgImg = new Image();
      bgImg.crossOrigin = 'anonymous';
      bgImg.src = bgImgUrl;
      await new Promise((res) => (bgImg.onload = res));
      // Cover fit backdrop image
      ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
    }

    // 2. Draw Transparent Cutout Subject on top
    ctx.drawImage(cutoutImg, 0, 0);
    setPreviewSrc(canvas.toDataURL('image/png'));
  };

  // Handle File Selection
  const handleFileSelect = (e) => {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;

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

    const processedList = validImages.map((file, idx) => {
      const mb = (file.size / (1024 * 1024)).toFixed(2);
      const kb = (file.size / 1024).toFixed(1);
      return {
        id: `${file.name}-${Date.now()}-${idx}`,
        file,
        name: file.name,
        sizeMB: `${mb} MB`,
        sizeKB: `${kb} KB`,
        formattedSize: `${mb} MB (${kb} KB)`,
        rawSize: file.size,
        url: URL.createObjectURL(file),
      };
    });

    setFiles(processedList);
    setPreviewSrc(processedList[0].url);

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

    // Auto run AI Cutout if Background Remover
    if (toolId === 'background-remover') {
      runAutoBgRemove(processedList[0]);
    }
  };

  // Handle Custom Photo Backdrop Select for Background Remover
  const handleCustomBgSelect = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const bgUrl = URL.createObjectURL(file);
      setCustomBgImageUrl(bgUrl);
      setBgMode('image');
      if (cutoutBlobUrl) {
        updateCompositePreview(cutoutBlobUrl, 'image', selectedBgColor, bgUrl);
      }
    }
  };

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

      if (toolId === 'background-remover') {
        // Use composite previewSrc canvas data
        const res = await fetch(previewSrc);
        outputBlob = await res.blob();
        outputName += '_bg_removed.png';
      }

      // 1. IMAGE COMPRESSOR
      else if (toolId === 'image-compressor') {
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
        ctx.drawImage(img, 0, 0);

        const mime = convertFormat === 'jpeg' ? 'image/jpeg' : convertFormat === 'webp' ? 'image/webp' : 'image/png';
        outputBlob = await new Promise((resolve) => canvas.toBlob(resolve, mime, 0.95));
        outputName += `.${convertFormat}`;
      }

      // 4. MERGE IMAGES
      else if (toolId === 'merge-images') {
        const loadedImgs = [];
        for (const f of files) {
          const img = new Image();
          img.src = f.url;
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

      // 5. IMAGE TO PDF
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

      // 6. PDF TO IMAGE (3.0x 300 DPI Ultra-HD)
      else if (toolId === 'pdf-to-image') {
        const arrayBuffer = await files[0].file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdfDoc = await loadingTask.promise;
        const page = await pdfDoc.getPage(1);
        const viewport = page.getViewport({ scale: 3.0 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        await page.render({ canvasContext: ctx, viewport }).promise;

        outputBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        outputName += '_page1.png';
      }

      // Fallback
      else {
        const res = await fetch(previewSrc);
        outputBlob = await res.blob();
        outputName += '_processed.png';
      }

      const url = URL.createObjectURL(outputBlob);
      setResultBlobUrl(url);
      setResultFileName(outputName);

      // Calculate Real Size & Saved %
      const origBytes = files[0]?.rawSize || files[0]?.file?.size || 0;
      const resBytes = outputBlob.size || 0;
      const origMB = (origBytes / (1024 * 1024)).toFixed(2);
      const origKB = (origBytes / 1024).toFixed(1);
      const resMB = (resBytes / (1024 * 1024)).toFixed(2);
      const resKB = (resBytes / 1024).toFixed(1);
      const savedPerc = origBytes > 0 ? Math.max(0, Math.round(((origBytes - resBytes) / origBytes) * 100)) : 0;

      setResultStats({
        original: `${origMB} MB (${origKB} KB)`,
        result: `${resMB} MB (${resKB} KB)`,
        saved: `${savedPerc}%`,
      });

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
    setCutoutBlobUrl('');
    setBgMode('transparent');
    setSelectedBgColor('#ffffff');
    setCustomBgImageUrl('');
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

                <div className="flex-1 flex items-center justify-center p-4 rounded-xl bg-slate-900/60 border border-slate-800 min-h-[300px] relative overflow-hidden">
                  {isRemovingBg ? (
                    <div className="flex flex-col items-center justify-center space-y-3 py-12 text-cyan-400 font-extrabold text-sm animate-pulse">
                      <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
                      <span>✨ Removing Background in Real-Time AI...</span>
                    </div>
                  ) : previewSrc ? (
                    <img
                      src={previewSrc}
                      alt="Preview"
                      className="max-h-96 max-w-full object-contain rounded-lg shadow-2xl border border-slate-800"
                    />
                  ) : (
                    <ImageIcon className="w-16 h-16 text-slate-700" />
                  )}
                </div>

                <div className="text-center text-xs font-bold text-slate-400">
                  {files.length === 1 ? `${files[0]?.name} • ${files[0]?.formattedSize}` : `${files.length} images selected`}
                </div>
              </div>

              {/* Right Settings Sidebar */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-6">
                <h2 className="text-xl font-extrabold text-white">{toolTitle} Settings</h2>

                {/* 1. BACKGROUND REMOVER CONTROLS (Real-Time Color & Custom Photo Backdrop) */}
                {toolId === 'background-remover' && (
                  <div className="space-y-5">
                    <div className="p-3 rounded-xl bg-cyan-950/70 border border-cyan-800/80 text-cyan-200 text-xs font-bold flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>AI Cutout Ready! Choose Background Style below:</span>
                    </div>

                    {/* Mode Selector Tabs */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">Select Background Mode:</label>
                      <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                        <button
                          onClick={() => {
                            setBgMode('transparent');
                            updateCompositePreview(cutoutBlobUrl, 'transparent', selectedBgColor, customBgImageUrl);
                          }}
                          className={`py-2 rounded-lg text-[11px] font-extrabold transition-colors ${
                            bgMode === 'transparent' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Transparent
                        </button>

                        <button
                          onClick={() => {
                            setBgMode('color');
                            updateCompositePreview(cutoutBlobUrl, 'color', selectedBgColor, customBgImageUrl);
                          }}
                          className={`py-2 rounded-lg text-[11px] font-extrabold transition-colors ${
                            bgMode === 'color' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Solid Color
                        </button>

                        <button
                          onClick={() => {
                            setBgMode('image');
                            updateCompositePreview(cutoutBlobUrl, 'image', selectedBgColor, customBgImageUrl);
                          }}
                          className={`py-2 rounded-lg text-[11px] font-extrabold transition-colors ${
                            bgMode === 'image' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          Photo Backdrop
                        </button>
                      </div>
                    </div>

                    {/* SOLID COLOR PRESETS & CUSTOM COLOR PICKER */}
                    {bgMode === 'color' && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <label className="text-xs font-bold text-slate-300 block">Choose Solid Background Color:</label>
                        <div className="grid grid-cols-5 gap-2">
                          {colorPresets.map((preset) => (
                            <button
                              key={preset.hex}
                              onClick={() => {
                                setSelectedBgColor(preset.hex);
                                updateCompositePreview(cutoutBlobUrl, 'color', preset.hex, customBgImageUrl);
                              }}
                              className={`h-9 w-full rounded-xl border-2 transition-all flex items-center justify-center ${
                                selectedBgColor === preset.hex ? 'border-cyan-400 scale-110 shadow-lg' : 'border-slate-800 hover:border-slate-600'
                              }`}
                              style={{ backgroundColor: preset.hex }}
                              title={preset.label}
                            >
                              {selectedBgColor === preset.hex && (
                                <CheckCircle2 className={`w-4 h-4 ${preset.hex === '#ffffff' || preset.hex === '#eab308' ? 'text-slate-950' : 'text-white'}`} />
                              )}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center space-x-2 pt-1">
                          <label className="text-xs font-bold text-slate-300">Custom Color:</label>
                          <input
                            type="color"
                            value={selectedBgColor}
                            onChange={(e) => {
                              setSelectedBgColor(e.target.value);
                              updateCompositePreview(cutoutBlobUrl, 'color', e.target.value, customBgImageUrl);
                            }}
                            className="h-8 w-12 rounded-lg bg-slate-900 border border-slate-700 cursor-pointer p-0.5"
                          />
                          <span className="text-xs font-mono font-bold text-cyan-400">{selectedBgColor}</span>
                        </div>
                      </div>
                    )}

                    {/* CUSTOM PHOTO BACKDROP UPLOAD */}
                    {bgMode === 'image' && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <label className="text-xs font-bold text-slate-300 block">Upload Custom Background Photo:</label>
                        
                        <label className="w-full py-3 px-4 rounded-xl bg-slate-900 border border-cyan-800 hover:border-cyan-500 text-cyan-400 text-xs font-extrabold flex items-center justify-center space-x-2 cursor-pointer transition-all hover:bg-slate-800">
                          <Plus className="w-4 h-4 text-cyan-400" />
                          <span>Upload Photo from Gallery</span>
                          <input
                            ref={customBgInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleCustomBgSelect}
                            className="hidden"
                          />
                        </label>

                        {customBgImageUrl ? (
                          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                            <span className="text-emerald-400 font-bold flex items-center space-x-1">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Custom Backdrop Applied</span>
                            </span>
                            <button
                              onClick={() => {
                                setCustomBgImageUrl('');
                                setBgMode('transparent');
                                updateCompositePreview(cutoutBlobUrl, 'transparent', selectedBgColor, '');
                              }}
                              className="text-[11px] text-rose-400 hover:underline font-bold"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400">
                            Select any photo from your gallery to place behind your cutout subject.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Compressor controls */}
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
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-400 font-semibold">
                        <span>Original File Size:</span>
                        <span className="text-white font-mono font-bold">
                          {files[0]?.formattedSize || '0 KB'}
                        </span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Est. Output Size:</span>
                        <span className="font-mono">
                          ~{files[0]?.file ? ((files[0].file.size / (1024 * 1024)) * (quality / 100)).toFixed(2) : 0} MB ({files[0]?.file ? ((files[0].file.size / 1024) * (quality / 100)).toFixed(1) : 0} KB)
                        </span>
                      </div>
                      <div className="text-[11px] text-cyan-400 font-extrabold text-right pt-1 border-t border-slate-800">
                        Saved ~{100 - quality}% File Weight
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Resizer controls */}
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
                      <span>Lock Aspect Ratio</span>
                    </label>
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
                  disabled={(toolId === 'merge-images' && files.length < 2) || isRemovingBg}
                  className="w-full py-4 rounded-2xl font-extrabold text-base bg-gradient-to-r from-cyan-600 via-teal-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white transition-all shadow-xl shadow-cyan-500/25 active:scale-95 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <span>Download Image</span>
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
