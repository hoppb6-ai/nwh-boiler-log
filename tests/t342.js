const {chromium}=require('/tmp/jt/node_modules/playwright-core');const fs=require('fs');
const BASE=process.argv[2]||'http://localhost:8766/nwh-boiler-log/';const BK='/workspace/NWH-User-Backup-2026-10-17.json';
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1;};
const PH={'2026-10-26':['1013127','386035037','2133438','86342.77','17723.1','22188.5','9128470'],'2026-10-27':['1013857','386046223','2137690','86347.30','17746.8','22212.2','9141700'],'2026-10-28':['1014746','386076133','2143088','86358.97','17771.0','22236.4','9156460'],'2026-10-29':['1015759','386123055','2146304','86365.55','17790.3','22255.9','9167090'],'2026-10-30':['1016416','386131019','2150759','86368.17','17814.2','22279.8','9181120'],'2026-10-31':['1017196','386132961','2155220','86368.97','17842.3','22307.9','9195070']};
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,acceptDownloads:true});const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('dialog',d=>d.accept());const E=(f,a)=>pg.evaluate(f,a);
 await pg.addInitScript(()=>{Object.defineProperty(navigator,'canShare',{value:undefined});});
 await pg.goto(BASE);await pg.fill('#pinInput','5295');await pg.click('text=Unlock');await pg.waitForTimeout(300);
 await E(()=>showScreen('restore'));await pg.setInputFiles('#restoreFile',BK);await pg.click('#restore >> text=Restore from File');await pg.waitForSelector('#mpad .rs-prev');await pg.click('#mpad .danger-btn');await pg.waitForTimeout(800);
 const info=await E(()=>({ms:meterItems().map(m=>m.label),last:sheetStyleData('2026-10-10','2026-10-17').days}));
 console.log('meters (sheet order):',info.ms.join(' | '));console.log('backup last days:',JSON.stringify(info.last.slice(-2)));
 ok(info.ms.length===7,'7 meters in sheet order');
 const before=await E(()=>localStorage.nwhWork);
 // build sample on a COPY of data (fixture only, never stored)
 const res=await E(PH=>{const W=JSON.parse(localStorage.nwhWork);const ms=meterItems();for(const [d,v] of Object.entries(PH)){W[d]=W[d]||{};W[d].checklist=W[d].checklist||{};ms.forEach((it,i)=>{const r=W[d].checklist[it.id]=W[d].checklist[it.id]||{};r.values=Object.assign({},r.values,{[meterKey(it)]:v[i]});});}
   const data=sheetStyleData('2026-10-26','2026-10-31',W);const cv=sheetStyleCanvas('2026-10-26','2026-10-31',{W});return {url:cv.toDataURL('image/png'),w:cv.width,h:cv.height,data};},PH);
 fs.writeFileSync('/workspace/nwh-build/v342/sample.png',Buffer.from(res.url.split(',')[1],'base64'));
 ok(res.data.days.length===6&&res.data.days.every(d=>JSON.stringify(d.vals)===JSON.stringify(PH[d.day])),'fixture values printed raw, in order (86347.30, 17771.0 kept)');
 ok(res.h>res.w,'tall phone PNG '+res.w+'x'+res.h);
 ok(await E(b=>localStorage.nwhWork===b,before),'app data untouched by sample');
 // huge range grows
 const big=await E(()=>{const W=getWork();const ks=Object.keys(W).sort();return sheetStyleCanvas(ks[0],ks[ks.length-1]).height;});ok(big>=3200,'full-history sheet grows rows: h='+big);
 // UI buttons
 await E(()=>{showScreen('meters');mtScope='history';renderMeters()});await pg.waitForTimeout(300);
 if(!await pg.$('#shStyle')){await pg.click('#meters >> text=History').catch(()=>{});await pg.waitForTimeout(300);}
 ok(!!await pg.$('#shStyle button'),'Meters > History has Sheet-style PNG');
 const [dl]=await Promise.all([pg.waitForEvent('download',{timeout:8000}),pg.click('#shStyle button')]);ok(/NWH-meter-reads-.*\.png$/.test(dl.suggestedFilename()),'download '+dl.suggestedFilename());
 await E(()=>showScreen('shift'));await pg.waitForTimeout(300);ok(!!await pg.$('#shSheetStyle'),'Shift share step has Sheet-style PNG');
 await E(()=>{localStorage.nwhSheetLegend='0'});const h2=await E(()=>sheetStyleCanvas('2026-10-10','2026-10-17').height);ok(h2>0,'legend off renders');await E(()=>{localStorage.removeItem('nwhSheetLegend')});
 ok(!errs.length,'no page errors '+errs.join('|'));await b.close();})();
