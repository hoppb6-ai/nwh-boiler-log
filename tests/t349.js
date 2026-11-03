const {chromium}=require('/tmp/jt/node_modules/playwright-core');const fs=require('fs'),{execSync}=require('child_process');
const URL='http://localhost:8766/sim/app/';const BK=JSON.parse(fs.readFileSync('/workspace/NWH-User-Backup-2026-10-17.json'));
const REVS=['5243ff6','152be6e','e83efd7','6969d2a','60725fe','3050ba3','3257320','2992b54'];
const use=c=>execSync(`rm -rf /workspace/sim/app && cp -r /workspace/sim/rev/${c} /workspace/sim/app`);
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});
 const ctx=await b.newContext({viewport:{width:390,height:844},isMobile:true,serviceWorkers:process.env.SW?'allow':'block'});const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('dialog',d=>{console.log('DIALOG:',d.message().replace(/\n/g,' / '));globalThis.DISMISS?d.dismiss():d.accept()});const E=(f,a)=>pg.evaluate(f,a);
 const open=async(u)=>{await pg.goto(u);await pg.waitForTimeout(600);if(await pg.$('#pinInput:visible')){await pg.fill('#pinInput','5295');await pg.click('text=Unlock');await pg.waitForTimeout(800);}};
 const count=()=>E(()=>{const W=JSON.parse(localStorage.nwhWork||'{}');const ds=Object.keys(W).filter(d=>W[d].checklist&&Object.values(W[d].checklist).some(r=>r.values&&Object.values(r.values).some(v=>v!==''&&v!=null))).sort();return {n:ds.length,last:ds[ds.length-1],ver:typeof APP_VER!=='undefined'?APP_VER:'?'};});
 use('5243ff6');await open(URL);
 // seed: backup + 10-18..10-31 readings as v3.3.5 would store them
 await E(bk=>{for(const k of ['nwhWork','nwhAocs','nwhSettings','nwhSchema']) if(bk.data[k]!=null) localStorage.setItem(k,JSON.stringify(bk.data[k]));},BK);
 await pg.reload();await open(URL);
 await E(()=>{const W=getWork();const ms=getChecklist().filter(isMeter);const last=W['2026-10-16'].checklist;for(let i=1;i<=15;i++){const d=ymd(new Date(2026,9,16+i));W[d]=W[d]||{};W[d].checklist=W[d].checklist||{};ms.forEach(it=>{const k=it.fields.find(f=>f.type==='meter').key;const p=Number(last[it.id].values[k]);W[d].checklist[it.id]={done:true,values:{[k]:Math.round((p+i*(isHourMeter(it)?23.5:700))*100)/100},time:'07:'+String(10+i).padStart(2,'0')};});}store('nwhWork',W);});
 console.log('seeded',JSON.stringify(await count()));

 rm=()=>0;execSync('rm -rf /workspace/sim/app && mkdir -p /workspace/sim/app && cp /workspace/nwh-boiler-log/index.html /workspace/nwh-boiler-log/sw.js /workspace/sim/app/ && cp -r /workspace/nwh-boiler-log/*.png /workspace/nwh-boiler-log/*.json /workspace/sim/app/ 2>/dev/null; true');
 await open(URL);await pg.waitForTimeout(2500);console.log('v347 load',JSON.stringify(await count()));


 await E(()=>{const W=JSON.parse(localStorage.nwhWork);W['2026-10-31'].fan=[{id:'fanold1',date:'2026-10-31',time:'07:10',hz:42.5,note:'old entry'}];localStorage.setItem('nwhWork',JSON.stringify(W));});
 await pg.reload();await open(URL);await pg.waitForTimeout(1200);await E(()=>showScreen('home'));await pg.waitForTimeout(500);
 console.log('home card',(await E(()=>document.querySelector('.fan2')?.innerText||'NONE')).replace(/\n+/g,' | '));
 await E(()=>fanEdit('ign'));await pg.waitForTimeout(300);await pg.screenshot({path:'/workspace/nwh-build/v349/edit.png'});console.log('cs',await E(()=>{const a=document.querySelector('.fan-step'),i=document.getElementById('fanIn');return [getComputedStyle(a).width,getComputedStyle(a).flex,getComputedStyle(i).width,i.className, [...document.styleSheets].length]}));
 await pg.fill('#fanIn','18.5');await pg.fill('#fanNote','cold morning, wet sawdust');await E(()=>fanSave());await pg.waitForTimeout(600);
 console.log('stored',await E(()=>JSON.stringify([JSON.parse(localStorage.nwhWork)['2026-10-31'].fan,Object.values(JSON.parse(localStorage.nwhWork)).flatMap(d=>d.fanIgn||[]).map(r=>[r.hz,r.note])])));
 console.log('home card',(await E(()=>document.querySelector('.fan2')?.innerText||'NONE')).replace(/\n+/g,' | '));
 const el=await pg.$('.fan2');await el.scrollIntoViewIfNeeded();await pg.screenshot({path:'/workspace/nwh-build/v349/home.png'});
 await E(()=>{document.documentElement.classList.add('dark')});await pg.waitForTimeout(300);await pg.screenshot({path:'/workspace/nwh-build/v349/home-dark.png'});
 console.log('activity',await E(()=>JSON.stringify(dayEvents?dayEvents(ymd(new Date())).filter(e=>e.cat==='Fan').map(e=>e.what):'n/a')).catch(e=>'err '+e.message));
 console.log('hscroll',await E(()=>document.documentElement.scrollWidth>innerWidth));
 console.log('errors',errs.slice(0,5).join(' | '));await b.close();})();
