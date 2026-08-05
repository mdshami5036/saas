import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  ImageDown,
  Printer,
  UploadCloud,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Headphones,
  Globe,
  CreditCard,
  FileText,
  Palette,
  Smartphone,
  CheckSquare
} from 'lucide-react';

export default function QrCodeModal({ cafeName, websiteUrl, bwPrice = 2.0, colorPrice = 10.0, onClose }) {
  const cardRef = useRef(null);

  const handleDownloadJPG = async () => {
    try {
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
        scrollY: -window.scrollY,
      });
      const link = document.createElement('a');
      link.download = `${cafeName || 'AutoPrint'}_QR_Standee.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 0.95);
      link.click();
    } catch (err) {
      alert('Download failed: ' + err.message);
    }
  };

  /* Exact Color System matching reference design */
  const BLUE_PRIMARY = '#1d4ed8'; // Crisp Royal Blue
  const BLUE_ACCENT = '#2563eb';
  const BLUE_BG_LIGHT = '#f0f5ff';
  const TEXT_DARK = '#0f172a';
  const TEXT_MUTED = '#475569';
  const BORDER_LIGHT = '#e2e8f0';

  return (
    <>
      {/* Modal Overlay */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(10px)',
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
              transition: 'all 0.2s',
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
           5 x 7 INCH PREMIUM STANDEE CANVAS (Print Ready & Exact Layout)
        ════════════════════════════════════════════════════════════════ */}
        <div
          ref={cardRef}
          style={{
            width: 500,
            height: 700, // Exact 5:7 Portrait Ratio
            background: '#ffffff',
            borderRadius: 20,
            padding: '28px 24px 22px',
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <style>{`
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Oswald:wght@700&display=swap');
          `}</style>

          {/* Top Decorative Background Waves */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 12,
            background: 'linear-gradient(90deg, #1e40af, #2563eb, #3b82f6)',
          }} />

          {/* ── TOP SECTION: LOGO + BRUSH BUSINESS NAME ── */}
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            {/* Top Printer Icon */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 52, height: 52, borderRadius: 16, marginBottom: 8,
              background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
              boxShadow: '0 6px 18px rgba(37, 99, 235, 0.3)',
            }}>
              <Printer size={28} color="#ffffff" strokeWidth={2.2} />
            </div>

            {/* Business Name with Brush / Scratch Texture Background */}
            <div style={{ position: 'relative', display: 'inline-block', width: '100%', margin: '4px 0 6px' }}>
              {/* Brush Stroke Background Effect */}
              <div style={{
                position: 'absolute', inset: '-6px 10%',
                background: 'linear-gradient(90deg, transparent, #e2e8f0 15%, #f1f5f9 50%, #e2e8f0 85%, transparent)',
                borderRadius: '50px', filter: 'blur(2px)', opacity: 0.85, zIndex: 0,
                transform: 'skewX(-6deg)',
              }} />

              <h1 style={{
                position: 'relative', zIndex: 1,
                fontSize: cafeName && cafeName.length > 16 ? 26 : 30,
                fontWeight: 900,
                fontFamily: "'Oswald', 'Inter', sans-serif",
                color: TEXT_DARK,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                margin: 0, lineHeight: 1.1,
                textShadow: '0 1px 2px rgba(255,255,255,0.8)',
              }}>
                {cafeName || 'BUSINESS NAME'}
              </h1>
            </div>

            {/* Fixed Tagline */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 4,
            }}>
              <div style={{ height: 1.5, width: 24, background: BLUE_ACCENT, borderRadius: 1 }} />
              <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '0.18em', color: BLUE_PRIMARY, textTransform: 'uppercase' }}>
                INSTANT <span style={{ color: BLUE_ACCENT }}>SELF-SERVICE</span> CLOUD PRINTING
              </span>
              <div style={{ height: 1.5, width: 24, background: BLUE_ACCENT, borderRadius: 1 }} />
            </div>
          </div>

          {/* ── PRICE SECTION (No /page text as requested) ── */}
          <div style={{ display: 'flex', gap: 12, margin: '8px 0' }}>
            {/* Left Card: B&W */}
            <div style={{
              flex: 1, borderRadius: 16, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 12,
              background: '#f8fafc', border: `1px solid ${BORDER_LIGHT}`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#e0e7ff', color: BLUE_PRIMARY,
              }}>
                <FileText size={20} strokeWidth={2.2} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: TEXT_MUTED, letterSpacing: '0.08em', textTransform: 'uppercase' }}>B&W PRINT</div>
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
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: '#fef3c7', color: '#d97706',
              }}>
                <Palette size={20} strokeWidth={2.2} />
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: TEXT_MUTED, letterSpacing: '0.08em', textTransform: 'uppercase' }}>FULL COLOR</div>
                <div style={{ fontSize: 24, fontWeight: 900, color: BLUE_PRIMARY, lineHeight: 1, marginTop: 2 }}>
                  ₹{parseFloat(colorPrice).toFixed(0)}
                </div>
              </div>
            </div>
          </div>

          {/* ── CENTER: LEFT FEATURES | QR CODE | RIGHT FEATURES ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Left Features Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 85, flexShrink: 0, textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: BLUE_BG_LIGHT, color: BLUE_ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UploadCloud size={20} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: 9.5, fontWeight: 800, color: TEXT_DARK, lineHeight: 1.1 }}>UPLOAD<br />PDF FILE</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: BLUE_BG_LIGHT, color: BLUE_ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldCheck size={20} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: 9.5, fontWeight: 800, color: TEXT_DARK, lineHeight: 1.1 }}>SECURE<br />PAYMENT</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: BLUE_BG_LIGHT, color: BLUE_ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Zap size={20} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: 9.5, fontWeight: 800, color: TEXT_DARK, lineHeight: 1.1 }}>INSTANT<br />PRINT</span>
              </div>
            </div>

            {/* Center Dynamic QR Card */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                background: '#ffffff', borderRadius: 22, padding: 14,
                border: `2px solid ${BLUE_ACCENT}`,
                boxShadow: '0 12px 30px rgba(37, 99, 235, 0.15)',
                position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center',
              }}>
                <QRCodeSVG
                  value={websiteUrl || 'https://autoprint.app'}
                  size={152}
                  level="H"
                  includeMargin={false}
                  fgColor={TEXT_DARK}
                  bgColor="#ffffff"
                />

                {/* Scan Button below QR */}
                <div style={{
                  marginTop: 10, width: '100%',
                  background: 'linear-gradient(135deg, #1d4ed8, #2563eb)',
                  borderRadius: 12, padding: '7px 0',
                  color: '#ffffff', fontSize: 10, fontWeight: 800,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                }}>
                  <Smartphone size={13} />
                  <span>SCAN & PRINT INSTANTLY</span>
                </div>
              </div>
            </div>

            {/* Right Features Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, width: 85, flexShrink: 0, textAlign: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: BLUE_BG_LIGHT, color: BLUE_ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle2 size={20} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: 9.5, fontWeight: 800, color: TEXT_DARK, lineHeight: 1.1 }}>SAFE &<br />RELIABLE</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: BLUE_BG_LIGHT, color: BLUE_ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={20} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: 9.5, fontWeight: 800, color: TEXT_DARK, lineHeight: 1.1 }}>POWERED BY<br />RAZORPAY</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: BLUE_BG_LIGHT, color: BLUE_ACCENT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Headphones size={20} strokeWidth={2.2} />
                </div>
                <span style={{ fontSize: 9.5, fontWeight: 800, color: TEXT_DARK, lineHeight: 1.1 }}>24×7<br />SUPPORT</span>
              </div>
            </div>
          </div>

          {/* ── HOW TO PRINT FROM PHONE (4 Steps) ── */}
          <div style={{
            borderRadius: 16, padding: '10px 12px',
            background: BLUE_BG_LIGHT, border: `1px solid ${BORDER_LIGHT}`,
            margin: '4px 0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
              <div style={{ height: 1, flex: 1, background: '#cbd5e1' }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: TEXT_DARK, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                HOW TO PRINT FROM PHONE
              </span>
              <div style={{ height: 1, flex: 1, background: '#cbd5e1' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Step 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center' }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: BLUE_ACCENT, color: '#fff', fontSize: 9, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>1</div>
                <span style={{ fontSize: 9, fontWeight: 800, color: BLUE_PRIMARY }}>SCAN QR CODE</span>
                <span style={{ fontSize: 7.5, color: TEXT_MUTED }}>with camera / UPI</span>
              </div>
              <span style={{ color: '#cbd5e1', fontWeight: 800, fontSize: 12 }}>→</span>

              {/* Step 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center' }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: BLUE_ACCENT, color: '#fff', fontSize: 9, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>2</div>
                <span style={{ fontSize: 9, fontWeight: 800, color: BLUE_PRIMARY }}>UPLOAD PDF FILE</span>
                <span style={{ fontSize: 7.5, color: TEXT_MUTED }}>& select options</span>
              </div>
              <span style={{ color: '#cbd5e1', fontWeight: 800, fontSize: 12 }}>→</span>

              {/* Step 3 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center' }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: BLUE_ACCENT, color: '#fff', fontSize: 9, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>3</div>
                <span style={{ fontSize: 9, fontWeight: 800, color: BLUE_PRIMARY }}>PAY SECURELY</span>
                <span style={{ fontSize: 7.5, color: TEXT_MUTED }}>via UPI / Netbanking</span>
              </div>
              <span style={{ color: '#cbd5e1', fontWeight: 800, fontSize: 12 }}>→</span>

              {/* Step 4 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, textAlign: 'center' }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: BLUE_ACCENT, color: '#fff', fontSize: 9, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 2 }}>4</div>
                <span style={{ fontSize: 9, fontWeight: 800, color: BLUE_PRIMARY }}>COLLECT PRINT</span>
                <span style={{ fontSize: 7.5, color: TEXT_MUTED }}>from counter</span>
              </div>
            </div>
          </div>

          {/* ── BOTTOM CONTAINER: VISIT WEBSITE TO PRINT ── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 14px', borderRadius: 14,
            border: `1.5px solid ${BLUE_ACCENT}`, background: '#ffffff',
            boxShadow: '0 2px 10px rgba(37, 99, 235, 0.08)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: BLUE_ACCENT, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={14} />
              </div>
              <span style={{ fontSize: 9.5, fontWeight: 800, color: TEXT_DARK, letterSpacing: '0.04em' }}>
                VISIT WEBSITE TO PRINT
              </span>
            </div>
            <div style={{ height: 16, width: 1, background: BORDER_LIGHT }} />
            <div style={{ fontSize: 9.5, fontWeight: 700, color: BLUE_PRIMARY, wordBreak: 'break-all', maxWidth: 220, textAlign: 'right' }}>
              {(websiteUrl || 'your-website.com/xyz123').replace(/^https?:\/\//, '')}
            </div>
          </div>

        </div>

      </div>
    </>
  );
}
