const {chromium}=require('/tmp/jt/node_modules/playwright-core');const fs=require('fs');
const BASE=process.argv[2]||'http://localhost:8766/nwh-boiler-log/';const BK='/workspace/NWH-User-Backup-2026-10-17.json';
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1;};
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});const errs=[];
 const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const pg=await ctx.newPage();pg.on('pageerror',e=>errs.push(e.message));pg.on('dialog',d=>d.accept());const E=(f,a)=>pg.evaluate(f,a);
 await pg.addInitScript(()=>{Object.defineProperty(navigator,'canShare',{value:undefined});});
 // 1. simulated upgrade: load v3.3.5, restore real backup, add data there
 await pg.goto(BASE+'v335/index.html');await pg.fill('#pinInput','5295');await pg.click('text=Unlock');
 ok(await E(()=>APP_VER==='3.3.5'&&!!document.getElementById('v335bar')),'v335 copy runs v3.3.5 with banner');
 await E(()=>showScreen('restore'));await pg.setInputFiles('#restoreFile',BK);await pg.click('#restore >> text=Restore from File');await pg.waitForSelector('#mpad .rs-prev');await pg.click('#mpad .danger-btn');await pg.waitForTimeout(1000);
 const bk=JSON.parse(fs.readFileSync(BK));
 const same=await E(d=>JSON.stringify(JSON.parse(localStorage.nwhWork))===JSON.stringify(d.nwhWork),bk.data);ok(same,'v335 restore of real backup: nwhWork identical');
 await E(()=>{const W=getWork();W['2026-10-18']=W['2026-10-18']||{};W['2026-10-18'].checklist=Object.assign(W['2026-10-18'].checklist||{},{gas:{values:{reading:'999999'},done:true,time:'07:10'}});store('nwhWork',W);});
 const before=await E(()=>({w:localStorage.nwhWork,a:localStorage.nwhAocs,s:localStorage.nwhSettings}));
 // 2. open v3.4 on same origin
 await pg.goto(BASE+'index.html');await pg.fill('#pinInput','5295');await pg.click('text=Unlock');
 ok(await E(()=>APP_VER==='3.4.0'),'v3.4 loads');
 const after=await E(()=>({w:localStorage.nwhWork,a:localStorage.nwhAocs,s:JSON.parse(localStorage.nwhSettings)}));
 ok(after.w===before.w,'upgrade: nwhWork untouched by v3.4 load');ok(after.a===before.a,'upgrade: AOCs untouched');
 const bs=JSON.parse(before.s);ok(Object.keys(bs).every(k=>k in after.s),'upgrade: no settings key removed');
 ok(await E(()=>getWork()['2026-10-18'].checklist.gas.values.reading==='999999'),'v3.4 reads data written by v3.3.5');
 // restore real backup in v3.4
 await E(()=>showScreen('restore'));await pg.setInputFiles('#restoreFile',BK);await pg.click('#restore >> text=Restore from File');await pg.waitForSelector('#mpad .rs-prev');await pg.click('#mpad .danger-btn');await pg.waitForTimeout(1000);
 ok(await E(d=>JSON.stringify(getWork())===JSON.stringify(d.nwhWork)&&JSON.stringify(getAocs())===JSON.stringify(d.nwhAocs),bk.data),'v3.4 restore of real backup: work+AOCs identical (zero loss)');
 const days=Object.keys(bk.data.nwhWork).length;ok(await E(n=>Object.keys(getWork()).length===n,days),'all '+days+' days present');
 // Home
 await E(()=>showScreen('home'));ok(await E(()=>!!document.querySelector('#homeShift .big-go')&&!!document.querySelector('#home .plant-card')),'Home: shift card + big button + plant status card');
 ok(await E(()=>document.querySelectorAll('#home .plant-card').length===1),'one plant status card');
 ok(await E(()=>{const h=document.getElementById('home');return [...h.children].indexOf(document.getElementById('homeShift'))<[...h.children].indexOf(document.getElementById('calGrid').closest('.card'))}),'calendar below shift/plant');
 ok(await E(()=>[...document.querySelectorAll('.rd-btn')].every(b=>getComputedStyle(b).display==='none')),'no per-page Readable buttons');
 // backup reminder
 ok(await E(()=>document.getElementById('saveReminder').classList.contains('show')),'weekly backup reminder shows (never saved)');
 await E(()=>dismissSaveReminder());ok(await E(()=>!document.getElementById('saveReminder').classList.contains('show')),'dismissible');
 await E(()=>{localStorage.nwhBackupRemindDismissed=new Date(Date.now()-8*864e5).toISOString();localStorage.nwhLastFileSave=new Date(Date.now()-2*864e5).toISOString();updateSaveUI()});ok(await E(()=>!document.getElementById('saveReminder').classList.contains('show')),'hidden when saved 2 days ago');
 await E(()=>{localStorage.nwhLastFileSave=new Date(Date.now()-9*864e5).toISOString();updateSaveUI()});ok(await E(()=>document.getElementById('saveReminder').classList.contains('show')&&/9 days/.test(document.getElementById('saveReminder').textContent)),'shows after 7+ days');
 // shift flow
 await E(()=>shiftClockIn(ymd(new Date())));ok(await E(()=>document.getElementById('round').classList.contains('active')&&/^\d\d:\d\d$/.test(getClock()[ymd(new Date())].in)),'clock in → round opens, 24h stamp');
 await E(()=>{roundI=getChecklist().length;renderRound();});ok(await E(()=>!!document.querySelector('#roundBody .sh-next')),'round summary → Next: review flags');
 await E(()=>showScreen('shift'));ok(await E(()=>document.querySelectorAll('#shiftBody .sh-step').length===4),'shift screen 4 steps');
 await E(()=>{clockSet(ymd(new Date()),'reviewed',nowHM());renderShift()});let dls=[];pg.on('download',d=>dls.push(d));await E(()=>shiftShare(ymd(new Date()),'png'));await pg.waitForTimeout(1500);
 ok(dls.length&&/phone\.png$/.test(dls[0].suggestedFilename()),'share step = phone PNG '+(dls[0]&&dls[0].suggestedFilename()));ok(await E(()=>!!getClock()[ymd(new Date())].exported),'export recorded');
 ok((await E(()=>buildBackup().data)).nwhClock!=null,'backup includes nwhClock');
 // meters
 await E(()=>{showScreen('meters');mtSet('history');MH.range='custom';MH.from='2026-10-01';MH.to='2026-10-17';MH.meter='all';mhSave();renderMeters()});
 ok(await E(()=>!document.querySelector('#meters .scr-head .vt')),'no Editor/Spreadsheet toggle on Meters');
 ok(await E(()=>!!document.querySelector('#meters .mh-ssx')),'spreadsheet folded into History exports');
 await E(()=>mhChartToggle());ok(await E(()=>document.querySelectorAll('#meters svg.mh-chart').length>0),'Chart toggle renders inline charts');
 dls=[];await E(()=>mhSheetExport('pdf'));await pg.waitForTimeout(1500);if(dls[0]){const buf=fs.readFileSync(await dls[0].path()).toString('latin1');ok(buf.startsWith('%PDF')&&buf.includes('/MediaBox [0 0 792 612]'),'spreadsheet export PDF landscape');}else ok(false,'sheet pdf');
 await E(()=>mhChartToggle());
 // customize
 await E(()=>showScreen('custom'));ok(await E(()=>!!document.getElementById('clEditor')&&document.getElementById('customBody').contains(document.getElementById('clEditor'))),'round items / water tests editor in Customize');
 await E(()=>cmSet('water','label','Water meter (main)'));ok(await E(()=>getChecklist().find(i=>i.id==='water').label==='Water meter (main)'),'rename meter');
 await E(()=>{document.getElementById('cmName').value='Test meter';document.getElementById('cmType').value='hour';cmAdd()});ok(await E(()=>getChecklist().some(i=>i.label==='Test meter'&&isHourMeter(i))),'add hour meter');
 const nGas=await E(()=>meterSeries('gas',getWork(),'reading').length);await E(()=>cmRetire('gas'));
 ok(await E(()=>!getChecklist().some(i=>i.id==='gas')),'retire removes from round');ok(await E(n=>meterSeries('gas',getWork(),'reading').length===n&&mtItems(getWork()).some(i=>i.id==='gas'),nGas),'retired meter keeps history ('+nGas+' reads) and still in History');
 await E(()=>cmRestore('gas'));ok(await E(()=>getChecklist().findIndex(i=>i.id==='gas')===2),'restore to original position');
 await E(()=>setTextSize('L'));ok(await E(()=>getComputedStyle(document.documentElement).getPropertyValue('--tz').trim()==='1.2'),'text size L');await E(()=>setTextSize('M'));
 // More
 await E(()=>showScreen('more'));ok(await E(()=>!!document.querySelector('#prevVer a[href="./v335/"]')&&!!document.getElementById('czLink')),'More: previous version link + Settings & Customize');
 ok(await E(()=>!document.getElementById('setupGrp')&&![...document.querySelectorAll('#more button')].some(b=>/Trends/.test(b.textContent))),'More streamlined');
 // horizontal overflow
 for(const s of ['home','shift','daily','meters','more','custom','round','report','trends','eqHome','trouble']){await E(x=>{if(x==='round')startRound(ymd(new Date()));else if(x==='report')openReport('2026-10-16');else showScreen(x)},s);await pg.waitForTimeout(120);for(const W of [320,375,430]){await pg.setViewportSize({width:W,height:800});ok(await E(()=>document.documentElement.scrollWidth<=innerWidth),`${s} ${W} no horizontal scroll`);}await pg.setViewportSize({width:390,height:844});}
 for(const z of ['L']){await E(x=>setTextSize(x),z);for(const s of ['home','shift','meters','custom','daily']){await E(x=>showScreen(x),s);await pg.setViewportSize({width:320,height:800});ok(await E(()=>document.documentElement.scrollWidth<=innerWidth),`${s} text ${z} 320 no horizontal scroll`);}await pg.setViewportSize({width:390,height:844});await E(()=>setTextSize('M'));}
 ok(await E(()=>document.querySelectorAll('input[type=time]').length===0),'24h time fields only');
 // 3. back to v335 after v3.4 writes
 const w34=await E(()=>localStorage.nwhWork);
 await pg.goto(BASE+'v335/index.html');await pg.fill('#pinInput','5295');await pg.click('text=Unlock');
 ok(await E(()=>APP_VER==='3.3.5'),'v335 opens after v3.4');ok(await E(w=>localStorage.nwhWork===w,w34),'v335 sees identical nwhWork');
 ok(await E(()=>getChecklist().some(i=>i.label==='Water meter (main)')&&getChecklist().some(i=>i.label==='Test meter')),'v335 reads v3.4 settings edits');
 await E(()=>{showScreen('meters');showScreen('home');showScreen('daily');showScreen('more')});ok(true,'v335 renders screens');
 ok(await E(()=>localStorage.nwhClock!=null),'v335 leaves v3.4-only keys alone');
 ok(!errs.length,'no errors '+errs.join('|'));await b.close();})();
