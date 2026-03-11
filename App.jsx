import { useState, useCallback } from "react";

// ─── Data Constants ───
const LIST_PRICES = {
  growth: { base: 475, perDoor: 1.0, onboarding: 2500 },
  enterprise: { base: 575, perDoor: 1.2, onboarding: 5000 },
};

const GROWTH_FEATURES = [
  { name: "Central Platform", shared: true },
  { name: "Engage Portal", shared: true },
  { name: "AR Payments", shared: true },
  { name: "Automate AP", shared: true },
  { name: "Accounting & Budgeting", shared: true },
  { name: "Work Orders & CCRs", shared: true },
  { name: "Smart Banking Integration", shared: true },
  { name: "Unlimited Users & Storage", shared: true },
];

const ENTERPRISE_ONLY = [
  { name: "Engage Websites", shared: false },
  { name: "Field Ops", shared: false },
];

const AR_FEES = [
  { label: "ACH - One-Time / Recurring", value: "$2.95", note: "Fee charged to homeowner per transaction" },
  { label: "Debit Card", value: "$5.95", note: "Fee charged to homeowner per transaction" },
  { label: "Credit Card", value: "3.5%", note: "Percentage of assessment, charged to homeowner" },
];

const AP_FEES = [
  { label: "Automated Invoice Processing (OCR)", value: "$0.50/each", note: "Book price: $1.50/each" },
  { label: "Automated Payment to Vendor", value: "$1.00/each", note: "Prior month billed in the current month" },
];

const PHASES = [
  { num: "1", title: "Initiation", time: "0-7 days", desc: "Kickoff calls, document collection, and launch campaign planning." },
  { num: "2", title: "Activation", time: "30-45 days", desc: "Applications configured; begin using software for daily business." },
  { num: "3", title: "Adoption", time: "45-65 days", desc: "Launch resident portal, CCRs, Work Orders, and Service Requests." },
  { num: "4", title: "Utilization", time: "65-90 days", desc: "Demonstrate competence in daily, weekly, and monthly activities." },
  { num: "5", title: "Graduation", time: "90-120 days", desc: "Handoff to Customer Support team with feedback survey." },
];

