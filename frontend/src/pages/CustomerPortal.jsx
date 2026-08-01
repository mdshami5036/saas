import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import PdfPreviewer from '../components/PdfPreviewer';
import PrintStatusTracker from '../components/PrintStatusTracker';
import { UploadCloud, FileText, CheckCircle, Printer, IndianRupee, Layers, Palette, Sparkles, Loader2, AlertCircle } from 'lucide-react';

export default function CustomerPortal() {
  const { slug } = useParams();
  const [cafeInfo, setCafeInfo] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  // File state
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Form options
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pagesToPrint, setPagesToPrint] = useState('ALL');
  const [copies, setCopies] = useState(1);
  const [colorMode, setColorMode] = useState('BW'); // 'BW' | 'COLOR'

  // Payment & Tracking
  const [processingOrder, setProcessingOrder] = useState(false);
  const [activeJobId, setActiveJobId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function fetchCafe() {
      try {
        setLoadingInfo(true);
        const res = await api.get(`/public/cafe/${slug}/info`);
        if (res.data.success) {
          setCafeInfo(res.data.cafe);
        }
      } catch (err) {
        setErrorMsg(err.response?.data?.error || 'Cyber Cafe not found or inactive');
      } finally {
        setLoadingInfo(false);
      }
    }
    fetchCafe();
  }, [slug]);

  const handleFileDrop = async (file) => {
    if (!file || !file.name.toLowerCase().endsWith('.pdf')) {
      alert('Please upload a valid PDF document.');
      return;
    }
    setSelectedFile(file);
    setUploading(true);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await api.post('/public/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setUploadedFile(res.data.file);
      }
    } catch (err) {
      alert('PDF Upload failed: ' + (err.response?.data?.error || err.message));
      setSelectedFile(null);
    } finally {
      setUploading(false);
    }
  };

  // Price Calculation Logic
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

    const pricePerPage = colorMode === 'COLOR' ? cafeInfo.colorPricePerPage : cafeInfo.bwPricePerPage;
    return selectedPagesCount * copies * pricePerPage;
  };

  const handleProceedToPayment = async () => {
    if (!uploadedFile) return;

    setProcessingOrder(true);
    try {
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

      if (!orderRes.data.success) {
        throw new Error(orderRes.data.error || 'Failed to create order');
      }

      const { jobId, razorpayOrderId, amount, keyId, cafeName } = orderRes.data.order;

      // Razorpay Checkout Popup
      const options = {
        key: keyId,
        amount: Math.round(amount * 100),
        currency: 'INR',
        name: cafeName,
        description: `Auto Print - ${uploadedFile.originalName}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            const verifyRes = await api.post('/public/verify-payment', {
              jobId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              setActiveJobId(jobId);
            } else {
              alert('Payment Verification Failed');
            }
          } catch (vErr) {
            alert('Verification Error: ' + vErr.message);
          }
        },
        prefill: {
          name: customerName,
          contact: customerPhone,
        },
        theme: {
          color: '#0284c7',
        },
      };

      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Mock payment fallback for testing
        const verifyRes = await api.post('/public/verify-payment', {
          jobId,
          razorpayOrderId,
          razorpayPaymentId: 'pay_mock_' + Date.now(),
          razorpaySignature: 'signature_mock',
        });
        if (verifyRes.data.success) {
          setActiveJobId(jobId);
        }
      }
    } catch (err) {
      alert('Order Error: ' + (err.response?.data?.error || err.message));
    } finally {
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

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
        <div className="glass-card max-w-md p-8 rounded-2xl text-center border-rose-900/50">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Cafe Not Found</h2>
          <p className="text-sm text-slate-400">{errorMsg}</p>
        </div>
      </div>
    );
  }

  const calculatedTotal = getCalculatedPrice();

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
        {/* Header Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Cyber Cafe Print Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {cafeInfo.name}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload your PDF, customize print settings & pay online for instant auto-printing!
          </p>
        </div>

        {/* Step 1: Upload PDF */}
        {!uploadedFile ? (
          <div className="glass-card rounded-2xl p-8 border-dashed border-2 border-slate-700 hover:border-cyan-500 transition-colors text-center cursor-pointer relative group">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileDrop(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">
              {uploading ? 'Processing PDF Document...' : 'Tap or Drag & Drop PDF Here'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Supported file format: PDF (Max size: 50MB)
            </p>
            {uploading && <Loader2 className="w-6 h-6 text-cyan-400 animate-spin mx-auto mt-4" />}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: PDF Preview */}
            <div className="lg:col-span-5">
              <PdfPreviewer file={selectedFile} />
            </div>

            {/* Right Column: Customization & Payment */}
            <div className="lg:col-span-7 space-y-6">
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-cyan-400" />
                    <div>
                      <h4 className="font-bold text-white text-sm truncate max-w-[200px]">
                        {uploadedFile.originalName}
                      </h4>
                      <p className="text-xs text-slate-400">Total PDF Pages: {uploadedFile.totalPages}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setSelectedFile(null);
                    }}
                    className="text-xs text-rose-400 hover:underline font-medium"
                  >
                    Change File
                  </button>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
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
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-cyan-500 focus:outline-none"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Type <strong>ALL</strong> or specific pages like <strong>1-3,5</strong>
                  </span>
                </div>

                {/* Copies & Color Mode */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Number of Copies</label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCopies((c) => Math.max(1, c - 1))}
                        className="w-8 h-8 rounded-lg bg-slate-800 text-slate-200 font-bold hover:bg-slate-700"
                      >
                        -
                      </button>
                      <span className="font-bold text-white text-sm">{copies}</span>
                      <button
                        onClick={() => setCopies((c) => c + 1)}
                        className="w-8 h-8 rounded-lg bg-slate-800 text-slate-200 font-bold hover:bg-slate-700"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Print Color Mode</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setColorMode('BW')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border ${
                          colorMode === 'BW'
                            ? 'bg-slate-700 text-white border-cyan-400'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        B&W (₹{cafeInfo.bwPricePerPage}/p)
                      </button>
                      <button
                        onClick={() => setColorMode('COLOR')}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all border ${
                          colorMode === 'COLOR'
                            ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-300'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        Color (₹{cafeInfo.colorPricePerPage}/p)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">Total Amount Payable</span>
                    <h3 className="text-2xl font-extrabold text-white flex items-center">
                      ₹{calculatedTotal.toFixed(2)}
                    </h3>
                  </div>
                  <button
                    disabled={processingOrder}
                    onClick={handleProceedToPayment}
                    className="py-3 px-6 rounded-xl font-extrabold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-[1.02] flex items-center space-x-2"
                  >
                    {processingOrder ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>Pay via Razorpay</span>
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
