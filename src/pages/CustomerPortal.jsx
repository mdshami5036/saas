import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import SeoHead from '../components/SeoHead';
import PdfPreviewer from '../components/PdfPreviewer';
import PrintStatusTracker from '../components/PrintStatusTracker';
import UploadPageAd from '../components/UploadPageAd';
import {
  UploadCloud,
  FileText,
  Printer,
  Loader2,
  Plus,
  Minus,
  Zap,
  AlertCircle,
} from 'lucide-react';

export default function CustomerPortal() {
  const { slug } = useParams();
  const [cafeInfo, setCafeInfo] = useState(null);
  const [cafeError, setCafeError] = useState('');
  const [loadingInfo, setLoadingInfo] = useState(true);

  // File state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form options
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pagesToPrint, setPagesToPrint] = useState('ALL');
  const [copies, setCopies] = useState(1);
  const [colorMode, setColorMode] = useState('BW');

  // Payment & Tracking
  const [processingOrder, setProcessingOrder] = useState(false);
  const [activeJobId, setActiveJobId] = useState(null);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState('');

  const formatSlugToName = (str) => {
    if (!str) return 'WevePrint Cyber Center';
    const clean = str.replace(/-[a-f0-9]{6}$/i, '').replace(/[-_]/g, ' ');
    return clean.replace(/\b\w/g, (c) => c.toUpperCase());
  };

  useEffect(() => {
    async function fetchCafe() {
      try {
        setLoadingInfo(true);
        setCafeError('');
        const res = await api.get(`/public/cafe/${slug}/info`);
        if (res.data && res.data.success && res.data.cafe) {
          setCafeInfo(res.data.cafe);
          setLoadingInfo(false);
          return;
        }
      } catch (err) {
        console.warn('Backend info warning, loading fallback portal:', err.message);
      }
      
      // Fallback: Always populate cafeInfo so PDF Upload Portal & Hover Glow rendering never fails
      setCafeInfo({
        name: formatSlugToName(slug),
        slug: slug,
        bwPricePerPage: 2.0,
        colorPricePerPage: 10.0,
      });
      setLoadingInfo(false);
    }

    fetchCafe();
  }, [slug]);

  // Fast Client-Side PDF Page Count Detector
  const fastDetectPdfPageCount = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const contents = e.target.result;
          const match = contents.match(/\/Type\s*\/Pages[\s\S]*?\/Count\s+(\d+)/);
          if (match && match[1]) {
            const count = parseInt(match[1], 10);
            if (!isNaN(count) && count > 0) {
              resolve(count);
              return;
            }
          }
        } catch (err) {}
        resolve(1);
      };
      reader.readAsText(file.slice(0, 100000));
    });
  };

  const handleFileDrop = async (file) => {
    if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a valid PDF document.');
      return;
    }
    setSelectedFile(file);
    setUploading(true);
    setUploadProgress(10);
    setPaymentErrorMessage('');

    try {
      const pageCount = await fastDetectPdfPageCount(file);
      setUploadProgress(30);

      const formData = new FormData();
      formData.append('pdf', file);

      const res = await api.post('/public/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          if (evt.total) {
            const percent = Math.round((evt.loaded * 100) / evt.total);
            setUploadProgress(30 + Math.round(percent * 0.65));
          }
        },
      });

      if (res.data && res.data.success && res.data.file) {
        const serverFile = res.data.file;
        if (!serverFile.totalPages || serverFile.totalPages < pageCount) {
          serverFile.totalPages = pageCount;
        }
        setUploadedFile(serverFile);
        setUploadProgress(100);
      } else {
        throw new Error(res.data?.error || 'Failed to upload PDF document');
      }
    } catch (err) {
      console.error('File upload error:', err);
      setPaymentErrorMessage(err.response?.data?.error || 'PDF upload failed. Please try uploading your document again.');
      setSelectedFile(null);
      setUploadedFile(null);
    } finally {
      setTimeout(() => setUploading(false), 300);
    }
  };

  // Strict Per-Cafe Price Calculation Logic
  const getCalculatedPrice = () => {
    if (!cafeInfo || !uploadedFile) return 0;
    const totalPages = uploadedFile.totalPages || 1;

    let selectedPagesCount = totalPages;
    if (pagesToPrint && pagesToPrint.toUpperCase() !== 'ALL') {
      const parts = pagesToPrint.split(',');
      let count = 0;
      for (const part of parts) {
        const trimmed = part.trim();
        if (trimmed.includes('-')) {
          const [s, e] = trimmed.split('-');
          const start = parseInt(s, 10);
          const end = parseInt(e, 10);
          if (!isNaN(start) && !isNaN(end)) {
            count += Math.max(0, Math.min(totalPages, end) - Math.max(1, start) + 1);
          }
        } else {
          const p = parseInt(trimmed, 10);
          if (!isNaN(p) && p >= 1 && p <= totalPages) count += 1;
        }
      }
      selectedPagesCount = count > 0 ? count : totalPages;
    }

    const currentCafe = cafeInfo || { bwPricePerPage: 2.0, colorPricePerPage: 10.0 };
    const pricePerPage = colorMode === 'COLOR' ? (currentCafe.colorPricePerPage || 10.0) : (currentCafe.bwPricePerPage || 2.0);
    return selectedPagesCount * copies * pricePerPage;
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const confirmAndDispatchPrint = async (jobId, rzpPaymentId, rzpOrderId, rzpSignature) => {
    try {
      const res = await api.post('/public/verify-payment', {
        jobId,
        razorpayOrderId: rzpOrderId,
        razorpayPaymentId: rzpPaymentId,
        razorpaySignature: rzpSignature,
      });

      if (res.data && res.data.success) {
        setActiveJobId(jobId);
        setPaymentErrorMessage('');
      } else {
        setPaymentErrorMessage(res.data?.error || 'Payment verification failed on server.');
      }
    } catch (err) {
      console.error('Payment verify API error:', err);
      setPaymentErrorMessage(err.response?.data?.error || 'Payment verification failed.');
    } finally {
      setProcessingOrder(false);
    }
  };

  const handleProceedToPayment = async () => {
    if (!uploadedFile) return;

    setProcessingOrder(true);
    setPaymentErrorMessage('');
    const calculatedAmount = getCalculatedPrice();

    try {
      // 1. Create order on backend (creates PENDING job & Razorpay order for this cafe)
      const orderRes = await api.post(`/public/create-order?slug=${slug}`, {
        customerName: customerName || 'Guest Customer',
        customerPhone,
        fileName: uploadedFile.fileName,
        originalName: uploadedFile.originalName,
        totalPages: uploadedFile.totalPages,
        pagesToPrint,
        copies,
        colorMode,
      });

      if (!orderRes.data || !orderRes.data.success) {
        setPaymentErrorMessage(orderRes.data?.error || 'Failed to create payment order.');
        setProcessingOrder(false);
        return;
      }

      const { jobId, razorpayOrderId, keyId, cafeName } = orderRes.data.order;

      if (!keyId || !razorpayOrderId) {
        setPaymentErrorMessage('This Cyber Cafe has not configured their Razorpay payment gateway yet.');
        setProcessingOrder(false);
        return;
      }

      // 2. Load Razorpay Checkout SDK
      const loaded = await loadRazorpayScript();
      if (!loaded || !window.Razorpay) {
        setPaymentErrorMessage('Failed to load Razorpay payment gateway SDK.');
        setProcessingOrder(false);
        return;
      }

      // 3. Open Razorpay Payment Window (ONLY THIS CAFE'S REVENUE)
      const options = {
        key: keyId,
        amount: Math.round(calculatedAmount * 100),
        currency: 'INR',
        name: cafeName || cafeInfo?.name || 'Cyber Cafe Auto-Print',
        description: `Print Job - ${uploadedFile.originalName}`,
        order_id: razorpayOrderId,
        handler: function (response) {
          // Strictly verify payment on backend after successful checkout
          confirmAndDispatchPrint(
            jobId,
            response.razorpay_payment_id,
            response.razorpay_order_id || razorpayOrderId,
            response.razorpay_signature
          );
        },
        modal: {
          ondismiss: function () {
            setProcessingOrder(false);
          },
        },
        prefill: {
          name: customerName || 'Guest Customer',
          contact: customerPhone || '9876543210',
        },
        theme: {
          color: '#0284c7',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        console.error('Razorpay payment failed:', resp.error);
        setPaymentErrorMessage(resp.error?.description || 'Payment was declined or failed.');
        setProcessingOrder(false);
      });
      rzp.open();

    } catch (err) {
      console.error('Create order execution error:', err);
      setPaymentErrorMessage(
        err.response?.data?.error || 'Failed to initialize payment gateway. Please ensure the Cyber Cafe has configured Razorpay.'
      );
      setProcessingOrder(false);
    }
  };

  if (loadingInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
        <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
      </div>
    );
  }

  const safeCafeInfo = cafeInfo || {
    name: formatSlugToName(slug),
    slug: slug,
    bwPricePerPage: 2.0,
    colorPricePerPage: 10.0,
  };

  const calculatedTotal = getCalculatedPrice();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between font-sans text-slate-100 pb-24 lg:pb-8 relative overflow-hidden">
      <SeoHead
        title={`Instant PDF Upload & Print – ${safeCafeInfo.name}`}
        description={`Upload documents and auto-print instantly at ${safeCafeInfo.name}.`}
        noindex={true}
      />
      {/* Background Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="anim-glow-orb absolute -top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-radial from-cyan-600/20 to-transparent" />
        <div className="anim-glow-orb absolute top-1/3 -right-20 w-[550px] h-[550px] rounded-full bg-gradient-radial from-blue-600/15 to-transparent" />
      </div>

      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 relative z-10">
        {/* Header Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950/90 text-cyan-400 border border-cyan-800/80 text-xs font-bold shadow-sm">
            <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
            <span>Instant Auto-Print Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {safeCafeInfo.name}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
            Fast PDF upload, customize pages, pay online & print instantly!
          </p>
        </div>

        {/* Error Notification Banner */}
        {paymentErrorMessage && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start space-x-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Payment / Order Issue</span>
              <span>{paymentErrorMessage}</span>
            </div>
          </div>
        )}

        {/* Step 1: Upload PDF Box */}
        {!uploadedFile ? (
          <div className="glass-card rounded-2xl p-6 sm:p-10 border-2 border-dashed border-slate-700 hover:border-cyan-500 transition-all text-center cursor-pointer relative group shadow-2xl">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileDrop(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform border border-cyan-500/30">
              <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-base sm:text-xl font-bold text-white mb-1">
              {uploading ? 'Analyzing PDF Document...' : 'Tap to Upload PDF Document'}
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
              Works on all Smartphones & Laptops (Max PDF size: 50MB)
            </p>

            {uploading && (
              <div className="mt-4 max-w-xs mx-auto space-y-2">
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <span className="text-[11px] text-cyan-400 font-bold block">{uploadProgress}% Uploaded</span>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: PDF Preview */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <PdfPreviewer file={selectedFile} />
            </div>

            {/* Right Column: Mobile-Optimized Settings & Payment */}
            <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
              <div className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-800 space-y-5 shadow-2xl">
                {/* File Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3 truncate">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-500/20">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-white text-xs sm:text-sm truncate max-w-[180px] sm:max-w-[240px]">
                        {uploadedFile.originalName}
                      </h4>
                      <p className="text-[11px] text-cyan-400 font-semibold">
                        Total PDF Pages: {uploadedFile.totalPages}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setSelectedFile(null);
                      setPaymentErrorMessage('');
                    }}
                    className="text-xs text-rose-400 hover:underline font-bold shrink-0 ml-2"
                  >
                    Change
                  </button>
                </div>

                {/* Customer Details Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Pages to Print */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Pages to Print</label>
                  <input
                    type="text"
                    placeholder="ALL or e.g. 1-3,5"
                    value={pagesToPrint}
                    onChange={(e) => setPagesToPrint(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none font-mono"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Type <strong>ALL</strong> for whole PDF or range like <strong>1-3,5</strong>
                  </span>
                </div>

                {/* Copies & Color Mode - Touch Friendly Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Number of Copies</label>
                    <div className="flex items-center space-x-3 bg-slate-900 p-1.5 rounded-xl border border-slate-800 justify-between">
                      <button
                        onClick={() => setCopies((c) => Math.max(1, c - 1))}
                        className="w-9 h-9 rounded-lg bg-slate-800 text-slate-200 font-bold hover:bg-slate-700 flex items-center justify-center active:scale-95 transition-transform"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-extrabold text-white text-base">{copies}</span>
                      <button
                        onClick={() => setCopies((c) => c + 1)}
                        className="w-9 h-9 rounded-lg bg-slate-800 text-slate-200 font-bold hover:bg-slate-700 flex items-center justify-center active:scale-95 transition-transform"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Print Color Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setColorMode('BW')}
                        className={`py-2 px-2.5 rounded-xl text-xs font-extrabold transition-all border flex flex-col items-center justify-center ${
                          colorMode === 'BW'
                            ? 'bg-slate-800 text-white border-cyan-400 shadow-md'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        <span>Black & White</span>
                        <span className="text-[10px] text-slate-400 font-normal">₹{cafeInfo?.bwPricePerPage}/page</span>
                      </button>
                      <button
                        onClick={() => setColorMode('COLOR')}
                        className={`py-2 px-2.5 rounded-xl text-xs font-extrabold transition-all border flex flex-col items-center justify-center ${
                          colorMode === 'COLOR'
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-300 shadow-md'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        <span>Full Color</span>
                        <span className="text-[10px] text-cyan-200 font-normal">₹{cafeInfo?.colorPricePerPage}/page</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown Desktop */}
                <div className="hidden sm:flex bg-slate-950 p-4 rounded-xl border border-slate-800 items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Total Amount Payable</span>
                    <h3 className="text-2xl font-extrabold text-white flex items-center">
                      ₹{calculatedTotal.toFixed(2)}
                    </h3>
                  </div>
                  <button
                    disabled={processingOrder}
                    onClick={handleProceedToPayment}
                    className="py-3 px-6 rounded-xl font-extrabold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] active:scale-95 flex items-center space-x-2 disabled:opacity-50"
                  >
                    {processingOrder ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Pay & Print Now</span>
                        <Printer className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Responsive Google AdSense Banner (Only visible before PDF upload) */}
      {!uploadedFile && !selectedFile && !activeJobId && (
        <UploadPageAd />
      )}

      {/* Sticky Bottom Action Bar for Mobile Phones */}
      {uploadedFile && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 p-3 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 z-50 flex items-center justify-between shadow-2xl">
          <div>
            <span className="text-[10px] text-slate-400 block font-semibold">TOTAL PAYABLE</span>
            <span className="text-xl font-extrabold text-white">₹{calculatedTotal.toFixed(2)}</span>
          </div>
          <button
            disabled={processingOrder}
            onClick={handleProceedToPayment}
            className="py-2.5 px-5 rounded-xl font-extrabold text-xs bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/30 transition-all flex items-center space-x-1.5 active:scale-95 disabled:opacity-50"
          >
            {processingOrder ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Pay & Print</span>
                <Printer className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      )}

      {/* Live Print Tracker Modal */}
      {activeJobId && (
        <PrintStatusTracker
          jobId={activeJobId}
          cafeName={cafeInfo?.name}
          onClose={() => setActiveJobId(null)}
        />
      )}
    </div>
  );
}