// jsPDF: Y=0 is TOP, Y increases DOWNWARD. Page = 612 x 792 pt.
let jspdfLoaded = false;
async function loadJsPDF() {
  if (jspdfLoaded) return;
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    s.onload = () => { jspdfLoaded = true; resolve(); };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

async function generatePDF(config) {
  await loadJsPDF();
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "letter" });
  const W = 612, H = 792, M = 50;

  const navy=[27,42,74], medBlue=[58,107,197], gray=[107,123,149], lightBlueBg=[244,246,250];
  const lightGray=[208,215,227], green=[39,174,96], gold=[240,192,64], white=[255,255,255];
  const darkText=[74,91,117], dimStrike=[160,170,185], featStrike=[100,120,160];

  const setC=c=>doc.setTextColor(c[0],c[1],c[2]);
  const setF=c=>doc.setFillColor(c[0],c[1],c[2]);
  const setD=c=>doc.setDrawColor(c[0],c[1],c[2]);

  function dots(x,y,r){
    setF([130,180,230]); doc.circle(x,y,r,"F"); doc.circle(x+r*2.8,y,r,"F");
    setF(medBlue); doc.circle(x,y+r*2.8,r,"F"); doc.circle(x+r*2.8,y+r*2.8,r,"F");
    setF([46,80,144]); doc.circle(x+r*1.4,y+r*5.6,r,"F"); doc.circle(x+r*4.2,y+r*5.6,r,"F");
  }

  function hdr(n){
    doc.setFontSize(12); doc.setFont("helvetica","bold"); setC(navy);
    doc.text("ENUMERATE",M,30);
    dots(M+doc.getTextWidth("ENUMERATE")+8,22,2);
    doc.setFontSize(8); doc.setFont("helvetica","normal"); setC(gray);
    doc.text("Page "+n,W-M,30,{align:"right"});
    setD(lightGray); doc.setLineWidth(0.5); doc.line(M,40,W-M,40);
    doc.line(M,H-40,W-M,H-40);
    doc.setFontSize(7); setC(gray);
    doc.text("Enumerate  |  goenumerate.com",M,H-28);
    doc.text("Confidential Pricing Proposal",W-M,H-28,{align:"right"});
  }

  // ── PAGE 1: COVER ──
  setF(navy); doc.rect(0,0,W,H,"F");
  setF([31,48,80]); doc.triangle(W*0.55,0,W,0,W,H*0.7,"F");
  for(let r=0;r<18;r++) for(let c=0;c<14;c++) if((r+c)%3===0){ setF([42,63,101]); doc.circle(50+c*40,50+r*40,1.2,"F"); }

  doc.setFontSize(28); doc.setFont("helvetica","bold"); setC(white);
  doc.text("ENUMERATE",60,90);
  dots(60+doc.getTextWidth("ENUMERATE")+10,76,3.2);
  setD(medBlue); doc.setLineWidth(2); doc.line(60,108,190,108);

  doc.setFontSize(44); setC(white); doc.text("Pricing",60,230); doc.text("Proposal",60,280);
  doc.setFontSize(18); doc.setFont("helvetica","normal"); setC([139,159,192]); doc.text("Prepared for",60,340);
  doc.setFontSize(26); doc.setFont("helvetica","bold"); setC(white); doc.text(config.accountName,60,375);
  doc.setFontSize(14); doc.setFont("helvetica","normal"); setC([139,159,192]);
  doc.text(new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),60,410);

  setF([22,35,64]); doc.rect(0,H-70,W,70,"F");
  setD(medBlue); doc.setLineWidth(1); doc.line(0,H-70,W,H-70);
  doc.setFontSize(10); setC([139,159,192]);
  doc.text("goenumerate.com",60,H-38);
  doc.text("Community Association Management Software",W-60,H-38,{align:"right"});

  // ── PAGE 2: PRICING CARDS ──
  doc.addPage(); hdr(2);

  doc.setFontSize(22); doc.setFont("helvetica","bold"); setC(navy);
  doc.text("Subscription Plans",M,65);
  doc.setFontSize(10); doc.setFont("helvetica","normal"); setC(gray);
  doc.text("Choose the plan that fits your community's needs.",M,82);
  doc.setFontSize(7.5);
  setC(gold); doc.setFont("helvetica","bold"); doc.text("*",M,96);
  doc.setFont("helvetica","normal"); setC(gray); doc.text("= Enterprise-only feature",M+8,96);
  setC([192,200,213]); doc.text("--  = Not included in plan",M+130,96);

  const cW=235, cGap=22, cX=(W-cW*2-cGap)/2, cTop=108, doors=config.doors;

  function card(x,yT,w,tier,price,feat){
    const lp=LIST_PRICES[tier], listTot=lp.base+lp.perDoor*doors;
    const disc=price<listTot, pct=disc?Math.round((1-price/listTot)*100):0;
    const ratio=lp.base/listTot;
    const cBase=disc?Math.round(price*ratio):lp.base;
    const cDoor=disc?+((price-cBase)/doors).toFixed(2):lp.perDoor;
    const allFeat=[...GROWTH_FEATURES,...ENTERPRISE_ONLY];
    const sCol=feat?featStrike:dimStrike, gCol=feat?[90,230,128]:green;

    // Compute height
    let h=38+14+10; // title+sub+div
    h+=14+16; // base label+val
    h+=14+16; // door label+val
    h+=10+14+22; // div+total label+big num
    h+=disc?14+15+8:12+8; // discount extras or /month
    h+=6+allFeat.length*14+4; // div+features
    h+=14+15; // onboard label+val
    if(config.waiveOnboarding) h+=14;
    h+=16; // padding

    // BG
    if(feat){
      setF([190,200,218]); doc.roundedRect(x+3,yT+3,w,h,8,8,"F");
      setF(navy); doc.roundedRect(x,yT,w,h,8,8,"F");
      setF(medBlue); doc.roundedRect(x+(w-100)/2,yT-10,100,18,9,9,"F");
      doc.setFontSize(7); doc.setFont("helvetica","bold"); setC(white);
      doc.text("MOST POPULAR",x+w/2,yT+2,{align:"center"});
    } else {
      setF([232,237,245]); doc.roundedRect(x+2,yT+2,w,h,8,8,"F");
      setF(white); setD(lightGray); doc.setLineWidth(0.8);
      doc.roundedRect(x,yT,w,h,8,8,"FD");
    }

    const tc=feat?white:navy, sc=feat?[139,159,192]:gray;
    const lc=feat?[42,63,101]:lightGray, fc=feat?[160,180,208]:darkText;
    const cx=x+w/2;
    let y=yT+32;

    // Title
    doc.setFontSize(17); doc.setFont("helvetica","bold"); setC(tc);
    doc.text(tier==="growth"?"Growth":"Enterprise",cx,y,{align:"center"});
    y+=14; doc.setFontSize(8); doc.setFont("helvetica","normal"); setC(sc);
    doc.text(tier==="growth"?"Essential management tools":"Full-featured suite",cx,y,{align:"center"});
    y+=10; setD(lc); doc.setLineWidth(0.5); doc.line(x+16,y,x+w-16,y);

    // Base Fee
    y+=14; doc.setFontSize(8); setC(sc); doc.text("Base Fee",cx,y,{align:"center"});
    y+=15;
    if(disc){
      doc.setFont("helvetica","bold");
      const ls="$"+lp.base+"/mo", cs="$"+cBase+"/mo";
      doc.setFontSize(9.5); setC(sCol); const lw=doc.getTextWidth(ls);
      doc.setFontSize(12); const cw2=doc.getTextWidth(cs);
      const sx=cx-(lw+6+cw2)/2;
      doc.setFontSize(9.5); setC(sCol); doc.text(ls,sx,y);
      setD(sCol); doc.setLineWidth(0.7); doc.line(sx,y-3,sx+lw,y-3);
      doc.setFontSize(12); setC(gCol); doc.text(cs,sx+lw+6,y);
    } else {
      doc.setFontSize(13); doc.setFont("helvetica","bold"); setC(tc);
      doc.text("$"+lp.base+"/mo",cx,y,{align:"center"});
    }

    // Per Door
    y+=14; doc.setFontSize(8); doc.setFont("helvetica","normal"); setC(sc);
    doc.text("Per Door",cx,y,{align:"center"});
    y+=15;
    if(disc){
      doc.setFont("helvetica","bold");
      const ls="$"+lp.perDoor.toFixed(2)+"/door", cs="$"+cDoor.toFixed(2)+"/door";
      doc.setFontSize(9.5); setC(sCol); const lw=doc.getTextWidth(ls);
      doc.setFontSize(12); const cw2=doc.getTextWidth(cs);
      const sx=cx-(lw+6+cw2)/2;
      doc.setFontSize(9.5); setC(sCol); doc.text(ls,sx,y);
      setD(sCol); doc.setLineWidth(0.7); doc.line(sx,y-3,sx+lw,y-3);
      doc.setFontSize(12); setC(gCol); doc.text(cs,sx+lw+6,y);
    } else {
      doc.setFontSize(13); doc.setFont("helvetica","bold"); setC(tc);
      doc.text("$"+lp.perDoor.toFixed(2)+"/door",cx,y,{align:"center"});
    }

    // Divider
    y+=10; setD(lc); doc.line(x+16,y,x+w-16,y);

    // Total
    y+=14; doc.setFontSize(8); doc.setFont("helvetica","normal"); setC(sc);
    doc.text("Monthly Total ("+doors+" doors)",cx,y,{align:"center"});
    y+=20; doc.setFontSize(22); doc.setFont("helvetica","bold"); setC(tc);
    doc.text("$"+price,cx,y,{align:"center"});

    if(disc){
      y+=14; doc.setFontSize(8.5); doc.setFont("helvetica","normal");
      const lt="List: $"+listTot; setC(sCol);
      const ltw=doc.getTextWidth(lt);
      doc.text(lt,cx,y,{align:"center"});
      setD(sCol); doc.setLineWidth(0.6); doc.line(cx-ltw/2,y-3,cx+ltw/2,y-3);
      y+=14; doc.setFontSize(7); doc.setFont("helvetica","bold");
      const bt="SAVE "+pct+"%", btw=doc.getTextWidth(bt)+10;
      setF(green); doc.roundedRect(cx-btw/2,y-8,btw,12,6,6,"F");
      setC(white); doc.text(bt,cx,y,{align:"center"});
      y+=6;
    } else {
      y+=12; doc.setFontSize(8); doc.setFont("helvetica","normal"); setC(sc);
      doc.text("/month",cx,y,{align:"center"}); y+=6;
    }

    // Divider
    y+=4; setD(lc); doc.line(x+16,y,x+w-16,y);

    // Features
    y+=13;
    for(const f of allFeat){
      const eo=!f.shared;
      doc.setFontSize(7.5);
      if(eo&&!feat){ setC([192,200,213]); doc.setFont("helvetica","normal"); doc.text("--",x+18,y); doc.text(f.name,x+32,y); }
      else if(eo&&feat){ setC(gold); doc.setFont("helvetica","bold"); doc.text("*",x+20,y); doc.text(f.name,x+32,y); }
      else { setC(feat?medBlue:green); doc.setFont("helvetica","bold"); doc.text(String.fromCharCode(10003),x+18,y); doc.setFont("helvetica","normal"); setC(fc); doc.text(f.name,x+32,y); }
      y+=14;
    }

    // Onboarding
    y+=2; setD(lc); doc.line(x+16,y,x+w-16,y);
    y+=13; doc.setFontSize(7.5); doc.setFont("helvetica","normal"); setC(sc);
    doc.text("Onboarding Fee",cx,y,{align:"center"});
    y+=14; doc.setFontSize(12); doc.setFont("helvetica","bold");
    if(config.waiveOnboarding){
      setC(sCol); const os="$"+lp.onboarding.toLocaleString(), ow=doc.getTextWidth(os);
      doc.text(os,cx,y,{align:"center"});
      setD(sCol); doc.setLineWidth(0.7); doc.line(cx-ow/2,y-4,cx+ow/2,y-4);
      y+=13; doc.setFontSize(10); setC(gCol); doc.text("WAIVED",cx,y,{align:"center"});
    } else { setC(tc); doc.text("$"+lp.onboarding.toLocaleString(),cx,y,{align:"center"}); }
  }

  card(cX,cTop,cW,"growth",config.growthPrice,false);
  card(cX+cW+cGap,cTop,cW,"enterprise",config.enterprisePrice,true);

  doc.setFontSize(7); doc.setFont("helvetica","normal"); setC(gray);
  doc.text("Initial 36-month term  |  Onboarding includes data migration + training",W/2,H-48,{align:"center"});

  // ── PAGE 3: PAYMENT SOLUTIONS ──
  doc.addPage(); hdr(3);
  let py=65;
  doc.setFontSize(22); doc.setFont("helvetica","bold"); setC(navy); doc.text("Payment Solutions",M,py);
  py+=17; doc.setFontSize(10); doc.setFont("helvetica","normal"); setC(gray);
  doc.text("Streamline collections and vendor payments.",M,py);

  function feeBox(yS,title,items,accent){
    const bH=30+items.length*36;
    setF(lightBlueBg); doc.roundedRect(M,yS,W-2*M,bH,6,6,"F");
    setF(accent); doc.rect(M,yS,4,bH,"F");
    doc.setFontSize(12); doc.setFont("helvetica","bold"); setC(navy); doc.text(title,M+14,yS+20);
    let iy=yS+42;
    for(const it of items){
      doc.setFontSize(9); doc.setFont("helvetica","normal"); setC(navy); doc.text(it.label,M+14,iy);
      doc.setFont("helvetica","bold"); doc.setFontSize(9.5); doc.text(it.value,W-M-14,iy,{align:"right"});
      if(it.note){ iy+=12; doc.setFontSize(7); doc.setFont("helvetica","normal"); setC(gray); doc.text(it.note,M+14,iy); }
      iy+=24;
    }
    return yS+bH;
  }

  py+=22;
  const arE=feeBox(py,"Digital Payments (AR)",AR_FEES,medBlue);
  py=arE+12; doc.setFontSize(7.5); doc.setFont("helvetica","normal"); setC(gray);
  doc.text("Fees are paid by the homeowner per transaction.",M,py);

  py+=20; const apE=feeBox(py,"Automate AP",AP_FEES,green);
  py=apE+12; doc.setFontSize(7.5); setC(gray);
  doc.text("Automate AP fee is paid by the association in the following month's bill.",M,py);

  py+=26; const tH=85;
  setF([240,242,247]); doc.roundedRect(M,py,W-2*M,tH,6,6,"F");
  doc.setFontSize(10); doc.setFont("helvetica","bold"); setC(navy);
  doc.text("Terms & Conditions",M+14,py+18);
  doc.setFontSize(7.5); doc.setFont("helvetica","normal"); setC(darkText);
  ["  Initial 36-month term","  Pricing valid through January 31, 2026","  Full list of services: goenumerate.com/pricing",
   "  Subject to Master Subscription Agreement, Payment Processing","  Agreement (AR), and Payment Services Agreement (AP)"]
  .forEach((t,i)=>doc.text(t,M+14,py+34+i*10));

  // ── PAGE 4: IMPLEMENTATION ──
  doc.addPage(); hdr(4);
  doc.setFontSize(22); doc.setFont("helvetica","bold"); setC(navy); doc.text("Implementation Timeline",M,65);
  doc.setFontSize(10); doc.setFont("helvetica","normal"); setC(gray);
  doc.text("Guided onboarding with weekly one-hour training sessions.",M,82);

  const pY0=112, pS=85;
  PHASES.forEach((p,i)=>{
    const y=pY0+i*pS, cx=78;
    setF(i<4?navy:green); doc.circle(cx,y,13,"F");
    doc.setFontSize(11); doc.setFont("helvetica","bold"); setC(white);
    doc.text(p.num,cx,y+4,{align:"center"});
    if(i<4){ setD(lightGray); doc.setLineWidth(1.2); doc.setLineDashPattern([3,3],0);
      doc.line(cx,y+13,cx,y+pS-13); doc.setLineDashPattern([],0); }
    doc.setFontSize(11); doc.setFont("helvetica","bold"); setC(navy); doc.text(p.title,103,y-1);
    doc.setFontSize(7.5); doc.setFont("helvetica","bold");
    const tw=doc.getTextWidth(p.title); doc.setFont("helvetica","normal");
    const bx=103+tw+8, bw=doc.getTextWidth(p.time)+10;
    setF([232,237,245]); doc.roundedRect(bx,y-9,bw,13,6,6,"F");
    doc.setFontSize(7.5); setC(medBlue); doc.text(p.time,bx+5,y-1);
    doc.setFontSize(8.5); doc.setFont("helvetica","normal"); setC(darkText); doc.text(p.desc,103,y+16);
  });

  const wY=pY0+5*pS+6;
  setF(lightBlueBg); doc.roundedRect(M,wY,W-2*M,48,6,6,"F");
  setF(medBlue); doc.rect(M,wY,4,48,"F");
  doc.setFontSize(9); doc.setFont("helvetica","bold"); setC(navy); doc.text("Weekly Commitment",M+14,wY+16);
  doc.setFontSize(7.5); doc.setFont("helvetica","normal"); setC(darkText);
  doc.text("1-hour scheduled training call + 1-2 hours of self-paced video training and setup.",M+14,wY+30);
  doc.text("Includes video training, practice in Sample Community, and setup homework.",M+14,wY+41);

  // ── PAGE 5: WHY ENUMERATE ──
  doc.addPage(); hdr(5);
  doc.setFontSize(22); doc.setFont("helvetica","bold"); setC(navy); doc.text("Why Enumerate",M,65);

  const wCards=[
    {t:"Central",d:"End-to-end community association management - Work Orders, CCR, Budget, Accounting, AR/AP, Correspondence, and Property details all in one place."},
    {t:"Engage",d:"Resident and board engagement portal with real-time balance, requests, documents, events, and multi-channel notifications."},
    {t:"Smart Banking",d:"Smart Banking Integration with auto-reconciliations. Unlimited storage, user licenses, and no IT servers needed."},
    {t:"Ongoing Support",d:"US-based live support, monthly webinars, training repository, dedicated Customer Success Manager after onboarding."},
  ];
  const wW=(W-2*M-16)/2, wH=90;
  wCards.forEach((c,i)=>{
    const col=i%2, row=Math.floor(i/2), cx=M+col*(wW+16), cy=85+row*(wH+10);
    setF(lightBlueBg); doc.roundedRect(cx,cy,wW,wH,6,6,"F");
    doc.setFontSize(10); doc.setFont("helvetica","bold"); setC(navy); doc.text(c.t,cx+12,cy+18);
    doc.setFontSize(7); doc.setFont("helvetica","normal"); setC(darkText);
    doc.text(doc.splitTextToSize(c.d,wW-24),cx+12,cy+32);
  });

  const fY=85+2*(wH+10)+10;
  setF(navy); doc.roundedRect(M,fY,W-2*M,44,6,6,"F");
  doc.setFontSize(10); doc.setFont("helvetica","bold"); setC(white); doc.text("Financial Services",M+14,fY+18);
  doc.setFontSize(8); doc.setFont("helvetica","normal"); setC([160,180,208]);
  doc.text("Led by Vishnu Sharma CPA - 2024 CAI National President",M+14,fY+33);

  const ctY=fY+64;
  doc.setFontSize(16); doc.setFont("helvetica","bold"); setC(navy); doc.text("Let's Get Started",M,ctY);
  doc.setFontSize(9); doc.setFont("helvetica","normal"); setC(gray);
  doc.text("Ready to transform your community management?",M,ctY+15);
  doc.setFontSize(10); doc.setFont("helvetica","bold"); setC(navy); doc.text(config.repName,M,ctY+34);

  setF(medBlue); doc.roundedRect(M,ctY+44,260,24,5,5,"F");
  doc.setFontSize(8.5); doc.setFont("helvetica","bold"); setC(white);
  doc.text(config.waiveOnboarding?"Sign by 1/31 - Onboarding Fee Waived":"Contact us to get started today",M+130,ctY+59,{align:"center"});

  doc.save(config.accountName.replace(/\s+/g,"_")+"_Pricing_Proposal.pdf");
}

