const {chromium}=require('/tmp/jt/node_modules/playwright-core');const fs=require('fs');
const BASE=process.argv[2]||'http://localhost:8766/nwh-boiler-log/';const BK='/workspace/NWH-User-Backup-2026-10-17.json';
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1;};
const PH={'2026-10-26':[1013127,386035037,2133438,86342.77,17723.1,22188.5,9128470],'2026-10-27':[1013857,386046223,2137690,86347.3,17746.8,22212.2,9141700],'2026-10-28':[1014746,386076133,2143088,86358.97,17771,22236.4,9156460],'2026-10-29':[1015759,386123055,2146304,86365.55,17790.3,22255.9,9167090],'2026-10-30':[1016416,386131019,2150759,86368.17,17814.2,22279.8,9181120],'2026-10-31':[1017196,386132961,2155220,86368.97,17842.3,22307.9,9195070]};
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,acceptDownloads:true});const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('dialog',d=>d.accept());const E=(f,a)=>pg.evaluate(f,a);
 await pg.addInitScript(()=>{Object.defineProperty(navigator,'canShare',{value:undefined});});
 await pg.goto(BASE);await pg.fill('#pinInput','5295');await pg.click('text=Unlock');await pg.waitForTimeout(300);
 await E(()=>showScreen('restore'));await pg.setInputFiles('#restoreFile',BK);await pg.click('#restore >> text=Restore from File');await pg.waitForSelector('#mpad .rs-prev');await pg.click('#mpad .danger-btn');await pg.waitForTimeout(800);
 // sample: fixture in a throwaway copy, numbers stored as numbers (like the phone), no read times
 const res=await E(PH=>{const W={};const ms=meterItems();for(const [d,v] of Object.entries(PH)){W[d]={checklist:{}};ms.forEach((it,i)=>{W[d].checklist[it.id]={values:{[meterKey(it)]:v[i]}};});}
   const cv=sheetStyleCanvas('2026-10-31',null,{W});return {url:cv.toDataURL('image/png'),days:mrDays('2026-10-31',W).days,dt:mrDayTime('2026-10-31',ms,W),pl:ms.map(meterPlaces)};},PH);
 fs.writeFileSync('/workspace/nwh-build/v346/sample.png',Buffer.from(res.url.split(',')[1],'base64'));
 ok(JSON.stringify(res.pl)==='[0,0,0,2,1,1,0]','default decimals per meter '+res.pl);
 const d27=res.days.find(d=>d.day==='2026-10-27').vals,d28=res.days.find(d=>d.day==='2026-10-28').vals;
 ok(d27[3]==='86347.30'&&d28[4]==='17771.0'&&d27[0]==='1013857','PNG fixed decimals: '+d27[3]+' '+d28[4]);ok(res.dt==='','no read time → —');
 // tolerance
 const tl=await E(()=>{const ms=meterItems(),b1=ms[4],k=meterKey(b1);const W={'2026-10-01':{checklist:{[b1.id]:{values:{[k]:100},time:'07:00'}}},'2026-10-02':{checklist:{[b1.id]:{values:{[k]:124.2},time:'07:00'}}},'2026-10-03':{checklist:{[b1.id]:{values:{[k]:148.6},time:'07:00'}}},'2026-10-04':{checklist:{[b1.id]:{values:{[k]:149.5},time:'07:30'}}}};
   return [mrUsed(b1,'2026-10-02',W).t,mrUsed(b1,'2026-10-03',W).t,mrUsed(b1,'2026-10-04',W).t];});
 ok(!tl[0].startsWith('!'),'24.2 in 24h (within 0.25h) not red: '+tl[0]);ok(tl[1].startsWith('!'),'24.4 in 24h is red: '+tl[1]);ok(!tl[2].startsWith('!'),'0.9 in 24.5h normal: '+tl[2]);
 // stored data untouched + app-wide display (put a numeric 86347.3 into real data copy? no: check History text on real backup)
 const before=await E(()=>localStorage.nwhWork);
 await E(()=>{showScreen('meters');mtScope='history';MH.range='custom';MH.from='2026-10-01';MH.to='2026-10-17';renderMeters();});await pg.waitForTimeout(300);
 const ht=await pg.textContent('#meters');ok(/86,238\.59/.test(ht)&&/17,549\.6\b/.test(ht),'History shows fixed decimals');
 const [dl]=await Promise.all([pg.waitForEvent('download',{timeout:8000}),E(()=>mhExport('csv'))]);const csv=fs.readFileSync(await dl.path(),'utf8');ok(/86,?238\.59/.test(csv),'CSV decimals ok');
 // customize decimals
 await E(()=>showScreen('custom'));await pg.waitForTimeout(200);ok((await pg.$$('#custom .cz-dec select')).length===7,'Customize has Decimals per meter');
 await E(()=>{cmSet(meterItems()[0].id,'places','2')});ok(await E(()=>meterPlaces(meterItems()[0])===2&&fmtM(meterItems()[0],1004337)==='1,004,337.00'),'set Gas decimals=2 changes display');
 await E(()=>{cmSet(meterItems()[0].id,'places','')});ok(await E(()=>meterPlaces(meterItems()[0])===0),'Auto restores default');
 ok(await E(b=>localStorage.nwhWork===b,before),'stored readings untouched');
 ok(!errs.length,'no page errors '+errs.join('|'));await b.close();})();
