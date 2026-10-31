const {chromium}=require('/tmp/jt/node_modules/playwright-core');
const BASE='http://localhost:8766/nwh-boiler-log/';
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1;};
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});
 const mk=async()=>{const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('dialog',d=>d.accept());return {ctx,pg,errs,E:(f,a)=>pg.evaluate(f,a)};};
 const unlock=async pg=>{await pg.fill('#pinInput','5295');await pg.click('text=Unlock');await pg.waitForTimeout(300);};
 const SCR=['home','meters','more','custom','shift','daily','aocs','pm','trends','sops','restore','bstat'];
 // empty
 {const {ctx,pg,errs,E}=await mk();await pg.goto(BASE);await unlock(pg);
  for(const s of SCR){await E(s=>{try{showScreen(s)}catch(e){window.__e=(window.__e||[]).concat(s+':'+e.message)}},s);await pg.waitForTimeout(80);}
  await pg.click('nav >> text=Round');await pg.waitForTimeout(300);await E(()=>startRound(ymd(new Date())));await E(()=>openReport(ymd(new Date())));await pg.waitForTimeout(300);const ee=await E(()=>window.__e||[]);ok(!ee.length&&!errs.length,'empty data: all screens render without errors '+ee.concat(errs).join('|'));
  await E(()=>showScreen('meters'));await E(()=>{try{MH&&(MH.chart=true);renderScreen&&0}catch(e){}});ok(!errs.length,'empty meters history ok');await ctx.close();}
 // huge: 400 days of reads
 {const {ctx,pg,errs,E}=await mk();await pg.goto(BASE);await unlock(pg);
  await E(()=>{const W=getWork();const items=LEGACY_CHECKLIST.filter(x=>x.meter||x.unit||x.type).slice(0,20);const d=new Date();for(let i=0;i<400;i++){const k=ymd(new Date(d-i*864e5));W[k]=W[k]||{};W[k].note='Note '+i+' '+'x'.repeat(200);}store('nwhWork',W);});
  const sz=await E(()=>localStorage.nwhWork.length);
  const t0=Date.now();for(const s of ['home','meters','daily','trends','more','shift']){await E(s=>showScreen(s),s);}const dt=Date.now()-t0;
  ok(!errs.length,'huge data ('+Math.round(sz/1024)+'KB, 400 days): no errors');ok(dt<6000,'huge data screen switches fast: '+dt+'ms');
  await pg.reload();await unlock(pg);ok(await E(()=>Object.keys(getWork()).length>=400),'huge data persists across reload');await ctx.close();}
 // offline: SW cache
 {const {ctx,pg,errs,E}=await mk();await pg.goto(BASE);await pg.waitForTimeout(2500);await pg.reload();await pg.waitForTimeout(1500);
  await pg.goto(BASE+'v335/');await pg.waitForTimeout(2500);await pg.reload();await pg.waitForTimeout(1500);
  const keys=await E(()=>caches.keys());ok(keys.includes('nwh-log-v38')&&keys.some(k=>k.startsWith('nwh-v335')),'both caches present: '+keys.join(','));
  const regs=await E(async()=>(await navigator.serviceWorker.getRegistrations()).map(r=>r.scope));ok(regs.length===2,'two SW scopes: '+regs.join(','));
  await ctx.setOffline(true);await pg.goto(BASE);await unlock(pg);ok(await E(()=>APP_VER==='3.4.1'),'main app loads offline');
  await pg.goto(BASE+'v335/');ok(await E(()=>APP_VER==='3.3.5'),'v335 loads offline');await ctx.close();}
 // mid-procedure reload
 {const {ctx,pg,errs,E}=await mk();await pg.goto(BASE);await unlock(pg);
  await E(()=>{const p=eqProcs().find(x=>x.steps.length);eqStart(p.id);const r=eqGetRun();r.steps[0].done=Date.now();r.steps[1].done=Date.now();eqSetRun(r);});
  await pg.reload();await unlock(pg);ok(await E(()=>!!eqGetRun()&&eqGetRun().steps.filter(x=>x.done).length===2),'procedure run state survives reload');
  await E(()=>showScreen('eqHome'));ok(await E(()=>/In progress/.test(document.body.innerText)),'In progress resume card shown');ok(!errs.length,'no errors '+errs.join('|'));await ctx.close();}
 await b.close();})();
