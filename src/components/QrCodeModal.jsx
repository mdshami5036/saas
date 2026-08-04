import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Printer, ImageDown } from 'lucide-react';

/* ─────────────────────────────────────────────────────────────
   STATIC STANDEE  — used for PDF/Print capture (off-screen)
   No animations, no overflow, fixed pixel sizes, self-contained
──────────────────────────────────────────────────────────────── */
function StandeeStatic({ cafeName, websiteUrl, bwPrice, colorPrice }) {

  const W = 794;   // ~A4 width at 96dpi
  const PAD = 32;
  const INN = W - PAD * 2;

  const tag = (label, color) => (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center',
      textAlign:'center', gap:4, padding:'10px 6px', borderRadius:16,
      border:`1.5px solid ${color}44`, background:`${color}12`,
      flex:1,
    }}>
      <div style={{fontSize:11, fontWeight:800, color, letterSpacing:'0.08em', lineHeight:1}}>{label.split('\n')[0]}</div>
      <div style={{fontSize:10, fontWeight:600, color:'#94a3b8', lineHeight:1}}>{label.split('\n')[1]}</div>
    </div>
  );

  const featureBox = (emoji, line1, line2, color) => (
    <div style={{
      display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center',
      gap:5, padding:'12px 6px', borderRadius:18,
      border:`1.5px solid ${color}44`, background:`${color}12`, flex:1,
    }}>
      <span style={{fontSize:26, lineHeight:1}}>{emoji}</span>
      <div style={{fontSize:11, fontWeight:800, color, letterSpacing:'0.08em'}}>{line1}</div>
      <div style={{fontSize:10, fontWeight:600, color:'#94a3b8'}}>{line2}</div>
    </div>
  );

  const step = (n, emoji, label, sub, color) => (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', flex:1, gap:5}}>
      <div style={{
        width:22, height:22, borderRadius:'50%', background:color,
        display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:11, fontWeight:900, color:'#fff',
      }}>{n}</div>
      <div style={{
        width:52, height:52, borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center',
        background:`${color}18`, border:`1.5px solid ${color}55`, fontSize:26,
      }}>{emoji}</div>
      <div style={{fontSize:11, fontWeight:800, color:'#fff', lineHeight:1.3}}>{label}</div>
      <div style={{fontSize:10, color:'#94a3b8', lineHeight:1.3}}>{sub}</div>
    </div>
  );

  return (
    <div style={{
      width: W,
      background: 'linear-gradient(140deg,#060d1f 0%,#0b1535 35%,#100d32 65%,#060d1f 100%)',
      padding: `${PAD}px`,
      fontFamily: "'Inter',Arial,sans-serif",
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* BG blobs */}
      <div style={{position:'absolute',top:-120,left:-120,width:380,height:380,borderRadius:'50%',background:'radial-gradient(circle,#7C3AED2a 0%,transparent 70%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:-80,right:-80,width:300,height:300,borderRadius:'50%',background:'radial-gradient(circle,#0EA5E92a 0%,transparent 70%)',pointerEvents:'none'}}/>

      {/* ── HEADER ── */}
      <div style={{textAlign:'center', marginBottom:22}}>
        <div style={{
          display:'inline-flex', alignItems:'center', justifyContent:'center',
          width:64, height:64, borderRadius:20, marginBottom:12,
          background:'linear-gradient(135deg,#0EA5E9,#7C3AED)',
          boxShadow:'0 6px 28px #7C3AED66',
        }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
        </div>
        <div style={{fontSize:34, fontWeight:900, color:'#fff', letterSpacing:'0.14em', textTransform:'uppercase',
          textShadow:'0 0 28px #0EA5E9bb', lineHeight:1, marginBottom:8}}>
          {cafeName || 'AutoPrint Center'}
        </div>
        <div style={{display:'flex', alignItems:'center', gap:12, justifyContent:'center'}}>
          <div style={{height:1, width:60, background:'linear-gradient(90deg,transparent,#0EA5E9)'}}/>
          <span style={{fontSize:11, fontWeight:700, letterSpacing:'0.22em', color:'#0EA5E9',
            textTransform:'uppercase'}}>
            ✦ Instant Self-Service Online Cloud Printing ✦
          </span>
          <div style={{height:1, width:60, background:'linear-gradient(90deg,#0EA5E9,transparent)'}}/>
        </div>
      </div>

      {/* ── PRICING ── */}
      <div style={{display:'flex', gap:14, marginBottom:22}}>
        {/* B&W */}
        <div style={{flex:1, borderRadius:18, padding:'14px 18px', display:'flex', alignItems:'center', gap:14,
          background:'linear-gradient(135deg,#0EA5E918,#060d1f)', border:'1.5px solid #0EA5E955',
          boxShadow:'0 0 22px #0EA5E918'}}>
          <div style={{width:48, height:48, borderRadius:14, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
            background:'linear-gradient(135deg,#0EA5E9,#0369A1)', boxShadow:'0 4px 14px #0EA5E955'}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
            </svg>
          </div>
          <div>
            <div style={{fontSize:10, fontWeight:700, color:'#94a3b8', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:2}}>B&amp;W Print</div>
            <div style={{fontSize:28, fontWeight:900, color:'#fff', lineHeight:1}}>
              ₹{parseFloat(bwPrice).toFixed(2)}
              <span style={{fontSize:13, fontWeight:400, color:'#64748b'}}> /page</span>
            </div>
          </div>
        </div>
        {/* Color */}
        <div style={{flex:1, borderRadius:18, padding:'14px 18px', display:'flex', alignItems:'center', gap:14,
          background:'linear-gradient(135deg,#7C3AED18,#060d1f)', border:'1.5px solid #7C3AED55',
          boxShadow:'0 0 22px #7C3AED18'}}>
          <div style={{width:48, height:48, borderRadius:14, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center',
            background:'linear-gradient(135deg,#7C3AED,#5B21B6)', boxShadow:'0 4px 14px #7C3AED55'}}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/>
            </svg>
          </div>
          <div>
            <div style={{fontSize:10, fontWeight:700, color:'#94a3b8', letterSpacing:'0.15em', textTransform:'uppercase', marginBottom:2}}>Full Color</div>
            <div style={{fontSize:28, fontWeight:900, color:'#fff', lineHeight:1}}>
              ₹{parseFloat(colorPrice).toFixed(2)}
              <span style={{fontSize:13, fontWeight:400, color:'#64748b'}}> /page</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MIDDLE ROW ── */}
      <div style={{display:'flex', gap:14, marginBottom:22, alignItems:'stretch'}}>
        {/* Left */}
        <div style={{display:'flex', flexDirection:'column', gap:10, width:110, flexShrink:0}}>
          {featureBox('☁️','UPLOAD','PDF FILE','#0EA5E9')}
          {featureBox('🛡️','SECURE','PAYMENT','#10B981')}
          {featureBox('⚡','INSTANT','PRINT','#F59E0B')}
        </div>

        {/* QR */}
        <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:12}}>
          <div style={{
            background:'rgba(255,255,255,0.97)', borderRadius:24, padding:18,
            border:'3px solid #7C3AED',
            boxShadow:'0 0 32px 8px #7C3AED88, 0 0 60px 16px #0EA5E944',
            position:'relative', display:'inline-block',
          }}>
            <QRCodeSVG
              value={websiteUrl || 'https://autoprint.app'}
              size={210}
              level="H"
              includeMargin={false}
            />
            <div style={{
              position:'absolute', top:'50%', left:'50%',
              transform:'translate(-50%,-50%)',
              width:46, height:46, borderRadius:13,
              background:'linear-gradient(135deg,#0EA5E9,#7C3AED)',
              boxShadow:'0 2px 14px #7C3AED99',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
            </div>
          </div>
          {/* CTA */}
          <div style={{
            width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:10,
            padding:'12px 0', borderRadius:18, fontWeight:800, color:'#fff', fontSize:13,
            letterSpacing:'0.12em', textTransform:'uppercase',
            background:'linear-gradient(135deg,#7C3AED,#0EA5E9)',
            boxShadow:'0 4px 22px #7C3AED55',
          }}>
            📱 Scan &amp; Print Instantly
          </div>
        </div>

        {/* Right */}
        <div style={{display:'flex', flexDirection:'column', gap:10, width:110, flexShrink:0}}>
          {featureBox('✅','SAFE &','RELIABLE','#7C3AED')}
          {featureBox('💰','POWERED BY','RAZORPAY','#10B981')}
          {featureBox('🎧','24×7','SUPPORT','#0EA5E9')}
        </div>
      </div>

      {/* ── HOW TO PRINT ── */}
      <div style={{borderRadius:20, padding:'18px 16px', marginBottom:18,
        background:'linear-gradient(135deg,#0EA5E910,#7C3AED08)', border:'1.5px solid #0EA5E930'}}>
        <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:16, justifyContent:'center'}}>
          <div style={{height:1, flex:1, background:'linear-gradient(90deg,transparent,#0EA5E9)'}}/>
          <span style={{fontSize:13, fontWeight:900, color:'#fff', letterSpacing:'0.18em',
            textTransform:'uppercase', textShadow:'0 0 12px #0EA5E9', whiteSpace:'nowrap'}}>
            🖥️ How To Print From Phone
          </span>
          <div style={{height:1, flex:1, background:'linear-gradient(90deg,#0EA5E9,transparent)'}}/>
        </div>
        <div style={{display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:6}}>
          {step(1,'📱','Scan QR Code','with phone camera\nor UPI app','#0EA5E9')}
          <div style={{color:'#475569', fontWeight:900, fontSize:20, marginTop:30, flexShrink:0}}>→</div>
          {step(2,'📄','Upload PDF File','& select page\noptions','#7C3AED')}
          <div style={{color:'#475569', fontWeight:900, fontSize:20, marginTop:30, flexShrink:0}}>→</div>
          {step(3,'💳','Pay Securely','via UPI / Card /\nNetbanking','#10B981')}
          <div style={{color:'#475569', fontWeight:900, fontSize:20, marginTop:30, flexShrink:0}}>→</div>
          {step(4,'🖨️','Collect Print','from the counter\ninstantly!','#F59E0B')}
        </div>
      </div>

      {/* ── FOOTER STRIP ── */}
      <div style={{display:'flex', gap:10, marginBottom:14}}>
        <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'10px 8px',
          borderRadius:14, border:'1.5px solid #10B98155', background:'#10B98112', textAlign:'center'}}>
          <span style={{fontSize:20}}>✅</span>
          <div style={{fontSize:10, fontWeight:800, color:'#10B981', letterSpacing:'0.06em'}}>NO APP REQUIRED</div>
          <div style={{fontSize:9, color:'#64748b'}}>100% Web Based</div>
        </div>
        <div style={{flex:2, display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'10px 8px',
          borderRadius:14, border:'1.5px solid #0EA5E955', background:'#0EA5E912', textAlign:'center'}}>
          <span style={{fontSize:20}}>🌐</span>
          <div style={{fontSize:10, fontWeight:800, color:'#0EA5E9'}}>YOUR PRINTING LINK</div>
          <div style={{fontSize:9, color:'#94a3b8', wordBreak:'break-all', lineHeight:1.4, maxWidth:320}}>
            {websiteUrl || ''}
          </div>
        </div>
        <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, padding:'10px 8px',
          borderRadius:14, border:'1.5px solid #F59E0B55', background:'#F59E0B12', textAlign:'center'}}>
          <span style={{fontSize:20}}>⚡</span>
          <div style={{fontSize:10, fontWeight:800, color:'#F59E0B'}}>FAST &amp; EASY</div>
          <div style={{fontSize:9, color:'#64748b'}}>Print in 30 Seconds</div>
        </div>
      </div>

      {/* ── THANK YOU ── */}
      <div style={{textAlign:'center'}}>
        <div style={{fontSize:12, color:'#94a3b8', fontWeight:500}}>
          💗 &nbsp;Thank You! &nbsp; We Appreciate Your Trust. &nbsp;💗
        </div>
        <div style={{fontSize:9, color:'#334155', marginTop:4}}>Powered by AutoPrint SaaS</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ANIMATED PREVIEW  — shown inside modal (looks premium)
