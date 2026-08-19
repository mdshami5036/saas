import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import SeoHead from '../components/SeoHead';
import {
  Printer,
  QrCode,
  UploadCloud,
  CreditCard,
  Zap,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Clock,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Sparkles,
  HelpCircle,
  ChevronDown,
  UserCheck,
  Code2,
  Lock,
  DollarSign,
  Layers,
  Heart,
  Mail,
  Calculator,
  Image,
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  // Interactive Live Rate Calculator State
  const [dailyPrints, setDailyPrints] = useState(150);
  const [bwPrice, setBwPrice] = useState(2);
  const estimatedMonthlyRevenue = Math.round(dailyPrints * bwPrice * 30);

  // FAQ Accordion State
  const [activeFaq, setActiveFaq] = useState(null);

  const faqs = [
    {
      q: "Shopkeeper ko setup karne me kitna time lagta hai?",
      a: "Sirf 2 minute! Aap account banayein, apna rate set karein aur QR Standee download karke print karke counter par rakhein. Bas, aapka Smart Print Center ready!"
    },
    {
      q: "Kya customer ko koi App download karni padegi?",
      a: "Bilkul nahi! Customer apne kisi bhi smartphone camera ya UPI App (PhonePe, Google Pay, Paytm) se QR code scan karke direct browser me PDF upload aur print kar sakta hai."
    },
    {
      q: "Payment kaise milti hai?",
      a: "Customer Razorpay dwara UPI, QR, Debit/Credit Card ya Netbanking se payment karta hai. Saari payment direct aapke bank account me transfer ho jaati hai."
    },
    {
      q: "Customer files kitni safe rehti hain?",
      a: "Files 100% encrypted rehti hain aur print hone ke baad automatically system se delete ho jaati hain. No WhatsApp chat storage, no privacy risk."
    }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: '#040914',
      color: '#f8fafc',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      overflowX: 'hidden',
    }}>
      <SeoHead
        title="WevePrint – Instant Self-Service Cloud Printing Platform & Free Web Tools"
        description="Transform your Cyber Cafe & Print Shop into a 24/7 Smart Cloud Print Center. Instant QR scanning, PDF upload, UPI payments, and 50+ free client-side PDF, Image, QR & Calculator tools."
        canonicalUrl="https://weveprint.netlify.app/"
      />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Outfit:wght@600;700;800;900&display=swap');

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; filter: blur(40px); }
          50% { opacity: 0.75; filter: blur(60px); }
        }

        .anim-float { animation: floatSlow 4s ease-in-out infinite; }
        .anim-glow { animation: pulseGlow 6s ease-in-out infinite; }

        .glass-card {
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
        }
        .glass-card:hover {
          border-color: rgba(56, 189, 248, 0.35);
          box-shadow: 0 20px 60px rgba(56, 189, 248, 0.15);
        }
        .gradient-text {
          background: linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .btn-glow {
          position: relative;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-glow:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(37, 99, 235, 0.5);
        }
      `}</style>

      {/* Background Ambient Glow Orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <div className="anim-glow" style={{ position: 'absolute', top: '-10%', left: '20%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, transparent 70%)' }} />
        <div className="anim-glow" style={{ position: 'absolute', top: '40%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.2) 0%, transparent 70%)', animationDelay: '-3s' }} />
        <div className="anim-glow" style={{ position: 'absolute', bottom: '-10%', left: '10%', width: '550px', height: '550px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)', animationDelay: '-1.5s' }} />
      </div>

      {/* 1. UNIFIED NAVBAR */}
      <Navbar />

      {/* 2. HERO SECTION */}
      <section style={{ position: 'relative', zIndex: 1, padding: '80px 24px 60px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          {/* Announcement Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 18px', borderRadius: 30,
            background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)',
            marginBottom: 28, boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)',
          }}>
            <Sparkles size={16} color="#38bdf8" />
            <span style={{ fontSize: 13, fontWeight: 700, color: '#38bdf8', letterSpacing: '0.04em' }}>
              The Future of Instant Self-Service Cloud Printing
            </span>
          </div>

          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 900,
            fontFamily: "'Outfit', sans-serif", lineHeight: 1.1,
            letterSpacing: '-0.03em', margin: '0 0 24px', color: '#ffffff',
          }}>
            Apni Dukan Ko Banayein <br />
            <span className="gradient-text">24/7 Smart Cloud Print Center</span>
          </h1>

          {/* Subheadline */}
          <p style={{
            fontSize: 'clamp(16px, 2vw, 20px)', color: '#94a3b8',
            maxWidth: '740px', margin: '0 auto 40px', lineHeight: 1.6, fontWeight: 500,
          }}>
            Na WhatsApp transfer ka jhanjhat, na Pendrive ka khatra!
            Customer QR scan karega, PDF upload karega, online pay karega aur <strong style={{ color: '#f8fafc' }}>30 seconds me print</strong> le jayega!
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, flexWrap: 'wrap', marginBottom: 60 }}>
            <button
              onClick={() => navigate('/register')}
              className="btn-glow"
              style={{
                padding: '16px 36px', borderRadius: 16, fontSize: 16, fontWeight: 800,
                color: '#ffffff', background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                boxShadow: '0 10px 30px rgba(37, 99, 235, 0.4)',
              }}
            >
              Start Free Trial Now <ArrowRight size={18} />
            </button>

            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '16px 32px', borderRadius: 16, fontSize: 16, fontWeight: 700,
                color: '#f8fafc', background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s',
              }}
            >
              Login to Dashboard
            </button>
          </div>

          {/* HERO KIOSK SIMULATOR */}
          <div className="anim-float glass-card" style={{
            maxWidth: '850px', margin: '0 auto', borderRadius: 28, padding: '32px 24px',
            textAlign: 'left', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16, marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#10b981' }} />
                </div>
                <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Live WevePrint Kiosk Simulator</span>
              </div>
              <span style={{ fontSize: 12, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: 20, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} /> System Online
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 18, padding: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(56,189,248,0.15)', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QrCode size={18} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc' }}>1. Customer Scans QR</span>
                </div>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                  Dukan ke counter par rakhe QR Standee ko mobile camera se scan karta hai.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 18, padding: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(129,140,248,0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UploadCloud size={18} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc' }}>2. Uploads PDF File</span>
                </div>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                  PDF select karke B&amp;W (₹2) ya Full Color (₹10) options chunata hai.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 18, padding: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(16,185,129,0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={18} />
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc' }}>3. Auto Instant Print</span>
                </div>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                  Razorpay UPI payment complete hote hi printer se paper turant nikal jata hai!
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. 50+ FREE WEB TOOLS ECOSYSTEM */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 24px 80px', background: 'rgba(56,189,248,0.02)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 30, background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', marginBottom: 16 }}>
              <Sparkles size={14} color="#38bdf8" />
              <span style={{ fontSize: 12, fontWeight: 800, color: '#38bdf8', letterSpacing: '0.1em' }}>100% FREE CLIENT-SIDE SUITE</span>
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", margin: '0 0 16px', color: '#ffffff' }}>
              Explore 50+ Free Web Tools Built for Speed &amp; Privacy
            </h2>
            <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
              All tools run 100% locally in your web browser. No cloud upload, no data logging, no file size restrictions.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            
            <Link to="/tools" className="glass-card" style={{ borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textDecoration: 'none', transition: 'all 0.3s' }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg, #ef4444, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 8px 20px rgba(239, 68, 68, 0.3)' }}>
                  <Layers size={24} color="#ffffff" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', margin: '0 0 8px' }}>PDF Tools</h3>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                  Merge PDF, Split PDF, Remove Pages, Extract Pages, Organize, Compress, Repair &amp; PDF Converters.
                </p>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>Explore 18 PDF Tools</span>
                <ArrowRight size={16} />
              </div>
            </Link>

            <Link to="/tools" className="glass-card" style={{ borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textDecoration: 'none', transition: 'all 0.3s' }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 8px 20px rgba(6, 182, 212, 0.3)' }}>
                  <Image size={24} color="#ffffff" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', margin: '0 0 8px' }}>Image Tools</h3>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                  Image Compressor, Resizer, Format Converter, Merge Images, Background Remover, Enhancer &amp; Watermark.
                </p>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>Explore 12 Image Tools</span>
                <ArrowRight size={16} />
              </div>
            </Link>

            <Link to="/tools" className="glass-card" style={{ borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textDecoration: 'none', transition: 'all 0.3s' }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)' }}>
                  <QrCode size={24} color="#ffffff" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', margin: '0 0 8px' }}>QR Code Tools</h3>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                  QR Generator, Scanner, Decoder, WiFi QR, UPI Payment QR, WhatsApp Chat QR, vCard &amp; Logo QR.
                </p>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>Explore 12 QR Code Tools</span>
                <ArrowRight size={16} />
              </div>
            </Link>

            <Link to="/tools" className="glass-card" style={{ borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textDecoration: 'none', transition: 'all 0.3s' }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg, #8b5cf6, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)' }}>
                  <Calculator size={24} color="#ffffff" />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#ffffff', margin: '0 0 8px' }}>Calculators</h3>
                <p style={{ fontSize: 13, color: '#94a3b8', margin: 0, lineHeight: 1.6 }}>
                  Percentage, Age, Date, EMI, GST, Profit &amp; Loss, Compound Interest, SIP, SWP, FD, RD &amp; PPF.
                </p>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>Explore 15 Calculators</span>
                <ArrowRight size={16} />
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section id="how-it-works" style={{ position: 'relative', zIndex: 1, padding: '80px 24px', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              4 SIMPLE STEPS
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", margin: '10px 0 16px', color: '#ffffff' }}>
              WevePrint Kaise Kaam Karta Hai?
            </h2>
            <p style={{ fontSize: 16, color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
              Grahak aur Dukan-dar dono ke liye 100% aasan aur automatic process.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 24 }}>
            <div className="glass-card" style={{ borderRadius: 24, padding: 30, position: 'relative' }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: 'rgba(56,189,248,0.25)', position: 'absolute', top: 20, right: 20 }}>01</div>
              <div style={{ width: 50, height: 50, borderRadius: 16, background: 'linear-gradient(135deg, #1d4ed8, #2563eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <QrCode size={26} color="#ffffff" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 10px', color: '#f8fafc' }}>Scan Counter QR</h3>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                Customer dukan par lage branded QR standee ko apne kisi bhi UPI App ya phone camera se scan karta hai.
              </p>
            </div>

            <div className="glass-card" style={{ borderRadius: 24, padding: 30, position: 'relative' }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: 'rgba(129,140,248,0.25)', position: 'absolute', top: 20, right: 20 }}>02</div>
              <div style={{ width: 50, height: 50, borderRadius: 16, background: 'linear-gradient(135deg, #4f46e5, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <UploadCloud size={26} color="#ffffff" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 10px', color: '#f8fafc' }}>Upload PDF Document</h3>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                Bina kisi app ko install kiye web browser me PDF upload karta hai aur Black &amp; White ya Color select karta hai.
              </p>
            </div>

            <div className="glass-card" style={{ borderRadius: 24, padding: 30, position: 'relative' }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: 'rgba(192,132,252,0.25)', position: 'absolute', top: 20, right: 20 }}>03</div>
              <div style={{ width: 50, height: 50, borderRadius: 16, background: 'linear-gradient(135deg, #7c3aed, #9333ea)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <CreditCard size={26} color="#ffffff" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 10px', color: '#f8fafc' }}>Pay via UPI Online</h3>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                Exact calculated amount Razorpay UPI (PhonePe / GPay / Paytm) dwara online pay ho jata hai.
              </p>
            </div>

            <div className="glass-card" style={{ borderRadius: 24, padding: 30, position: 'relative' }}>
              <div style={{ fontSize: 42, fontWeight: 900, color: 'rgba(16,185,129,0.25)', position: 'absolute', top: 20, right: 20 }}>04</div>
              <div style={{ width: 50, height: 50, borderRadius: 16, background: 'linear-gradient(135deg, #059669, #10b981)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <Printer size={26} color="#ffffff" />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 10px', color: '#f8fafc' }}>Instant Print Collection</h3>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, margin: 0 }}>
                Payment confirmation hote hi printer se paper nikal aata hai. Customer apna print utha kar chala jata hai!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INCOME ESTIMATOR */}
      <section id="calculator" style={{ position: 'relative', zIndex: 1, padding: '80px 24px', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div className="glass-card" style={{ borderRadius: 32, padding: '40px 32px', border: '1px solid rgba(56,189,248,0.2)' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                INCOME ESTIMATOR
              </span>
              <h2 style={{ fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", margin: '8px 0', color: '#ffffff' }}>
                Aap Mahine Me Kitna Extra Kamayenge?
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32, alignItems: 'center' }}>
              <div>
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ fontSize: 14, fontWeight: 700, color: '#cbd5e1' }}>Daily Print Volume:</label>
                    <span style={{ fontSize: 16, fontWeight: 900, color: '#38bdf8' }}>{dailyPrints} Pages / Day</span>
                  </div>
                  <input
                    type="range" min="30" max="1000" step="10"
                    value={dailyPrints} onChange={(e) => setDailyPrints(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
                  />
                </div>

                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ fontSize: 14, fontWeight: 700, color: '#cbd5e1' }}>Rate Per Page (B&amp;W):</label>
                    <span style={{ fontSize: 16, fontWeight: 900, color: '#38bdf8' }}>₹{bwPrice}</span>
                  </div>
                  <input
                    type="range" min="1" max="10" step="0.5"
                    value={bwPrice} onChange={(e) => setBwPrice(Number(e.target.value))}
                    style={{ width: '100%', accentColor: '#38bdf8', cursor: 'pointer' }}
                  />
                </div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, rgba(29,78,216,0.3), rgba(124,58,237,0.3))',
                borderRadius: 24, padding: 32, textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.12)',
              }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  ESTIMATED MONTHLY REVENUE
                </span>
                <div style={{ fontSize: 'clamp(36px, 5vw, 48px)', fontWeight: 900, color: '#ffffff', margin: '10px 0', lineHeight: 1 }}>
                  ₹{estimatedMonthlyRevenue.toLocaleString('en-IN')}
                </div>
                <p style={{ fontSize: 12, color: '#cbd5e1', margin: 0 }}>
                  bina kisi extra staff ya manual time waste kiye!
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section id="faq" style={{ position: 'relative', zIndex: 1, padding: '80px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: 50 }}>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 900, fontFamily: "'Outfit', sans-serif", margin: '10px 0', color: '#ffffff' }}>
              Frequently Asked Questions (FAQ)
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="glass-card"
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                style={{
                  borderRadius: 20, padding: 24, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0 }}>{faq.q}</h3>
                  <ChevronDown
                    size={20}
                    color="#38bdf8"
                    style={{
                      transform: activeFaq === index ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s', flexShrink: 0,
                    }}
                  />
                </div>
                {activeFaq === index && (
                  <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, marginTop: 14, marginBottom: 0, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. FOOTER */}
      <footer style={{
        position: 'relative', zIndex: 1,
        background: '#02050c', borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '60px 24px 30px',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 40, marginBottom: 50 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: 'linear-gradient(135deg, #1d4ed8, #7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Printer size={20} color="#ffffff" />
                </div>
                <span style={{ fontSize: 22, fontWeight: 900, fontFamily: "'Outfit', sans-serif", color: '#ffffff' }}>
                  Weve<span style={{ color: '#38bdf8' }}>Print</span>
                </span>
              </div>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6, marginBottom: 16 }}>
                India's premier self-service instant cloud printing platform for Cyber Cafes, Print Shops &amp; Photostat Counters.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#38bdf8', fontSize: 14, fontWeight: 600 }}>
                <Mail size={16} />
                <a href="mailto:weve.cyber@gmail.com" style={{ color: '#38bdf8', textDecoration: 'none' }}>
                  weve.cyber@gmail.com
                </a>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Pages, Guides &amp; Legal</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14, color: '#94a3b8' }}>
                <li><Link to="/tools" style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}>⚡ Free 50+ Web Tools</Link></li>
                <li><Link to="/blog" style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none' }}>📝 Read Official Blog</Link></li>
                <li><Link to="/docs/how-qr-printing-works" style={{ color: 'inherit', textDecoration: 'none' }}>How QR Printing Works</Link></li>
                <li><Link to="/docs/setup-printer-auto-print" style={{ color: 'inherit', textDecoration: 'none' }}>Printer Setup Guide</Link></li>
                <li><Link to="/docs/razorpay-direct-payouts" style={{ color: 'inherit', textDecoration: 'none' }}>Razorpay Direct Payouts</Link></li>
                <li><Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</Link></li>
                <li><Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact Us</Link></li>
                <li><Link to="/privacy-policy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link></li>
                <li><Link to="/terms-conditions" style={{ color: 'inherit', textDecoration: 'none' }}>Terms &amp; Conditions</Link></li>
                <li><Link to="/disclaimer" style={{ color: 'inherit', textDecoration: 'none' }}>Disclaimer</Link></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Team &amp; Leadership</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <UserCheck size={18} color="#38bdf8" />
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Director</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#ffffff' }}>Md Shami Ahmad</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)' }}>
                  <Code2 size={18} color="#818cf8" />
                  <div>
                    <div style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Developer</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#ffffff' }}>Md Shami Ahmad</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 24,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 16, fontSize: 13, color: '#64748b',
          }}>
            <div>
              © {new Date().getFullYear()} WevePrint. All Rights Reserved.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              Crafted with <Heart size={14} color="#ef4444" fill="#ef4444" /> for Smart Indian Businesses
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
