// v3.4 every-screen review: contrast audit + tap targets + overflow + screenshots, light & dark, iPhone emulation
const {chromium,devices}=require('/tmp/jt/node_modules/playwright-core');const fs=require('fs');const audit=require('./audit.js');
const URL='http://localhost:8766/nwh-boiler-log/index.html';const BK='/workspace/NWH-User-Backup-2026-10-17.json';const OUT='/workspace/nwh-build/v34/shots';fs.mkdirSync(OUT,{recursive:true});
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1;};
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});
 for(const MODE of ['light','dark']){const errs=[];
 const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'});const pg=await ctx.newPage();pg.on('pageerror',e=>errs.push(e.message));pg.on('dialog',d=>d.accept());const E=(f,a)=>pg.evaluate(f,a);
 await pg.addInitScript(()=>{const st=document.createElement('style');st.textContent='*{animation-duration:0s!important;transition-duration:0s!important}';document.addEventListener('DOMContentLoaded',()=>document.head.appendChild(st));});
 await pg.goto(URL);await pg.fill('#pinInput','5295');await pg.click('text=Unlock');
 await pg.setInputFiles('#quickRestore',BK);await pg.waitForSelector('#mpad .rs-prev');await pg.click('#mpad .danger-btn');await pg.waitForTimeout(400);
 await E(m=>{localStorage.setItem('nwhTheme',m);applyTheme();const t=ymd(new Date());bsAdd('b1',{temp:350,press:79,feed:60,status:'Running'});const l=getAocs();l.push({id:'ax',title:'Low water alarm',equipment:'Boiler 1',severity:'High',status:'Open',occ:[{id:'o1',date:t,time:'05:00'}]});store('nwhAocs',l);},MODE);
 const T=()=>ymd(new Date());
 const S=[['home',()=>showScreen('home')],['shift-empty',()=>showScreen('shift')],['shift-in',()=>{clockSet(shiftDay(),'in','06:02');showScreen('shift')}],['home-in',()=>showScreen('home')],
  ['round',()=>startRound()],['round-sum',()=>{roundI=getChecklist().length;renderRound()}],['shift-rev',()=>{clockSet(shiftDay(),'reviewed','14:10');showScreen('shift')}],['shift-done',()=>{clockSet(shiftDay(),'exported','14:12');clockSet(shiftDay(),'out','14:30');showScreen('shift')}],['home-done',()=>showScreen('home')],
  ['daily',()=>{edDay='2026-10-16';showScreen('daily')}],['meters-day',()=>{showScreen('meters');mtSet('day')}],['meters-hist',()=>{mtSet('history');MH.range='custom';MH.from='2026-10-01';MH.to='2026-10-17';MH.meter='all';MH.chart=false;mhSave();renderMeters()}],
  ['meters-chart',()=>{mhChartToggle()}],['meters-ssx',()=>{document.querySelector('#meters .mh-ssx').open=true}],['meters-preview',()=>{mhSheetPreview()}],['meters-back',()=>{setView('meters','editor');MH.chart=false;mhSave();renderMeters()}],
  ['more',()=>showScreen('more')],['custom',()=>showScreen('custom')],['custom-L',()=>{setTextSize('L')}],['custom-S',()=>{setTextSize('S')}],['custom-M',()=>{setTextSize('M');document.getElementById('cmName').value='';}],
  ['eqHome',()=>showScreen('eqHome')],['trouble',()=>showScreen('trouble')],['pm',()=>showScreen('pm')],['aocs',()=>showScreen('aocs')],['report',()=>openReport('2026-10-16')],['trends',()=>showScreen('trends')],['restore',()=>showScreen('restore')],['bstat',()=>showScreen('bstat')],['dayStatus',()=>openStatus('2026-10-16')]];
 let total=0;for(const [n,f] of S){try{await E(f);}catch(e){ok(false,n+' open failed '+e.message);continue;}await pg.waitForTimeout(300);
  const v=await E(audit);total+=v.length;ok(!v.length,`${MODE} contrast ${n}${v.length?' — '+v.slice(0,5).join(' | '):''}`);
  const tt=await E(()=>{const bad=[];document.querySelectorAll('.screen.active button, .screen.active a.btn-like, .screen.active .chip').forEach(e=>{const r=e.getBoundingClientRect();if(!r.width||e.closest('[hidden],details:not([open]) > :not(summary)'))return;if(e.classList.contains('linkish')||e.closest('.cal-grid,.cal-day,.mh-list,.act-list'))return;if(r.height<38||r.width<38)bad.push((e.textContent.trim().slice(0,18)||e.getAttribute('aria-label'))+' '+Math.round(r.width)+'x'+Math.round(r.height));});return bad;});
  ok(!tt.length,`${MODE} tap targets ≥38px ${n}${tt.length?' — '+tt.slice(0,6).join(' | '):''}`);
  for(const W of [320,390]){await pg.setViewportSize({width:W,height:844});ok(await E(()=>document.documentElement.scrollWidth<=innerWidth),`${MODE} ${n} ${W} no horizontal scroll`);}
  await pg.screenshot({path:`${OUT}/${MODE}-${n}.png`,fullPage:true});}
 console.log('CONTRAST TOTAL',MODE,total);ok(!errs.length,'no errors '+errs.join('|'));await ctx.close();}
 await b.close();})();
