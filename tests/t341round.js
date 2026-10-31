const {chromium}=require('/tmp/jt/node_modules/playwright-core');const fs=require('fs');
const TAG=process.argv[2];const BASE='http://localhost:8766/nwh-boiler-log/';const BK='/workspace/NWH-User-Backup-2026-10-17.json';
const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m); if(!c) process.exitCode=1;};
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});fs.mkdirSync('shots',{recursive:true});
for(const mode of ['dark','light']){
 const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('dialog',d=>d.accept());const E=(f,a)=>pg.evaluate(f,a);
 await pg.addInitScript(()=>{const f=()=>{const s=document.createElement('style');s.textContent=':root{--sat:47px!important;--sab:34px!important}';document.documentElement.appendChild(s);};if(document.documentElement)f();else document.addEventListener('DOMContentLoaded',f);});
 await pg.goto(BASE);await pg.fill('#pinInput','5295');await pg.click('text=Unlock');await pg.waitForTimeout(300);
 await E(m=>{localStorage.nwhTheme=m;},mode);
 await E(()=>showScreen('restore'));await pg.setInputFiles('#restoreFile',BK);await pg.click('#restore >> text=Restore from File');await pg.waitForSelector('#mpad .rs-prev');await pg.click('#mpad .danger-btn');await pg.waitForTimeout(800);
 await pg.reload();await pg.fill('#pinInput','5295').catch(()=>{});await pg.click('text=Unlock').catch(()=>{});await pg.waitForTimeout(300);
 await E(m=>{document.documentElement.classList.toggle('dark',m==='dark')},mode);
 await E(()=>startRound(ymd(new Date())));
 const items=await E(()=>getChecklist().map((it,i)=>({i,k:it.sections?'ws':it.fields.length?(isMeter(it)?'meter':'field'):'check'})));
 const pick=['check','meter','ws','field'].map(k=>items.find(x=>x.k===k)).filter(Boolean);
 for(const p of pick){await E(i=>{roundI=i;renderRound();window.scrollTo(0,0)},p.i);await pg.waitForTimeout(400);
  await pg.screenshot({path:`shots/${TAG}-${mode}-round-${p.k}.png`});
  if(TAG==='after'){const r=await E(()=>{const h=document.querySelector('#round .round-head button').getBoundingClientRect();const n=document.querySelector('.round-nav').getBoundingClientRect();const nb=document.querySelector('.round-nav button').getBoundingClientRect();return {ht:h.top,nb:document.documentElement.clientHeight-nb.bottom}});
   ok(r.ht>=47,`${mode} ${p.k}: Exit clears 47px top inset (${r.ht})`);ok(r.nb>=34,`${mode} ${p.k}: nav buttons clear 34px bottom inset (${r.nb})`);}
 }
 if(TAG==='after'){const m=pick.find(x=>x.k==='meter');if(m){await E(i=>{roundI=i;renderRound()},m.i);
  const t=await E(()=>({s:document.querySelector('#roundProg span').textContent,lr:!!document.querySelector('#roundMu .lr-v'),fs:parseFloat(getComputedStyle(document.querySelector('.lr-v')).fontSize)}));
  ok(/^Step \d+ of \d+ · \d+ done$/.test(t.s),'progress text consistent: '+t.s);ok(t.lr&&t.fs>=30,'Last read block big value '+t.fs);}
  const c=pick.find(x=>x.k==='check');await E(i=>{roundI=i;renderRound();roundCheck(getChecklist()[i].id)},c.i);await pg.waitForTimeout(400);await E(i=>{roundI=i;renderRound()},c.i);
  await pg.screenshot({path:`shots/after-${mode}-round-checkdone.png`});ok(await E(()=>/Done/.test(document.querySelector('.round-done').textContent)),'done state shows');
  await pg.setViewportSize({width:844,height:390});await pg.waitForTimeout(200);await pg.screenshot({path:`shots/after-${mode}-landscape.png`});
  ok(await E(()=>getComputedStyle(document.getElementById('rotLock')).display==='flex'),'landscape phone shows upright overlay');
  await pg.setViewportSize({width:390,height:844});await pg.waitForTimeout(200);ok(await E(()=>getComputedStyle(document.getElementById('rotLock')).display==='none'&&document.getElementById('round').classList.contains('active')),'back to portrait: overlay gone, still on round');
  await pg.setViewportSize({width:1100,height:800});ok(await E(()=>getComputedStyle(document.getElementById('rotLock')).display==='none'),'tablet/desktop landscape not locked');await pg.setViewportSize({width:390,height:844});
  await pg.emulateMedia({media:'print'});await pg.setViewportSize({width:844,height:390});ok(await E(()=>getComputedStyle(document.getElementById('rotLock')).display==='none'),'print media: no overlay');await pg.emulateMedia({media:'screen'});
 }
 ok(!errs.length,mode+' no page errors '+errs.join('|'));await ctx.close();}
await b.close();})();
