import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, Download, ImageDown } from 'lucide-react';

/* ─────────────────────────────────────────────
   INLINE STYLES  (no Tailwind needed for standee)
   So the canvas capture works perfectly.
───────────────────────────────────────────── */

const S = {
  overlay: {
    position:'fixed', inset:0, zIndex:9999,
    background:'rgba(0,0,0,0.85)',
    backdropFilter:'blur(10px)',
    display:'flex', flexDirection:'column',
    alignItems:'center', justifyContent:'flex-start',
    overflowY:'auto', padding:'16px 8px 100px',
  },
  actionBar: {
    display:'flex', gap:12, marginBottom:16,
    position:'sticky', top:8, zIndex:10,
  },
  btn: (bg) => ({
    display:'flex', alignItems:'center', gap:8,
    padding:'10px 22px', borderRadius:14,
    fontWeight:800, fontSize:13, color:'#fff',
    background: bg, border:'none', cursor:'pointer',
    boxShadow:'0 4px 20px #0004',
    fontFamily:'Inter,sans-serif',
    transition:'transform .15s',
  }),
  btnClose: {
    display:'flex', alignItems:'center', gap:8,
    padding:'10px 18px', borderRadius:14,
    fontWeight:700, fontSize:13, color:'#cbd5e1',
    background:'#1e293b', border:'1px solid #334155',
    cursor:'pointer', fontFamily:'Inter,sans-serif',
  },
};

