import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, ImageDown } from 'lucide-react';

/* ══════════════════════════════════════════════════════════
   STATIC STANDEE — off-screen capture (no animations)
   Width: 600px  →  PDF ≈ 159mm × auto (compact, not A4)
══════════════════════════════════════════════════════════ */
function StandeeStatic({ cafeName, websiteUrl, bwPrice, colorPrice }) {
  const W = 600;
  const s = {
    root: {
      width: W,
      background: 'linear-gradient(140deg,#060d1f 0%,#0b1535 35%,#100d32 65%,#060d1f 100%)',
      padding: '28px 24px 24px',
      fontFamily: "'Inter',Arial,sans-serif",
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
    },
    blob: (t, r, b, l, sz, col) => ({
      position: 'absolute', borderRadius: '50%', pointerEvents: 'none',
      background: `radial-gradient(circle,${col} 0%,transparent 70%)`,
      width: sz, height: sz, top: t, right: r, bottom: b, left: l,
    }),
  };

  const featBox = (emoji, line1, line2, color) => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center',
      gap:4, padding:'10px 6px', borderRadius:16,
      border:`1.5px solid ${color}44`, background:`${color}10`, flex:1 }}>
      <span style={{ fontSize:22, lineHeight:1 }}>{emoji}</span>
      <div style={{ fontSize:10, fontWeight:800, color, letterSpacing:'0.08em' }}>{line1}</div>
      <div style={{ fontSize:9, fontWeight:600, color:'#94a3b8' }}>{line2}</div>
    </div>
  );

  const stepBox = (n, emoji, label, sub, color) => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', flex:1, gap:4 }}>
      <div style={{ width:20, height:20, borderRadius:'50%', background:color,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:10, fontWeight:900, color:'#fff' }}>{n}</div>
      <div style={{ width:48, height:48, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center',
        background:`${color}18`, border:`1.5px solid ${color}55`, fontSize:22 }}>{emoji}</div>
      <div style={{ fontSize:9.5, fontWeight:800, color:'#fff', lineHeight:1.3 }}>{label}</div>
      <div style={{ fontSize:8.5, color:'#94a3b8', lineHeight:1.3 }}>{sub}</div>
    </div>
  );

  return (
    <div style={s.root}>
      {/* blobs */}
      <div style={s.blob(-90,-90,null,-90,300,  '#7C3AED2a')}/>
      <div style={s.blob(null,-70,-70,null,260,  '#0EA5E92a')}/>
      <div style={s.blob(null,null,null,-50,180, '#10B98118')}/>

      {/* ── HEADER ── */}
      <div style={{ textAlign:'center', marginBottom:18, position:'relative', zIndex:1 }}>
        <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center',
          width:58, height:58, borderRadius:18, marginBottom:10,
          background:'linear-gradient(135deg,#0EA5E9,#7C3AED)',
          boxShadow:'0 6px 24px #7C3AED77' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
        </div>
        <div style={{ fontSize:26, fontWeight:900, color:'#fff', letterSpacing:'0.13em',
          textTransform:'uppercase', textShadow:'0 0 28px #0EA5E9aa', lineHeight:1, marginBottom:6 }}>
          {cafeName || 'AutoPrint Center'}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, justifyContent:'center' }}>
          <div style={{ height:1, width:44, background:'linear-gradient(90deg,transparent,#0EA5E9)' }}/>
          <span style={{ fontSize:8.5, fontWeight:700, letterSpacing:'0.2em', color:'#0EA5E9', textTransform:'uppercase' }}>
            ✦ Instant Self-Service Cloud Printing ✦
          </span>
          <div style={{ height:1, width:44, background:'linear-gradient(90deg,#0EA5E9,transparent)' }}/>
        </div>
      </div>

      {/* ── PRICING ── */}
      <div style={{ display:'flex', gap:12, marginBottom:16, position:'relative', zIndex:1 }}>
        {[['#0EA5E9','B&W Print', bwPrice,'linear-gradient(135deg,#0EA5E9,#0369A1)',
           <svg key="bw" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>],
          ['#7C3AED','Full Color',colorPrice,'linear-gradient(135deg,#7C3AED,#5B21B6)',
           <svg key="cl" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>]
        ].map(([c, label, price, bg, icon], i) => (
          <div key={i} style={{ flex:1, borderRadius:18, padding:'12px 14px', display:'flex', alignItems:'center', gap:12,
            background:`linear-gradient(135deg,${c}15,#060d1f)`, border:`1.5px solid ${c}55` }}>
            <div style={{ width:42, height:42, borderRadius:13, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', background:bg }}>
              {icon}
            </div>
            <div>
              <div style={{ fontSize:9, fontWeight:700, color:'#94a3b8', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:2 }}>{label}</div>
              <div style={{ fontSize:24, fontWeight:900, color: i===0?'#fff':'#a78bfa', lineHeight:1 }}>
                ₹{parseFloat(price).toFixed(2)}<span style={{ fontSize:11, color:'#64748b', fontWeight:400 }}> /page</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── MIDDLE: features + QR + features ── */}
      <div style={{ display:'flex', gap:10, marginBottom:16, alignItems:'stretch', position:'relative', zIndex:1 }}>
        {/* Left */}
        <div style={{ display:'flex', flexDirection:'column', gap:8, width:86, flexShrink:0 }}>
          {featBox('☁️','UPLOAD','PDF FILE','#0EA5E9')}
          {featBox('🛡️','SECURE','PAYMENT','#10B981')}
          {featBox('⚡','INSTANT','PRINT','#F59E0B')}
        </div>

        {/* QR */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:10 }}>
          <div style={{ background:'rgba(255,255,255,0.97)', borderRadius:22, padding:16,
            border:'3px solid #7C3AED',
            boxShadow:'0 0 28px 6px #7C3AED88, 0 0 55px 14px #0EA5E944',
            position:'relative', display:'inline-block' }}>
            <QRCodeSVG value={websiteUrl||'https://autoprint.app'} size={190} level="H" includeMargin={false}/>
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)',
              width:42, height:42, borderRadius:12,
              background:'linear-gradient(135deg,#0EA5E9,#7C3AED)',
              display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
            </div>
          </div>
          <div style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            padding:'10px 0', borderRadius:16, fontWeight:800, color:'#fff', fontSize:11,
            letterSpacing:'0.12em', textTransform:'uppercase',
            background:'linear-gradient(135deg,#7C3AED,#0EA5E9)',
            boxShadow:'0 4px 20px #7C3AED55' }}>
            📱 Scan &amp; Print Instantly
          </div>
        </div>

        {/* Right */}
        <div style={{ display:'flex', flexDirection:'column', gap:8, width:86, flexShrink:0 }}>
          {featBox('✅','SAFE &','RELIABLE','#7C3AED')}
          {featBox('💰','POWERED BY','RAZORPAY','#10B981')}
          {featBox('🎧','24×7','SUPPORT','#0EA5E9')}
        </div>
      </div>

      {/* ── HOW TO PRINT ── */}
      <div style={{ borderRadius:18, padding:'14px 12px', marginBottom:14,
        background:'linear-gradient(135deg,#0EA5E910,#7C3AED08)', border:'1.5px solid #0EA5E930',
        position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12, justifyContent:'center' }}>
          <div style={{ height:1, flex:1, background:'linear-gradient(90deg,transparent,#0EA5E9)' }}/>
          <span style={{ fontSize:10.5, fontWeight:900, color:'#fff', letterSpacing:'0.18em',
            textTransform:'uppercase', whiteSpace:'nowrap' }}>🖥️ How To Print From Phone</span>
          <div style={{ height:1, flex:1, background:'linear-gradient(90deg,#0EA5E9,transparent)' }}/>
        </div>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:4 }}>
          {stepBox(1,'📱','Scan QR Code','with phone camera\nor UPI app','#0EA5E9')}
          <div style={{ color:'#475569', fontWeight:900, fontSize:18, marginTop:26, flexShrink:0 }}>→</div>
          {stepBox(2,'📄','Upload PDF','& select page\noptions','#7C3AED')}
          <div style={{ color:'#475569', fontWeight:900, fontSize:18, marginTop:26, flexShrink:0 }}>→</div>
          {stepBox(3,'💳','Pay Securely','via UPI / Card /\nNetbanking','#10B981')}
          <div style={{ color:'#475569', fontWeight:900, fontSize:18, marginTop:26, flexShrink:0 }}>→</div>
          {stepBox(4,'🖨️','Collect Print','from counter\ninstantly!','#F59E0B')}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ display:'flex', gap:8, marginBottom:12, position:'relative', zIndex:1 }}>
        {[
          ['✅','NO APP REQUIRED','100% Web Based','#10B981',1],
          ['🌐','YOUR PRINTING LINK',(websiteUrl||'').replace('https://','').slice(0,42),'#0EA5E9',2],
          ['⚡','FAST & EASY','Print in 30 Seconds','#F59E0B',1],
        ].map(([emoji,l,s,c,f],i)=>(
          <div key={i} style={{ flex:f, display:'flex', flexDirection:'column', alignItems:'center', gap:3,
            padding:'9px 6px', borderRadius:13, border:`1.5px solid ${c}55`, background:`${c}10`, textAlign:'center' }}>
            <span style={{ fontSize:18 }}>{emoji}</span>
            <div style={{ fontSize:9, fontWeight:800, color:c, letterSpacing:'0.05em' }}>{l}</div>
            <div style={{ fontSize:8, color:'#64748b', wordBreak:'break-all', lineHeight:1.3 }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
        <div style={{ fontSize:11, color:'#94a3b8' }}>💗 &nbsp;Thank You! &nbsp; We Appreciate Your Trust. &nbsp;💗</div>
        <div style={{ fontSize:9, color:'#334155', marginTop:3 }}>Powered by AutoPrint SaaS</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   ANIMATED PREVIEW — shown in modal
══════════════════════════════════════════════════════════ */
function StandeePreview({ cafeName, websiteUrl, bwPrice, colorPrice }) {
  const featBox = (emoji, line1, line2, color) => (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center',
      gap:3, padding:'9px 4px', borderRadius:14,
      border:`1.5px solid ${color}44`, background:`${color}0f`, flex:1 }}>
      <span style={{ fontSize:20, lineHeight:1 }}>{emoji}</span>
      <div style={{ fontSize:9, fontWeight:800, color, letterSpacing:'0.08em' }}>{line1}</div>
      <div style={{ fontSize:8, fontWeight:600, color:'#94a3b8' }}>{line2}</div>
    </div>
  );

  return (
    <div style={{ width:480, background:'linear-gradient(140deg,#060d1f 0%,#0b1535 35%,#100d32 65%,#060d1f 100%)',
      borderRadius:24, padding:'24px 20px', fontFamily:"'Inter',Arial,sans-serif",
      boxSizing:'border-box', position:'relative', overflow:'hidden',
      boxShadow:'0 0 70px #7C3AED33, 0 0 120px #0EA5E918' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        @keyframes qrPulse{0%,100%{box-shadow:0 0 22px 5px #7C3AED99,0 0 44px 12px #0EA5E944}50%{box-shadow:0 0 38px 12px #0EA5E9cc,0 0 65px 18px #7C3AED55}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        .p-qr{animation:qrPulse 2.2s ease-in-out infinite}
        .p-fl{animation:floatY 3s ease-in-out infinite}
      `}</style>

      <div style={{ position:'absolute',top:-80,left:-80,width:260,height:260,borderRadius:'50%',background:'radial-gradient(circle,#7C3AED2a 0%,transparent 70%)',pointerEvents:'none' }}/>
      <div style={{ position:'absolute',bottom:-60,right:-60,width:220,height:220,borderRadius:'50%',background:'radial-gradient(circle,#0EA5E92a 0%,transparent 70%)',pointerEvents:'none' }}/>

      {/* Header */}
      <div style={{ textAlign:'center', marginBottom:14, position:'relative', zIndex:1 }}>
        <div className="p-fl" style={{ display:'inline-flex',alignItems:'center',justifyContent:'center',
          width:54,height:54,borderRadius:18,marginBottom:8,
          background:'linear-gradient(135deg,#0EA5E9,#7C3AED)',boxShadow:'0 6px 22px #7C3AED77' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
          </svg>
        </div>
        <div style={{ fontSize:21,fontWeight:900,color:'#fff',letterSpacing:'0.13em',textTransform:'uppercase',textShadow:'0 0 24px #0EA5E9aa',marginBottom:4 }}>{cafeName||'AutoPrint Center'}</div>
        <div style={{ display:'flex',alignItems:'center',gap:7,justifyContent:'center' }}>
          <div style={{ height:1,width:36,background:'linear-gradient(90deg,transparent,#0EA5E9)' }}/>
          <span style={{ fontSize:7.5,fontWeight:700,letterSpacing:'0.2em',color:'#0EA5E9',textTransform:'uppercase' }}>✦ Instant Self-Service Cloud Printing ✦</span>
          <div style={{ height:1,width:36,background:'linear-gradient(90deg,#0EA5E9,transparent)' }}/>
        </div>
      </div>

      {/* Pricing */}
      <div style={{ display:'flex',gap:10,marginBottom:12,position:'relative',zIndex:1 }}>
        {[['#0EA5E9','B&W',bwPrice,'#fff'],['#7C3AED','Color',colorPrice,'#a78bfa']].map(([c,l,p,tc],i)=>(
          <div key={i} style={{ flex:1,borderRadius:16,padding:'10px 12px',display:'flex',alignItems:'center',gap:10,
            background:`linear-gradient(135deg,${c}15,#060d1f)`,border:`1.5px solid ${c}55` }}>
            <div style={{ width:36,height:36,borderRadius:11,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
              background:`linear-gradient(135deg,${c},${i===0?'#0369A1':'#5B21B6'})` }}>
              {i===0
                ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>}
            </div>
            <div>
              <div style={{ fontSize:8,fontWeight:700,color:'#94a3b8',letterSpacing:'0.12em',textTransform:'uppercase' }}>{l} Print</div>
              <div style={{ fontSize:20,fontWeight:900,color:tc,lineHeight:1 }}>₹{parseFloat(p).toFixed(2)}<span style={{ fontSize:9,color:'#64748b' }}>/pg</span></div>
            </div>
          </div>
        ))}
      </div>

      {/* Middle row */}
      <div style={{ display:'flex',gap:9,marginBottom:12,alignItems:'stretch',position:'relative',zIndex:1 }}>
        <div style={{ display:'flex',flexDirection:'column',gap:7,width:78,flexShrink:0 }}>
          {featBox('☁️','UPLOAD','PDF FILE','#0EA5E9')}
          {featBox('🛡️','SECURE','PAYMENT','#10B981')}
          {featBox('⚡','INSTANT','PRINT','#F59E0B')}
        </div>
        <div style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:9 }}>
          <div className="p-qr" style={{ background:'rgba(255,255,255,0.97)',borderRadius:20,padding:14,
            border:'3px solid #7C3AED',position:'relative',display:'inline-block' }}>
            <QRCodeSVG value={websiteUrl||'https://autoprint.app'} size={158} level="H" includeMargin={false}/>
            <div style={{ position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
              width:37,height:37,borderRadius:11,background:'linear-gradient(135deg,#0EA5E9,#7C3AED)',
              display:'flex',alignItems:'center',justifyContent:'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
              </svg>
            </div>
          </div>
          <div style={{ width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:7,
            padding:'9px 0',borderRadius:14,fontWeight:800,color:'#fff',fontSize:9.5,
            letterSpacing:'0.1em',textTransform:'uppercase',
            background:'linear-gradient(135deg,#7C3AED,#0EA5E9)',boxShadow:'0 3px 18px #7C3AED55' }}>
            📱 Scan &amp; Print Instantly
          </div>
        </div>
        <div style={{ display:'flex',flexDirection:'column',gap:7,width:78,flexShrink:0 }}>
          {featBox('✅','SAFE &','RELIABLE','#7C3AED')}
          {featBox('💰','POWERED BY','RAZORPAY','#10B981')}
          {featBox('🎧','24×7','SUPPORT','#0EA5E9')}
        </div>
      </div>

      {/* Steps */}
      <div style={{ borderRadius:16,padding:'12px 10px',marginBottom:10,
        background:'linear-gradient(135deg,#0EA5E910,#7C3AED08)',border:'1.5px solid #0EA5E930',position:'relative',zIndex:1 }}>
        <div style={{ display:'flex',alignItems:'center',gap:7,marginBottom:10,justifyContent:'center' }}>
          <div style={{ height:1,flex:1,background:'linear-gradient(90deg,transparent,#0EA5E9)' }}/>
          <span style={{ fontSize:9,fontWeight:900,color:'#fff',letterSpacing:'0.15em',textTransform:'uppercase',whiteSpace:'nowrap' }}>🖥️ How To Print From Phone</span>
          <div style={{ height:1,flex:1,background:'linear-gradient(90deg,#0EA5E9,transparent)' }}/>
        </div>
        <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:4 }}>
          {[['📱','Scan QR','#0EA5E9'],['📄','Upload PDF','#7C3AED'],['💳','Pay Online','#10B981'],['🖨️','Collect Print','#F59E0B']].map(([e,l,c],i)=>(
            <React.Fragment key={i}>
              <div style={{ display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',flex:1,gap:3 }}>
                <div style={{ width:16,height:16,borderRadius:'50%',background:c,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:900,color:'#fff' }}>{i+1}</div>
                <div style={{ width:36,height:36,borderRadius:11,display:'flex',alignItems:'center',justifyContent:'center',background:`${c}18`,border:`1.5px solid ${c}55`,fontSize:18 }}>{e}</div>
                <div style={{ fontSize:8,fontWeight:800,color:'#fff',lineHeight:1.3 }}>{l}</div>
              </div>
              {i<3 && <div style={{ color:'#475569',fontWeight:900,fontSize:14,marginTop:20,flexShrink:0 }}>→</div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ display:'flex',gap:7,marginBottom:9,position:'relative',zIndex:1 }}>
        {[['✅','NO APP','100% Web','#10B981',1],['🌐','YOUR LINK',(websiteUrl||'').replace('https://','').slice(0,36),'#0EA5E9',2],['⚡','FAST & EASY','30 Sec','#F59E0B',1]].map(([e,l,s,c,f],i)=>(
          <div key={i} style={{ flex:f,display:'flex',flexDirection:'column',alignItems:'center',gap:2,padding:'7px 5px',
            borderRadius:11,border:`1.5px solid ${c}55`,background:`${c}10`,textAlign:'center' }}>
            <span style={{ fontSize:15 }}>{e}</span>
            <div style={{ fontSize:8,fontWeight:800,color:c }}>{l}</div>
            <div style={{ fontSize:7.5,color:'#64748b',wordBreak:'break-all',lineHeight:1.3 }}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{ textAlign:'center',position:'relative',zIndex:1,fontSize:9.5,color:'#94a3b8' }}>
        💗 Thank You! &nbsp; We Appreciate Your Trust. 💗
        <div style={{ fontSize:8,color:'#334155',marginTop:2 }}>Powered by AutoPrint SaaS</div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN MODAL
══════════════════════════════════════════════════════════ */
export default function QrCodeModal({ cafeName, websiteUrl, bwPrice = 2.0, colorPrice = 10.0, onClose }) {
  const captureRef = useRef(null);

  const captureCanvas = async () => {
    const html2canvas = (await import('html2canvas')).default;
    const el = captureRef.current;
    return html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#060d1f',
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
      // Custom page size = exact canvas dimensions → single page, no cuts
      const pxToMm = 0.264583;
      const pdfW = Math.round(canvas.width  * pxToMm);
      const pdfH = Math.round(canvas.height * pxToMm);
      const pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:[pdfW, pdfH] });
      pdf.setFillColor(6, 13, 31);
      pdf.rect(0, 0, pdfW, pdfH, 'F');
      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
      pdf.save(`${cafeName||'AutoPrint'}_QR_Standee.pdf`);
    } catch (err) { alert('PDF error: ' + err.message); }
  };

  const handlePrint = async () => {
    try {
      const canvas = await captureCanvas();
      const imgData = canvas.toDataURL('image/png');
      const pw = window.open('', '_blank');
      pw.document.write(`<!DOCTYPE html><html><head><title>QR Standee</title>
        <style>*{margin:0;padding:0}body{background:#060d1f;display:flex;align-items:center;justify-content:center;min-height:100vh}img{max-width:100%;height:auto;display:block}
        @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style>
        </head><body><img src="${imgData}"/>
        <script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}}<\/script>
        </body></html>`);
      pw.document.close();
    } catch (err) { alert('Print error: ' + err.message); }
  };

  const btn = (bg) => ({
    display:'flex', alignItems:'center', gap:8, padding:'11px 22px', borderRadius:14,
    fontWeight:800, fontSize:13, color:'#fff', border:'none', cursor:'pointer',
    background: bg, fontFamily:'Inter,sans-serif',
  });

  return (
    <>
      {/* Off-screen static element for capture */}
      <div style={{ position:'fixed', left:'-9999px', top:0, zIndex:-1, pointerEvents:'none' }}>
        <div ref={captureRef}>
          <StandeeStatic cafeName={cafeName} websiteUrl={websiteUrl} bwPrice={bwPrice} colorPrice={colorPrice}/>
        </div>
      </div>

      {/* Modal overlay */}
      <div style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,0.85)',
        backdropFilter:'blur(10px)', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'flex-start', overflowY:'auto', padding:'16px 8px 100px' }}>

        <div style={{ display:'flex', gap:10, marginBottom:18, position:'sticky', top:8, zIndex:10 }}>
          <button style={btn('linear-gradient(135deg,#10B981,#059669)')} onClick={handleDownload}>
            <ImageDown size={16}/> Download PDF
          </button>
          <button style={btn('linear-gradient(135deg,#0EA5E9,#7C3AED)')} onClick={handlePrint}>
            <Printer size={16}/> Print
          </button>
          <button style={{ ...btn('#1e293b'), border:'1px solid #334155', color:'#cbd5e1', fontWeight:700 }} onClick={onClose}>
            <X size={16}/> Close
          </button>
        </div>

        <StandeePreview cafeName={cafeName} websiteUrl={websiteUrl} bwPrice={bwPrice} colorPrice={colorPrice}/>
      </div>
    </>
  );
}