// ─── Styles ───
const labelStyle={display:"block",fontSize:12,fontWeight:600,color:"#8B9FC0",marginBottom:6,letterSpacing:0.4,textTransform:"uppercase"};
const inputStyle={width:"100%",padding:"12px 14px",background:"rgba(15,29,53,0.6)",border:"1px solid rgba(58,107,197,0.2)",borderRadius:8,color:"#E8EDF5",fontSize:15,boxSizing:"border-box",outline:"none",transition:"border-color 0.2s, box-shadow 0.2s"};

function PricingInput({label,listTotal,value,onChange,discount,listBase,listDoor,doors,onboarding,waived,features,entOnly,isEnterprise}){
  const cv=value===""?listTotal:Number(value), hd=cv<listTotal;
  return(
    <div>
      <div style={{marginBottom:20}}>
        <label style={labelStyle}>Monthly Total (Custom Price)</label>
        <div style={{position:"relative"}}>
          <span style={{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",fontSize:18,fontWeight:700,color:"#6B7B95",pointerEvents:"none"}}>$</span>
          <input type="number" style={{...inputStyle,paddingLeft:30,fontSize:20,fontWeight:700}} value={value} onChange={e=>onChange(e.target.value)} placeholder={String(listTotal)} min={0}/>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:12,marginTop:8,fontSize:13,flexWrap:"wrap"}}>
          <span style={{color:"#6B7B95"}}>List price: <strong style={{color:"#8B9FC0"}}>${listTotal}</strong><span style={{margin:"0 6px",color:"#3A4F6F"}}>|</span>Base: ${listBase}/mo + ${listDoor.toFixed(2)}/door x {doors} doors</span>
          {hd&&<span style={{background:"rgba(39,174,96,0.15)",color:"#27AE60",padding:"2px 10px",borderRadius:20,fontSize:12,fontWeight:700}}>{discount}% OFF</span>}
        </div>
      </div>
      <div style={{background:isEnterprise?"rgba(27,42,74,0.8)":"rgba(255,255,255,0.05)",border:"1px solid "+(isEnterprise?"rgba(58,107,197,0.3)":"rgba(208,215,227,0.15)"),borderRadius:12,padding:"20px 24px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:16}}>
          <span st
