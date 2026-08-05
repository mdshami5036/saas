import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import CustomerPortal from './pages/CustomerPortal';
import CafeLogin from './pages/CafeLogin';
import CafeRegister from './pages/CafeRegister';
import CafeDashboard from './pages/CafeDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/cafe/:slug" element={<CustomerPortal />} />
      <Route path="/login" element={<CafeLogin />} />
      <Route path="/register" element={<CafeRegister />} />
      <Route path="/dashboard" element={<CafeDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