/* ── The actual printable standee ── */
function StandeeCard({ cafeName, websiteUrl, bwPrice, colorPrice }) {
  const w = 520;

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
    @keyframes qrPulse{0%,100%{box-shadow:0 0 22px 6px #7C3AEDaa,0 0 50px 12px #0EA5E944}50%{box-shadow:0 0 40px 14px #0EA5E9cc,0 0 70px 20px #7C3AED66}}
    @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
    @keyframes bgMove{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
    @keyframes borderPulse{0%,100%{opacity:1}50%{opacity:.55}}
    .standee-root{font-family:'Inter',sans-serif;box-sizing:border-box}
    .float-icon{animation:floatY 3s ease-in-out infinite}
    .qr-glow{animation:qrPulse 2.2s ease-in-out infinite}
    .bg-anim{background-size:300% 300%;animation:bgMove 9s ease infinite}
    @media print{
      body>*{display:none!important}
      .print-standee-root{display:block!important;position:fixed;top:0;left:0;width:100vw;min-height:100vh;z-index:99999}
      .no-print{display:none!important}
    }
  `;

  return (
    <>
      <style>{css}</style>
      <div
        className="standee-root print-standee-root"
        style={{
          width: w, borderRadius:28,
          background:'linear-gradient(140deg,#060d1f 0%,#0b1535 30%,#100d32 60%,#060d1f 100%)',
          border:'2px solid transparent',
          backgroundClip:'border-box',
          boxShadow:'0 0 80px 10px #0EA5E922, 0 0 0 2px #7C3AED44 inset, 0 0 0 4px #0EA5E922 inset',
          overflow:'hidden', position:'relative',
          padding:'26px 22px 24px',
        }}
      >
        {/* BG neon blobs */}
        <div style={{position:'absolute',top:-100,left:-100,width:320,height:320,borderRadius:'50%',background:'radial-gradient(circle,#7C3AED33 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>
        <div style={{position:'absolute',bottom:-80,right:-80,width:280,height:280,borderRadius:'50%',background:'radial-gradient(circle,#0EA5E933 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>
        <div style={{position:'absolute',top:'55%',left:-60,width:200,height:200,borderRadius:'50%',background:'radial-gradient(circle,#10B98122 0%,transparent 70%)',pointerEvents:'none',zIndex:0}}/>

        {/* ── HEADER ── */}
        <div style={{textAlign:'center',position:'relative',zIndex:1,marginBottom:18}}>
          {/* Printer icon */}
          <div className="float-icon" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',
            width:62,height:62,borderRadius:20,marginBottom:10,
            background:'linear-gradient(135deg,#0EA5E9,#7C3AED)',
            boxShadow:'0 8px 32px #7C3AED88,0 2px 8px #0006'}}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
            </svg>
          </div>

          <div style={{fontSize:28,fontWeight:900,color:'#fff',letterSpacing:'0.14em',textTransform:'uppercase',
            textShadow:'0 0 30px #0EA5E9cc,0 2px 6px #0006',lineHeight:1,marginBottom:6}}>
            {cafeName || 'AutoPrint Center'}
          </div>

          {/* Divider */}
          <div style={{display:'flex',alignItems:'center',gap:10,justifyContent:'center',marginTop:6}}>
            <div style={{height:1,width:48,background:'linear-gradient(90deg,transparent,#0EA5E9)'}}/>
            <span style={{fontSize:9.5,fontWeight:700,letterSpacing:'0.22em',color:'#0EA5E9',
              textShadow:'0 0 10px #0EA5E9',textTransform:'uppercase'}}>
              ✦ Instant Self-Service Online Cloud Printing ✦
            </span>
            <div style={{height:1,width:48,background:'linear-gradient(90deg,#0EA5E9,transparent)'}}/>
          </div>
        </div>

        {/* ── PRICING CARDS ── */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:18,position:'relative',zIndex:1}}>
          {/* B&W */}
          <div style={{borderRadius:18,padding:'12px 14px',display:'flex',alignItems:'center',gap:12,
            background:'linear-gradient(135deg,#0EA5E918,#060d1f)',
            border:'1.5px solid #0EA5E955',boxShadow:'0 0 24px #0EA5E922'}}>
            <div style={{width:42,height:42,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
              background:'linear-gradient(135deg,#0EA5E9,#0369A1)',boxShadow:'0 4px 14px #0EA5E966'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div>
              <div style={{fontSize:9,fontWeight:700,color:'#94a3b8',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:2}}>B&amp;W Print</div>
              <div style={{fontSize:22,fontWeight:900,color:'#fff',lineHeight:1}}>₹{parseFloat(bwPrice).toFixed(2)}<span style={{fontSize:11,fontWeight:400,color:'#64748b'}}> /page</span></div>
            </div>
          </div>
          {/* Color */}
          <div style={{borderRadius:18,padding:'12px 14px',display:'flex',alignItems:'center',gap:12,
            background:'linear-gradient(135deg,#7C3AED18,#060d1f)',
            border:'1.5px solid #7C3AED55',boxShadow:'0 0 24px #7C3AED22'}}>
            <div style={{width:42,height:42,borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
              background:'linear-gradient(135deg,#7C3AED,#5B21B6)',boxShadow:'0 4px 14px #7C3AED66'}}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>
            </div>
            <div>
              <div style={{fontSize:9,fontWeight:700,color:'#94a3b8',letterSpacing:'0.15em',textTransform:'uppercase',marginBottom:2}}>Full Color</div>
              <div style={{fontSize:22,fontWeight:900,color:'#fff',lineHeight:1}}>₹{parseFloat(colorPrice).toFixed(2)}<span style={{fontSize:11,fontWeight:400,color:'#64748b'}}> /page</span></div>
            </div>
          </div>
        </div>

        {/* ── MIDDLE ROW: Left Features | QR | Right Features ── */}
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:18,position:'relative',zIndex:1}}>

          {/* Left features */}
          <div style={{display:'flex',flexDirection:'column',gap:10,width:88,flexShrink:0}}>
            {[
              {icon:'☁️',label:'UPLOAD',sub:'PDF FILE',c:'#0EA5E9'},
              {icon:'🛡️',label:'SECURE',sub:'PAYMENT',c:'#10B981'},
              {icon:'⚡',label:'INSTANT',sub:'PRINT',c:'#F59E0B'},
            ].map((f,i)=>(
              <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',
                padding:'8px 4px',borderRadius:16,border:`1.5px solid ${f.c}44`,
                background:`${f.c}0f`,boxShadow:`0 0 14px ${f.c}22`,gap:3}}>
                <div style={{fontSize:22,lineHeight:1,filter:`drop-shadow(0 0 6px ${f.c})`}}>{f.icon}</div>
                <div style={{fontSize:9.5,fontWeight:800,color:f.c,letterSpacing:'0.1em'}}>{f.label}</div>
                <div style={{fontSize:8.5,fontWeight:600,color:'#94a3b8'}}>{f.sub}</div>
              </div>
            ))}
          </div>

          {/* QR Code */}
          <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:10}}>
            <div className="qr-glow" style={{background:'rgba(255,255,255,0.97)',borderRadius:24,
              padding:16,border:'3px solid #7C3AED',position:'relative',display:'inline-block'}}>
              <QRCodeSVG
                value={websiteUrl || 'https://autoprint.app'}
                size={175}
                level="H"
                includeMargin={false}
              />
              {/* Center badge on QR */}
              <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
                width:40,height:40,borderRadius:12,
                background:'linear-gradient(135deg,#0EA5E9,#7C3AED)',
                boxShadow:'0 2px 14px #7C3AED99',
                display:'flex',alignItems:'center',justifyContent:'center'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
                </svg>
              </div>
            </div>

            {/* Scan CTA */}
            <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:8,
              padding:'9px 0',borderRadius:16,fontWeight:800,color:'#fff',fontSize:10.5,
              letterSpacing:'0.12em',textTransform:'uppercase',
              background:'linear-gradient(135deg,#7C3AED,#0EA5E9)',
              boxShadow:'0 4px 22px #7C3AED66'}}>
              📱 Scan &amp; Print Instantly
            </div>
          </div>

          {/* Right features */}
          <div style={{display:'flex',flexDirection:'column',gap:10,width:88,flexShrink:0}}>
            {[
              {icon:'✅',label:'SAFE &',sub:'RELIABLE',c:'#7C3AED'},
              {icon:'💰',label:'POWERED BY',sub:'RAZORPAY',c:'#10B981'},
              {icon:'🎧',label:'24×7',sub:'SUPPORT',c:'#0EA5E9'},
            ].map((f,i)=>(
              <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',
                padding:'8px 4px',borderRadius:16,border:`1.5px solid ${f.c}44`,
                background:`${f.c}0f`,boxShadow:`0 0 14px ${f.c}22`,gap:3}}>
                <div style={{fontSize:22,lineHeight:1,filter:`drop-shadow(0 0 6px ${f.c})`}}>{f.icon}</div>
                <div style={{fontSize:9.5,fontWeight:800,color:f.c,letterSpacing:'0.1em'}}>{f.label}</div>
                <div style={{fontSize:8.5,fontWeight:600,color:'#94a3b8'}}>{f.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── HOW TO PRINT ── */}
        <div style={{borderRadius:20,padding:'14px 12px',marginBottom:16,
          background:'linear-gradient(135deg,#0EA5E910,#7C3AED08)',
          border:'1.5px solid #0EA5E933',position:'relative',zIndex:1}}>
          {/* Heading */}
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14,justifyContent:'center'}}>
            <div style={{height:1,flex:1,background:'linear-gradient(90deg,transparent,#0EA5E9)'}}/>
            <span style={{fontSize:11,fontWeight:900,color:'#fff',letterSpacing:'0.2em',
              textTransform:'uppercase',textShadow:'0 0 12px #0EA5E9',whiteSpace:'nowrap'}}>
              🖥️ How To Print From Phone
            </span>
            <div style={{height:1,flex:1,background:'linear-gradient(90deg,#0EA5E9,transparent)'}}/>
          </div>

          {/* Steps */}
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:4}}>
            {[
              {emoji:'📱',label:'Scan QR Code',sub:'with phone camera or UPI app',c:'#0EA5E9'},
              {emoji:'📄',label:'Upload PDF File',sub:'& select page options',c:'#7C3AED'},
              {emoji:'💳',label:'Pay Securely',sub:'via UPI / Card / Netbanking',c:'#10B981'},
              {emoji:'🖨️',label:'Collect Print',sub:'from the counter instantly!',c:'#F59E0B'},
            ].map((s,i)=>(
              <React.Fragment key={i}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',flex:1,gap:4}}>
                  <div style={{width:18,height:18,borderRadius:'50%',background:s.c,
                    display:'flex',alignItems:'center',justifyContent:'center',
                    fontSize:9,fontWeight:900,color:'#fff',
                    boxShadow:`0 0 8px ${s.c}99`}}>{i+1}</div>
                  <div style={{width:46,height:46,borderRadius:16,display:'flex',alignItems:'center',justifyContent:'center',
                    background:`${s.c}18`,border:`1.5px solid ${s.c}55`,
                    boxShadow:`0 0 14px ${s.c}33`,fontSize:22}}>{s.emoji}</div>
                  <div style={{fontSize:8.5,fontWeight:800,color:'#fff',lineHeight:1.2}}>{s.label}</div>
                  <div style={{fontSize:7.5,color:'#94a3b8',lineHeight:1.2}}>{s.sub}</div>
                </div>
                {i < 3 && <div style={{color:'#475569',fontWeight:900,fontSize:16,marginTop:28,flexShrink:0}}>→</div>}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* ── FOOTER STRIP ── */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:8,marginBottom:12,position:'relative',zIndex:1}}>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,padding:'8px 4px',
            borderRadius:14,border:'1.5px solid #10B98155',background:'#10B98110',textAlign:'center'}}>
            <span style={{fontSize:18}}>✅</span>
            <div style={{fontSize:8.5,fontWeight:800,color:'#10B981',letterSpacing:'0.05em'}}>NO APP REQUIRED</div>
            <div style={{fontSize:7.5,color:'#64748b'}}>100% Web Based</div>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,padding:'8px 4px',
            borderRadius:14,border:'1.5px solid #0EA5E955',background:'#0EA5E910',textAlign:'center'}}>
            <span style={{fontSize:18}}>🌐</span>
            <div style={{fontSize:8.5,fontWeight:800,color:'#0EA5E9',letterSpacing:'0.04em'}}>YOUR LINK</div>
            <div style={{fontSize:7,color:'#64748b',wordBreak:'break-all',lineHeight:1.3}}>
              {(websiteUrl||'').replace('https://','').slice(0,36)}
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:3,padding:'8px 4px',
            borderRadius:14,border:'1.5px solid #F59E0B55',background:'#F59E0B10',textAlign:'center'}}>
            <span style={{fontSize:18}}>⚡</span>
            <div style={{fontSize:8.5,fontWeight:800,color:'#F59E0B',letterSpacing:'0.05em'}}>FAST &amp; EASY</div>
            <div style={{fontSize:7.5,color:'#64748b'}}>Print in 30 Seconds</div>
          </div>
        </div>

        {/* ── THANK YOU ── */}
        <div style={{textAlign:'center',position:'relative',zIndex:1}}>
          <div style={{fontSize:11,color:'#94a3b8',fontWeight:500}}>
            💗 Thank You! &nbsp; We Appreciate Your Trust. 💗
          </div>
          <div style={{fontSize:8.5,color:'#334155',marginTop:3}}>Powered by AutoPrint SaaS</div>
        </div>

      </div>
    </>
  );
}

/* ── MAIN MODAL WRAPPER ── */
export default function QrCodeModal({ cafeName, websiteUrl, bwPrice = 2.0, colorPrice = 10.0, onClose }) {
  const standeeRef = useRef(null);

  const captureCanvas = async () => {
    const html2canvas = (await import('html2canvas')).default;
    return html2canvas(standeeRef.current, {
      scale: 3,
      useCORS: true,
      backgroundColor: '#060d1f',
      logging: false,
      allowTaint: true,
    });
  };

  const handleDownload = async () => {
    try {
      const canvas = await captureCanvas();
      const { jsPDF } = await import('jspdf');

      const imgData = canvas.toDataURL('image/png');

      // A4 dimensions in mm
      const pdfW = 210;
      const pdfH = 297;

      // Calculate image dimensions to fit A4 preserving aspect ratio
      const canvasRatio = canvas.height / canvas.width;
      const imgW = pdfW;
      const imgH = pdfW * canvasRatio;

      // Center vertically on A4
      const yOffset = imgH < pdfH ? (pdfH - imgH) / 2 : 0;

      const pdf = new jsPDF({
        orientation: imgH > pdfW ? 'portrait' : 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      // Dark background matching standee
      pdf.setFillColor(6, 13, 31);
      pdf.rect(0, 0, pdfW, pdfH, 'F');

      pdf.addImage(imgData, 'PNG', 0, yOffset, imgW, imgH);

      pdf.save(`${cafeName || 'AutoPrint'}_QR_Standee.pdf`);
    } catch (err) {
      console.error('PDF Download failed:', err);
      alert('PDF Download failed: ' + err.message);
    }
  };

  const handlePrint = async () => {
    try {
      // Capture standee as high-res image using html2canvas
      const canvas = await captureCanvas();
      const imgData = canvas.toDataURL('image/png');

      // Open a clean new window with just the image for printing
      const pw = window.open('', '_blank');
      pw.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Standee - ${cafeName || 'AutoPrint'}</title>
            <style>
              * { margin:0; padding:0; box-sizing:border-box; }
              body { background:#060d1f; display:flex; align-items:center; justify-content:center; min-height:100vh; }
              img { max-width:100%; height:auto; display:block; }
              @media print {
                body { background:#060d1f !important; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
                img { width:100%; page-break-inside:avoid; }
              }
            </style>
          </head>
          <body>
            <img src="${imgData}" />
            <script>window.onload = function(){ window.print(); window.onafterprint = function(){ window.close(); }; }<\/script>
          </body>
        </html>
      `);
      pw.document.close();
    } catch (err) {
      console.error('Print failed:', err);
      alert('Print failed: ' + err.message);
    }
  };

  return (
    <>

      <div style={S.overlay}>
        {/* Action Bar */}
        <div className="modal-action-bar" style={S.actionBar}>
          <button style={S.btn('linear-gradient(135deg,#10B981,#059669)')} onClick={handleDownload}>
            <ImageDown size={16} /> Download PDF
          </button>
          <button style={S.btn('linear-gradient(135deg,#0EA5E9,#7C3AED)')} onClick={handlePrint}>
            <Printer size={16} /> Print A4
          </button>
          <button style={S.btnClose} onClick={onClose}>
            <X size={16} /> Close
          </button>
        </div>

        {/* Standee (captured by html2canvas) */}
        <div id="standee-print-area" ref={standeeRef}>
          <StandeeCard
            cafeName={cafeName}
            websiteUrl={websiteUrl}
            bwPrice={bwPrice}
            colorPrice={colorPrice}
          />
        </div>
      </div>
    </>
  );
}
