import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, ImageDown } from 'lucide-react';

/* ────────────────────────────────────────────
   STATIC — off-screen, used for PDF/Print
   794px wide, no animations, perfect capture
──────────────────────────────────────────── */
function StandeeStatic({ cafeName, websiteUrl, bwPrice, colorPrice }) {
  return (
    <div style={{
      width: 794,
      minHeight: 1100,
      background: 'linear-gradient(160deg, #0a1628 0%, #0d2048 40%, #0a1628 100%)',
      fontFamily: "'Bebas Neue','Impact','Arial Narrow',Arial,sans-serif",
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 60px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* ── Background diagonal lines (scratch effect) ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `repeating-linear-gradient(
          -55deg,
          transparent,
          transparent 18px,
          rgba(255,255,255,0.018) 18px,
          rgba(255,255,255,0.018) 19px
        )`,
      }}/>

      {/* ── Top glow blob ── */}
      <div style={{
        position:'absolute', top:-160, left:'50%', transform:'translateX(-50%)',
        width:600, height:400,
        background:'radial-gradient(circle, #1a6fd444 0%, transparent 70%)',
        pointerEvents:'none',
      }}/>

      {/* ── SHOP NAME ── */}
      <div style={{
        textAlign: 'center',
        marginBottom: 36,
        position: 'relative',
        zIndex: 1,
        width: '100%',
      }}>
        {/* Thin label above */}
        <div style={{
          fontSize: 15,
          fontFamily: "'Arial',sans-serif",
          fontWeight: 600,
          letterSpacing: '0.35em',
          color: '#4a9fd4',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}>
          — Print Center —
        </div>

        {/* Big stylish scratchy name */}
        <div style={{
          fontSize: cafeName && cafeName.length > 14 ? 72 : 88,
          fontFamily: "'Bebas Neue','Impact','Arial Narrow',Arial,sans-serif",
          fontWeight: 900,
          color: '#ffffff',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          lineHeight: 1,
          textShadow: `
            3px 3px 0px #0d2048,
            -1px -1px 0px #1a6fd422,
            0 0 40px #1a6fd488,
            0 0 80px #1a6fd422
          `,
          position: 'relative',
        }}>
          {cafeName || 'AutoPrint'}

          {/* Underline scratch */}
          <div style={{
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: 4,
            background: 'linear-gradient(90deg, transparent, #1a6fd4, #4fc3f7, #1a6fd4, transparent)',
            borderRadius: 2,
          }}/>
        </div>

        {/* Subtitle */}
        <div style={{
          marginTop: 20,
          fontSize: 14,
          fontFamily: "'Arial',sans-serif",
          fontWeight: 500,
          letterSpacing: '0.25em',
          color: '#7db5d8',
          textTransform: 'uppercase',
        }}>
          Scan &amp; Print from Your Phone
        </div>
      </div>

      {/* ── RATE CARDS ── */}
      <div style={{
        display: 'flex',
        gap: 20,
        marginBottom: 44,
        width: '100%',
        justifyContent: 'center',
        zIndex: 1,
        position: 'relative',
      }}>
        {/* B&W */}
        <div style={{
          flex: 1,
          maxWidth: 280,
          borderRadius: 20,
          padding: '22px 28px',
          background: 'rgba(255,255,255,0.06)',
          border: '1.5px solid rgba(255,255,255,0.12)',
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: "'Arial',sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.3em',
            color: '#7db5d8',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            Black &amp; White
          </div>
          <div style={{
            fontSize: 56,
            fontFamily: "'Bebas Neue','Impact',Arial,sans-serif",
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1,
            letterSpacing: '0.04em',
          }}>
            ₹{parseFloat(bwPrice).toFixed(2)}
          </div>
          <div style={{
            fontFamily: "'Arial',sans-serif",
            fontSize: 12,
            color: '#4a9fd4',
            marginTop: 4,
            letterSpacing: '0.1em',
          }}>
            per page
          </div>
        </div>

        {/* Divider */}
        <div style={{
          width: 1,
          alignSelf: 'stretch',
          background: 'linear-gradient(180deg, transparent, rgba(255,255,255,0.15), transparent)',
        }}/>

        {/* Color */}
        <div style={{
          flex: 1,
          maxWidth: 280,
          borderRadius: 20,
          padding: '22px 28px',
          background: 'rgba(255,255,255,0.06)',
          border: '1.5px solid rgba(255,255,255,0.12)',
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: "'Arial',sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.3em',
            color: '#7db5d8',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            Full Color
          </div>
          <div style={{
            fontSize: 56,
            fontFamily: "'Bebas Neue','Impact',Arial,sans-serif",
            fontWeight: 900,
            color: '#4fc3f7',
            lineHeight: 1,
            letterSpacing: '0.04em',
          }}>
            ₹{parseFloat(colorPrice).toFixed(2)}
          </div>
          <div style={{
            fontFamily: "'Arial',sans-serif",
            fontSize: 12,
            color: '#4a9fd4',
            marginTop: 4,
            letterSpacing: '0.1em',
          }}>
            per page
          </div>
        </div>
      </div>

      {/* ── QR CODE ── */}
      <div style={{
        background: '#ffffff',
        borderRadius: 28,
        padding: 28,
        marginBottom: 36,
        boxShadow: '0 0 60px rgba(79,195,247,0.3), 0 0 120px rgba(26,111,212,0.2)',
        position: 'relative',
        zIndex: 1,
      }}>
        <QRCodeSVG
          value={websiteUrl || 'https://autoprint.app'}
          size={260}
          level="H"
          includeMargin={false}
          fgColor="#0a1628"
          bgColor="#ffffff"
        />
      </div>

      {/* ── SCAN LABEL ── */}
      <div style={{
        fontFamily: "'Arial',sans-serif",
        fontSize: 14,
        fontWeight: 700,
        letterSpacing: '0.3em',
        color: '#4fc3f7',
        textTransform: 'uppercase',
        marginBottom: 10,
        zIndex: 1,
        position: 'relative',
      }}>
        ↑ Scan with your phone camera ↑
      </div>

      {/* ── URL ── */}
      <div style={{
        fontFamily: "'Arial',sans-serif",
        fontSize: 12,
        color: '#3d7aad',
        letterSpacing: '0.05em',
        zIndex: 1,
        position: 'relative',
        marginBottom: 40,
        wordBreak: 'break-all',
        textAlign: 'center',
        maxWidth: 580,
      }}>
        {websiteUrl || ''}
      </div>

      {/* ── BOTTOM LINE ── */}
      <div style={{
        width: '100%',
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
        marginBottom: 24,
        zIndex: 1,
        position: 'relative',
      }}/>

      <div style={{
        fontFamily: "'Arial',sans-serif",
        fontSize: 11,
        color: '#2d5a80',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        zIndex: 1,
        position: 'relative',
      }}>
        Powered by AutoPrint SaaS
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   ANIMATED PREVIEW — shown in modal
──────────────────────────────────────────── */
function StandeePreview({ cafeName, websiteUrl, bwPrice, colorPrice }) {
  return (
    <div style={{
      width: 400,
      background: 'linear-gradient(160deg, #0a1628 0%, #0d2048 40%, #0a1628 100%)',
      fontFamily: "'Bebas Neue','Impact','Arial Narrow',Arial,sans-serif",
      borderRadius: 24,
      padding: '40px 36px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      boxShadow: '0 0 80px rgba(26,111,212,0.35)',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;600;700;800;900&display=swap');
        @keyframes qrFloat{0%,100%{box-shadow:0 0 30px rgba(79,195,247,0.4),0 0 60px rgba(26,111,212,0.2)}50%{box-shadow:0 0 50px rgba(79,195,247,0.6),0 0 100px rgba(26,111,212,0.3)}}
        .qr-float{animation:qrFloat 3s ease-in-out infinite}
      `}</style>

      {/* scratch lines */}
      <div style={{position:'absolute',inset:0,pointerEvents:'none',backgroundImage:`repeating-linear-gradient(-55deg,transparent,transparent 18px,rgba(255,255,255,0.018) 18px,rgba(255,255,255,0.018) 19px)`}}/>
      <div style={{position:'absolute',top:-100,left:'50%',transform:'translateX(-50%)',width:400,height:260,background:'radial-gradient(circle,#1a6fd433 0%,transparent 70%)',pointerEvents:'none'}}/>

      {/* Label */}
      <div style={{fontSize:10,fontFamily:"'Inter',sans-serif",fontWeight:600,letterSpacing:'0.35em',color:'#4a9fd4',textTransform:'uppercase',marginBottom:6,zIndex:1}}>
        — Print Center —
      </div>

      {/* Name */}
      <div style={{
        fontSize: cafeName && cafeName.length > 14 ? 46 : 56,
        fontWeight: 900, color: '#ffffff',
        letterSpacing: '0.06em', textTransform: 'uppercase',
        lineHeight: 1, textAlign: 'center', zIndex: 1,
        textShadow: '0 0 30px #1a6fd488',
        marginBottom: 4,
      }}>
        {cafeName || 'AutoPrint'}
      </div>
      <div style={{width:'70%',height:3,background:'linear-gradient(90deg,transparent,#1a6fd4,#4fc3f7,#1a6fd4,transparent)',borderRadius:2,marginBottom:14,zIndex:1}}/>
      <div style={{fontSize:9,fontFamily:"'Inter',sans-serif",fontWeight:500,letterSpacing:'0.2em',color:'#7db5d8',textTransform:'uppercase',marginBottom:22,zIndex:1}}>
        Scan &amp; Print from Your Phone
      </div>

      {/* Rates */}
      <div style={{display:'flex',gap:12,marginBottom:24,width:'100%',justifyContent:'center',zIndex:1}}>
        <div style={{flex:1,borderRadius:16,padding:'14px 16px',background:'rgba(255,255,255,0.06)',border:'1.5px solid rgba(255,255,255,0.12)',textAlign:'center'}}>
          <div style={{fontSize:9,fontFamily:"'Inter',sans-serif",fontWeight:700,letterSpacing:'0.25em',color:'#7db5d8',textTransform:'uppercase',marginBottom:4}}>B&amp;W</div>
          <div style={{fontSize:36,fontWeight:900,color:'#fff',lineHeight:1}}>₹{parseFloat(bwPrice).toFixed(2)}</div>
          <div style={{fontSize:9,fontFamily:"'Inter',sans-serif",color:'#4a9fd4',marginTop:2}}>per page</div>
        </div>
        <div style={{width:1,alignSelf:'stretch',background:'linear-gradient(180deg,transparent,rgba(255,255,255,0.12),transparent)'}}/>
        <div style={{flex:1,borderRadius:16,padding:'14px 16px',background:'rgba(255,255,255,0.06)',border:'1.5px solid rgba(255,255,255,0.12)',textAlign:'center'}}>
          <div style={{fontSize:9,fontFamily:"'Inter',sans-serif",fontWeight:700,letterSpacing:'0.25em',color:'#7db5d8',textTransform:'uppercase',marginBottom:4}}>Color</div>
          <div style={{fontSize:36,fontWeight:900,color:'#4fc3f7',lineHeight:1}}>₹{parseFloat(colorPrice).toFixed(2)}</div>
          <div style={{fontSize:9,fontFamily:"'Inter',sans-serif",color:'#4a9fd4',marginTop:2}}>per page</div>
        </div>
      </div>

      {/* QR */}
      <div className="qr-float" style={{background:'#fff',borderRadius:20,padding:18,marginBottom:18,zIndex:1}}>
        <QRCodeSVG value={websiteUrl||'https://autoprint.app'} size={180} level="H" includeMargin={false} fgColor="#0a1628" bgColor="#ffffff"/>
      </div>

      <div style={{fontSize:9,fontFamily:"'Inter',sans-serif",fontWeight:700,letterSpacing:'0.28em',color:'#4fc3f7',textTransform:'uppercase',marginBottom:8,zIndex:1}}>
        ↑ Scan with your phone camera ↑
      </div>
      <div style={{fontSize:9,fontFamily:"'Inter',sans-serif",color:'#3d7aad',wordBreak:'break-all',textAlign:'center',maxWidth:320,marginBottom:18,zIndex:1}}>
        {websiteUrl||''}
      </div>
      <div style={{width:'100%',height:1,background:'linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent)',marginBottom:12,zIndex:1}}/>
      <div style={{fontSize:9,fontFamily:"'Inter',sans-serif",color:'#2d5a80',letterSpacing:'0.15em',textTransform:'uppercase',zIndex:1}}>
        Powered by AutoPrint SaaS
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   MAIN MODAL
──────────────────────────────────────────── */
export default function QrCodeModal({ cafeName, websiteUrl, bwPrice = 2.0, colorPrice = 10.0, onClose }) {
  const captureRef = useRef(null);

  const captureCanvas = async () => {
    const html2canvas = (await import('html2canvas')).default;
    const el = captureRef.current;
    return html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#0a1628',
      logging: false,
      allowTaint: true,
      width: el.offsetWidth,
      height: el.offsetHeight,
      scrollX: 0,
      scrollY: 0,
    });
  };

  const handleDownload = async () => {
    try {
      const canvas = await captureCanvas();
      const { jsPDF } = await import('jspdf');
      const imgData = canvas.toDataURL('image/png');
      const pxToMm = 0.264583;
      const pdfW = Math.round(canvas.width * pxToMm);
      const pdfH = Math.round(canvas.height * pxToMm);
      const pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:[pdfW, pdfH] });
      pdf.setFillColor(10, 22, 40);
      pdf.rect(0, 0, pdfW, pdfH, 'F');
      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
      pdf.save(`${cafeName || 'AutoPrint'}_QR_Standee.pdf`);
    } catch (err) {
      alert('PDF download failed: ' + err.message);
    }
  };

  const handlePrint = async () => {
    try {
      const canvas = await captureCanvas();
      const imgData = canvas.toDataURL('image/png');
      const pw = window.open('', '_blank');
      pw.document.write(`<!DOCTYPE html><html><head><title>QR Standee - ${cafeName||'AutoPrint'}</title>
        <style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a1628}img{width:100%;display:block}
        @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style>
        </head><body><img src="${imgData}"/>
        <script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}}<\/script>
        </body></html>`);
      pw.document.close();
    } catch (err) {
      alert('Print failed: ' + err.message);
    }
  };

  const btnBase = {
    display:'flex', alignItems:'center', gap:8,
    padding:'11px 22px', borderRadius:14,
    fontWeight:800, fontSize:13, color:'#fff',
    border:'none', cursor:'pointer',
    fontFamily:'Inter,sans-serif',
  };

  return (
    <>
      {/* Hidden static capture element */}
      <div style={{position:'fixed', left:'-9999px', top:0, zIndex:-1, pointerEvents:'none'}}>
        <div ref={captureRef}>
          <StandeeStatic cafeName={cafeName} websiteUrl={websiteUrl} bwPrice={bwPrice} colorPrice={colorPrice}/>
        </div>
      </div>

      {/* Modal */}
      <div style={{position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.85)',
        backdropFilter:'blur(10px)', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'flex-start', overflowY:'auto', padding:'16px 8px 100px'}}>

        {/* Buttons */}
        <div style={{display:'flex', gap:10, marginBottom:18, position:'sticky', top:8, zIndex:10}}>
          <button style={{...btnBase, background:'linear-gradient(135deg,#10B981,#059669)'}} onClick={handleDownload}>
            <ImageDown size={16}/> Download PDF
          </button>
          <button style={{...btnBase, background:'linear-gradient(135deg,#1a6fd4,#0d2048)'}} onClick={handlePrint}>
            <Printer size={16}/> Print A4
          </button>
          <button style={{...btnBase, background:'#1e293b', border:'1px solid #334155', color:'#cbd5e1', fontWeight:700}} onClick={onClose}>
            <X size={16}/> Close
          </button>
        </div>

        {/* Animated preview */}
        <StandeePreview cafeName={cafeName} websiteUrl={websiteUrl} bwPrice={bwPrice} colorPrice={colorPrice}/>
      </div>
    </>
  );
}