──────────────────────────────────────────────────────────────── */
function StandeePreview({ cafeName, websiteUrl, bwPrice, colorPrice }) {
  return (
    <div style={{
      width: 480, borderRadius: 24,
      background:'linear-gradient(140deg,#060d1f 0%,#0b1535 35%,#100d32 65%,#060d1f 100%)',
      padding: '22px 18px',
      fontFamily:"'Inter',Arial,sans-serif",
      boxSizing:'border-box',
      boxShadow:'0 0 60px 12px #7C3AED33, 0 0 120px 30px #0EA5E922',
      border:'2px solid #7C3AED44',
      position:'relative', overflow:'hidden',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        @keyframes qrGlow{0%,100%{box-shadow:0 0 22px 6px #7C3AED99,0 0 50px 14px #0EA5E944}50%{box-shadow:0 0 40px 14px #0EA5E9cc,0 0 70px 20px #7C3AED55}}
        @keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
        .qr-glow-anim{animation:qrGlow 2.2s ease-in-out infinite}
        .float-anim{animation:floatY 3s ease-in-out infinite}
      `}</style>

      {/* Blobs */}
      <div style={{position:'absolute',top:-80,left:-80,width:280,height:280,borderRadius:'50%',background:'radial-gradient(circle,#7C3AED2a 0%,transparent 70%)',pointerEvents:'none'}}/>
      <div style={{position:'absolute',bottom:-60,right:-60,width:240,height:240,borderRadius:'50%',background:'radial-gradient(circle,#0EA5E92a 0%,transparent 70%)',pointerEvents:'none'}}/>

      {/* Header */}
      <div style={{textAlign:'center', marginBottom:16}}>
        <div className="float-anim" style={{display:'inline-flex',alignItems:'center',justifyContent:'center',
          width:56,height:56,borderRadius:18,marginBottom:10,
          background:'linear-gradient(135deg,#0EA5E9,#7C3AED)',
          boxShadow:'0 6px 26px #7C3AED77'}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
          </svg>
        </div>
        <div style={{fontSize:22,fontWeight:900,color:'#fff',letterSpacing:'0.13em',textTransform:'uppercase',
          textShadow:'0 0 24px #0EA5E9bb',marginBottom:5}}>{cafeName||'AutoPrint Center'}</div>
        <div style={{display:'flex',alignItems:'center',gap:8,justifyContent:'center'}}>
          <div style={{height:1,width:40,background:'linear-gradient(90deg,transparent,#0EA5E9)'}}/>
          <span style={{fontSize:8.5,fontWeight:700,letterSpacing:'0.2em',color:'#0EA5E9',textTransform:'uppercase'}}>✦ Instant Self-Service Cloud Printing ✦</span>
          <div style={{height:1,width:40,background:'linear-gradient(90deg,#0EA5E9,transparent)'}}/>
        </div>
      </div>

      {/* Pricing */}
      <div style={{display:'flex',gap:10,marginBottom:14}}>
        <div style={{flex:1,borderRadius:16,padding:'10px 12px',display:'flex',alignItems:'center',gap:10,
          background:'linear-gradient(135deg,#0EA5E918,#060d1f)',border:'1.5px solid #0EA5E955'}}>
          <div style={{width:36,height:36,borderRadius:12,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
            background:'linear-gradient(135deg,#0EA5E9,#0369A1)'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div>
            <div style={{fontSize:8,fontWeight:700,color:'#94a3b8',letterSpacing:'0.15em',textTransform:'uppercase'}}>B&amp;W Print</div>
            <div style={{fontSize:18,fontWeight:900,color:'#fff',lineHeight:1}}>₹{parseFloat(bwPrice).toFixed(2)}<span style={{fontSize:10,color:'#64748b'}}>/pg</span></div>
          </div>
        </div>
        <div style={{flex:1,borderRadius:16,padding:'10px 12px',display:'flex',alignItems:'center',gap:10,
          background:'linear-gradient(135deg,#7C3AED18,#060d1f)',border:'1.5px solid #7C3AED55'}}>
          <div style={{width:36,height:36,borderRadius:12,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',
            background:'linear-gradient(135deg,#7C3AED,#5B21B6)'}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8.56 2.75c4.37 6.03 6.02 9.42 8.03 17.72m2.54-15.38c-3.72 4.35-8.94 5.66-16.88 5.85m19.5 1.9c-3.5-.93-6.63-.82-8.94 0-2.58.92-5.01 2.86-7.44 6.32"/></svg>
          </div>
          <div>
            <div style={{fontSize:8,fontWeight:700,color:'#94a3b8',letterSpacing:'0.15em',textTransform:'uppercase'}}>Full Color</div>
            <div style={{fontSize:18,fontWeight:900,color:'#fff',lineHeight:1}}>₹{parseFloat(colorPrice).toFixed(2)}<span style={{fontSize:10,color:'#64748b'}}>/pg</span></div>
          </div>
        </div>
      </div>

      {/* QR + features */}
      <div style={{display:'flex',gap:10,marginBottom:14,alignItems:'stretch'}}>
        {/* Left */}
        <div style={{display:'flex',flexDirection:'column',gap:8,width:80,flexShrink:0}}>
          {[['☁️','UPLOAD','PDF FILE','#0EA5E9'],['🛡️','SECURE','PAYMENT','#10B981'],['⚡','INSTANT','PRINT','#F59E0B']].map(([e,l,s,c],i)=>(
            <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',
              gap:3,padding:'8px 4px',borderRadius:14,border:`1.5px solid ${c}44`,background:`${c}0f`,flex:1}}>
              <span style={{fontSize:18}}>{e}</span>
              <div style={{fontSize:9,fontWeight:800,color:c}}>{l}</div>
              <div style={{fontSize:8,color:'#94a3b8'}}>{s}</div>
            </div>
          ))}
        </div>
        {/* QR */}
        <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:8}}>
          <div className="qr-glow-anim" style={{background:'rgba(255,255,255,0.97)',borderRadius:20,padding:14,
            border:'2.5px solid #7C3AED',position:'relative',display:'inline-block'}}>
            <QRCodeSVG value={websiteUrl||'https://autoprint.app'} size={160} level="H" includeMargin={false}/>
            <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',
              width:38,height:38,borderRadius:11,
              background:'linear-gradient(135deg,#0EA5E9,#7C3AED)',
              display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
              </svg>
            </div>
          </div>
          <div style={{width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:7,
            padding:'9px 0',borderRadius:14,fontWeight:800,color:'#fff',fontSize:9.5,
            letterSpacing:'0.1em',textTransform:'uppercase',
            background:'linear-gradient(135deg,#7C3AED,#0EA5E9)',
            boxShadow:'0 3px 18px #7C3AED55'}}>
            📱 Scan &amp; Print Instantly
          </div>
        </div>
        {/* Right */}
        <div style={{display:'flex',flexDirection:'column',gap:8,width:80,flexShrink:0}}>
          {[['✅','SAFE &','RELIABLE','#7C3AED'],['💰','POWERED BY','RAZORPAY','#10B981'],['🎧','24×7','SUPPORT','#0EA5E9']].map(([e,l,s,c],i)=>(
            <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',
              gap:3,padding:'8px 4px',borderRadius:14,border:`1.5px solid ${c}44`,background:`${c}0f`,flex:1}}>
              <span style={{fontSize:18}}>{e}</span>
              <div style={{fontSize:9,fontWeight:800,color:c}}>{l}</div>
              <div style={{fontSize:8,color:'#94a3b8'}}>{s}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div style={{borderRadius:16,padding:'12px 10px',marginBottom:12,
        background:'linear-gradient(135deg,#0EA5E910,#7C3AED08)',border:'1.5px solid #0EA5E930'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10,justifyContent:'center'}}>
          <div style={{height:1,flex:1,background:'linear-gradient(90deg,transparent,#0EA5E9)'}}/>
          <span style={{fontSize:9.5,fontWeight:900,color:'#fff',letterSpacing:'0.15em',textTransform:'uppercase',textShadow:'0 0 10px #0EA5E9',whiteSpace:'nowrap'}}>🖥️ How To Print From Phone</span>
          <div style={{height:1,flex:1,background:'linear-gradient(90deg,#0EA5E9,transparent)'}}/>
        </div>
        <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:4}}>
          {[['📱','Scan QR\nCode','#0EA5E9'],['📄','Upload\nPDF File','#7C3AED'],['💳','Pay\nSecurely','#10B981'],['🖨️','Collect\nPrint','#F59E0B']].map(([e,l,c],i)=>(
            <React.Fragment key={i}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',flex:1,gap:3}}>
                <div style={{width:16,height:16,borderRadius:'50%',background:c,display:'flex',alignItems:'center',justifyContent:'center',fontSize:8,fontWeight:900,color:'#fff'}}>{i+1}</div>
                <div style={{width:38,height:38,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',background:`${c}18`,border:`1.5px solid ${c}55`,fontSize:18}}>{e}</div>
                <div style={{fontSize:8,fontWeight:800,color:'#fff',lineHeight:1.3}}>{l.replace('\n',' ')}</div>
              </div>
              {i<3&&<div style={{color:'#475569',fontWeight:900,fontSize:14,marginTop:22,flexShrink:0}}>→</div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{display:'flex',gap:8,marginBottom:10}}>
        {[['✅','NO APP\nREQUIRED','100% Web Based','#10B981',1],['🌐','YOUR LINK',(websiteUrl||'').replace('https://','').slice(0,40),'#0EA5E9',2],['⚡','FAST & EASY','30 Seconds','#F59E0B',1]].map(([e,l,s,c,f],i)=>(
          <div key={i} style={{flex:f,display:'flex',flexDirection:'column',alignItems:'center',gap:3,padding:'8px 6px',
            borderRadius:12,border:`1.5px solid ${c}55`,background:`${c}10`,textAlign:'center'}}>
            <span style={{fontSize:16}}>{e}</span>
            <div style={{fontSize:8.5,fontWeight:800,color:c}}>{l.replace('\n',' ')}</div>
            <div style={{fontSize:7.5,color:'#64748b',wordBreak:'break-all',lineHeight:1.3}}>{s}</div>
          </div>
        ))}
      </div>

      <div style={{textAlign:'center',fontSize:10,color:'#94a3b8'}}>
        💗 Thank You! &nbsp; We Appreciate Your Trust. 💗
        <div style={{fontSize:8,color:'#334155',marginTop:2}}>Powered by AutoPrint SaaS</div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN MODAL EXPORT
──────────────────────────────────────────────────────────────── */
export default function QrCodeModal({ cafeName, websiteUrl, bwPrice = 2.0, colorPrice = 10.0, onClose }) {
  const captureRef = useRef(null);  // hidden off-screen static element

  /* Capture the STATIC off-screen element — no animations, no scroll */
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

      // Custom page size matching canvas — guaranteed single page, no cuts
      const pxToMm = 0.264583;
      const pdfW = Math.round(canvas.width * pxToMm);
      const pdfH = Math.round(canvas.height * pxToMm);

      const pdf = new jsPDF({ orientation:'portrait', unit:'mm', format:[pdfW, pdfH] });
      pdf.setFillColor(6, 13, 31);
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
      pw.document.write(`<!DOCTYPE html><html><head><title>QR Standee</title>
        <style>*{margin:0;padding:0}body{background:#060d1f}img{width:100%;display:block}
        @media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style>
        </head><body><img src="${imgData}"/>
        <script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}}<\/script>
        </body></html>`);
      pw.document.close();
    } catch (err) {
      alert('Print failed: ' + err.message);
    }
  };

  return (
    <>
      {/* ── Hidden static element for capture — positioned off-screen ── */}
      <div style={{ position:'fixed', left:'-9999px', top:0, zIndex:-1, pointerEvents:'none' }}>
        <div ref={captureRef}>
          <StandeeStatic
            cafeName={cafeName}
            websiteUrl={websiteUrl}
            bwPrice={bwPrice}
            colorPrice={colorPrice}
          />
        </div>
      </div>

      {/* ── Modal Overlay ── */}
      <div style={{
        position:'fixed', inset:0, zIndex:9999,
        background:'rgba(0,0,0,0.85)', backdropFilter:'blur(10px)',
        display:'flex', flexDirection:'column', alignItems:'center',
        justifyContent:'flex-start', overflowY:'auto',
        padding:'16px 8px 100px',
      }}>
        {/* Action Buttons */}
        <div style={{ display:'flex', gap:12, marginBottom:16, position:'sticky', top:8, zIndex:10 }}>
          <button
            onClick={handleDownload}
            style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 24px', borderRadius:14,
              fontWeight:800, fontSize:13, color:'#fff', border:'none', cursor:'pointer',
              background:'linear-gradient(135deg,#10B981,#059669)',
              boxShadow:'0 4px 20px #10B98144', fontFamily:'Inter,sans-serif' }}
          >
            <ImageDown size={16}/> Download PDF
          </button>
          <button
            onClick={handlePrint}
            style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 24px', borderRadius:14,
              fontWeight:800, fontSize:13, color:'#fff', border:'none', cursor:'pointer',
              background:'linear-gradient(135deg,#0EA5E9,#7C3AED)',
              boxShadow:'0 4px 20px #0EA5E944', fontFamily:'Inter,sans-serif' }}
          >
            <Printer size={16}/> Print A4
          </button>
          <button
            onClick={onClose}
            style={{ display:'flex', alignItems:'center', gap:8, padding:'11px 18px', borderRadius:14,
              fontWeight:700, fontSize:13, color:'#cbd5e1', background:'#1e293b',
              border:'1px solid #334155', cursor:'pointer', fontFamily:'Inter,sans-serif' }}
          >
            <X size={16}/> Close
          </button>
        </div>

        {/* Animated Preview */}
        <StandeePreview
          cafeName={cafeName}
          websiteUrl={websiteUrl}
          bwPrice={bwPrice}
          colorPrice={colorPrice}
        />
      </div>
    </>
  );
}
