import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CustomerPortal from './pages/CustomerPortal';
import CafeLogin from './pages/CafeLogin';
import CafeRegister from './pages/CafeRegister';
import CafeDashboard from './pages/CafeDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsConditions from './pages/TermsConditions';
import Disclaimer from './pages/Disclaimer';

// PDF Tools Pages
import PdfToolsHub from './pages/PdfToolsHub';
import MergePdfTool from './pages/tools/MergePdfTool';
import SplitPdfTool from './pages/tools/SplitPdfTool';
import RemovePagesTool from './pages/tools/RemovePagesTool';
import GenericPdfTool from './pages/tools/GenericPdfTool';
import ImageToolsRunner from './pages/tools/ImageToolsRunner';
import QrToolsRunner from './pages/tools/QrToolsRunner';

// Documentation Guides Pages
import HowQrPrintingWorks from './pages/docs/HowQrPrintingWorks';
import SetupPrinterAutoPrint from './pages/docs/SetupPrinterAutoPrint';
import RazorpayDirectPayouts from './pages/docs/RazorpayDirectPayouts';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-conditions" element={<TermsConditions />} />
      <Route path="/disclaimer" element={<Disclaimer />} />

      {/* PDF Tools Hub & Individual Tools */}
      <Route path="/tools" element={<PdfToolsHub />} />
      <Route path="/tools/merge-pdf" element={<MergePdfTool />} />
      <Route path="/tools/split-pdf" element={<SplitPdfTool />} />
      <Route path="/tools/remove-pages" element={<RemovePagesTool />} />

      {/* Dedicated QR Code Tools Category */}
      <Route path="/tools/qr-generator" element={<QrToolsRunner toolId="qr-generator" toolTitle="QR Code Generator" toolDescription="Convert any text or web URL into a high resolution QR code instantly." />} />
      <Route path="/tools/qr-scanner" element={<QrToolsRunner toolId="qr-scanner" toolTitle="QR Code Scanner" toolDescription="Scan QR codes using camera or uploaded image right in your browser." />} />
      <Route path="/tools/qr-decoder" element={<QrToolsRunner toolId="qr-decoder" toolTitle="QR Code Decoder" toolDescription="Decode QR code image files locally to extract embedded text or URLs." />} />
      <Route path="/tools/wifi-qr" element={<QrToolsRunner toolId="wifi-qr" toolTitle="WiFi QR Code" toolDescription="Generate WiFi connect QR codes for instant passwordless connection." />} />
      <Route path="/tools/upi-qr" element={<QrToolsRunner toolId="upi-qr" toolTitle="UPI QR Code" toolDescription="Generate UPI payment QR codes (BHIM, PhonePe, Paytm, Google Pay)." />} />
      <Route path="/tools/whatsapp-qr" element={<QrToolsRunner toolId="whatsapp-qr" toolTitle="WhatsApp QR Code" toolDescription="Create direct WhatsApp chat QR codes with pre-filled text messages." />} />
      <Route path="/tools/vcard-qr" element={<QrToolsRunner toolId="vcard-qr" toolTitle="vCard QR Code" toolDescription="Share contact business cards (Name, Phone, Email, Org) via QR code." />} />
      <Route path="/tools/maps-qr" element={<QrToolsRunner toolId="maps-qr" toolTitle="Google Maps QR Code" toolDescription="Share Google Maps location links or GPS coordinates via QR code." />} />
      <Route path="/tools/social-qr" element={<QrToolsRunner toolId="social-qr" toolTitle="Social Media QR Code" toolDescription="Create QR codes linking directly to your Instagram, YouTube or Facebook." />} />
      <Route path="/tools/qr-with-logo" element={<QrToolsRunner toolId="qr-with-logo" toolTitle="QR Code with Logo" toolDescription="Embed your company logo in the center of generated QR codes." />} />
      <Route path="/tools/custom-qr" element={<QrToolsRunner toolId="custom-qr" toolTitle="Custom QR Code" toolDescription="Customize QR code foreground/background colors and dot styles." />} />
      <Route path="/tools/bulk-qr-generator" element={<QrToolsRunner toolId="bulk-qr-generator" toolTitle="Bulk QR Code Generator" toolDescription="Generate multiple QR codes simultaneously for lists or CSVs." />} />

      {/* Dedicated Image Tools Category */}
      <Route path="/tools/image-compressor" element={<ImageToolsRunner toolId="image-compressor" toolTitle="Image Compressor" toolDescription="Reduce image file size while keeping high visual quality." />} />
      <Route path="/tools/image-resizer" element={<ImageToolsRunner toolId="image-resizer" toolTitle="Image Resizer" toolDescription="Resize image dimensions (width & height) with aspect ratio control." />} />
      <Route path="/tools/image-converter" element={<ImageToolsRunner toolId="image-converter" toolTitle="Image Converter" toolDescription="Convert images between JPG, PNG, WEBP, and BMP formats." />} />
      <Route path="/tools/jpg-to-png" element={<ImageToolsRunner toolId="jpg-to-png" toolTitle="JPG to PNG" toolDescription="Convert JPG images into transparent lossless PNG format." />} />
      <Route path="/tools/png-to-jpg" element={<ImageToolsRunner toolId="png-to-jpg" toolTitle="PNG to JPG" toolDescription="Convert PNG images into high-quality JPG files." />} />
      <Route path="/tools/merge-images" element={<ImageToolsRunner toolId="merge-images" toolTitle="Merge Images" toolDescription="Combine multiple images horizontally or vertically into one image." />} />
      <Route path="/tools/image-to-pdf" element={<ImageToolsRunner toolId="image-to-pdf" toolTitle="Image to PDF" toolDescription="Convert one or multiple images into a clean PDF document." />} />
      <Route path="/tools/pdf-to-image" element={<ImageToolsRunner toolId="pdf-to-image" toolTitle="PDF to Image" toolDescription="Convert PDF document pages into high resolution PNG/JPG images." />} />
      <Route path="/tools/background-remover" element={<ImageToolsRunner toolId="background-remover" toolTitle="Background Remover" toolDescription="Remove background from images and make transparent PNG cutouts." />} />
      <Route path="/tools/image-enhancer" element={<ImageToolsRunner toolId="image-enhancer" toolTitle="Image Enhancer" toolDescription="Improve brightness, contrast, and clarity of your photos." />} />
      <Route path="/tools/image-upscaler" element={<ImageToolsRunner toolId="image-upscaler" toolTitle="Image Upscaler" toolDescription="Upscale low-resolution images 2x or 4x without losing quality." />} />
      <Route path="/tools/image-watermark" element={<ImageToolsRunner toolId="image-watermark" toolTitle="Image Watermark" toolDescription="Add custom text or logo watermarks onto your photos for protection." />} />

      <Route path="/tools/extract-pages" element={<GenericPdfTool toolTitle="Extract Pages" toolDescription="Extract specific pages from your PDF document." actionButtonText="Extract Pages" />} />
      <Route path="/tools/organize-pdf" element={<GenericPdfTool toolTitle="Organize PDF" toolDescription="Sort, re-order, rotate or delete pages inside your PDF document." actionButtonText="Organize PDF" />} />
      <Route path="/tools/scan-to-pdf" element={<GenericPdfTool toolTitle="Scan to PDF" toolDescription="Capture document scans using mobile camera or images into PDF." actionButtonText="Scan to PDF" acceptFileType="image/*" />} />
      
      <Route path="/tools/compress-pdf" element={<GenericPdfTool toolTitle="Compress PDF" toolDescription="Reduce file size while optimizing for maximal PDF quality." actionButtonText="Compress PDF" />} />
      <Route path="/tools/repair-pdf" element={<GenericPdfTool toolTitle="Repair PDF" toolDescription="Fix damaged or corrupted PDF files and recover unreadable data." actionButtonText="Repair PDF" />} />
      <Route path="/tools/ocr-pdf" element={<GenericPdfTool toolTitle="OCR PDF" toolDescription="Convert scanned PDF documents and images into searchable text." actionButtonText="OCR PDF" />} />
      
      <Route path="/tools/jpg-to-pdf" element={<GenericPdfTool toolTitle="JPG to PDF" toolDescription="Convert JPG, PNG, and WebP images into high quality PDFs in seconds." actionButtonText="Convert to PDF" acceptFileType="image/*" />} />
      <Route path="/tools/word-to-pdf" element={<GenericPdfTool toolTitle="WORD to PDF" toolDescription="Make DOC and DOCX files easy to read by converting them to PDF." actionButtonText="Convert to PDF" acceptFileType=".doc,.docx,application/msword" />} />
      <Route path="/tools/powerpoint-to-pdf" element={<GenericPdfTool toolTitle="POWERPOINT to PDF" toolDescription="Make PPT and PPTX slideshows easy to view by converting to PDF." actionButtonText="Convert to PDF" acceptFileType=".ppt,.pptx" />} />
      <Route path="/tools/excel-to-pdf" element={<GenericPdfTool toolTitle="EXCEL to PDF" toolDescription="Make EXCEL spreadsheets easy to read by converting them to PDF." actionButtonText="Convert to PDF" acceptFileType=".xls,.xlsx" />} />
      <Route path="/tools/html-to-pdf" element={<GenericPdfTool toolTitle="HTML to PDF" toolDescription="Convert web pages or HTML code directly into PDF documents." actionButtonText="Convert to PDF" acceptFileType=".html,.htm" />} />
      
      <Route path="/tools/pdf-to-jpg" element={<GenericPdfTool toolTitle="PDF to JPG" toolDescription="Extract all images or convert each PDF page into high quality JPGs." actionButtonText="Convert to JPG" />} />
      <Route path="/tools/pdf-to-word" element={<GenericPdfTool toolTitle="PDF to WORD" toolDescription="Easily convert your PDF files into easy to edit DOC and DOCX documents." actionButtonText="Convert to Word" />} />
      <Route path="/tools/pdf-to-powerpoint" element={<GenericPdfTool toolTitle="PDF to POWERPOINT" toolDescription="Turn your PDF files into easy to edit PPT and PPTX presentation slides." actionButtonText="Convert to PPT" />} />
      <Route path="/tools/pdf-to-excel" element={<GenericPdfTool toolTitle="PDF to EXCEL" toolDescription="Pull data straight from PDFs into Excel spreadsheets in a few seconds." actionButtonText="Convert to Excel" />} />
      <Route path="/tools/pdf-to-pdfa" element={<GenericPdfTool toolTitle="PDF to PDF/A" toolDescription="Convert PDF documents to ISO-standardized PDF/A for long-term archiving." actionButtonText="Convert to PDF/A" />} />

      {/* Documentation Guides */}
      <Route path="/docs/how-qr-printing-works" element={<HowQrPrintingWorks />} />
      <Route path="/docs/setup-printer-auto-print" element={<SetupPrinterAutoPrint />} />
      <Route path="/docs/razorpay-direct-payouts" element={<RazorpayDirectPayouts />} />

      <Route path="/cafe/:slug" element={<CustomerPortal />} />
      <Route path="/login" element={<CafeLogin />} />
      <Route path="/register" element={<CafeRegister />} />
      <Route path="/dashboard" element={<CafeDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
