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
import GenericPdfTool from './pages/tools/GenericPdfTool';

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
      <Route path="/tools/remove-pages" element={<GenericPdfTool toolTitle="Remove Pages" toolDescription="Delete unwanted pages from your PDF document." actionButtonText="Remove Pages" />} />
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
