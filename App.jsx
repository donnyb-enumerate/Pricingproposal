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
          <span st  doc.line(60, 105, 200, 105);

  doc.setFontSize(44);
  setC(white);
  doc.text("Pricing", 60, 220);
  doc.text("Proposal", 60, 270);

  doc.setFontSize(20);
  doc.setFont("helvetica", "normal");
  setC([139, 159, 192]);
  doc.text("Prepared for", 60, 340);

  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  setC(white);
  doc.text(config.accountName, 60, 375);

  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  setC([139, 159, 192]);
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  doc.text(dateStr, 60, 410);

  setF([22, 35, 64]);
  doc.rect(0, H - 80, W, 80, "F");
  setD(medBlue);
  doc.setLineWidth(1);
  doc.line(0, H - 80, W, H - 80);
  doc.setFontSize(10);
  setC([139, 159, 192]);
  doc.text("goenumerate.com", 60, H - 45);
  doc.text("Community Association Management Software", W - 60, H - 45, { align: "right" });

  // ─── PAGE 2: Pricing Cards ───
  doc.addPage();
  drawHeader(2);

  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  setC(navy);
  doc.text("Subscription Plans", M, headerBottom - 15);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  setC(gray);
  doc.text("Choose the plan that fits your community's needs.", M, headerBottom - 32);

  doc.setFontSize(8);
  setC(gold);
  doc.setFont("helvetica", "bold");
  doc.text("✓", M, headerBottom - 48);
  doc.setFont("helvetica", "normal");
  setC(gray);
  doc.text("= Enterprise-only feature", M + 10, headerBottom - 48);
  setC(lightGray);
  doc.text("— = Not included in plan", M + 150, headerBottom - 48);

  const cardW = 240, cardH = 545, gap = 25;
  const totalW = cardW * 2 + gap;
  const startX = (W - totalW) / 2;
  const cardY = headerBottom - 56;
  const doors = config.doors;

  function drawCard(x, yTop, w, tier, price, isFeatured) {
    const listBase = LIST_PRICES[tier].base;
    const listDoor = LIST_PRICES[tier].perDoor;
    const listTotal = listBase + listDoor * doors;
    const listOnboard = LIST_PRICES[tier].onboarding;
    const customTotal = price;
    const hasDiscount = customTotal < listTotal;
    const discountPct = hasDiscount ? Math.round((1 - customTotal / listTotal) * 100) : 0;

    const customBase = hasDiscount ? Math.round(customTotal * (listBase / listTotal)) : listBase;
    const customDoorTotal = hasDiscount ? customTotal - customBase : listDoor * doors;
    const customDoor = hasDiscount ? +(customDoorTotal / doors).toFixed(2) : listDoor;

    const features = [...GROWTH_FEATURES, ...ENTERPRISE_ONLY];
    const strikeCol = isFeatured ? featuredStrike : dimmedStrike;
    const greenCol = isFeatured ? [90, 230, 128] : green;

    if (isFeatured) {
      setF([208, 215, 227]);
      doc.roundedRect(x + 3, yTop + 3, w, cardH, 10, 10, "F");
      setF(navy);
      doc.roundedRect(x, yTop, w, cardH, 10, 10, "F");
      setF(medBlue);
      const bw = 110, bh = 20;
      doc.roundedRect(x + (w - bw) / 2, yTop - 10, bw, bh, 10, 10, "F");
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      setC(white);
      doc.text("MOST POPULAR", x + w / 2, yTop - 1, { align: "center" });
    } else {
      setF([232, 237, 245]);
      doc.roundedRect(x + 2, yTop + 2, w, cardH, 10, 10, "F");
      setF(white);
      setD(lightGray);
      doc.setLineWidth(1);
      doc.roundedRect(x, yTop, w, cardH, 10, 10, "FD");
    }

    const tc = isFeatured ? white : navy;
    const sc = isFeatured ? [139, 159, 192] : gray;
    const lc = isFeatured ? [42, 63, 101] : lightGray;
    const fc = isFeatured ? [160, 180, 208] : darkText;
    const cx = x + w / 2;

    let ty = yTop + 42;
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    setC(tc);
    doc.text(tier === "growth" ? "Growth" : "Enterprise", cx, ty, { align: "center" });

    ty += 16;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    setC(sc);
    doc.text(tier === "growth" ? "Essential management tools" : "Full-featured suite", cx, ty, { align: "center" });

    ty += 10;
    setD(lc);
    doc.setLineWidth(0.5);
    doc.line(x + 20, ty, x + w - 20, ty);

    // Base Fee
    ty += 16;
    doc.setFontSize(9);
    setC(sc);
    doc.text("Base Fee", cx, ty, { align: "center" });
    ty += 17;
    if (hasDiscount) {
      const listStr = "$" + listBase + "/mo";
      const custStr = "$" + customBase + "/mo";
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      setC(strikeCol);
      const lw = doc.getTextWidth(listStr);
      const cw2 = doc.getTextWidth(custStr);
      const ttw = lw + 8 + cw2;
      const sx = cx - ttw / 2;
      doc.text(listStr, sx, ty);
      setD(strikeCol);
      doc.setLineWidth(1);
      doc.line(sx, ty - 4, sx + lw, ty - 4);
      doc.setFontSize(15);
      setC(greenCol);
      doc.text(custStr, sx + lw + 8, ty);
    } else {
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      setC(tc);
      doc.text("$" + listBase + "/mo", cx, ty, { align: "center" });
    }

    // Per Door
    ty += 18;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    setC(sc);
    doc.text("Per Door", cx, ty, { align: "center" });
    ty += 17;
    if (hasDiscount) {
      const listStr = "$" + listDoor.toFixed(2) + "/door";
      const custStr = "$" + customDoor.toFixed(2) + "/door";
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      setC(strikeCol);
      const lw = doc.getTextWidth(listStr);
      const cw2 = doc.getTextWidth(custStr);
      const ttw = lw + 8 + cw2;
      const sx = cx - ttw / 2;
      doc.text(listStr, sx, ty);
      setD(strikeCol);
      doc.setLineWidth(1);
      doc.line(sx, ty - 4, sx + lw, ty - 4);
      doc.setFontSize(15);
      setC(greenCol);
      doc.text(custStr, sx + lw + 8, ty);
    } else {
      doc.setFontSize(15);
      doc.setFont("helvetica", "bold");
      setC(tc);
      doc.text("$" + listDoor.toFixed(2) + "/door", cx, ty, { align: "center" });
    }

    ty += 12;
    setD(lc);
    doc.line(x + 20, ty, x + w - 20, ty);

    // Total
    ty += 16;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    setC(sc);
    doc.text("Monthly Total (" + doors + " doors)", cx, ty, { align: "center" });

    ty += 28;
    doc.setFontSize(26);
    doc.setFont("helvetica", "bold");
    setC(tc);
    doc.text("$" + customTotal, cx, ty, { align: "center" });

    if (hasDiscount) {
      ty += 16;
      doc.setFontSize(10);
      const listTotalStr = "List: $" + listTotal;
      setC(strikeCol);
      const ltw = doc.getTextWidth(listTotalStr);
      doc.text(listTotalStr, cx, ty, { align: "center" });
      setD(strikeCol);
      doc.setLineWidth(0.8);
      doc.line(cx - ltw / 2, ty - 4, cx + ltw / 2, ty - 4);

      ty += 16;
      setF(green);
      const badgeText = "SAVE " + discountPct + "%";
      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      const btw = doc.getTextWidth(badgeText) + 14;
      doc.roundedRect(cx - btw / 2, ty - 10, btw, 14, 7, 7, "F");
      setC(white);
      doc.text(badgeText, cx, ty - 1, { align: "center" });
      ty += 6;
    } else {
      ty += 14;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      setC(sc);
      doc.text("/month", cx, ty, { align: "center" });
      ty += 8;
    }

    ty += 4;
    setD(lc);
    doc.line(x + 20, ty, x + w - 20, ty);

    // Features
    ty += 16;
    for (const feat of features) {
      const isEntOnly = !feat.shared;
      if (isEntOnly && !isFeatured) {
        doc.setFontSize(8.5);
        setC([192, 200, 213]);
        doc.setFont("helvetica", "normal");
        doc.text("—", x + 22, ty);
        doc.text(feat.name, x + 38, ty);
      } else if (isEntOnly && isFeatured) {
        setC(gold);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("✓", x + 22, ty);
        doc.setFontSize(8.5);
        doc.text(feat.name, x + 38, ty);
      } else {
        setC(isFeatured ? medBlue : green);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("✓", x + 22, ty);
        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        setC(fc);
        doc.text(feat.name, x + 38, ty);
      }
      ty += 16;
    }

    // Onboarding
    ty += 4;
    setD(lc);
    doc.line(x + 20, ty, x + w - 20, ty);
    ty += 16;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    setC(sc);
    doc.text("Onboarding Fee", cx, ty, { align: "center" });
    ty += 18;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");

    if (config.waiveOnboarding) {
      setC(strikeCol);
      const obStr = "$" + listOnboard.toLocaleString();
      const obw = doc.getTextWidth(obStr);
      doc.text(obStr, cx, ty, { align: "center" });
      setD(strikeCol);
      doc.setLineWidth(1);
      doc.line(cx - obw / 2, ty - 5, cx + obw / 2, ty - 5);
      doc.setFontSize(12);
      setC(greenCol);
      doc.text("WAIVED", cx, ty + 15, { align: "center" });
    } else {
      setC(tc);
      doc.text("$" + listOnboard.toLocaleString(), cx, ty, { align: "center" });
    }
  }

  drawCard(startX, cardY, cardW, "growth", config.growthPrice, false);
  drawCard(startX + cardW + gap, cardY, cardW, "enterprise", config.enterprisePrice, true);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  setC(gray);
  doc.text("Initial 36-month term  •  Onboarding includes data migration + training", W / 2, H - footerTop - 4, { align: "center" });

  // ─── PAGE 3: Payment Solutions ───
  doc.addPage();
  drawHeader(3);

  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  setC(navy);
  doc.text("Payment Solutions", M, headerBottom - 15);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  setC(gray);
  doc.text("Streamline collections and vendor payments.", M, headerBottom - 32);

  function drawFeeBox(yStart, title, items, accent) {
    const boxH = 30 + items.length * 37;
    setF(lightBlueBg);
    doc.roundedRect(M, yStart, W - 2 * M, boxH, 8, 8, "F");
    setF(accent);
    doc.rect(M, yStart, 4, boxH, "F");
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    setC(navy);
    doc.text(title, M + 18, yStart + 22);
    let iy = yStart + 47;
    for (const item of items) {
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      setC(navy);
      doc.text(item.label, M + 18, iy);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(item.value, W - M - 18, iy, { align: "right" });
      if (item.note) {
        iy += 14;
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        setC(gray);
        doc.text(item.note, M + 18, iy);
      }
      iy += 23;
    }
    return yStart + boxH;
  }

  let py = headerBottom - 15;
  const arEnd = drawFeeBox(py, "Digital Payments (AR)", AR_FEES, medBlue);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  setC(gray);
  doc.text("Fees are paid by the homeowner per transaction.", M, arEnd + 16);

  const apEnd = drawFeeBox(arEnd + 35, "Automate AP", AP_FEES, green);
  doc.setFontSize(8.5);
  setC(gray);
  doc.text("Automate AP fee is paid by the association in the following month's bill.", M, apEnd + 16);

  const termsY = apEnd + 40;
  const termsH = 95;
  setF([240, 242, 247]);
  doc.roundedRect(M, termsY, W - 2 * M, termsH, 8, 8, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  setC(navy);
  doc.text("Terms & Conditions", M + 18, termsY + 20);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  setC(darkText);
  const terms = [
    "•  Initial 36-month term",
    "•  Pricing valid through January 31, 2026",
    "•  Full list of services: goenumerate.com/pricing",
    "•  Subject to Master Subscription Agreement, Payment Processing Agreement (AR),",
    "    and Payment Services Agreement (AP)",
  ];
  let tty = termsY + 38;
  terms.forEach((t) => { doc.text(t, M + 18, tty); tty += 12; });

  // ─── PAGE 4: Implementation ───
  doc.addPage();
  drawHeader(4);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  setC(navy);
  doc.text("Implementation Timeline", M, headerBottom - 15);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  setC(gray);
  doc.text("Guided onboarding with weekly one-hour training sessions.", M, headerBottom - 32);

  let startPhaseY = headerBottom + 10;
  PHASES.forEach((phase, i) => {
    const y = startPhaseY + i * 90;
    const pcx = 80;
    setF(i < PHASES.length - 1 ? navy : green);
    doc.circle(pcx, y + 15, 15, "F");
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    setC(white);
    doc.text(phase.num, pcx, y + 19, { align: "center" });
    if (i < PHASES.length - 1) {
      setD(lightGray);
      doc.setLineWidth(1.5);
      doc.setLineDashPattern([3, 3], 0);
      doc.line(pcx, y + 30, pcx, y + 75);
      doc.setLineDashPattern([], 0);
    }
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    setC(navy);
    doc.text(phase.title, 108, y + 15);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    const tw = doc.getTextWidth(phase.time) + 14;
    doc.setFont("helvetica", "bold");
    const titleW = doc.getTextWidth(phase.title);
    doc.setFont("helvetica", "normal");
    const tx = 108 + titleW + 12;
    setF([232, 237, 245]);
    doc.roundedRect(tx, y + 5, tw, 15, 7, 7, "F");
    setC(medBlue);
    doc.setFontSize(8.5);
    doc.text(phase.time, tx + 7, y + 15);
    doc.setFontSize(9.5);
    setC(darkText);
    doc.text(phase.desc, 108, y + 35);
  });

  const boxY = startPhaseY + 5 * 90 + 10;
  setF(lightBlueBg);
  doc.roundedRect(M, boxY, W - 2 * M, 55, 8, 8, "F");
  setF(medBlue);
  doc.rect(M, boxY, 4, 55, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  setC(navy);
  doc.text("Weekly Commitment", M + 18, boxY + 18);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  setC(darkText);
  doc.text("1-hour scheduled training call + 1–2 hours of self-paced video training and setup.", M + 18, boxY + 33);
  doc.text("Includes video training, practice in Sample Community, and setup homework.", M + 18, boxY + 45);

  // ─── PAGE 5: Why Enumerate ───
  doc.addPage();
  drawHeader(5);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  setC(navy);
  doc.text("Why Enumerate", M, headerBottom - 15);

  const whyCards = [
    { t: "Central", d: "End-to-end community association management — Work Orders, CCR, Budget, Accounting, AR/AP, Correspondence, and Property details all in one place." },
    { t: "Engage", d: "Resident and board engagement portal with real-time balance, requests, documents, events, and multi-channel notifications." },
    { t: "Smart Banking", d: "Smart Banking Integration with auto-reconciliations. Unlimited storage, user licenses, and no IT servers needed." },
    { t: "Ongoing Support", d: "US-based live support, monthly webinars, training repository, dedicated Customer Success Manager after onboarding." },
  ];

  const cw = (W - 2 * M - 20) / 2;
  const ch = 100;
  const csY = headerBottom + 5;
  whyCards.forEach((card, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const ccx = M + col * (cw + 20);
    const cy = csY + row * (ch + 12);
    setF(lightBlueBg);
    doc.roundedRect(ccx, cy, cw, ch, 8, 8, "F");
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    setC(navy);
    doc.text(card.t, ccx + 15, cy + 20);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    setC(darkText);
    const lines = doc.splitTextToSize(card.d, cw - 30);
    doc.text(lines, ccx + 15, cy + 35);
  });

  const fsY = csY + 2 * (ch + 12) + 10;
  setF(navy);
  doc.roundedRect(M, fsY, W - 2 * M, 50, 8, 8, "F");
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  setC(white);
  doc.text("Financial Services", M + 18, fsY + 22);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  setC([160, 180, 208]);
  doc.text("Led by Vishnu Sharma CPA — 2024 CAI National President", M + 18, fsY + 38);

  const ctY = fsY + 75;
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  setC(navy);
  doc.text("Let's Get Started", M, ctY);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  setC(gray);
  doc.text("Ready to transform your community management?", M, ctY + 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  setC(navy);
  doc.text(config.repName, M, ctY + 40);

  setF(medBlue);
  doc.roundedRect(M, ctY + 55, 280, 28, 6, 6, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  setC(white);
  doc.text(
    config.waiveOnboarding ? "Sign by 1/31 — Onboarding Fee Waived" : "Contact us to get started today",
    M + 140, ctY + 73, { align: "center" }
  );

  doc.save(config.accountName.replace(/\s+/g, "_") + "_Pricing_Proposal.pdf");
}

// ─── Styles ───
const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#8B9FC0",
  marginBottom: 6,
  letterSpacing: 0.4,
  textTransform: "uppercase",
};

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  background: "rgba(15,29,53,0.6)",
  border: "1px solid rgba(58,107,197,0.2)",
  borderRadius: 8,
  color: "#E8EDF5",
  fontSize: 15,
  boxSizing: "border-box",
  transition: "border-color 0.2s, box-shadow 0.2s",
  outline: "none",
};

// ─── PricingInput Component ───
function PricingInput({ label, listTotal, value, onChange, discount, listBase, listDoor, doors, onboarding, waived, features, entOnly, isEnterprise }) {
  const customVal = value === "" ? listTotal : Number(value);
  const hasDiscount = customVal < listTotal;

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Monthly Total (Custom Price)</label>
        <div style={{ position: "relative" }}>
          <span style={{
            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
            fontSize: 18, fontWeight: 700, color: "#6B7B95", pointerEvents: "none",
          }}>$</span>
          <input
            type="number"
            style={{ ...inputStyle, paddingLeft: 30, fontSize: 20, fontWeight: 700 }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={String(listTotal)}
            min={0}
          />
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          marginTop: 8, fontSize: 13, flexWrap: "wrap",
        }}>
          <span style={{ color: "#6B7B95" }}>
            List price: <strong style={{ color: "#8B9FC0" }}>${listTotal}</strong>
            <span style={{ margin: "0 6px", color: "#3A4F6F" }}>|</span>
            Base: ${listBase}/mo + ${listDoor.toFixed(2)}/door × {doors} doors
          </span>
          {hasDiscount && (
            <span style={{
              background: "rgba(39,174,96,0.15)", color: "#27AE60",
              padding: "2px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700,
            }}>
              {discount}% OFF
            </span>
          )}
        </div>
      </div>

      <div style={{
        background: isEnterprise ? "rgba(27,42,74,0.8)" : "rgba(255,255,255,0.05)",
        border: "1px solid " + (isEnterprise ? "rgba(58,107,197,0.3)" : "rgba(208,215,227,0.15)"),
        borderRadius: 12,
        padding: "20px 24px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{label}</span>
          <div style={{ textAlign: "right" }}>
            {hasDiscount ? (
              <>
                <span style={{ textDecoration: "line-through", color: "#4A5B75", fontSize: 14, marginRight: 8 }}>
                  ${listTotal}
                </span>
                <span style={{ fontSize: 24, fontWeight: 800, color: "#27AE60" }}>${customVal}</span>
                <span style={{ fontSize: 12, color: "#6B7B95" }}>/mo</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>${customVal}</span>
                <span style={{ fontSize: 12, color: "#6B7B95" }}>/mo</span>
              </>
            )}
          </div>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px",
          borderTop: "1px solid rgba(58,107,197,0.15)", paddingTop: 14,
        }}>
          {features.map((f) => (
            <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
              <span style={{ color: isEnterprise ? "#3A6BC5" : "#27AE60", fontWeight: 700 }}>✓</span>
              <span style={{ color: "#A0B4D0" }}>{f.name}</span>
            </div>
          ))}
          {entOnly.map((f) => (
            <div key={f.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
              {isEnterprise ? (
                <>
                  <span style={{ color: "#F0C040", fontWeight: 700 }}>✓</span>
                  <span style={{ color: "#F0C040", fontWeight: 600 }}>{f.name}</span>
                </>
              ) : (
                <>
                  <span style={{ color: "#3A4F6F" }}>—</span>
                  <span style={{ color: "#3A4F6F" }}>{f.name}</span>
                </>
              )}
            </div>
          ))}
        </div>

        <div style={{
          borderTop: "1px solid rgba(58,107,197,0.15)",
          marginTop: 14, paddingTop: 12,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: 12, color: "#6B7B95" }}>Onboarding</span>
          {waived ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ textDecoration: "line-through", color: "#4A5B75", fontSize: 13 }}>
                ${onboarding.toLocaleString()}
              </span>
              <span style={{
                background: "rgba(39,174,96,0.15)", color: "#27AE60",
                padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
              }}>WAIVED</span>
            </div>
          ) : (
            <span style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>${onboarding.toLocaleString()}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main App ───
export default function App() {
  const [accountName, setAccountName] = useState("");
  const [repName, setRepName] = useState("");
  const [doors, setDoors] = useState(175);
  const [growthPrice, setGrowthPrice] = useState("");
  const [enterprisePrice, setEnterprisePrice] = useState("");
  const [waiveOnboarding, setWaiveOnboarding] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("growth");

  const growthList = LIST_PRICES.growth.base + LIST_PRICES.growth.perDoor * doors;
  const entList = LIST_PRICES.enterprise.base + LIST_PRICES.enterprise.perDoor * doors;

  const gPrice = growthPrice === "" ? growthList : Number(growthPrice);
  const ePrice = enterprisePrice === "" ? entList : Number(enterprisePrice);

  const gDiscount = gPrice < growthList ? Math.round((1 - gPrice / growthList) * 100) : 0;
  const eDiscount = ePrice < entList ? Math.round((1 - ePrice / entList) * 100) : 0;

  const canGenerate = accountName.trim() && repName.trim() && gPrice > 0 && ePrice > 0;

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    try {
      await generatePDF({
        accountName: accountName.trim(),
        repName: repName.trim(),
        doors,
        growthPrice: gPrice,
        enterprisePrice: ePrice,
        waiveOnboarding,
      });
    } catch (e) {
      console.error(e);
      alert("PDF generation failed: " + e.message);
    }
    setGenerating(false);
  }, [accountName, repName, doors, gPrice, ePrice, waiveOnboarding]);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0F1D35 0%, #1B2A4A 40%, #223558 100%)",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      color: "#E8EDF5",
    }}>
      {/* Header */}
      <div style={{
        padding: "28px 36px",
        borderBottom: "1px solid rgba(58,107,197,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: 1.5, color: "#fff" }}>ENUMERATE</span>
          <svg width="22" height="26" viewBox="0 0 22 26">
            <circle cx="5" cy="5" r="3" fill="#82B4E0" />
            <circle cx="14" cy="5" r="3" fill="#82B4E0" />
            <circle cx="5" cy="14" r="3" fill="#3A6BC5" />
            <circle cx="14" cy="14" r="3" fill="#3A6BC5" />
            <circle cx="9.5" cy="23" r="3" fill="#2E5090" />
            <circle cx="18.5" cy="23" r="3" fill="#2E5090" />
          </svg>
        </div>
        <span style={{ fontSize: 13, color: "#6B7B95", letterSpacing: 0.5 }}>Proposal Generator</span>
      </div>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "32px 24px 60px" }}>
        {/* Deal Configuration */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(58,107,197,0.2)",
          borderRadius: 16,
          padding: "32px 36px",
          marginBottom: 28,
          backdropFilter: "blur(10px)",
        }}>
          <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 700, color: "#fff" }}>
            Deal Configuration
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px 28px" }}>
            <div>
              <label style={labelStyle}>Account Name *</label>
              <input style={inputStyle} value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="e.g. Playa de Oro" />
            </div>
            <div>
              <label style={labelStyle}>Sales Rep Name *</label>
              <input style={inputStyle} value={repName} onChange={(e) => setRepName(e.target.value)} placeholder="e.g. Grant" />
            </div>
            <div>
              <label style={labelStyle}>Number of Doors</label>
              <input style={inputStyle} type="number" value={doors} onChange={(e) => setDoors(Math.max(1, Number(e.target.value) || 1))} min={1} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 4 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", fontSize: 14, color: "#A0B4D0" }}>
                <div
                  onClick={() => setWaiveOnboarding(!waiveOnboarding)}
                  style={{
                    width: 44, height: 24, borderRadius: 12,
                    background: waiveOnboarding ? "#3A6BC5" : "#2A3F65",
                    position: "relative", transition: "background 0.2s", cursor: "pointer",
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: 9,
                    background: "#fff", position: "absolute", top: 3,
                    left: waiveOnboarding ? 23 : 3, transition: "left 0.2s",
                  }} />
                </div>
                Waive Onboarding Fee
              </label>
            </div>
          </div>
        </div>

        {/* Package Pricing */}
        <div style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(58,107,197,0.2)",
          borderRadius: 16,
          padding: "32px 36px",
          marginBottom: 28,
        }}>
          <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 700, color: "#fff" }}>Package Pricing</h2>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: "#6B7B95" }}>
            Enter custom monthly totals. If below list price, the PDF will show the discount visually.
          </p>

          <div style={{ display: "flex", gap: 0, marginBottom: 24 }}>
            {["growth", "enterprise"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: "12px 0",
                  background: activeTab === tab ? "rgba(58,107,197,0.2)" : "transparent",
                  border: "1px solid",
                  borderColor: activeTab === tab ? "rgba(58,107,197,0.5)" : "rgba(58,107,197,0.15)",
                  borderRadius: tab === "growth" ? "10px 0 0 10px" : "0 10px 10px 0",
                  color: activeTab === tab ? "#fff" : "#6B7B95",
                  fontSize: 14, fontWeight: activeTab === tab ? 700 : 500,
                  cursor: "pointer", transition: "all 0.2s",
                }}
              >
                {tab === "growth" ? "Growth" : "Enterprise"}
              </button>
            ))}
          </div>

          {activeTab === "growth" ? (
            <PricingInput label="Growth" listTotal={growthList} value={growthPrice} onChange={setGrowthPrice}
              discount={gDiscount} listBase={LIST_PRICES.growth.base} listDoor={LIST_PRICES.growth.perDoor}
              doors={doors} onboarding={LIST_PRICES.growth.onboarding} waived={waiveOnboarding}
              features={GROWTH_FEATURES} entOnly={ENTERPRISE_ONLY} isEnterprise={false} />
          ) : (
            <PricingInput label="Enterprise" listTotal={entList} value={enterprisePrice} onChange={setEnterprisePrice}
              discount={eDiscount} listBase={LIST_PRICES.enterprise.base} listDoor={LIST_PRICES.enterprise.perDoor}
              doors={doors} onboarding={LIST_PRICES.enterprise.onboarding} waived={waiveOnboarding}
              features={GROWTH_FEATURES} entOnly={ENTERPRISE_ONLY} isEnterprise={true} />
          )}
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={!canGenerate || generating}
          style={{
            width: "100%", padding: "18px 0",
            background: canGenerate && !generating ? "linear-gradient(135deg, #3A6BC5, #2E5090)" : "#2A3F65",
            border: "none", borderRadius: 12,
            color: canGenerate ? "#fff" : "#4A5B75",
            fontSize: 16, fontWeight: 700, cursor: canGenerate && !generating ? "pointer" : "not-allowed",
            letterSpacing: 0.5, transition: "all 0.3s",
            boxShadow: canGenerate ? "0 4px 20px rgba(58,107,197,0.3)" : "none",
          }}
        >
          {generating ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <span className="spinner" />
              Generating PDF...
            </span>
          ) : "Generate Proposal PDF"}
        </button>

        {!canGenerate && (
          <p style={{ textAlign: "center", fontSize: 12, color: "#4A5B75", marginTop: 10 }}>
            Fill in account name and rep name to enable generation.
          </p>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          display: inline-block; width: 18px; height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        input:focus { border-color: rgba(58,107,197,0.6) !important; box-shadow: 0 0 0 3px rgba(58,107,197,0.15); }
        input::placeholder { color: #3A4F6F; }
        button:hover:not(:disabled) { filter: brightness(1.1); }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>
    </div>
  );
}
