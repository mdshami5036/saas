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

      {/* PDF Tools Hub & Merge PDF Tool */}
      <Route path="/tools" element={<PdfToolsHub />} />
      <Route path="/tools/merge-pdf" element={<MergePdfTool />} />

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
