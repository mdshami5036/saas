import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  ImageDown,
  UploadCloud,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Headphones,
  Globe,
  CreditCard,
  FileText,
  Palette,
  Smartphone
} from 'lucide-react';

export default function QrCodeModal({ cafeName, websiteUrl, bwPrice = 2.0, colorPrice = 10.0, onClose }) {
  const cardRef = useRef(null);

  const handleDownloadJPG = async () => {
    try {
      // Ensure all custom web fonts are fully loaded before capturing
      if (document.fonts) {
        await document.fonts.ready;
      }

      const html2canvas = (await import('html2canvas')).default;
      const el = cardRef.current;

      const canvas = await html2canvas(el, {
        scale: 3, // High DPI for 5x7 print quality
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        width: el.offsetWidth,
        height: el.offsetHeight,
        scrollX: 0,
        scrollY: 0,
      });

      const link = document.createElement('a');
      link.download = `${(cafeName || 'AutoPrint').replace(/\s+/g, '_')}_QR_Standee.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch (err) {
      alert('Download failed: ' + err.message);
    }
  };

  /* Exact Color System */
  const BLUE_PRIMARY = '#1d4ed8'; // Crisp Royal Blue
  const BLUE_ACCENT = '#2563eb';
  const BLUE_BG_LIGHT = '#f0f5ff';
  const TEXT_DARK = '#0f172a';
  const TEXT_MUTED = '#475569';
  const BORDER_LIGHT = '#cbd5e1';

  // SVG Step Badge Helper (100% html2canvas shift-proof)
  const StepBadge = ({ number }) => (
    <svg width="22" height="22" viewBox="0 0 22 22" style={{ display: 'block', margin: '0 auto 4px' }}>
      <circle cx="11" cy="11" r="10.5" fill={BLUE_ACCENT} />
      <text x="11" y="14.5" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800" fontFamily="Arial, sans-serif">
        {number}
      </text>
    </svg>
  );

  return (
    <>
      {/* Modal Overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(8px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'flex-start', overflowY: 'auto',
        padding: '20px 10px 100px',
      }}>

        {/* Action Controls */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, position: 'sticky', top: 10, zIndex: 10 }}>
          <button
            onClick={handleDownloadJPG}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 14,
              fontWeight: 800, fontSize: 14, color: '#ffffff', border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
              boxShadow: '0 8px 25px rgba(37, 99, 235, 0.4)', fontFamily: 'Inter, sans-serif',
            }}
          >
            <ImageDown size={18} /> Download Standee (JPG)
          </button>
          <button
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 20px', borderRadius: 14,
              fontWeight: 700, fontSize: 14, color: '#64748b',
              background: '#ffffff', border: '1px solid #cbd5e1', cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            }}
          >
            <X size={18} /> Close
          </button>
        </div>

        {/* ════════════════════════════════════════════════════════════════
           5 x 7 INCH PREMIUM STANDEE CANVAS (100% html2canvas Shift-Proof)
        ════════════════════════════════════════════════════════════════ */}
        <div
          ref={cardRef}
          style={{
            width: 500,
            background: '#ffffff',
            borderRadius: 20,
            padding: '24px 22px 20px',
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            boxSizing: 'border-box',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)',
          }}
        >
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Oswald:wght@700&display=swap');
          `}</style>

          {/* Top Decorative Blue Bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 10,
            background: 'linear-gradient(90deg, #1e40af, #2563eb, #3b82f6)',
            borderTopLeftRadius: 20, borderTopRightRadius: 20,
          }} />

          {/* ── TOP SECTION: LOGO + BRUSH BUSINESS NAME ── */}
          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            {/* Top Printer Icon */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 48, height: 48, borderRadius: 14, marginBottom: 8,
              background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
              boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)',
              boxSizing: 'border-box',
            }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
            </div>

            {/* Business Name Badge Container (Direct background container to prevent text shift) */}
            <div style={{ margin: '2px 0 6px', textAlign: 'center' }}>
              <div style={{
                display: 'inline-block',
                background: '#e2e8f0',
                borderRadius: 25,
                padding: '4px 24px',
                maxWidth: '90%',
                boxSizing: 'border-box',
              }}>
                <h1 style={{
                  fontSize: cafeName && cafeName.length > 16 ? 22 : 26,
                  fontWeight: 900,
                  fontFamily: "'Oswald', 'Inter', Arial, sans-serif",
                  color: TEXT_DARK,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  margin: 0, lineHeight: 1.2,
                }}>
                  {cafeName || 'BUSINESS NAME'}
                </h1>
              </div>
            </div>

            {/* Fixed Tagline */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 4,
            }}>
              <div style={{ height: 1.5, width: 24, background: BLUE_ACCENT, borderRadius: 1 }} />
              <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.18em', color: BLUE_PRIMARY, textTransform: 'uppercase' }}>
                INSTANT <span style={{ color: BLUE_ACCENT }}>SELF-SERVICE</span> CLOUD PRINTING
              </span>
              <div style={{ height: 1.5, width: 24, background: BLUE_ACCENT, borderRadius: 1 }} />
            </div>
          </div>

          {/* ── PRICE SECTION (No /page text) ── */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            {/* Left Card: B&W */}
            <div style={{
              flex: 1, borderRadius: 16, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
              background: '#f8fafc', border: `1px solid ${BORDER_LIGHT}`,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#e0e7ff', color: BLUE_PRIMARY,
              }}>
                <FileText size={20} strokeWidth={2.2} />
              </div>
              <div>
                <div style={{ fontSize: 9.5, fontWeight: 800, color: TEXT_MUTED, letterSpacing: '0.08em', textTransform: 'uppercase' }}>B&W PRINT</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: BLUE_PRIMARY, lineHeight: 1, marginTop: 2 }}>
                  ₹{parseFloat(bwPrice).toFixed(0)}
                </div>
              </div>
            </div>

            {/* Right Card: Full Color */}
            <div style={{
              flex: 1, borderRadius: 16, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
              background: '#f8fafc', border: `1px solid ${BORDER_LIGHT}`,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#fef3c7', color: '#d97706',
              }}>
                <Palette size={20} strokeWidth={2.2} />
              </div>
              <div>
                <div style={{ fontSize: 9.5, fontWeight: 800, color: TEXT_MUTED, letterSpacing: '0.08em', textTransform: 'uppercase' }}>FULL COLOR</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: BLUE_PRIMARY, lineHeight: 1, marginTop: 2 }}>
                  ₹{parseFloat(colorPrice).toFixed(0)}
                </div>
              </div>
            </div>
          </div>

          {/* ── CENTER: LEFT FEATURES | QR CODE | RIGHT FEATURES ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            {/* Left Features Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 85, flexShrink: 0, textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: BLUE_BG_LIGHT, color: BLUE_ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UploadCloud size={19} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, color: TEXT_DARK, lineHeight: 1.1 }}>UPLOAD<br />PDF FILE</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: BLUE_BG_LIGHT, color: BLUE_ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={19} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, color: TEXT_DARK, lineHeight: 1.1 }}>SECURE<br />PAYMENT</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: BLUE_BG_LIGHT, color: BLUE_ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={19} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, color: TEXT_DARK, lineHeight: 1.1 }}>INSTANT<br />PRINT</span>
              </div>
            </div>

            {/* Center Dynamic QR Card */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                background: '#ffffff', borderRadius: 20, padding: 12,
                border: `2px solid ${BLUE_ACCENT}`,
                boxShadow: '0 10px 25px rgba(37, 99, 235, 0.12)',
                position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
                boxSizing: 'border-box', width: '100%',
              }}>
                <QRCodeSVG
                  value={websiteUrl || 'https://autoprint.app'}
                  size={150}
                  level="H"
                  includeMargin={false}
                  fgColor={TEXT_DARK}
                  bgColor="#ffffff"
                />

                {/* Scan Button below QR */}
                <div style={{
                  marginTop: 10, width: '100%',
                  background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                  borderRadius: 10, padding: '7px 0',
                  color: '#ffffff', fontSize: 9.5, fontWeight: 800,
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  boxShadow: '0 4px 10px rgba(37, 99, 235, 0.25)',
                }}>
                  <Smartphone size={13} />
                  <span>SCAN & PRINT INSTANTLY</span>
                </div>
              </div>
            </div>

            {/* Right Features Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 85, flexShrink: 0, textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: BLUE_BG_LIGHT, color: BLUE_ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={19} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, color: TEXT_DARK, lineHeight: 1.1 }}>SAFE &<br />RELIABLE</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: BLUE_BG_LIGHT, color: BLUE_ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={19} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, color: TEXT_DARK, lineHeight: 1.1 }}>POWERED BY<br />RAZORPAY</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: BLUE_BG_LIGHT, color: BLUE_ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Headphones size={19} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: 9, fontWeight: 800, color: TEXT_DARK, lineHeight: 1.1 }}>24×7<br />SUPPORT</span>
              </div>
            </div>
          </div>

          {/* ── HOW TO PRINT FROM PHONE (4 Steps - Shift-Proof Badges) ── */}
          <div style={{
            borderRadius: 16, padding: '10px 10px',
            background: BLUE_BG_LIGHT, border: `1px solid ${BORDER_LIGHT}`,
            marginBottom: 14,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
              <div style={{ height: 1, flex: 1, background: '#cbd5e1' }} />
              <span style={{ fontSize: 9.5, fontWeight: 800, color: TEXT_DARK, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                HOW TO PRINT FROM PHONE
              </span>
              <div style={{ height: 1, flex: 1, background: '#cbd5e1' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Step 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center' }}>
                <StepBadge number="1" />
                <span style={{ fontSize: 8.5, fontWeight: 800, color: BLUE_PRIMARY, lineHeight: 1.1 }}>SCAN QR CODE</span>
                <span style={{ fontSize: 7.5, color: TEXT_MUTED, marginTop: 2 }}>with camera / UPI</span>
              </div>
              <span style={{ color: '#cbd5e1', fontWeight: 800, fontSize: 12 }}>→</span>

              {/* Step 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center' }}>
                <StepBadge number="2" />
                <span style={{ fontSize: 8.5, fontWeight: 800, color: BLUE_PRIMARY, lineHeight: 1.1 }}>UPLOAD PDF FILE</span>
                <span style={{ fontSize: 7.5, color: TEXT_MUTED, marginTop: 2 }}>& select options</span>
              </div>
              <span style={{ color: '#cbd5e1', fontWeight: 800, fontSize: 12 }}>→</span>

              {/* Step 3 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center' }}>
                <StepBadge number="3" />
                <span style={{ fontSize: 8.5, fontWeight: 800, color: BLUE_PRIMARY, lineHeight: 1.1 }}>PAY SECURELY</span>
                <span style={{ fontSize: 7.5, color: TEXT_MUTED, marginTop: 2 }}>via UPI / Netbanking</span>
              </div>
              <span style={{ color: '#cbd5e1', fontWeight: 800, fontSize: 12 }}>→</span>

              {/* Step 4 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center' }}>
                <StepBadge number="4" />
                <span style={{ fontSize: 8.5, fontWeight: 800, color: BLUE_PRIMARY, lineHeight: 1.1 }}>COLLECT PRINT</span>
                <span style={{ fontSize: 7.5, color: TEXT_MUTED, marginTop: 2 }}>from counter</span>
              </div>
            </div>
          </div>

          {/* ── BOTTOM CONTAINER: VISIT WEBSITE TO PRINT ── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 14px', borderRadius: 12,
            border: `1.5px solid ${BLUE_ACCENT}`, background: '#ffffff',
            boxShadow: '0 2px 8px rgba(37, 99, 235, 0.06)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: BLUE_ACCENT, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={13} />
              </div>
              <span style={{ fontSize: 9, fontWeight: 800, color: TEXT_DARK, letterSpacing: '0.04em' }}>
                VISIT WEBSITE TO PRINT
              </span>
            </div>
            <div style={{ height: 14, width: 1, background: BORDER_LIGHT }} />
            <div style={{ fontSize: 9, fontWeight: 700, color: BLUE_PRIMARY, wordBreak: 'break-all', maxWidth: 220, textAlign: 'right' }}>
              {(websiteUrl || 'your-website.com/xyz123').replace(/^https?:\/\//, '')}
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
