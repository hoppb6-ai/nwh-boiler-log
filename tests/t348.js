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

 const full=await E(()=>localStorage.nwhWork);const other=await E(()=>JSON.stringify([localStorage.nwhAocs,localStorage.nwhSettings]));
 await E(()=>showScreen('restore'));await pg.setInputFiles('#restorePickFile','/workspace/NWH-11-01-add.json');await pg.waitForTimeout(800);
 console.log('preview',(await E(()=>document.getElementById('mpad').innerText)).replace(/\n+/g,' | '));
 await pg.screenshot({path:'/workspace/nwh-build/v347/import.png'});
 // Replace guard: dismiss the confirm
 globalThis.DISMISS=1;await E(()=>document.querySelector('#mpad .pad-next').click());await pg.waitForTimeout(800);globalThis.DISMISS=0;
 console.log('after replace-cancel',JSON.stringify(await count()));
 await E(()=>document.querySelector('#mpad .rs-merge').click());await pg.waitForTimeout(1500);
 console.log('after merge',JSON.stringify(await count()));
 console.log('prior days changed',await E(f=>{const A=JSON.parse(f),B=JSON.parse(localStorage.nwhWork);return Object.keys(A).filter(d=>JSON.stringify(A[d])!==JSON.stringify(B[d])).length+' of '+Object.keys(A).length+'; extra keys: '+Object.keys(B).filter(d=>!(d in A)).join(',')},full));
 console.log('other keys same',(await E(()=>JSON.stringify([localStorage.nwhAocs,localStorage.nwhSettings])))===other);
 console.log('11-01',await E(()=>JSON.stringify(Object.fromEntries(Object.entries(JSON.parse(localStorage.nwhWork)['2026-11-01'].checklist).map(([k,r])=>[k,r.values.reading+'@'+r.time])))));
 await pg.reload();await open(URL);await pg.waitForTimeout(2500);console.log('after reload',JSON.stringify(await count()));
 await E(()=>showScreen('restore'));await pg.setInputFiles('#restorePickFile','/workspace/NWH-11-01-add.json');await pg.waitForTimeout(800);await E(()=>document.querySelector('#mpad .rs-merge').click());await pg.waitForTimeout(800);
 console.log('second import',JSON.stringify(await count()));
 console.log('errors',errs.slice(0,5).join(' | '));await b.close();})();
