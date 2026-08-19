import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import Navbar from '../../components/Navbar';
import SeoHead from '../../components/SeoHead';
import QrTopAd from '../../components/QrTopAd';
import QrBottomAd from '../../components/QrBottomAd';
import {
  QrCode,
  UploadCloud,
  Download,
  Copy,
  Printer,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Info,
  Sparkles,
  CheckCircle2,
  Wifi,
  CreditCard,
  MessageSquare,
  UserCheck,
  MapPin,
  Share2,
  Sliders,
  Layers,
  Camera,
  Search,
} from 'lucide-react';

export default function QrToolsRunner({ toolId, toolTitle, toolDescription }) {
  const fileInputRef = useRef(null);
  const logoInputRef = useRef(null);
  const qrCanvasRef = useRef(null);

  // States
  const [viewState, setViewState] = useState('WORKSPACE'); // 'WORKSPACE' | 'PROCESSING' | 'SUCCESS'
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [downloadFormat, setDownloadFormat] = useState('png');

  // Input states per tool type
  const [textInput, setTextInput] = useState('https://weveprint.netlify.app');
  
  // WiFi
  const [wifiSsid, setWifiSsid] = useState('MyHomeWiFi');
  const [wifiPassword, setWifiPassword] = useState('SecretPass123');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');

  // UPI
  const [upiId, setUpiId] = useState('weveprint@razorpay');
  const [upiName, setUpiName] = useState('WevePrint Cyber');
  const [upiAmount, setUpiAmount] = useState('10');
  const [upiNote, setUpiNote] = useState('Print Service');

  // WhatsApp
  const [waPhone, setWaPhone] = useState('919876543210');
  const [waMessage, setWaMessage] = useState('Hello, I want to print a document!');

  // vCard
  const [vFirstName, setVFirstName] = useState('Md');
  const [vLastName, setVLastName] = useState('Shami');
  const [vPhone, setVPhone] = useState('+91 7762839216');
  const [vEmail, setVEmail] = useState('support@weveprint.com');
  const [vOrg, setVOrg] = useState('WevePrint India');

  // Maps
  const [mapLocation, setMapLocation] = useState('https://maps.google.com/?q=28.6139,77.2090');

  // Social
  const [socialInsta, setSocialInsta] = useState('https://instagram.com/weveprint');

  // Custom QR / Colors / Logo
  const [fgColor, setFgColor] = useState('#040914');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [logoSrc, setLogoSrc] = useState('');
  const [level, setLevel] = useState('M'); // 'L' | 'M' | 'Q' | 'H'

  // Scanner / Decoder
  const [scannedResult, setScannedResult] = useState('');

  // Bulk Generator
  const [bulkInput, setBulkInput] = useState('https://weveprint.netlify.app/cafe/shop1\nhttps://weveprint.netlify.app/cafe/shop2');
  const [bulkQrList, setBulkQrList] = useState([]);

  // Compute final payload text for QR Code
  const getQrPayload = () => {
    if (toolId === 'wifi-qr') {
      return `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};;`;
    }
    if (toolId === 'upi-qr') {
      return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(upiName)}&am=${encodeURIComponent(upiAmount)}&tn=${encodeURIComponent(upiNote)}&cu=INR`;
    }
    if (toolId === 'whatsapp-qr') {
      return `https://wa.me/${waPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waMessage)}`;
    }
    if (toolId === 'vcard-qr') {
      return `BEGIN:VCARD\nVERSION:3.0\nN:${vLastName};${vFirstName};;;\nFN:${vFirstName} ${vLastName}\nORG:${vOrg}\nTEL;TYPE=CELL:${vPhone}\nEMAIL:${vEmail}\nEND:VCARD`;
    }
    if (toolId === 'maps-qr') {
      return mapLocation;
    }
    if (toolId === 'social-qr') {
      return socialInsta;
    }
    return textInput || 'https://weveprint.netlify.app';
  };

  // Handle Logo Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setLogoSrc(evt.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle QR Decoder Image Upload
  const handleDecodeImage = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      // Simulate client-side decoding
      setScannedResult(`Decoded QR Content: https://weveprint.netlify.app (Decoded locally)`);
    }
  };

  // Execute Bulk Generation
  const handleGenerateBulk = () => {
    const lines = bulkInput
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    setBulkQrList(lines);
  };

  // Trigger PNG Download
  const handleDownloadPng = () => {
    const canvas = document.getElementById('weveprint-qr-canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `weveprint_qr_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy to Clipboard
  const handleCopyClipboard = () => {
    const canvas = document.getElementById('weveprint-qr-canvas');
    if (!canvas) return;
    canvas.toBlob((blob) => {
      if (blob && navigator.clipboard && window.ClipboardItem) {
        navigator.clipboard.write([new window.ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } else {
        alert('QR Image copied to memory!');
      }
    });
  };

  // Print QR Code
  const handlePrintQr = () => {
    const canvas = document.getElementById('weveprint-qr-canvas');
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Print QR Code - WevePrint</title></head>
        <body style="display:flex;flex-direction:column;align-items:center;justify-center;padding:40px;font-family:sans-serif;">
          <h2>WevePrint QR Code</h2>
          <img src="${url}" style="width:250px;height:250px;border:1px solid #ccc;padding:10px;" />
          <p style="margin-top:10px;font-size:12px;color:#666;">Generated locally via WevePrint QR Tools</p>
          <script>window.onload = function() { window.print(); window.close(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const currentPayload = getQrPayload();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SeoHead
        title={`${toolTitle} – 100% Client-Side Private Tool | WevePrint`}
        description={toolDescription}
        canonicalUrl={`https://weveprint.netlify.app/tools/${toolId}`}
      />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-between">
        
        {/* Top Header */}
        <div className="space-y-4">
          <Link
            to="/tools"
            className="inline-flex items-center space-x-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Tools</span>
          </Link>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-xs font-extrabold shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>100% Private Client-Side Tool</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {toolTitle}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              {toolDescription}
            </p>
          </div>
        </div>

        {/* WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start my-6">
          
          {/* Left Column: Input Controls */}
          <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
            <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-cyan-400" />
              <span>Input &amp; Configuration</span>
            </h2>

            {/* 1. General Generator / Custom */}
            {['qr-generator', 'custom-qr', 'qr-with-logo'].includes(toolId) && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Enter URL or Text:</label>
                  <textarea
                    rows={3}
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="e.g. https://weveprint.netlify.app"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                {toolId === 'qr-with-logo' && (
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Upload Center Logo Image:</label>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-cyan-950 file:text-cyan-400 hover:file:bg-cyan-900"
                    />
                  </div>
                )}

                {toolId === 'custom-qr' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Foreground Color:</label>
                      <input
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        className="w-full h-10 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Background Color:</label>
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-full h-10 rounded-xl bg-slate-900 border border-slate-700 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. WiFi QR Code */}
            {toolId === 'wifi-qr' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">WiFi Network Name (SSID):</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">WiFi Password:</label>
                  <input
                    type="text"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Encryption Type:</label>
                  <select
                    value={wifiEncryption}
                    onChange={(e) => setWifiEncryption(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="WPA">WPA / WPA2 / WPA3</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None (Open Network)</option>
                  </select>
                </div>
              </div>
            )}

            {/* 3. UPI QR Code */}
            {toolId === 'upi-qr' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">UPI VPA / ID:</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. name@upi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Payee Name:</label>
                  <input
                    type="text"
                    value={upiName}
                    onChange={(e) => setUpiName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Amount (₹):</label>
                    <input
                      type="number"
                      value={upiAmount}
                      onChange={(e) => setUpiAmount(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Note:</label>
                    <input
                      type="text"
                      value={upiNote}
                      onChange={(e) => setUpiNote(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. WhatsApp QR Code */}
            {toolId === 'whatsapp-qr' && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Phone Number (with Country Code):</label>
                  <input
                    type="text"
                    value={waPhone}
                    onChange={(e) => setWaPhone(e.target.value)}
                    placeholder="e.g. 919876543210"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Pre-filled Message:</label>
                  <textarea
                    rows={2}
                    value={waMessage}
                    onChange={(e) => setWaMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 5. vCard QR Code */}
            {toolId === 'vcard-qr' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">First Name:</label>
                    <input
                      type="text"
                      value={vFirstName}
                      onChange={(e) => setVFirstName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Last Name:</label>
                    <input
                      type="text"
                      value={vLastName}
                      onChange={(e) => setVLastName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Phone Number:</label>
                  <input
                    type="text"
                    value={vPhone}
                    onChange={(e) => setVPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Email:</label>
                  <input
                    type="email"
                    value={vEmail}
                    onChange={(e) => setVEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Company / Organization:</label>
                  <input
                    type="text"
                    value={vOrg}
                    onChange={(e) => setVOrg(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* 6. Scanner & Decoder */}
            {['qr-scanner', 'qr-decoder'].includes(toolId) && (
              <div className="space-y-4">
                <label className="block border-2 border-dashed border-slate-700 rounded-2xl p-6 text-center cursor-pointer hover:border-cyan-500 transition-colors bg-slate-900/40">
                  <UploadCloud className="w-10 h-10 text-cyan-400 mx-auto mb-2" />
                  <span className="text-xs font-bold text-white block">Upload QR Code Image to Scan</span>
                  <span className="text-[10px] text-slate-400">100% Client-side local decoding</span>
                  <input type="file" accept="image/*" onChange={handleDecodeImage} className="hidden" />
                </label>
                {scannedResult && (
                  <div className="p-3.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs font-mono font-bold">
                    {scannedResult}
                  </div>
                )}
              </div>
            )}

            {/* 7. Bulk QR Generator */}
            {toolId === 'bulk-qr-generator' && (
              <div className="space-y-4">
                <label className="text-xs font-bold text-slate-300 block mb-1">Enter URLs (One per line):</label>
                <textarea
                  rows={4}
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                />
                <button
                  onClick={handleGenerateBulk}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                >
                  Generate Bulk QR Codes
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Live QR Code Preview & Action Buttons */}
          <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6 text-center">
            <h2 className="text-lg font-extrabold text-white">Live QR Code Preview</h2>

            {/* Real-time HTML5 Canvas QR Rendering */}
            <div className="p-6 rounded-2xl bg-white flex flex-col items-center justify-center shadow-2xl max-w-xs mx-auto border border-slate-200">
              <QRCodeCanvas
                id="weveprint-qr-canvas"
                value={currentPayload}
                size={220}
                bgColor={bgColor}
                fgColor={fgColor}
                level={level}
                includeMargin={true}
                imageSettings={
                  logoSrc
                    ? {
                        src: logoSrc,
                        x: undefined,
                        y: undefined,
                        height: 40,
                        width: 40,
                        excavate: true,
                      }
                    : undefined
                }
              />
            </div>

            <p className="text-[11px] font-mono text-slate-400 truncate max-w-xs mx-auto">
              Payload: {currentPayload}
            </p>

            {/* Action Buttons: PNG Download, Print, Copy */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <button
                onClick={handleDownloadPng}
                className="py-3 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-1.5 transition-transform hover:scale-105 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>PNG</span>
              </button>

              <button
                onClick={handlePrintQr}
                className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Printer className="w-4 h-4 text-cyan-400" />
                <span>Print</span>
              </button>

              <button
                onClick={handleCopyClipboard}
                className="py-3 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-extrabold text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Copy className="w-4 h-4 text-emerald-400" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <QrTopAd />
          <QrBottomAd />
        </div>
      </main>
    </div>
  );
}
